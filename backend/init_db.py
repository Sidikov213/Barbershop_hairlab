"""
Скрипт для инициализации базы данных с тестовыми данными
"""
from database import SessionLocal, engine, Base
from models import User, Booking
from datetime import datetime

def init_database():
    """Создание таблиц и добавление тестовых данных"""
    print("Создание таблиц в базе данных...")
    Base.metadata.create_all(bind=engine)
    print("✅ Таблицы созданы!")
    
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже данные
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"⚠️ База данных уже содержит {existing_users} пользователей.")
            response = input("Хотите очистить базу и создать заново? (y/n): ")
            if response.lower() != 'y':
                print("Инициализация отменена.")
                return
            
            # Очистка базы
            print("Очистка базы данных...")
            db.query(Booking).delete()
            db.query(User).delete()
            db.commit()
            print("✅ База данных очищена!")
        
        # Создание тестовых пользователей
        print("\nСоздание тестовых пользователей...")
        users = [
            User(phone="+79991234567", name="Иван Иванов"),
            User(phone="+79991234568", name="Пётр Петров"),
            User(phone="+79991234569", name="Сидор Сидоров"),
        ]
        db.add_all(users)
        db.commit()
        print(f"✅ Создано {len(users)} тестовых пользователей!")
        
        # Создание тестовых бронирований
        print("\nСоздание тестовых бронирований...")
        bookings = [
            Booking(
                user_id=1,
                service="Мужская стрижка",
                date="2026-01-21",
                time="12:00",
                comment="Тестовое бронирование",
                status="confirmed"
            ),
            Booking(
                user_id=2,
                service="Окрашивание волос",
                date="2026-01-21",
                time="14:00",
                comment="",
                status="confirmed"
            ),
            Booking(
                user_id=1,
                service="Стрижка бороды и бритьё",
                date="2026-01-22",
                time="10:00",
                comment="Требуется королевское бритьё",
                status="confirmed"
            ),
        ]
        db.add_all(bookings)
        db.commit()
        print(f"✅ Создано {len(bookings)} тестовых бронирований!")
        
        print("\n" + "="*50)
        print("✅ База данных успешно инициализирована!")
        print("="*50)
        print("\n📋 Тестовые данные:")
        print("\nПользователи:")
        for user in users:
            print(f"  - {user.name} ({user.phone})")
        
        print("\nБронирования:")
        for booking in bookings:
            user = db.query(User).filter(User.id == booking.user_id).first()
            print(f"  - {booking.date} {booking.time} | {booking.service} | {user.name}")
        
        print("\n💡 Для входа используйте любой номер телефона и код: 1111")
        
    except Exception as e:
        print(f"❌ Ошибка при инициализации: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
