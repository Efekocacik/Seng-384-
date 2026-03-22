# Person Management System

React, Node.js (Express), PostgreSQL ve Docker Compose kullanılarak geliştirilmiş basit bir **Kişi Yönetim Sistemi**.

- **Backend**: Node.js + Express + PostgreSQL (`/api/people` CRUD)
- **Frontend**: React (Vite) + React Router + Axios
- **Veritabanı**: PostgreSQL (`people` tablosu)
- **Docker Compose**: `db`, `backend`, `frontend` servisleri tek komutla ayağa kalkar.

## Klasör Yapısı

```text
project-root/
  docker-compose.yml
  .env.example
  README.md

  db/
    init.sql

  backend/
    Dockerfile
    package.json
    src/
      db.js
      server.js
      controllers/
        peopleController.js
      routes/
        peopleRoutes.js

  frontend/
    Dockerfile
    package.json
    vite.config.ts
    index.html
    src/
      App.jsx
      main.jsx
      pages/
        RegistrationForm.jsx
        PeopleListPage.jsx
      styles.css
```

## Ortam Değişkenleri

Proje kök dizininde, `.env.example` dosyasını kopyalayarak `.env` oluşturun:

```bash
cp .env.example .env
```

Varsayılan değerler:

```env
POSTGRES_USER=people_user
POSTGRES_PASSWORD=people_password
POSTGRES_DB=people_db

DB_USER=people_user
DB_PASSWORD=people_password
DB_NAME=people_db
DB_HOST=db
DB_PORT=5432

PORT=5000
NODE_ENV=development
```

Backend, Docker ağı içinde veritabanına `DB_HOST=db` ile bağlanır.

## Çalıştırma (Docker ile Tek Komut)

Tüm sistemi Docker üzerinden ayağa kaldırmak için:

```bash
docker compose up --build
```

Bu komut:

- PostgreSQL veritabanını (`db` servisi) başlatır.
  - `db/init.sql` dosyası otomatik olarak çalıştırılır.
  - `people` tablosu oluşturulur.
- Backend API’sini (`backend` servisi) başlatır.
  - Express sunucusu `http://localhost:5001` üzerinde çalışır.
  - Ana endpoint: `http://localhost:5001/api/people`
  - (Mac'te port 5000 AirPlay tarafından kullanıldığı için 5001 kullanılır.)
- Frontend uygulamasını (`frontend` servisi) başlatır.
  - Nginx üzerinden `http://localhost:3000` adresinde yayınlanır.

## Backend API Özeti

- **Base URL**: `http://localhost:5001/api/people`

### Rotalar

- **GET** `/api/people` – Tüm kişileri listeler.
- **GET** `/api/people/:id` – Belirli kişiyi döner.
  - 404: Kişi yoksa.
- **POST** `/api/people` – Yeni kişi ekler.
  - Body: `{ "full_name": "...", "email": "..." }`
  - 201: Başarılı.
  - 400: Validasyon hatası.
  - 409: E-posta benzersiz değilse.
- **PUT** `/api/people/:id` – Kişi günceller.
  - Body: `{ "full_name": "...", "email": "..." }`
  - 200: Başarılı.
  - 400 / 404 / 409: Hata durumları.
- **DELETE** `/api/people/:id` – Kişi siler.
  - 200: Başarılı.
  - 404: Kişi bulunamadı.

## Frontend Sayfaları

- `/` – **Kayıt Formu**
  - Ad Soyad ve E-posta alanları.
  - İstemci tarafı validasyon.
  - Başarı ve hata mesajları.
  - POST `/api/people` çağrısı.

- `/people` – **Kişi Listesi**
  - GET `/api/people` ile tablo listesi.
  - Inline düzenleme (PUT `/api/people/:id`).
  - Onaylı silme (DELETE `/api/people/:id`).

Frontend, backend adresini `.env` üzerinden de alabilir:

```env
VITE_API_URL=http://localhost:5001
```

Docker build sırasında otomatik olarak `http://localhost:5001` kullanılır.

## Lokal Geliştirme (Opsiyonel)

Docker kullanmadan geliştirme yapmak için:

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Varsayılan Vite portu `http://localhost:5173` olacaktır.

