#!/usr/bin/env bash
# ============================================================
#  HUMO Medline — frontend deploy skripti (VPS, Nginx)
# ============================================================
#  Ishlatish (lokal kompyuterda, front/ papkasida turib):
#     ./deploy.sh 123.45.67.89
#  yoki domen bilan:
#     ./deploy.sh humomedline.uz
#
#  Talab: serverga SSH root kaliti yoki paroli bo'lishi kerak.
#  Bu skript: build qiladi → dist/ ni serverga yuboradi → Nginx sozlaydi.
# ============================================================
set -e

SERVER="${1:?Server IP yoki domen kiriting: ./deploy.sh <IP>}"
SSH_USER="${SSH_USER:-root}"
REMOTE_DIR="/var/www/humo"
DOMAIN="${DOMAIN:-$SERVER}"

echo "==> 1/4  Frontend build qilinmoqda..."
npm ci 2>/dev/null || npm install
npm run build

echo "==> 2/4  Serverda papka yaratilmoqda ($SSH_USER@$SERVER:$REMOTE_DIR)..."
ssh "$SSH_USER@$SERVER" "mkdir -p $REMOTE_DIR"

echo "==> 3/4  dist/ fayllari yuborilmoqda..."
# rsync bo'lsa — tez va aniq; bo'lmasa scp
if command -v rsync >/dev/null 2>&1; then
  rsync -avz --delete dist/ "$SSH_USER@$SERVER:$REMOTE_DIR/"
else
  scp -r dist/* "$SSH_USER@$SERVER:$REMOTE_DIR/"
fi

echo "==> 4/4  Nginx sozlanmoqda..."
ssh "$SSH_USER@$SERVER" "bash -s" <<REMOTE
set -e
# Nginx o'rnatilmagan bo'lsa o'rnatamiz
if ! command -v nginx >/dev/null 2>&1; then
  (apt-get update && apt-get install -y nginx) || (yum install -y nginx)
fi

cat > /etc/nginx/conf.d/humo.conf <<'NGINX'
server {
    listen 80;
    server_name $DOMAIN;
    root $REMOTE_DIR;
    index index.html;

    # Vue SPA — barcha yo'llar index.html ga (router uchun)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Statik fayllarni keshlash
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?)\$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
NGINX

# default konfig SPA'ni to'smasligi uchun
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

nginx -t && systemctl reload nginx && systemctl enable nginx
REMOTE

echo ""
echo "✅ Tayyor! Sayt shu yerda: http://$DOMAIN"
echo "   (HTTPS uchun: server'da  'certbot --nginx -d $DOMAIN'  ni ishga tushiring)"
