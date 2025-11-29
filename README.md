# 🚀 Quick Start Guide - Business Master

Welcome! This guide will get your system running in **15 minutes**. ⚡

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Node.js v18+ installed
- ✅ PostgreSQL v14+ installed
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

### Check Your Versions:
```bash
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
psql --version    # Should be v14 or higher
```

---

## ⚡ Quick Start (Local Development)

### Step 1: Database Setup (2 minutes)

```bash
# Create PostgreSQL database
createdb business_master

# Or using psql:
psql
CREATE DATABASE business_master;
\q
```

### Step 2: Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file - Add these minimum required values:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/business_master"
# JWT_ACCESS_SECRET=run-this-command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# JWT_REFRESH_SECRET=run-command-again-for-different-secret
# CLOUDINARY_CLOUD_NAME=get-from-cloudinary.com
# CLOUDINARY_API_KEY=get-from-cloudinary.com
# CLOUDINARY_API_SECRET=get-from-cloudinary.com
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-gmail-app-password
# CLIENT_URL=http://localhost:5173

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with initial data
npx prisma db seed

# Start backend server
npm run dev
```

**✅ Backend running at: http://localhost:5000**

### Step 3: Frontend Setup (3 minutes)

```bash
# Open new terminal window
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.development file
cp .env.example .env.development

# Edit .env.development - Add:
# VITE_API_URL=http://localhost:5000/api/v1
# VITE_SOCKET_URL=http://localhost:5000
# VITE_CLOUDINARY_CLOUD_NAME=same-as-backend
# VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads

# Start frontend server
npm run dev
```

**✅ Frontend running at: http://localhost:5173**

### Step 4: Test the System (2 minutes)

1. Open browser: http://localhost:5173
2. Click **"Become a Tutor"** or **"Sign up as Parent"**
3. Fill the registration form
4. Click Submit
5. Login with your credentials

**🎉 If you can register and login, everything is working!**

---

## 📁 Project Structure

```
Business Master/
├── backend/              ← Backend API (Node.js + Express)
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── frontend/             ← Frontend App (React + Vite)
│   ├── src/
│   └── package.json
│
├── docs/                 ← Documentation
├── DEPLOYMENT_GUIDE.md   ← How to deploy
├── ENV_SETUP_GUIDE.md    ← Environment variables guide
└── README.md             ← You are here
```

---

## 🔑 Environment Variables Quick Reference

### Backend `.env` (Minimum Required):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/business_master"
JWT_ACCESS_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=different-32-char-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=gmail-app-password
CLIENT_URL=http://localhost:5173
```

### Frontend `.env.development` (Minimum Required):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads
```

**📖 For detailed setup, see: `ENV_SETUP_GUIDE.md`**

---

## 🔧 Common Setup Issues

### Issue: "Cannot connect to database"
```bash
# Make sure PostgreSQL is running
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Check connection:
psql -U postgres -d business_master
```

### Issue: "Module not found"
```bash
# Reinstall dependencies
cd backend && npm install
cd frontend && npm install
```

### Issue: "Port already in use"
```bash
# Backend (port 5000):
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173):
lsof -ti:5173 | xargs kill -9
```

### Issue: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `ENV_SETUP_GUIDE.md` | Complete environment variables guide |
| `DEPLOYMENT_GUIDE.md` | Deploy to Vercel, Render, etc. |
| `docs/API_DOCUMENTATION.md` | All API endpoints (40+) |
| `docs/MATCHING_ALGORITHM.md` | Tutor-student matching logic |
| `docs/DATABASE_SCHEMA.md` | Database structure (20+ tables) |
| `docs/UI_COMPONENTS_WIREFRAMES.md` | Frontend components guide |
| `docs/DEVELOPMENT_ROADMAP.md` | Feature roadmap |
| `PROJECT_STRUCTURE.md` | Complete file structure |
| `PROJECT_COMPLETE.md` | System features & status |

---

## 🚀 Available Scripts

### Backend:
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database
npm run studio       # Open Prisma Studio
```

### Frontend:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🎯 Default Accounts (After Seeding)

### Admin:
```
Email: admin@businessmaster.com
Password: Admin@123
```

### Test Tutor:
```
Email: tutor1@example.com
Password: Tutor@123
```

### Test Parent:
```
Email: parent1@example.com
Password: Parent@123
```

