# HUMO Medline — Serverga joylash (VPS + Nginx)

Loyiha: **Vue 3 statik sayt** (SPA) + **Supabase** (bulut baza).
Alohida backend YO'Q — faqat `dist/` papkani serverga qo'yish kerak.

---

## 0. ⚠️ AVVAL: parolni almashtiring

ahost.uz panel parolingizni chatda yozgan bo'lsangiz — **darhol almashtiring**
va iloji bo'lsa 2FA yoqing.

---

## 1. `.env` faylini yarating (bir marta)

`front/` papkada `.env.example` dan nusxa oling:

```bash
cp .env.example .env
```

Keyin `.env` ichini to'ldiring (Supabase → Project Settings → API dan):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_PASSWORD=<kuchli-parol>
```

> Bu qiymatlar build paytida `dist/` ichiga kiritiladi. `anon` kalit ochiq
> kalit — frontendda ishlatish xavfsiz. `service_role` kalitni HECH QACHON
> bu yerga qo'ymang.

---

## 2. Avtomatik deploy (eng oson)

`front/` papkada turib:

```bash
./deploy.sh <SERVER_IP>
```

yoki domen bilan:

```bash
DOMAIN=humomedline.uz ./deploy.sh <SERVER_IP>
```

Skript o'zi: build qiladi → `dist/` ni serverga yuboradi → Nginx sozlaydi.
Tugagach sayt `http://<IP>` da ochiladi.

> Skript SSH orqali ulanadi. Birinchi ulanishda server paroli so'raladi.
> Parol qayta-qayta so'ralmasligi uchun SSH kalit qo'ying:
> `ssh-copy-id root@<IP>`

---

## 3. HTTPS (SSL) yoqish — domen bo'lsa

Domenni server IP'ga yo'naltirgach (DNS A-record), serverga kiring:

```bash
ssh root@<IP>
apt install -y certbot python3-certbot-nginx
certbot --nginx -d humomedline.uz -d www.humomedline.uz
```

---

## 4. Qo'lda deploy (skriptsiz)

```bash
# 1. Lokal build
npm install
npm run build

# 2. Serverga yuborish
rsync -avz --delete dist/ root@<IP>:/var/www/humo/

# 3. Server'da Nginx (bir marta) — deploy.sh ichidagi konfigni qo'ying
```

---

## Yangilash (keyingi safar)

Kodni o'zgartirgach faqat qaytadan:

```bash
./deploy.sh <SERVER_IP>
```
