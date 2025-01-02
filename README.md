
# QBot - AI-Powered Q&A Platform

<div align="center">

![QBot Logo](/client/public/bot-message-square-icon.svg)

A modern Q&A platform powered by GPT-4, built with FastAPI and React.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/) 
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) 
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) 
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

</div>

## Features

- AI-powered responses using GPT-4
- JWT authentication for secure access
- PostgreSQL database for persistent storage
- Modern UI with Tailwind CSS and shadcn/ui
- Responsive design for all devices

## Technical Stack

### Backend Infrastructure
- FastAPI
- PostgreSQL
- SQLAlchemy
- OpenAI API
- Python 3.9+

### Frontend Development
- React 18
- Tailwind CSS
- shadcn/ui
- Vite
- React Router

## Installation and Setup

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- PostgreSQL
- OpenAI API key

### Backend Configuration

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qbot.git
cd qbot/server
```

2. Set up virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables in `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/qbot
JWT_SECRET_KEY=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

5. Execute database migrations:
```bash
alembic upgrade head
```

6. Start the server:
```bash
uvicorn app.main:app --reload
```

### Frontend Configuration

1. Navigate to client directory:
```bash
cd ../client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:8000
```

4. Launch development server:
```bash
npm run dev
```

## API Documentation

Access the API documentation through:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

### Backend Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: Secret key for JWT token generation
- `OPENAI_API_KEY`: OpenAI API key

### Frontend Configuration
- `VITE_API_URL`: Backend API URL

## Project Team

- Your Name
- [@SSShogunn](https://github.com/SSShogunn)

## Acknowledgments

- OpenAI for GPT-4 API integration
- shadcn/ui for UI component library
- FastAPI for backend framework implementation