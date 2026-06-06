from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Схемы для пользователей
class UserBase(BaseModel):
    phone: str = Field(..., min_length=10, max_length=20)
    name: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    role: str = "client"
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

# Схемы для авторизации
class LoginRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=20)
    code: str = Field(..., min_length=4, max_length=10)  # Увеличил для пароля мастера
    role: str = Field(default="client")  # client или master

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone: Optional[str] = None

# Схемы для бронирований
class BookingBase(BaseModel):
    service: str = Field(..., min_length=1)
    date: str = Field(..., pattern=r'^\d{4}-\d{2}-\d{2}$')  # YYYY-MM-DD
    time: str = Field(..., pattern=r'^\d{2}:\d{2}$')  # HH:MM
    comment: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    user_id: int
    created_at: datetime
    status: str
    
    class Config:
        from_attributes = True

class BookingWithUser(Booking):
    user: User
    
    class Config:
        from_attributes = True

# Схема для проверки доступности времени
class TimeSlotCheck(BaseModel):
    date: str = Field(..., pattern=r'^\d{4}-\d{2}-\d{2}$')
    time: str = Field(..., pattern=r'^\d{2}:\d{2}$')

class TimeSlotResponse(BaseModel):
    available: bool
    message: str
