"""
services/parser.py
Extracts plain text from uploaded PDF or DOCX resume files.
"""

import io
import pdfplumber
from docx import Document
from fastapi import UploadFile, HTTPException


ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    # Browsers sometimes send these for .docx
    "application/octet-stream": "unknown",
}


def _extract_from_pdf(file_bytes: bytes) -> str:
    """Use pdfplumber to extract text from every page of a PDF."""
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def _extract_from_docx(file_bytes: bytes) -> str:
    """Use python-docx to extract paragraph text from a DOCX file."""
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


async def extract_text_from_upload(file: UploadFile) -> str:
    """
    Determines file type, reads bytes, and delegates to the correct extractor.
    Raises HTTPException on unsupported types or empty content.
    """
    content_type = file.content_type or ""
    filename = file.filename or ""

    # Derive type from extension if content-type is generic
    if filename.endswith(".pdf"):
        file_type = "pdf"
    elif filename.endswith(".docx"):
        file_type = "docx"
    elif content_type == "application/pdf":
        file_type = "pdf"
    elif "wordprocessingml" in content_type:
        file_type = "docx"
    else:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{content_type}'. Only PDF and DOCX are accepted.",
        )

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        if file_type == "pdf":
            text = _extract_from_pdf(file_bytes)
        else:
            text = _extract_from_docx(file_bytes)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not parse the uploaded file: {str(exc)}",
        )

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="No readable text found in the uploaded file.",
        )

    return text
