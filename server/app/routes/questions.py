from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.database import get_db
from app.crud import create_question_answer, get_user_questions, get_question_by_id, delete_question_answer, delete_question_by_id
from app.schemas import QuestionAnswerCreate, QuestionAnswerResponse
from typing import List
from openai import OpenAI
from dotenv import load_dotenv
import os
from datetime import datetime

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
            raise HTTPException(status_code=401, detail="Invalid token: User ID not found")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")

def generate_title(question: str) -> str:
    """
    Generate a short title from the question using GPT-4
    """
    try:
        title_response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "Generate a brief, concise title (maximum 3-5 words) that summarizes the following question. Return only the title without any additional text or punctuation. dont use any special characters or symbols. dont add \ or / at the start or end of the title."
                },
                {"role": "user", "content": question},
            ],
            max_tokens=50,
        )
        return title_response.choices[0].message.content.strip()
    except Exception as e:
        return question[:50] + "..." if len(question) > 50 else question

@router.post("/ask", response_model=QuestionAnswerResponse)
def ask_question(
    question_data: QuestionAnswerCreate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    token = authorization.split(" ")[1]

    user_id = get_user_id_from_token(token)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token: User ID not found")
    
    try:

        ai_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an assistant that provides helpful answers. generate the answer in markdown format."},
                {"role": "user", "content": question_data.question},
            ],
            max_tokens=700,
        )
        generated_answer = ai_response.choices[0].message.content

        generated_title = generate_title(question_data.question)

        qna_entry = create_question_answer(
            db=db,
            user_id=user_id,
            title=generated_title,
            question=question_data.question,
            answer=generated_answer
        )
        return qna_entry

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {e}")

@router.get("/history", response_model=List[QuestionAnswerResponse])
def get_question_history(
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        token = authorization.split(" ")[1]

        user_id = get_user_id_from_token(token)

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: User ID not found")

        questions = get_user_questions(db, user_id)
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@router.get("/{question_id}", response_model=QuestionAnswerResponse)
def get_question(
    question_id: str,
    db: Session = Depends(get_db),
    authorization: str = Header(...)
):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        token = authorization.split(" ")[1]
        
        user_id = get_user_id_from_token(token)

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: User ID not found")
        
        question = get_question_by_id(db, question_id, user_id)
        
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
            
        return question
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching question: {str(e)}")
    
@router.delete("/{question_id}")
def delete_question(
    question_id: str,
    db: Session = Depends(get_db),
    authorization: str = Header(...)
):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        token = authorization.split(" ")[1]
        
        user_id = get_user_id_from_token(token)
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: User ID not found")
        
        success = delete_question_by_id(db, question_id, user_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Question not found")
            
        return {"message": "Question deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting question: {str(e)}")

@router.get("/health")
def health_check():
    return {"status": "OK"}

