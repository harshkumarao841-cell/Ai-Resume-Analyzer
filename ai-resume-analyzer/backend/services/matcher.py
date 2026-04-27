"""
services/matcher.py
Computes the match score and derives matched / missing skill sets.
"""

from typing import List, Tuple


def compute_match(
    resume_skills: List[str],
    jd_skills: List[str],
) -> Tuple[float, List[str], List[str]]:
    """
    Compares resume skills against job-description skills.

    Returns:
        score          – percentage of JD skills covered by the resume (0–100)
        matched_skills – skills present in both resume and JD
        missing_skills – skills required by JD but absent in resume
    """
    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    if not jd_set:
        # No skills detected in the JD → cannot compute a meaningful score
        return 0.0, [], []

    matched = sorted(resume_set & jd_set)
    missing = sorted(jd_set - resume_set)

    score = round(len(matched) / len(jd_set) * 100, 2)

    return score, matched, missing
