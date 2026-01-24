"""
Скрипт для тестирования API
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_login():
    """Тест входа в систему"""
    print("\n=== Тест входа ===")
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "phone": "+79991234567",
            "code": "1111"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def test_get_me(token):
    """Тест получения информации о пользователе"""
    print("\n=== Тест получения информации о пользователе ===")
    response = requests.get(
        f"{BASE_URL}/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_check_availability():
    """Тест проверки доступности времени"""
    print("\n=== Тест проверки доступности времени ===")
    response = requests.post(
        f"{BASE_URL}/api/bookings/check-availability",
        json={
            "date": "2026-01-21",
            "time": "12:00"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_create_booking(token):
    """Тест создания бронирования"""
    print("\n=== Тест создания бронирования ===")
    response = requests.post(
        f"{BASE_URL}/api/bookings",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "service": "Мужская стрижка",
            "date": "2026-01-23",
            "time": "15:00",
            "comment": "Тестовое бронирование через API"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    if response.status_code == 201:
        return response.json()["id"]
    return None

def test_get_my_bookings(token):
    """Тест получения моих бронирований"""
    print("\n=== Тест получения моих бронирований ===")
    response = requests.get(
        f"{BASE_URL}/api/bookings/my",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_cancel_booking(token, booking_id):
    """Тест отмены бронирования"""
    print(f"\n=== Тест отмены бронирования #{booking_id} ===")
    response = requests.delete(
        f"{BASE_URL}/api/bookings/{booking_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def main():
    """Запуск всех тестов"""
    print("="*60)
    print("  Hair Lab API - Тестирование")
    print("="*60)
    
    try:
        # Проверка доступности API
        response = requests.get(BASE_URL)
        print(f"\n✅ API доступен: {BASE_URL}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"\n❌ API недоступен: {e}")
        print("Убедитесь, что backend запущен (python main.py)")
        return
    
    # Тесты
    token = test_login()
    if not token:
        print("\n❌ Ошибка входа. Остановка тестов.")
        return
    
    test_get_me(token)
    test_check_availability()
    
    booking_id = test_create_booking(token)
    test_get_my_bookings(token)
    
    if booking_id:
        test_cancel_booking(token, booking_id)
    
    print("\n" + "="*60)
    print("  Тестирование завершено!")
    print("="*60)

if __name__ == "__main__":
    main()
