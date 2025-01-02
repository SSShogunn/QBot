# app/crud.py
import uuid
from sqlalchemy.orm import Session
from app.models import User, QuestionAnswer
from app.hashing import hash_password 
from fastapi import HTTPException

def create_user(db: Session, name: str, email: str, password: str):
    hashed_password = hash_password(password)
    user = User(
        name=name, 
        email=email, 
        password=hashed_password  
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        raise e

def create_question_answer(
    db: Session, 
    user_id: str, 
    title: str,
    question: str, 
    answer: str
) -> QuestionAnswer:
    if not title:
        title = question[:50] + "..." if len(question) > 50 else question
        
    db_qna = QuestionAnswer(
        user_id=user_id,
        title=title,
        question=question,
        answer=answer
    )
    try:
        db.add(db_qna)
        db.commit()
        db.refresh(db_qna)
        return db_qna
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def get_user_questions(db: Session, user_id: str) -> list[QuestionAnswer]:
    try:
        questions = db.query(QuestionAnswer).filter(QuestionAnswer.user_id == user_id).order_by(QuestionAnswer.created_at.desc()).all()       
        return questions
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def get_question_by_id(db: Session, question_id: str, user_id: str) -> QuestionAnswer:
    return db.query(QuestionAnswer).filter(
        QuestionAnswer.id == question_id,
        QuestionAnswer.user_id == user_id
    ).first()
