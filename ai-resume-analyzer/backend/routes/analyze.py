"""
routes/analyze.py
Defines POST /analyze – the main endpoint for resume analysis.
"""

import logging
from datetime import datetime

from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from models.schema import AnalysisResponse
from services.parser import extract_text_from_upload
from services.skill_extractor import extract_skills
from services.matcher import compute_match
from services.feedback import generate_suggestions
from database.db import save_analysis

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    summary="Analyze a resume against a job description",
    responses={
        400: {"description": "Empty input"},
        415: {"description": "Unsupported file type"},
        422: {"description": "Could not parse file"},
        500: {"description": "Internal server error"},
    },
)
async def analyze_resume(
    resume: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    job_description: str = Form(..., description="Full job description text"),
):
    """
    Pipeline:
    1. Parse uploaded resume → plain text
    2. Extract skills from resume text
    3. Extract skills from job description
    4. Compute match score
    5. Generate improvement suggestions
    6. Optionally persist to MongoDB
    7. Return structured JSON response
    """

    # --- Validate job description ---------------------------------------- #
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    # --- Step 1: Parse resume -------------------------------------------- #
    logger.info(f"Parsing resume: {resume.filename}")
    resume_text = await extract_text_from_upload(resume)

    # --- Step 2: Extract resume skills ------------------------------------ #
    resume_skills = extract_skills(resume_text)
    logger.info(f"Resume skills found: {len(resume_skills)}")

    # --- Step 3: Extract JD skills ---------------------------------------- #
    jd_skills = extract_skills(job_description)
    logger.info(f"JD skills found: {len(jd_skills)}")

    if not jd_skills:
        raise HTTPException(
            status_code=422,
            detail=(
                "Could not extract any recognisable skills from the job description. "
                "Please ensure it contains technical requirements or skill keywords."
            ),
        )

    # --- Step 4: Compute match -------------------------------------------- #
    score, matched_skills, missing_skills = compute_match(resume_skills, jd_skills)

    # --- Step 5: Generate suggestions ------------------------------------- #
    suggestions = generate_suggestions(score, matched_skills, missing_skills, resume_text)

    # --- Step 6: Persist to MongoDB (best-effort) ------------------------- #
    try:
        record = {
            "resume_filename": resume.filename,
            "resume_text": resume_text[:5000],  # store first 5k chars only
            "job_description": job_description[:2000],
            "skills": resume_skills,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "score": score,
            "suggestions": suggestions,
            "created_at": datetime.utcnow(),
        }
        doc_id = await save_analysis(record)
        if doc_id:
            logger.info(f"Saved analysis to MongoDB with id={doc_id}")
    except Exception as exc:
        # Non-fatal – log and continue
        logger.warning(f"Could not persist analysis: {exc}")

    # --- Step 7: Return response ------------------------------------------ #
    return AnalysisResponse(
        score=score,
        skills=resume_skills,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        suggestions=suggestions,
    )
