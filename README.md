# Glow Salon — Booking API

Session 7 homework — Punjab Jobs AI Bootcamp.
Ek Vercel serverless API jo Supabase database se bookings padhta aur likhta hai.

## Kya-kya bana hai

| File | Kaam |
|---|---|
| `api/appointments.js` | **Asli API** — GET (bookings padho) + POST (booking banao) |
| `index.html` | Booking form + bookings ki list |
| `docs.html` | Swagger UI — GET aur POST dono dikhte hain |
| `openapi.json` | API ki spec, Swagger isi ko padhta hai |
| `supabase-setup.sql` | Table banane ka SQL |
| `.env.local.example` | Keys ka example (asli keys `.env.local` mein) |

Deploy hone ke baad 3 links milenge:

```
https://<tumhara-project>.vercel.app/                    → booking page
https://<tumhara-project>.vercel.app/docs.html           → Swagger docs
https://<tumhara-project>.vercel.app/api/appointments    → raw JSON (screenshot isi ka)
```

---

## Step 1 — Supabase mein table banao

1. [supabase.com](https://supabase.com) → **Start your project** → GitHub se login
2. **New project** → naam do, database password daalo (kahin save kar lo), region **Mumbai** ya **Singapore**
3. Project khulne ke baad left side → **SQL Editor** → **New query**
4. `supabase-setup.sql` file ka saara code copy karke paste karo → **Run** dabao

Table ban gaya. **Table Editor** mein `appointments` dikhna chahiye.

## Step 2 — Keys copy karo

Supabase mein left side → **Project Settings** → **API**. Wahan se do cheezein chahiye:

- **Project URL** → `SUPABASE_URL`
- **anon public key** → `SUPABASE_ANON_KEY`

Ab project folder mein `.env.local.example` ki copy banao, naam rakho `.env.local`, aur apni asli values daal do.

> `.env.local` already `.gitignore` mein hai — ye GitHub pe kabhi nahi jayegi. Yahi sir ne kaha tha.

## Step 3 — GitHub pe daalo

Ye commands ek-ek karke chalao:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Salon booking API"
```

Phir [github.com/new](https://github.com/new) pe ek **naya empty repo** banao (README add mat karna), aur jo do commands wo page pe dikhaye wo chala do — kuch aisa:

```bash
git remote add origin https://github.com/<tumhara-username>/<repo-naam>.git
```

```bash
git push -u origin main
```

> Push ke baad GitHub pe check karo — `.env.local` **nahi** dikhni chahiye. Agar dikh rahi hai to ruko aur mujhe batao.

## Step 4 — Vercel pe deploy

1. [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub** (wahi account jisme repo hai)
2. **Add New** → **Project** → apna repo **Import** karo
3. Deploy dabane se **pehle** → **Environment Variables** kholo aur dono keys daalo:

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | Supabase wala Project URL |
   | `SUPABASE_ANON_KEY` | Supabase wali anon key |

4. **Deploy** dabao → 1–2 minute wait karo

## Step 5 — Test karo aur screenshot lo

Apna Vercel link kholo:

- `/` → form bhar ke ek booking karo
- `/api/appointments` → JSON mein wo booking dikhni chahiye ✅ **is page ka screenshot lo**
- `/docs.html` → Swagger mein GET aur POST dono dikhenge

Sir ko submit karo: **endpoint URL + screenshot**.

---

## Kuch galat ho to

| Problem | Wajah | Fix |
|---|---|---|
| `permission denied for table appointments` | RLS policies nahi bani | `supabase-setup.sql` ka policy wala hissa dobara Run karo |
| `fetch failed` / 500 | Vercel pe env variables nahi daale | Vercel → Settings → Environment Variables → daal ke **Redeploy** karo |
| Booking pe `409` | Us stylist ka wo slot already booked hai | Dusra time ya dusra stylist choose karo |
| Env variable daala par abhi bhi error | Vercel purana build use kar raha hai | Deployments → latest → **Redeploy** |

## Bonus (agar sir ko third-party API chahiye)

`api/weather.js` already bana hua hai — OpenWeatherMap se mausam laake salon service suggest karta hai.
Use karna ho to [openweathermap.org](https://openweathermap.org/api) se free key lo aur Vercel mein `WEATHER_API_KEY` add kar do.
Nahi chahiye to us file ko delete kar dena.
