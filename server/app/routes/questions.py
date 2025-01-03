from fastapi import APIRouter, Depends, HTTPException, Header, Request, Response
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.database import get_db
from app.crud import create_question_answer, get_user_questions, get_question_by_id, delete_question_by_id
from app.schemas import QuestionAnswerCreate, QuestionAnswerResponse
from typing import List
from openai import OpenAI
from dotenv import load_dotenv
import os
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
load_dotenv()
router = APIRouter()

SECRET_KEY = os.getenv('JWT_SECRET_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
ALGORITHM = "HS256"

client = OpenAI(
    api_key=OPENAI_API_KEY,
)

def get_user_id_from_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401, 
                detail="Invalid authentication credentials"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=401, 
            detail="Invalid authentication credentials"
        )

@router.post("/ask", response_model=QuestionAnswerResponse)
@limiter.limit("1/minute")
async def ask_question(
    request: Request,
    question_data: QuestionAnswerCreate,
    db: Session = Depends(get_db),
    authorization: str = Header(...)
):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header format")
        
        token = authorization.split(" ")[1]
        user_id = get_user_id_from_token(token)

        # Validate question
        if not question_data.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        # Generate AI response
        try:
            ai_response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an assistant that provides helpful answers. generate the answer in markdown format."},
                    {"role": "user", "content": question_data.question},
                ],
                max_tokens=700,
            )
            generated_answer = ai_response.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=503, detail="AI service temporarily unavailable")

        # Generate title
        try:
            title_response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Generate a brief title (3-5 words) for this question."},
                    {"role": "user", "content": question_data.question},
                ],
                max_tokens=50,
            )
            generated_title = title_response.choices[0].message.content.strip()
        except Exception:
            # Fallback title if generation fails
            generated_title = question_data.question[:50] + "..." if len(question_data.question) > 50 else question_data.question

        # Create database entry
        try:
            qna_entry = create_question_answer(
                db=db,
                user_id=user_id,
                title=generated_title,
                question=question_data.question,
                answer=generated_answer
            )
            return qna_entry
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to save question and answer")

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/history", response_model=List[QuestionAnswerResponse])
async def get_question_history(
    response: Response,
    db: Session = Depends(get_db),
    authorization: str = Header(...)
):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header format")
        
        token = authorization.split(" ")[1]
        user_id = get_user_id_from_token(token)

        questions = get_user_questions(db, user_id)
        
        # Set Cache-Control header
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        return questions

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch question history")

@router.delete("/{question_id}")
async def delete_question(
    question_id: str,
    db: Session = Depends(get_db),
    authorization: str = Header(...)
):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header format")
        
        token = authorization.split(" ")[1]
        user_id = get_user_id_from_token(token)
        
        success = delete_question_by_id(db, question_id, user_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Question not found")
            
        return {"message": "Question deleted successfully", "status": "success"}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete question")

@router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"}

