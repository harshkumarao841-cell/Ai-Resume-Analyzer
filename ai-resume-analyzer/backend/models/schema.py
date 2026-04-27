"""
models/schema.py
Pydantic models for request validation and response serialization
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class AnalysisResponse(BaseModel):
    """Response schema returned by POST /analyze"""
    score: float = Field(..., description="Match percentage (0–100)", example=72.5)
    skills: List[str] = Field(..., description="All skills found in the resume")
    missing_skills: List[str] = Field(..., description="Skills required by JD but absent in resume")
    matched_skills: List[str] = Field(..., description="Skills present in both resume and JD")
    suggestions: List[str] = Field(..., description="Actionable improvement tips")


class ResumeRecord(BaseModel):
    """MongoDB document schema (used when persistence is enabled)"""
    resume_text: str
    job_description: str
    skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    score: float
    suggestions: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
