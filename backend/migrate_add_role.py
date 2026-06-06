"""
Миграция: добавление колонки role в таблицу users
"""
import sqlite3
import os

# Путь к базе данных
db_path = os.path.join(os.path.dirname(__file__), 'hairlab.db')

def migrate():
    """Добавляет колонку role в таблицу users, если её нет"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Проверяем, существует ли колонка role
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'role' not in columns:
            print("Adding 'role' column to 'users' table...")
            cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'client'")
            conn.commit()
            print("SUCCESS: Column 'role' added!")
        else:
            print("Column 'role' already exists")
        
        # Обновляем существующие записи, у которых role = NULL
        cursor.execute("UPDATE users SET role = 'client' WHERE role IS NULL")
        conn.commit()
        print("SUCCESS: Existing users updated")
        
    except Exception as e:
        print(f"ERROR during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
