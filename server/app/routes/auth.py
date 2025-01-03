from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import create_user
from app.schemas import UserCreate, UserLogin
from app.hashing import verify_password, create_access_token
from app.models import User
from datetime import datetime, timedelta

router = APIRouter()

# Increase token expiration to 24 hours
TOKEN_EXPIRATION = 1440  # 24 hours in minutes

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        db_user = create_user(db, user.name, user.email, user.password)
        return {
            "id": str(db_user.id),
            "name": db_user.name,
            "email": db_user.email,
            "message": "Registration successful"
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()

        if not db_user or not verify_password(user.password, db_user.password):
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password"
            )
        
        expires_at = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRATION)
        
        token = create_access_token(
            data={
                "sub": str(db_user.id),
                "exp": expires_at
            }
        )
        
        return {
            "name": db_user.name,
            "email": db_user.email,
            "token": token,
            "expires_at": expires_at.isoformat()
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error during login")

