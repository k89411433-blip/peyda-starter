# پیدا — اسکلت بک‌اند بازارگاه آگهی

این مخزن یک **اسکلت قابل اجرا برای شروع توسعه** است، نه محصول نهایی آماده انتشار. شامل NestJS، PostgreSQL/PostGIS، Redis، Prisma، Swagger، API پایه آگهی‌ها و کنترل دسترسی مبتنی بر نقش برای پنل مدیریت است.

## پیش‌نیازها
- Node.js 22+
- Docker Desktop / Docker Engine و Docker Compose

## اجرای محلی

```bash
cp .env.example .env
```

مقادیر `JWT_ACCESS_SECRET`، `BOOTSTRAP_ADMIN_EMAIL` و `BOOTSTRAP_ADMIN_PASSWORD` را در `.env` تغییر بده. رمز مدیر باید حداقل ۱۶ کاراکتر و منحصربه‌فرد باشد. برای محیط واقعی از secret manager استفاده کن و رمز نمونه را به‌کار نبر.

برای سرویس‌های داده:

```bash
docker compose up -d
```

نصب وابستگی‌ها و ساخت Prisma Client:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

ایجاد مدیر اولیه:

```bash
npm run prisma:seed-admin
```

پس از ایجاد مدیر، متغیر `BOOTSTRAP_ADMIN_PASSWORD` را از محیط اجرا حذف کن. سپس:

```bash
npm run start:dev
```

- Health: `GET http://localhost:3000/api/v1/health`
- Swagger UI: `http://localhost:3000/docs`
- Admin dashboard: `GET /api/v1/admin/dashboard` با توکن Bearer مدیر

## APIهای موجود
- `POST /api/v1/auth/login` با `{ "identifier": "admin@example.com", "password": "..." }`
- `GET /api/v1/categories`
- `GET /api/v1/listings?q=...&province=...` (فقط آگهی منتشرشده)
- `POST /api/v1/listings` (نیازمند ورود؛ آگهی در وضعیت بررسی ثبت می‌شود)
- `GET /api/v1/admin/dashboard` (فقط نقش ADMIN)

## ساختار

```text
src/
  auth/         ورود JWT، گارد توکن و نقش‌ها
  admin/        endpoint محدودشده مدیریت
  categories/   فهرست دسته‌ها
  listings/     فهرست و ثبت آگهی
  health/       سلامت سرویس
  main.ts       پیکربندی، Helmet، CORS، Validation و Swagger
prisma/
  schema.prisma مدل‌های کاربران، دسته‌ها، آگهی، رسانه، بازدید، چت و استوری
  seed-admin.ts ساخت امن مدیر اولیه از متغیرهای محیطی
```

## نکات امنیت و تکمیل پیش از انتشار
1. JWT secret را با مقدار تصادفی امن حداقل ۳۲ بایت جایگزین کن. کلیدها را در Git قرار نده.
2. این نمونه ورود دارد اما ثبت‌نام، تأیید SMS، refresh-token rotation، بازیابی حساب، MFA واقعی و rate limiting هنوز پیاده‌سازی نشده‌اند.
3. Redis در Compose آماده است ولی در این اسکلت هنوز به قابلیت‌های کاربردی متصل نشده است.
4. مدل مختصات اولیه Decimal است. برای جست‌وجوی شعاعی و مسیر، migration اختصاصی PostGIS و سرویس نقشه/مسیریابی لازم است.
5. پیام‌رسان زنده، بارگذاری امن رسانه، moderation، اعلان push، مدیریت کامل آگهی‌ها و ثبت رویداد بازدید باید در فازهای بعدی تکمیل شوند.
6. پنل مدیریت وب و اپلیکیشن Flutter/Next.js در این بسته نیستند؛ این مخزن فقط API و زیرساخت داده را آغاز می‌کند.
7. قبل از تولید: تست خودکار و امنیتی، محدودیت اندازه درخواست، rate limit، سیاست CORS دقیق، TLS، مدیریت secrets، پشتیبان‌گیری و بازیابی، مانیتورینگ و تست بار لازم است.

## Docker برای API
`Dockerfile` نمونه ساخت image برنامه است؛ برای اجرا در محیط واقعی، secretها را از orchestrator تزریق کن، migration را به‌صورت job کنترل‌شده اجرا کن و از اجرای migration خودکار در هر replica اجتناب کن.

## رابط وب و داشبورد مدیریتی (آغازین)

رابط وب در پوشه `web/` با Next.js ساخته شده و به API بک‌اند وصل می‌شود. شامل خانه بازارگاه، جست‌وجو، دسته‌بندی‌ها، استوری‌های نمایشی، فهرست آگهی‌های دریافتی از API، پوسته روشن/تیره و ورود مدیر برای نمایش آمار است.

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

وب‌سایت روی `http://localhost:3001` اجرا می‌شود و به‌طور پیش‌فرض از `http://localhost:3000/api/v1` استفاده می‌کند. اگر API جای دیگری اجرا می‌شود، `NEXT_PUBLIC_API_URL` را در `web/.env.local` تغییر بده.

**وضعیت:** این رابط آغازین به مسیرهای API موجود متصل است؛ فرم کامل ثبت آگهی، چت زنده، نقشه عملیاتی، مدیریت آگهی‌ها و ابزارهای CRUD پنل هنوز نیاز به توسعه دارند. برای استفاده واقعی، وابستگی‌های وب و API را نصب و تست کن و کلیدها و رمزهای محیطی را امن تنظیم کن.