**⚠️ Change these passwords immediately in production!**

---

## 🌟 Key Features

### For Tutors:
- ✅ Multi-step registration with document upload
- ✅ Profile management
- ✅ Session tracking
- ✅ Earnings & payouts
- ✅ Real-time match notifications
- ✅ Attendance marking
- ✅ Report submission

### For Parents:
- ✅ Easy registration
- ✅ Student management
- ✅ Find tutors (search & auto-match)
- ✅ Session tracking
- ✅ Payment management
- ✅ Review & feedback
- ✅ Complaint system

### For Admin:
- ✅ Tutor verification & approval
- ✅ Monitor all sessions
- ✅ Revenue dashboard
- ✅ Manage commissions
- ✅ Analytics & reports
- ✅ Mass communication (SMS/Email)

### Technical:
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Real-time notifications (Socket.io)
- ✅ File uploads (Cloudinary)
- ✅ Email & SMS integration
- ✅ Intelligent matching algorithm
- ✅ Secure & scalable architecture

---

## 📊 Tech Stack

### Frontend:
- React 18
- Vite
- React Router v6
- Redux Toolkit
- TailwindCSS
- Axios
- Socket.io Client

### Backend:
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- Socket.io
- Nodemailer
- Cloudinary

---

## 🚀 Deployment

Ready to deploy? Follow these guides:

### 1. Quick Deploy (Free Tier):
```
Frontend → Vercel (Free)
Backend → Render (Free)
Database → Supabase (Free)
Files → Cloudinary (Free)
```

### 2. Follow Deployment Guide:
See `DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.

**⏱️ Total deployment time: ~40 minutes**

---

## 🆘 Getting Help

### Check These First:
1. ✅ `ENV_SETUP_GUIDE.md` - Environment setup
2. ✅ `DEPLOYMENT_GUIDE.md` - Deployment issues
3. ✅ Backend logs: Check terminal running `npm run dev`
4. ✅ Frontend logs: Check browser console (F12)
5. ✅ Database: Run `npx prisma studio` to view data

### Common Commands:
```bash
# Reset database (⚠️ deletes all data)
cd backend
npx prisma migrate reset

# View database
npx prisma studio

# Check API health
curl http://localhost:5000/api/v1/health

# Generate new Prisma client
npx prisma generate
```

---

## 📝 Development Workflow

### Adding New Features:
1. Backend: Create route → controller → service
2. Frontend: Create component → connect Redux → add route
3. Test locally
4. Push to Git
5. Deploy

### Database Changes:
```bash
# 1. Update prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_migration_name
# 3. Prisma client auto-updates
```

---

## 🎯 Next Steps

Now that you have the system running:

### For Development:
1. ✅ Explore the codebase
2. ✅ Test all features (register, login, create sessions)
3. ✅ Read API documentation (`docs/API_DOCUMENTATION.md`)
4. ✅ Customize UI components
5. ✅ Add new features

### For Production:
1. ✅ Setup Cloudinary account
2. ✅ Setup Gmail App Password
3. ✅ Deploy database (Supabase)
4. ✅ Deploy backend (Render)
5. ✅ Deploy frontend (Vercel)
6. ✅ Test everything
7. ✅ Launch! 🚀

**📖 See `DEPLOYMENT_GUIDE.md` for complete deployment instructions**

---

## 🎉 Congratulations!

You now have a complete, production-ready tutor management system!

### What You Have:
- ✅ **115+ files** of production code
- ✅ **45,000+ lines** of code
- ✅ **Complete backend API** (40+ endpoints)
- ✅ **Complete frontend app** (responsive design)
- ✅ **Intelligent matching algorithm**
- ✅ **Real-time features**
- ✅ **Comprehensive documentation**

### Ready to Deploy?
Follow `DEPLOYMENT_GUIDE.md` to deploy for **FREE** using:
- Vercel (Frontend)
- Render (Backend)
- Supabase (Database)
- Cloudinary (Files)

**Total Cost: $0/month on free tiers!** 🎊

---

## 📞 Quick Links

- **Documentation**: `/docs` folder
- **API Reference**: `docs/API_DOCUMENTATION.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`
- **Environment Setup**: `ENV_SETUP_GUIDE.md`
- **Project Status**: `PROJECT_COMPLETE.md`

---

**🌟 Happy Coding! 🌟**

Built with ❤️ for empowering education through technology.
