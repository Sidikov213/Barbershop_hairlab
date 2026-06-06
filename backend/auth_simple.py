"""
Упрощенная версия авторизации без JWT (на случай проблем с установкой python-jose)
Использует простые токены на основе UUID
"""
from datetime import datetime, timedelta
from typing import Optional
import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User

security = HTTPBearer()

VERIFICATION_CODE = "1111"  # Статический код для всех пользователей
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Простое хранилище токенов в памяти (в продакшене использовать Redis)
# Формат: {token: {"phone": phone, "expires": datetime}}
_token_storage = {}

def verify_code(code: str) -> bool:
    """Проверка кода подтверждения"""
    return code == VERIFICATION_CODE

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создание простого токена"""
    token = secrets.token_urlsafe(32)
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    phone = data.get("sub")
    _token_storage[token] = {
        "phone": phone,
        "expires": expire
    }
    
    # Очистка истекших токенов
    _cleanup_expired_tokens()
    
    return token

def _cleanup_expired_tokens():
    """Удаление истекших токенов"""
    now = datetime.utcnow()
    expired = [token for token, data in _token_storage.items() if data["expires"] < now]
    for token in expired:
        del _token_storage[token]

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Получение текущего пользователя из токена"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    
    # Проверка токена
    if token not in _token_storage:
        raise credentials_exception
    
    token_data = _token_storage[token]
    
    # Проверка срока действия
    if token_data["expires"] < datetime.utcnow():
        del _token_storage[token]
        raise credentials_exception
    
    phone = token_data["phone"]
    if not phone:
        raise credentials_exception
    
    user = db.query(User).filter(User.phone == phone).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Проверка что пользователь активен"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
