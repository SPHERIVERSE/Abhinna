# Abhinna Institute – Coaching Platform

A full-stack **CMS + Landing Page** for a coaching institute, built using the **PERN stack** with a modern, production-ready architecture.

---

## 🚀 Tech Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL (Prisma ORM)
* **Storage:** Cloudinary (Image Management)
* **Authentication:** JWT (HttpOnly Cookies) + OTP Logic

---

## 🛠️ Prerequisites

Ensure the following are installed on your system:

* Node.js **v20+**
* PostgreSQL (Local or Cloud: Neon / Supabase)
* Git

---

## 📥 1. Clone the Repository

```bash
git clone https://github.com/SPHERIVERSE/Abhinna.git
cd Abhinna
```

---

## 🗄️ 2. Database Setup

Create a new PostgreSQL database:

```sql
CREATE DATABASE coaching_db;
```

---

## ⚙️ 3. Backend Setup

### Navigate to backend

```bash
cd backend
```

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file inside `backend/`:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:password@localhost:5432/coaching_db?schema=public"
JWT_SECRET="your_super_secret_key_here"
NODE_ENV="development"

# Cloudinary (for Admin uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

> Replace `postgres:password` with your actual PostgreSQL credentials.

---

### Database Migration & Seeding

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed initial data (Admin, defaults)
npx prisma db seed
```

---

### Start Backend Server

```bash
npm run dev
```

Backend will run at:

```
http://localhost:4000
```

---

## 🖥️ 4. Frontend Setup

### Navigate to frontend

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Environment variables

Create `.env.local` inside `frontend/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Cloudinary (client-side uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_PRESET="your_unsigned_preset_name"
```

---

### Start Frontend

```bash
npm run dev
```

Frontend will be live at:

```
http://localhost:3000
```

---

## 🔐 5. Admin Account Setup

Admin accounts are **not publicly creatable**.

### Recommended: Prisma Seed

The `prisma/seed.ts` script automatically creates the initial **SUPER_ADMIN**.

Run:

```bash
npx prisma db seed
```

---

### Alternative: Prisma Studio

```bash
npx prisma studio
```

* Open the `Admin` model
* Add a record manually
* Use a valid bcrypt password hash

---

## 📂 Project Structure

```
/
├── backend/
│   ├── prisma/          # Prisma schema, migrations, seed
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes (Admin & Public)
│   │   ├── middlewares/ # Auth & guards
│   │   └── config/      # DB & env config
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── app/         # App Router pages
    │   ├── components/  # Reusable UI components
    │   └── lib/         # Utilities
    └── .env.local
```

---

## 🤝 Team Git Workflow (IMPORTANT)

This project follows a **professional Git flow**.

### Branches

* `main` → Stable / production-ready
* `dev` → Active development branch
* `feature/*` → Individual features

```
main
 └── dev
     ├── feature/admin-login
     ├── feature/courses
     └── feature/analytics
```

---

### Daily Workflow (for all developers)

#### 1. Sync before work

```bash
git checkout dev
git pull origin dev
```

#### 2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

#### 3. Commit changes

```bash
git add .
git commit -m "Add admin dashboard layout"
```

#### 4. Sync with latest dev

```bash
git checkout dev
git pull origin dev
git checkout feature/your-feature-name
git merge dev
```

#### 5. Push feature branch

```bash
git push origin feature/your-feature-name
```

#### 6. Create Pull Request

* Base branch: `dev`
* Compare branch: `feature/*`
* Review → Merge

---

### Releasing to Production

```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

---

## ✅ Contribution Rules

* ❌ Never commit directly to `main`
* ✅ One feature = one branch
* ✅ Small, clear commits
* ✅ Always pull before coding
* ✅ Use Pull Requests

---

## 📄 License

MIT License

---

**Built for scalability, collaboration, and real-world production use.** 🚀

