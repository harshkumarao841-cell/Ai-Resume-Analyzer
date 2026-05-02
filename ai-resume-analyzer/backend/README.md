# Backend README

This folder contains the FastAPI backend for AI Resume Analyzer. It receives resume uploads, extracts text, detects skills, compares them with a job description, generates suggestions, and optionally stores analysis records in MongoDB.

## Main Files

- `main.py`: creates the FastAPI app, configures CORS, registers routes, and exposes `/health`
- `routes/analyze.py`: defines `POST /api/analyze`, the main analysis endpoint
- `services/parser.py`: extracts plain text from PDF and DOCX uploads
- `services/skill_extractor.py`: extracts known skills from resume and job description text
- `services/matcher.py`: calculates match score, matched skills, and missing skills
- `services/feedback.py`: creates rule-based improvement suggestions
- `models/schema.py`: defines Pydantic response models
- `database/db.py`: handles optional MongoDB persistence
- `requirements.txt`: Python dependencies
- `runtime.txt`: Python runtime version for deployment

## Requirements

- Python 3.11
- pip
- A spaCy English model, usually `en_core_web_sm`
- MongoDB connection string, optional

## Local Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Install the spaCy model:

```bash
python -m spacy download en_core_web_sm
```

Create local environment variables:

```bash
copy .env.example .env
```

Run the backend:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Environment Variables

```env
MONGO_URI=
MONGO_DB_NAME=resume_analyzer
APP_ENV=development
LOG_LEVEL=info
```

`MONGO_URI` can be left empty. When it is empty, `database/db.py` skips persistence and the analyzer still returns results.

## Endpoints

### `GET /health`

Checks whether the API is running.

```json
{
  "status": "healthy"
}
```

### `POST /api/analyze`

Analyzes a resume against a job description.

Request body:

- `resume`: PDF or DOCX file
- `job_description`: text field

Response:

- `score`: percentage of job description skills found in the resume
- `skills`: all skills extracted from the resume
- `matched_skills`: skills found in both resume and job description
- `missing_skills`: job description skills missing from the resume
- `suggestions`: improvement tips

## Analysis Pipeline

1. Validate that the job description is not empty.
2. Parse uploaded resume text from PDF or DOCX.
3. Extract resume skills with the skill dictionary and spaCy.
4. Extract job description skills with the same extractor.
5. Calculate the match percentage.
6. Generate improvement suggestions.
7. Save a shortened analysis record to MongoDB if configured.
8. Return a structured JSON response.

## CORS

CORS is configured in `main.py`. Current allowed origins include local Vite URLs and deployed frontend URLs. Add your new frontend domain before deployment if you change hosting.

## Deployment

For Render or similar platforms:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Make sure the platform installs `requirements.txt` and has access to the spaCy model. If the model is not preinstalled, add a build step:

```bash
python -m spacy download en_core_web_sm
```

