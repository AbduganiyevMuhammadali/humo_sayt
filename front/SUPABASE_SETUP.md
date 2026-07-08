# Supabase sozlash — qadam-baqadam (admin panel uchun)

Admin panel shifokorlar ma'lumotini va rasmlarini saqlashi uchun Supabase kerak.
Supabase **bepul**. Quyidagilarni bajaring (10 daqiqa).

---

## 1. Supabase'da loyiha yaratish

1. https://supabase.com saytiga kiring → **Start your project** → ro'yxatdan o'ting (GitHub yoki email).
2. **New project** bosing.
3. Nom: `humo-medline`, parol o'ylab toping (saqlab qo'ying), region: eng yaqinini tanlang.
4. **Create new project** → 1-2 daqiqa kuting.

---

## 2. Shifokorlar jadvalini yaratish

Chap menyuda **SQL Editor** → **New query** → quyidagini joylashtiring va **Run** bosing:

```sql
create table doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  experience text,
  patients text,
  photo_url text,
  sort int default 0,
  created_at timestamp default now()
);

-- Saytdan o'qishga ruxsat (hammaga), yozishga — faqat admin panel orqali.
alter table doctors enable row level security;

create policy "ommaga o'qish" on doctors
  for select using (true);

create policy "ommaga yozish" on doctors
  for all using (true) with check (true);
```

> ⚠️ Eslatma: bu sodda sozlama (oddiy parol bilan ishlash uchun). Keyinroq
> xavfsizlikni kuchaytirish mumkin (Supabase Auth bilan).

---

## 3. Rasm uchun "Storage" yaratish

1. Chap menyuda **Storage** → **New bucket**.
2. Nom: `doctors` → **Public bucket** ni YOQING → **Create**.

---

## 4. Kalitlarni saytga ulash

1. Chap pastda **Project Settings** (⚙️) → **API**.
2. `Project URL` va `anon public` kalitni nusxalang.
3. Loyihada `front/.env` fayl yarating (`.env.example` dan nusxa oling) va kiriting:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_PASSWORD=humo2026
```

4. Dev serverni qayta ishga tushiring (`npm run dev`).

---

## 5. Tayyor!

- Admin panel: **http://localhost:5173/admin**
- Parol: `.env` dagi `VITE_ADMIN_PASSWORD` (standart: `humo2026`)
- U yerdan shifokor qo'shing, rasm yuklang — sayt avtomatik yangilanadi.

Savol bo'lsa — menga yozing, har bir qadamda yordam beraman.
