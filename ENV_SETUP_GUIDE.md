# 🔐 Environment Variables Setup Guide

This guide explains how to create and configure your `.env` files for both backend and frontend.

---

## 📁 File Locations

```
Business Master/
├── backend/
│   ├── .env.example          ← Template (this is provided)
│   └── .env                  ← Create this file (add to .gitignore)
└── frontend/
    ├── .env.example          ← Template (this is provided)
    ├── .env.development      ← Create this for local development
    └── .env.production       ← Create this for production (or use Vercel dashboard)
```

---

## 🚀 Quick Setup

### Step 1: Backend `.env` File

```bash
# Navigate to backend folder
cd backend

# Copy the example file
cp .env.example .env

# Open in editor
nano .env
# or
code .env
```

### Step 2: Frontend `.env` Files

```bash
# Navigate to frontend folder
cd frontend

# For development
cp .env.example .env.development

# For production (optional, can use Vercel dashboard instead)
cp .env.example .env.production

# Open in editor
nano .env.development
# or
code .env.development
```

---

## 🔧 Backend Environment Variables Explained

### 1. Server Configuration
```env
NODE_ENV=development          # Use 'production' for deployment
PORT=5000                     # Backend server port
```

### 2. Database URL
**Local Development:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/business_master?schema=public"
```
Replace:
- `postgres` = your PostgreSQL username
- `password` = your PostgreSQL password
- `business_master` = your database name

**Production (Supabase):**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```
Get this from: Supabase Dashboard → Settings → Database → Connection string

### 3. JWT Secrets
**Generate random secrets:**
```bash
# Run this command twice to get two different secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output:
```
a7f3d9e2c1b8a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9
```

Add to `.env`:
```env
JWT_ACCESS_SECRET=a7f3d9e2c1b8a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9
JWT_REFRESH_SECRET=different-secret-here-min-32-characters-long
```

### 4. Cloudinary Configuration

**How to get these:**
1. Go to https://cloudinary.com/users/register/free
2. Sign up and verify email
3. Go to Dashboard
4. Copy these values:

```env
CLOUDINARY_CLOUD_NAME=dxxxxxx     # Your cloud name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123xyz789def456
```

**Create Upload Preset:**
1. Go to Settings → Upload
2. Click "Add upload preset"
3. Name: `business-master-uploads`
4. Signing Mode: **Unsigned**
5. Folder: `business-master`
6. Save

### 5. Gmail Configuration

**How to get App Password:**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select: Mail → Other → Enter "Business Master"
5. Click Generate
6. Copy 16-character password (e.g., `abcd efgh ijkl mnop`)

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop    # Remove spaces
```

### 6. Client URL (Frontend URL)

**Development:**
```env
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

**Production (update after deploying to Vercel):**
```env
CLIENT_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🎨 Frontend Environment Variables Explained

### Development (`.env.development`)
```env
# Point to local backend
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# Your Cloudinary details
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads
```

### Production (`.env.production` or Vercel Dashboard)
```env
# Point to deployed backend
VITE_API_URL=https://business-master-api.onrender.com/api/v1
VITE_SOCKET_URL=https://business-master-api.onrender.com

# Your Cloudinary details
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads
```

---

## 📋 Complete Setup Checklist

### For Local Development:

#### Backend Setup:
- [ ] Create `backend/.env`
- [ ] Set `NODE_ENV=development`
- [ ] Set `DATABASE_URL` (local PostgreSQL)
- [ ] Generate and set `JWT_ACCESS_SECRET`
- [ ] Generate and set `JWT_REFRESH_SECRET`
- [ ] Add Cloudinary credentials
- [ ] Add Gmail credentials
- [ ] Set `CLIENT_URL=http://localhost:5173`
- [ ] Set `CORS_ORIGIN=http://localhost:5173`

#### Frontend Setup:
- [ ] Create `frontend/.env.development`
- [ ] Set `VITE_API_URL=http://localhost:5000/api/v1`
- [ ] Set `VITE_SOCKET_URL=http://localhost:5000`
- [ ] Add Cloudinary credentials

### For Production:

#### Backend (Render/Heroku):
- [ ] Add all environment variables to deployment platform
- [ ] Update `NODE_ENV=production`
- [ ] Update `DATABASE_URL` (Supabase/Railway/Neon)
- [ ] Update `CLIENT_URL` to Vercel URL
- [ ] Update `CORS_ORIGIN` to Vercel URL

#### Frontend (Vercel):
- [ ] Add environment variables to Vercel dashboard
- [ ] Set `VITE_API_URL` to backend URL
- [ ] Set `VITE_SOCKET_URL` to backend URL
- [ ] Add Cloudinary credentials

---

## 🧪 Testing Your Configuration

### Test Backend Connection:
```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Test database connection
npx prisma db push

# Start server
npm run dev

# Should see: Server running on port 5000
```

### Test Frontend Connection:
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Should see: Local: http://localhost:5173
```

Open browser and try to register/login to test API connection.

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` files in `.gitignore`
- Use strong, random secrets for JWT
- Use Gmail App Passwords (never regular password)
- Different secrets for access and refresh tokens
- Update production URLs after deployment

### ❌ DON'T:
- Commit `.env` files to Git
- Share your secrets publicly
- Use the same secret for access and refresh tokens
- Use weak passwords or simple strings
- Hardcode secrets in your code

---

## 🆘 Common Issues

### Issue: "Cannot find module 'dotenv'"
```bash
cd backend
npm install dotenv
```

### Issue: "Database connection failed"
```bash
# Check DATABASE_URL format
# Ensure PostgreSQL is running (local)
# Check credentials are correct
# Test with: npx prisma db push
```

### Issue: "CORS error in browser"
```bash
# Ensure CORS_ORIGIN matches frontend URL
# Restart backend server after changing .env
```

### Issue: "Cloudinary upload fails"
```bash
# Verify CLOUDINARY_CLOUD_NAME is correct
# Check upload preset exists and is "unsigned"
# Ensure API key and secret are correct
```

---

## 📞 Quick Reference

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Check if .env is loaded:
```bash
# In backend/src/server.js, add temporarily:
console.log('DATABASE_URL:', process.env.DATABASE_URL)
```

### Verify Vite env variables:
```bash
# In frontend, Vite variables MUST start with VITE_
# Access with: import.meta.env.VITE_API_URL
```

---

## 🎯 Ready-to-Use Templates

### Minimal Backend `.env` (Local Development):
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/business_master?schema=public"
JWT_ACCESS_SECRET=generate-with-command-above-min-32-chars
JWT_REFRESH_SECRET=different-secret-min-32-chars
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### Minimal Frontend `.env.development`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads
```

---

## ✅ Verification Checklist

Run through this checklist to ensure everything is configured:

1. **Backend .env exists**: `ls backend/.env` ✓
2. **Frontend .env exists**: `ls frontend/.env.development` ✓
3. **Database connects**: `cd backend && npx prisma db push` ✓
4. **Backend starts**: `cd backend && npm run dev` ✓
5. **Frontend starts**: `cd frontend && npm run dev` ✓
6. **API call works**: Open frontend and try to register ✓
7. **Cloudinary works**: Try uploading a file ✓
8. **Email works**: Complete registration (check email) ✓

---

## 🎉 You're All Set!

Once you've created your `.env` files with the correct values:

1. Backend will connect to database
2. Frontend will connect to backend
3. File uploads will work
4. Emails will send
5. Authentication will work

**Next step**: Run `npm install` and `npm run dev` in both folders!

---

**Need help?** Check the main `DEPLOYMENT_GUIDE.md` for detailed setup instructions for each service!

