# Design Your Endpoint — Salon Booking Appointment System

**Session 7 — Punjab Jobs AI Bootcamp**
**Product:** Salon Booking Appointment System
**Endpoint purpose:** Let a customer book an appointment slot at the salon.

---

## 1. Endpoint + Method

```
POST /api/appointments
```

**Why POST?** The request *creates a new row* in the database. GET is only for reading data.
(Optional bonus: the same file can also handle `GET /api/appointments?date=2026-09-25` to list that day's bookings — branch on `req.method`, exactly like `/api/orders` in the slides.)

---

## 2. Input — JSON Request Body

```json
{
  "customer_name": "Anjali Sharma",
  "phone": "9876543210",
  "service": "Haircut",
  "stylist": "Simran",
  "appointment_time": "2026-09-25T14:30:00Z"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `customer_name` | string | Yes | Name of the customer |
| `phone` | string | Yes | 10-digit mobile number |
| `service` | string | Yes | Haircut / Facial / Hair Spa / Manicure |
| `stylist` | string | No | If blank, salon assigns anyone available |
| `appointment_time` | string (ISO 8601) | Yes | Date + time of the slot |

---

## 3. Output — Sample JSON Responses

### Success — `201 Created`

```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 12,
    "customer_name": "Anjali Sharma",
    "phone": "9876543210",
    "service": "Haircut",
    "stylist": "Simran",
    "appointment_time": "2026-09-25T14:30:00Z",
    "status": "confirmed",
    "created_at": "2026-09-21T09:12:00Z"
  }
}
```

### Error — `400 Bad Request` (missing or invalid field)

```json
{
  "success": false,
  "error": "phone is required"
}
```

### Error — `409 Conflict` (slot already booked)

```json
{
  "success": false,
  "error": "That slot is already booked. Please choose another time."
}
```

### Error — `405 Method Not Allowed` (someone sends GET to a POST-only route)

```json
{
  "success": false,
  "error": "Only POST is allowed on this endpoint"
}
```

---

## 4. Database + Keys

**Database:** Supabase (PostgreSQL)
**Table name:** `appointments`

| Column | Type | Key / Constraint |
|---|---|---|
| `id` | bigint | **Primary key**, auto-increment |
| `customer_name` | text | NOT NULL |
| `phone` | text | NOT NULL |
| `service` | text | NOT NULL |
| `stylist` | text | Nullable |
| `appointment_time` | timestamptz | NOT NULL |
| `status` | text | Default `'confirmed'` (confirmed / cancelled / completed) |
| `created_at` | timestamptz | Default `now()` |

**Primary key:** `id`
**Unique key (prevents double booking):** `UNIQUE (stylist, appointment_time)` — two customers cannot book the same stylist at the same time. This is what triggers the `409 Conflict` response.

**Connection keys (stored in `.env.local`, never in code, never pushed to GitHub):**

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

---

## 5. External Service

**Not required** for the basic booking endpoint. The API only talks to Supabase.

*Future add-on (optional):* MSG91 or Twilio to send an SMS/WhatsApp booking confirmation to the customer after the row is inserted. That would need one more key, `SMS_API_KEY`, also kept in `.env.local`.

---

## Request → Server → Response (the flow)

```
Booking form  →  POST /api/appointments  →  Vercel serverless function
                                             ↓ validates fields
                                             ↓ inserts row into Supabase
                                          201 + appointment JSON  →  "Booking confirmed!"
```

The frontend never touches the database directly — the API is the middle layer.
