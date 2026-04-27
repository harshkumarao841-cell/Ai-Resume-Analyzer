"""
services/skill_extractor.py
Extracts skills from free-form text using a curated skill dictionary + spaCy NLP.
Normalizes text and handles multi-word phrases (e.g. "machine learning").
"""

import re
import spacy
from typing import Set, List

# ---------------------------------------------------------------------------
# Load the spaCy English model (medium for better accuracy)
# Falls back to small model if medium is unavailable.
# ---------------------------------------------------------------------------
try:
    nlp = spacy.load("en_core_web_md")
except OSError:
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        raise RuntimeError(
            "No spaCy model found. Run: python -m spacy download en_core_web_sm"
        )

# ---------------------------------------------------------------------------
# Master skill dictionary – add / remove as needed
# ---------------------------------------------------------------------------
SKILL_LIBRARY: Set[str] = {
    # Programming languages
    "python", "java", "javascript", "typescript", "c", "c++", "c#", "go", "golang",
    "rust", "kotlin", "swift", "ruby", "php", "scala", "r", "matlab", "perl",
    "bash", "shell scripting", "powershell",

    # Web & frontend
    "html", "css", "react", "reactjs", "react.js", "angular", "angularjs",
    "vue", "vuejs", "vue.js", "next.js", "nuxt.js", "svelte", "jquery",
    "tailwind", "bootstrap", "sass", "less", "webpack", "vite",

    # Backend & frameworks
    "node.js", "nodejs", "express", "fastapi", "flask", "django", "spring boot",
    "spring", "laravel", "rails", "ruby on rails", "asp.net", ".net", "graphql",
    "rest api", "restful", "grpc",

    # Databases
    "sql", "mysql", "postgresql", "postgres", "sqlite", "oracle", "mongodb",
    "dynamodb", "redis", "cassandra", "elasticsearch", "firebase", "supabase",
    "nosql", "neo4j", "couchdb",

    # Cloud & DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
    "terraform", "ansible", "jenkins", "github actions", "gitlab ci",
    "ci/cd", "helm", "prometheus", "grafana", "cloudformation",

    # AI / ML / Data
    "machine learning", "deep learning", "natural language processing", "nlp",
    "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "matplotlib", "seaborn", "plotly", "hugging face",
    "transformers", "openai", "langchain", "llm", "data science",
    "data analysis", "data engineering", "feature engineering",
    "mlops", "mlflow", "kubeflow", "airflow", "spark", "hadoop",
    "tableau", "power bi", "looker", "dbt",

    # Security
    "cybersecurity", "penetration testing", "ethical hacking", "soc",
    "siem", "owasp", "ssl", "tls", "encryption", "oauth", "jwt",

    # Mobile
    "android", "ios", "react native", "flutter", "xamarin",

    # Testing
    "unit testing", "integration testing", "pytest", "jest", "selenium",
    "cypress", "playwright", "test driven development", "tdd", "bdd",

    # Tools & practices
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "agile", "scrum", "kanban", "devops", "microservices", "serverless",
    "system design", "design patterns", "object oriented programming",
    "oop", "functional programming", "api design",

    # Soft skills (optionally tracked)
    "leadership", "communication", "problem solving", "teamwork",
    "project management", "time management", "mentoring",
}

# Pre-sort multi-word skills longest-first so we match them before substrings
_SORTED_SKILLS = sorted(SKILL_LIBRARY, key=len, reverse=True)


def _normalize(text: str) -> str:
    """Lowercase and collapse whitespace."""
    return re.sub(r"\s+", " ", text.lower().strip())


def extract_skills(text: str) -> List[str]:
    """
    Returns a deduplicated, sorted list of skills found in *text*.

    Strategy:
    1. Scan raw normalized text for every entry in SKILL_LIBRARY (handles
       multi-word terms like 'machine learning' that spaCy tokens may split).
    2. Use spaCy noun chunks / tokens as an additional signal for single-word
       skills that appear as proper nouns or technical terms.
    """
    normalized = _normalize(text)
    found: Set[str] = set()

    # --- Pass 1: direct substring match on the skill library ---
    for skill in _SORTED_SKILLS:
        # Use word-boundary regex to avoid partial matches (e.g. "r" inside "react")
        pattern = r"(?<![a-z0-9\-\+#])" + re.escape(skill) + r"(?![a-z0-9\-\+#])"
        if re.search(pattern, normalized):
            found.add(skill)

    # --- Pass 2: spaCy noun chunks for anything we may have missed ---
    doc = nlp(text)
    for chunk in doc.noun_chunks:
        chunk_norm = _normalize(chunk.text)
        if chunk_norm in SKILL_LIBRARY:
            found.add(chunk_norm)

    # Also check individual tokens tagged as proper nouns or nouns
    for token in doc:
        token_norm = _normalize(token.text)
        if token_norm in SKILL_LIBRARY:
            found.add(token_norm)

    return sorted(found)
