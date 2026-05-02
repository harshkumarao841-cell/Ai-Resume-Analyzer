# AI Resume Analyzer

AI Resume Analyzer is a full-stack web application that compares a candidate resume against a job description. Users upload a PDF or DOCX resume, paste a job description, and receive a match score, matched skills, missing skills, and practical improvement suggestions.

## Features

- Resume upload with PDF and DOCX support
- Job description based skill matching
- FastAPI backend with a structured `/api/analyze` endpoint
- PDF parsing with `pdfplumber`
- DOCX parsing with `python-docx`
- Skill extraction using a curated skill library and spaCy
- Match score calculation based on job description skill coverage
- Rule-based resume improvement suggestions
- Optional MongoDB persistence with Motor
- React dashboard with charts, skill tags, score card, and animated transitions
- Frontend deployment support for Cloudflare Pages
- Backend deployment support for Render or any Python host

## Tech Stack

**Frontend**

- React 18
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Recharts
- Axios
- Lucide React

**Backend**

- Python 3.11
- FastAPI
- Uvicorn
- Pydantic
- spaCy
- pdfplumber
- python-docx
- MongoDB with Motor, optional

## Project Structure

```text
ai-resume-analyzer/
  backend/
    database/
      db.py
    models/
      schema.py
    routes/
      analyze.py
    services/
      parser.py
      skill_extractor.py
      matcher.py
      feedback.py
    main.py
    requirements.txt
    runtime.txt
  frontend/
    src/
      components/
      pages/
      services/
      App.jsx
      main.jsx
      index.css
    package.json
    vite.config.js
    tailwind.config.js
    wrangler.toml
```

## How It Works

1. The user uploads a PDF or DOCX resume and enters a job description.
2. The frontend sends a `multipart/form-data` request to `POST /api/analyze`.
3. The backend extracts readable text from the resume.
4. The backend extracts skills from both the resume and job description.
5. The matcher compares resume skills with job description skills.
6. The API returns a score, matched skills, missing skills, and suggestions.
7. The frontend displays the results in an interactive dashboard.

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Install a spaCy English model:

```bash
python -m spacy download en_core_web_sm
```

Create a `.env` file from the example:

```bash
copy .env.example .env
```

Run the backend:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend health check:

```text
http://127.0.0.1:8000/health
```

FastAPI docs:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the Vite development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## API Configuration

The frontend currently calls the deployed backend:

```text
https://resume-backend-gigu.onrender.com
```

This URL appears in:

- `frontend/src/services/api.js`
- `frontend/src/pages/Upload.jsx`
- `frontend/vite.config.js`

For local-only development, change those backend URLs to:

```text
http://127.0.0.1:8000
```

The backend CORS settings are configured in `backend/main.py`. Add your frontend domain there before deploying a new frontend URL.

## API Endpoints

### `GET /health`

Returns backend status.

Example response:

```json
{
  "status": "healthy"
}
```

### `POST /api/analyze`

Analyzes one resume against one job description.

Request type:

```text
multipart/form-data
```

Fields:

- `resume`: PDF or DOCX file
- `job_description`: full job description text

Example response:

```json
{
  "score": 72.5,
  "skills": ["fastapi", "mongodb", "python", "react"],
  "matched_skills": ["fastapi", "python"],
  "missing_skills": ["docker", "aws"],
  "suggestions": [
    "Moderate match. Strengthen your resume by addressing the missing skills below and quantifying your achievements."
  ]
}
```

## Environment Variables

Backend variables:

```env
MONGO_URI=
MONGO_DB_NAME=resume_analyzer
APP_ENV=development
LOG_LEVEL=info
```

MongoDB is optional. If `MONGO_URI` is empty, the backend still works and skips persistence.

## Deployment

### Backend

The backend can be deployed to Render or another Python hosting platform.

Typical start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Make sure the platform installs dependencies from `backend/requirements.txt` and uses Python `3.11.9`, as defined in `backend/runtime.txt`.

### Frontend

Build the frontend:

```bash
cd frontend
npm run build
```

The production files are generated in:

```text
frontend/dist
```

This project includes `frontend/wrangler.toml` for Cloudflare Pages deployment.

## GitHub Upload Notes

Do commit:

- Source code
- `package.json`
- `package-lock.json`
- `requirements.txt`
- `runtime.txt`
- README files
- `.env.example`

Do not commit:

- `node_modules/`
- `venv/`
- `.env`
- `dist/`
- log files
- `__pycache__/`

The existing `.gitignore` already excludes these generated and sensitive files.

## Future Improvements

- Move the frontend backend URL into a Vite environment variable
- Add authentication for saved analysis history
- Add resume history and downloadable reports
- Expand the skill dictionary
- Add automated frontend and backend tests
- Add Docker support for local development

