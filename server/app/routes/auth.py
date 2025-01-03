from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import create_user
from app.schemas import UserCreate, UserLogin
from app.hashing import verify_password, create_access_token
from app.models import User
from datetime import datetime, timedelta

router = APIRouter()

# Token expiration time in minutes
TOKEN_EXPIRATION = 60  # 1 hour

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = create_user(db, user.name, user.email, user.password)
    return {
        "id": str(db_user.id),
        "name": db_user.name,
        "email": db_user.email
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()

        if not db_user or not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        # Calculate expiration time
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
    except Exception as e:
        print(f"Error in login: {str(e)}")
        raise

