from pydantic import BaseModel, EmailStr, UUID4, Field
from datetime import datetime

# Auth schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# Question schemas
class QuestionAnswerCreate(BaseModel):
    question: str


class QuestionAnswerResponse(BaseModel):
    id: UUID4
    title: str = Field(..., min_length=1)
    question: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)
    user_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True