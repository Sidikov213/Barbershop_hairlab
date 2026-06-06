from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from database import engine, get_db, Base
from models import User, Booking
from schemas import (
    UserCreate, User as UserSchema,
    LoginRequest, Token,
    BookingCreate, Booking as BookingSchema, BookingWithUser,
    TimeSlotCheck, TimeSlotResponse
)
from config import CORS_ORIGINS, DATABASE_URL
from auth import (
    verify_code, create_access_token, get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
)

# Создание таблиц в БД
Base.metadata.create_all(bind=engine)

# Миграция: добавление колонки role, если её нет
def migrate_role_column():
    """Добавляет колонку role в таблицу users, если её нет"""
    import sqlite3
    
    # Получаем путь к БД из DATABASE_URL
    if DATABASE_URL.startswith('sqlite:///'):
        db_path = DATABASE_URL.replace('sqlite:///', '')
        if db_path.startswith('./'):
            import os
            db_path = os.path.join(os.path.dirname(__file__), db_path[2:])
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Проверяем, существует ли колонка role
            cursor.execute("PRAGMA table_info(users)")
            columns = [column[1] for column in cursor.fetchall()]
            
            if 'role' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'client'")
                conn.commit()
                print("Migration: Added 'role' column to 'users' table")
            
            # Обновляем существующие записи
            cursor.execute("UPDATE users SET role = 'client' WHERE role IS NULL")
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Migration warning: {e}")

# Выполняем миграцию при запуске
migrate_role_column()

app = FastAPI(
    title="Hair Lab API",
    description="API для системы бронирования барбершопа Hair Lab",
    version="1.0.0"
)

# CORS middleware для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === AUTH ENDPOINTS ===

@app.post("/api/auth/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Вход пользователя по номеру телефона и коду/паролю.
    Код для клиентов: 1111
    Пароль для мастеров: 12345
    """
    # Проверка кода/пароля в зависимости от роли
    if not verify_code(login_data.code, login_data.role):
        if login_data.role == "master":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный пароль мастера"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный код подтверждения"
            )
    
    # Поиск или создание пользователя
    user = db.query(User).filter(User.phone == login_data.phone).first()
    if not user:
        # Создаём нового пользователя при первом входе
        user = User(phone=login_data.phone, role=login_data.role)
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Обновляем роль, если она изменилась
        if user.role != login_data.role:
            user.role = login_data.role
            db.commit()
            db.refresh(user)
    
    # Создание токена
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.phone, "role": user.role}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserSchema)
def get_me(current_user: User = Depends(get_current_active_user)):
    """Получение информации о текущем пользователе"""
    return current_user

@app.put("/api/auth/me", response_model=UserSchema)
def update_me(
    user_update: UserCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Обновление информации о пользователе"""
    if user_update.name:
        current_user.name = user_update.name
    db.commit()
    db.refresh(current_user)
    return current_user

# === BOOKING ENDPOINTS ===

@app.post("/api/bookings", response_model=BookingSchema, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: BookingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Создание нового бронирования.
    Требуется авторизация.
    Проверяет доступность выбранного времени.
    """
    # Проверка, не занято ли это время
    existing_booking = db.query(Booking).filter(
        Booking.date == booking.date,
        Booking.time == booking.time,
        Booking.status == "confirmed"
    ).first()
    
    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Время {booking.time} на дату {booking.date} уже занято"
        )
    
    # Создание бронирования
    db_booking = Booking(
        user_id=current_user.id,
        service=booking.service,
        date=booking.date,
        time=booking.time,
        comment=booking.comment
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    return db_booking

@app.get("/api/bookings/my", response_model=List[BookingSchema])
def get_my_bookings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получение всех бронирований текущего пользователя"""
    bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).order_by(Booking.date.desc(), Booking.time.desc()).all()
    return bookings

@app.get("/api/bookings/{booking_id}", response_model=BookingSchema)
def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получение информации о конкретном бронировании"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    
    # Проверка, что бронирование принадлежит текущему пользователю
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    return booking

@app.delete("/api/bookings/{booking_id}")
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Отмена бронирования"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    
    # Проверка, что бронирование принадлежит текущему пользователю
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    booking.status = "cancelled"
    db.commit()
    
    return {"message": "Бронирование успешно отменено"}

@app.post("/api/bookings/check-availability", response_model=TimeSlotResponse)
def check_time_slot(
    time_slot: TimeSlotCheck,
    db: Session = Depends(get_db)
):
    """Проверка доступности временного слота"""
    existing_booking = db.query(Booking).filter(
        Booking.date == time_slot.date,
        Booking.time == time_slot.time,
        Booking.status == "confirmed"
    ).first()
    
    if existing_booking:
        return {
            "available": False,
            "message": f"Время {time_slot.time} на дату {time_slot.date} уже занято"
        }
    
    return {
        "available": True,
        "message": "Время свободно"
    }

# === MASTER ENDPOINTS ===

def get_current_master(current_user: User = Depends(get_current_active_user)) -> User:
    """Проверка что пользователь является мастером"""
    if current_user.role != "master":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ разрешен только для мастеров"
        )
    return current_user

@app.get("/api/master/bookings", response_model=List[BookingWithUser])
def get_master_bookings(
    current_user: User = Depends(get_current_master),
    db: Session = Depends(get_db)
):
    """Получение всех бронирований для мастера (отсортированные по дате и времени)"""
    bookings = db.query(Booking).filter(
        Booking.status == "confirmed"
    ).order_by(Booking.date.asc(), Booking.time.asc()).all()
    return bookings

# === ADMIN ENDPOINTS (опционально) ===

@app.get("/api/admin/bookings", response_model=List[BookingWithUser])
def get_all_bookings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Получение всех бронирований (для администратора)"""
    bookings = db.query(Booking).offset(skip).limit(limit).all()
    return bookings

# === ROOT ===

@app.get("/")
def read_root():
    return {
        "message": "Hair Lab API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
