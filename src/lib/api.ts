export type ApiProject = {
  id: number;
  title: string;
  url: string;
  target: string;
  task: string;
  about_company: string | null;
  stages: string | null;
  result: string | null;
  progress: string | null;
  preview_img: string | null;
  notebook_img: string | null;
  main_img: string | null;
  created_at?: string | null;
};

export type ApiRole = {
  id: number;
  name: string;
};

export type ApiUser = {
  id: number;
  email: string;
  fullname: string | null;
  role_ids: string | null;
  created_at?: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type CreateRoleRequest = {
  name: string;
};

export type UpdateRoleRequest = {
  name: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  fullname?: string;
  role_ids: string; // comma-separated role IDs
};

export type UpdateUserRequest = {
  email?: string;
  password?: string;
  fullname?: string;
  role_ids?: string; // comma-separated role IDs
};

// В Next.js переменные окружения для клиентских компонентов должны начинаться с NEXT_PUBLIC_
// Поддерживаем оба варианта для совместимости
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8000';

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    // не кешируем, чтобы админ всегда видел актуальные данные
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `API error ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<T>;
}

async function apiFormUrlEncoded<T>(
  path: string,
  data: Record<string, string>,
  init?: RequestInit
): Promise<T> {
  const formData = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method: init?.method || 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...init?.headers,
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `API error ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<T>;
}

// ===== Projects =====

// Список проектов (GET /projects)
export async function fetchProjectsFromApi(): Promise<ApiProject[]> {
  return apiJson<ApiProject[]>('/projects');
}

// Полный проект по id (GET /projects/{project_id})
export async function fetchProjectFromApi(
  projectId: number | string
): Promise<ApiProject> {
  return apiJson<ApiProject>(`/projects/${projectId}`);
}

// Создать проект (POST /projects, multipart/form-data)
export async function createProjectOnApi(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Create project failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// Обновить проект (PUT /projects/{project_id}, multipart/form-data)
export async function updateProjectOnApi(
  projectId: number | string,
  formData: FormData
) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Update project failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// Удалить проект (DELETE /projects/{project_id})
export async function deleteProjectOnApi(projectId: number | string) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Delete project failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// ===== Auth =====

// Вход (POST /auth/login)
export async function loginOnApi(
  credentials: LoginRequest
): Promise<LoginResponse> {
  return apiFormUrlEncoded<LoginResponse>('/auth/login', credentials);
}

// Обновить токен (POST /auth/refresh)
export async function refreshTokenOnApi(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  return apiFormUrlEncoded<RefreshTokenResponse>('/auth/refresh', request);
}

// ===== Admin Roles =====

// Получить список ролей (GET /admin/roles)
export async function fetchRolesFromApi(): Promise<ApiRole[]> {
  return apiJson<ApiRole[]>('/admin/roles');
}

// Создать роль (POST /admin/roles)
export async function createRoleOnApi(
  request: CreateRoleRequest
): Promise<ApiRole> {
  return apiFormUrlEncoded<ApiRole>('/admin/roles', request);
}

// Обновить роль (PUT /admin/roles/{role_id})
export async function updateRoleOnApi(
  roleId: number | string,
  request: UpdateRoleRequest
): Promise<ApiRole> {
  return apiFormUrlEncoded<ApiRole>(
    `/admin/roles/${roleId}`,
    request,
    { method: 'PUT' }
  );
}

// Удалить роль (DELETE /admin/roles/{role_id})
export async function deleteRoleOnApi(roleId: number | string) {
  const res = await fetch(`${API_BASE_URL}/admin/roles/${roleId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Delete role failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// ===== Admin Users =====

// Получить список пользователей (GET /admin/users)
export async function fetchUsersFromApi(): Promise<ApiUser[]> {
  return apiJson<ApiUser[]>('/admin/users');
}

// Получить пользователя по id (GET /admin/users/{user_id})
export async function fetchUserFromApi(
  userId: number | string
): Promise<ApiUser> {
  return apiJson<ApiUser>(`/admin/users/${userId}`);
}

// Создать пользователя (POST /admin/users)
export async function createUserOnApi(
  request: CreateUserRequest
): Promise<ApiUser> {
  return apiFormUrlEncoded<ApiUser>('/admin/users', request);
}

// Обновить пользователя (PUT /admin/users/{user_id})
export async function updateUserOnApi(
  userId: number | string,
  request: UpdateUserRequest
): Promise<ApiUser> {
  return apiFormUrlEncoded<ApiUser>(
    `/admin/users/${userId}`,
    request,
    { method: 'PUT' }
  );
}

// Удалить пользователя (DELETE /admin/users/{user_id})
export async function deleteUserOnApi(userId: number | string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Delete user failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// ===== Debug =====

// Получить список таблиц БД (GET /tables)
export async function fetchTablesFromApi(): Promise<string[]> {
  return apiJson<string[]>('/tables');
}

// ===== Hair Lab Bookings =====

export type HairLabLoginRequest = {
  phone: string;
  code: string;
  role?: string; // "client" или "master"
};

export type HairLabToken = {
  access_token: string;
  token_type: string;
};

export type HairLabUser = {
  id: number;
  phone: string;
  name: string | null;
  role: string; // "client" или "master"
  created_at: string;
  is_active: boolean;
};

export type HairLabBooking = {
  id: number;
  user_id: number;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  comment: string | null;
  created_at: string;
  status: string;
};

export type HairLabBookingWithUser = HairLabBooking & {
  user: HairLabUser;
};

export type HairLabBookingCreate = {
  service: string;
  date: string;
  time: string;
  comment?: string;
};

export type TimeSlotCheck = {
  date: string;
  time: string;
};

export type TimeSlotResponse = {
  available: boolean;
  message: string;
};

// Вход в систему бронирований (POST /api/auth/login)
export async function hairLabLogin(
  credentials: HairLabLoginRequest
): Promise<HairLabToken> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Login failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<HairLabToken>;
}

// Получить информацию о текущем пользователе (GET /api/auth/me)
export async function hairLabGetMe(token: string): Promise<HairLabUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Get user failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<HairLabUser>;
}

// Создать бронирование (POST /api/bookings)
export async function hairLabCreateBooking(
  token: string,
  booking: HairLabBookingCreate
): Promise<HairLabBooking> {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(booking),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Create booking failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<HairLabBooking>;
}

// Получить мои бронирования (GET /api/bookings/my)
export async function hairLabGetMyBookings(
  token: string
): Promise<HairLabBooking[]> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Get bookings failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<HairLabBooking[]>;
}

// Отменить бронирование (DELETE /api/bookings/{booking_id})
export async function hairLabCancelBooking(
  token: string,
  bookingId: number
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Cancel booking failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<{ message: string }>;
}

// Проверить доступность времени (POST /api/bookings/check-availability)
export async function hairLabCheckAvailability(
  timeSlot: TimeSlotCheck
): Promise<TimeSlotResponse> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/check-availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(timeSlot),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Check availability failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<TimeSlotResponse>;
}

// ===== Master Endpoints =====

// Получить все бронирования для мастера (GET /api/master/bookings)
export async function hairLabGetMasterBookings(
  token: string
): Promise<HairLabBookingWithUser[]> {
  const res = await fetch(`${API_BASE_URL}/api/master/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Get master bookings failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<HairLabBookingWithUser[]>;
}
