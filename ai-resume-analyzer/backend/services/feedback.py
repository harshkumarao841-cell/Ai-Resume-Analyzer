"""
services/feedback.py
Generates actionable, human-readable suggestions based on analysis results.
These are rule-based heuristics; swap with an LLM call if you need richer output.
"""

from typing import List


def generate_suggestions(
    score: float,
    matched_skills: List[str],
    missing_skills: List[str],
    resume_text: str,
) -> List[str]:
    """
    Produces a prioritised list of improvement tips for the candidate.

    Args:
        score          – match percentage
        matched_skills – skills already present
        missing_skills – skills the JD requires but the resume lacks
        resume_text    – raw resume text (used for heuristic checks)

    Returns:
        List of suggestion strings.
    """
    suggestions: List[str] = []
    text_lower = resume_text.lower()

    # ---- Score-based headline feedback ----------------------------------- #
    if score >= 80:
        suggestions.append(
            "✅ Strong match! Your profile covers most of the job requirements. "
            "Focus on tailoring your summary to the specific role."
        )
    elif score >= 50:
        suggestions.append(
            "⚠️ Moderate match. Strengthen your resume by addressing the missing skills "
            "below and quantifying your achievements."
        )
    else:
        suggestions.append(
            "❌ Low match. Consider upskilling in the missing areas or applying to roles "
            "that better fit your current skill set."
        )

    # ---- Missing skills -------------------------------------------------- #
    if missing_skills:
        top_missing = missing_skills[:5]  # highlight the top 5
        suggestions.append(
            f"📌 Add or demonstrate these key skills to improve your score: "
            + ", ".join(top_missing)
            + ("." if len(missing_skills) <= 5 else f" (and {len(missing_skills) - 5} more).")
        )

    # ---- Quantified achievements ----------------------------------------- #
    has_numbers = any(char.isdigit() for char in resume_text)
    if not has_numbers:
        suggestions.append(
            "📊 Include measurable achievements (e.g., 'Reduced API latency by 40%', "
            "'Led a team of 6 engineers') to make your impact concrete."
        )

    # ---- Action verbs ---------------------------------------------------- #
    strong_verbs = [
        "led", "built", "designed", "implemented", "optimised", "optimized",
        "deployed", "architected", "reduced", "increased", "delivered",
    ]
    if not any(verb in text_lower for verb in strong_verbs):
        suggestions.append(
            "💬 Use strong action verbs (Led, Built, Designed, Deployed) at the start "
            "of bullet points to make your experience more impactful."
        )

    # ---- Summary / objective section ------------------------------------- #
    if "summary" not in text_lower and "objective" not in text_lower and "profile" not in text_lower:
        suggestions.append(
            "📝 Add a concise Professional Summary (3–4 sentences) at the top of your "
            "resume that aligns with the target role."
        )

    # ---- Keywords for ATS ------------------------------------------------ #
    if score < 60 and missing_skills:
        suggestions.append(
            "🤖 ATS Tip: Many companies use automated screening. Mirror the exact "
            "keywords from the job description where they truthfully apply to your experience."
        )

    # ---- Certifications -------------------------------------------------- #
    cert_keywords = ["certification", "certified", "certificate", "aws certified",
                     "google certified", "microsoft certified", "pmp", "cpa"]
    if not any(k in text_lower for k in cert_keywords):
        suggestions.append(
            "🎓 Consider adding relevant certifications (e.g., AWS, Google Cloud, "
            "Azure, PMP) to validate your technical skills."
        )

    # ---- Length / detail ------------------------------------------------- #
    word_count = len(resume_text.split())
    if word_count < 200:
        suggestions.append(
            "📄 Your resume appears short. Aim for at least 400–600 words to adequately "
            "cover your experience and skills."
        )
    elif word_count > 1200:
        suggestions.append(
            "✂️ Your resume may be too long. Keep it to 1–2 pages; focus on the most "
            "relevant experience for this role."
        )

    return suggestions
