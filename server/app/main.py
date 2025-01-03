from fastapi import FastAPI, Request
from app.routes import auth, questions
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from dotenv import load_dotenv
import os

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()

# Update CORS settings to be more specific
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://q-bot-six.vercel.app",  # Add your production URL
        "http://localhost:5173",         # Development URL
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(questions.router, prefix="/questions", tags=["Questions and Answers"])

# Add rate limiter to the app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)