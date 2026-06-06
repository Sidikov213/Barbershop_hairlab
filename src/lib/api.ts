const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:8000';

export type HairLabLoginRequest = {
  phone: string;
  code: string;
  role?: string;
};

export type HairLabToken = {
  access_token: string;
  token_type: string;
};

export type HairLabUser = {
  id: number;
  phone: string;
  name: string | null;
  role: string;
  created_at: string;
  is_active: boolean;
};

export type HairLabBooking = {
  id: number;
  user_id: number;
  service: string;
  date: string;
  time: string;
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

export async function hairLabGetMe(token: string): Promise<HairLabUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
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

export async function hairLabCreateBooking(
  token: string,
  booking: HairLabBookingCreate
): Promise<HairLabBooking> {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

export async function hairLabGetMyBookings(
  token: string
): Promise<HairLabBooking[]> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
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

export async function hairLabCancelBooking(
  token: string,
  bookingId: number
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
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

export async function hairLabGetAllBookings(): Promise<HairLabBooking[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Get all bookings failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<HairLabBooking[]>;
}

export async function hairLabGetMasterBookings(
  token: string
): Promise<HairLabBookingWithUser[]> {
  const res = await fetch(`${API_BASE_URL}/api/master/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
