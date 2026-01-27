# AfterHack

AfterHack is a post-hackathon deal room platform connecting student builders with founders and recruiters.

## Project Structure

- **frontend/**: Next.js application (React, Tailwind CSS)
- **backend/**: Node.js Express application
    - **src/config/**: Configuration files
    - **src/controllers/**: Request handlers
    - **src/models/**: Database schemas (PostgreSQL & MongoDB)
    - **src/routes/**: API routes
    - **src/services/**: Business logic (AI scoring, etc.)
    - **src/middleware/**: Authentication and validation middleware
    - **src/utils/**: Helper functions
- **docker-compose.yml**: Docker orchestration for local development

## Getting Started

1.  **Prerequisites**: Node.js, Docker
2.  **Install Dependencies**:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```
3.  **Run Locally**:
    ```bash
    docker-compose up --build
    ```
    Or run individually:
    - Backend: `cd backend && npm start`
    - Frontend: `cd frontend && npm run dev`

## Features

- Student Project Uploads
- AI Signal Scoring
- Founder/Recruiter Dashboard
- Request System
- Role-based Access Control
