# 🚀 Complete Deployment Guide - Business Master

## Table of Contents
1. [Cloudinary Setup](#cloudinary-setup)
2. [PostgreSQL Database Deployment](#postgresql-database-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Final Configuration](#final-configuration)
6. [Testing Deployment](#testing-deployment)

---

## 1. Cloudinary Setup

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Click **"Sign up for free"**
3. Fill in your details:
   - Email
   - Password
   - Name
4. Click **"Create Account"**
5. Verify your email

### Step 2: Get Your Credentials
1. After login, you'll see the Dashboard
2. Copy these 3 values:
   ```
   Cloud Name: your-cloud-name
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz123
   ```

### Step 3: Create Upload Preset
1. Click **Settings** (gear icon) → **Upload**
2. Scroll to **"Upload presets"**
3. Click **"Add upload preset"**
4. Configure:
   ```
   Preset name: business-master-uploads
   Signing Mode: Unsigned
   Folder: business-master
   ```
5. Click **"Save"**
6. Copy the preset name

### Step 4: Create Folders (Optional)
1. Go to **Media Library**
2. Create folders:
   ```
   business-master/
   ├── documents/
   │   ├── id/
   │   └── university/
   ├── reports/
   └── avatars/
   ```

### Step 5: Update Environment Variables
Add to your `.env` files:
```env
# Backend (.env)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend (.env)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads
```

✅ **Cloudinary Setup Complete!**

---

## 2. PostgreSQL Database Deployment

### Option A: Supabase (Recommended - Free Tier Available)

#### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign in with GitHub/Email

#### Step 2: Create New Project
1. Click **"New Project"**
2. Fill in:
   ```
   Name: business-master
   Database Password: [Create strong password]
   Region: [Choose closest to users]
   Plan: Free (or Pro)
   ```
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

#### Step 3: Get Connection String
1. Go to **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual password

#### Step 4: Configure Database
```bash
# Update backend/.env
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"
```

#### Step 5: Run Migrations
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

✅ **Supabase PostgreSQL Setup Complete!**

---

### Option B: Railway.app (Alternative)

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign in with GitHub

#### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Provision PostgreSQL"**
3. Wait for database creation

#### Step 3: Get Connection String
1. Click on PostgreSQL service
2. Go to **"Connect"** tab
3. Copy **"Postgres Connection URL"**

#### Step 4: Update Environment
```bash
# backend/.env
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:7432/railway"
```

#### Step 5: Deploy Migrations
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

✅ **Railway PostgreSQL Setup Complete!**

---

### Option C: Neon.tech (Serverless PostgreSQL)

#### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Click **"Sign up"** with GitHub

#### Step 2: Create Database
1. Click **"Create project"**
2. Name: `business-master`
3. PostgreSQL version: 14
4. Region: Choose closest

#### Step 3: Get Connection String
1. Copy connection string from dashboard
2. Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb`

#### Step 4: Setup
```bash
# backend/.env
DATABASE_URL="your-neon-connection-string"

# Deploy
cd backend
npx prisma migrate deploy
npx prisma db seed
```

✅ **Neon PostgreSQL Setup Complete!**

---

## 3. Backend Deployment

### Option A: Render.com (Recommended)

#### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   ```
   Name: business-master-api
   Environment: Node
   Build Command: cd backend && npm install && npx prisma generate
   Start Command: cd backend && npm start
   Plan: Free (or Starter)
   ```

#### Step 3: Add Environment Variables
Click **"Environment"** and add:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your-database-url
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=https://your-frontend.vercel.app
```

#### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for build and deployment
3. Copy the service URL: `https://business-master-api.onrender.com`

#### Step 5: Run Migrations
1. Go to **"Shell"** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

✅ **Backend Deployed on Render!**

---

### Option B: Heroku

#### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login and Create App
```bash
heroku login
cd backend
heroku create business-master-api
```

#### Step 3: Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:mini
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
heroku config:set CLOUDINARY_CLOUD_NAME=your-cloud-name
heroku config:set CLOUDINARY_API_KEY=your-api-key
heroku config:set CLOUDINARY_API_SECRET=your-api-secret
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set CLIENT_URL=https://your-frontend.vercel.app
```

#### Step 5: Deploy
```bash
# Add Procfile
echo "web: cd backend && npm start" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
heroku run npx prisma db seed
```

✅ **Backend Deployed on Heroku!**

---

## 4. Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign in with **GitHub**
4. Authorize Vercel

### Step 2: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 3: Prepare Frontend for Deployment

#### Update Frontend Environment
Create `frontend/.env.production`:
```env
VITE_API_URL=https://business-master-api.onrender.com/api/v1
VITE_SOCKET_URL=https://business-master-api.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads
```

### Step 4: Deploy via Vercel Dashboard

#### Method 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   # Initialize git if not done
   cd "Business Master"
   git init
   git add .
   git commit -m "Complete Business Master system"
   
   # Create GitHub repo and push
   git remote add origin https://github.com/yourusername/business-master.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click **"Add New..." → "Project"**
   - Click **"Import Git Repository"**
   - Select your `business-master` repository
   - Click **"Import"**

3. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**:
   - Click **"Environment Variables"**
   - Add each variable:
     ```
     VITE_API_URL = https://business-master-api.onrender.com/api/v1
     VITE_SOCKET_URL = https://business-master-api.onrender.com
     VITE_CLOUDINARY_CLOUD_NAME = your-cloud-name
     VITE_CLOUDINARY_UPLOAD_PRESET = business-master-uploads
     ```

5. **Deploy**:
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - Your app will be live at: `https://business-master.vercel.app`

#### Method 2: Deploy via CLI

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? business-master
# Directory? ./
# Override settings? No

# Set environment variables
vercel env add VITE_API_URL production
# Enter: https://business-master-api.onrender.com/api/v1

vercel env add VITE_SOCKET_URL production
# Enter: https://business-master-api.onrender.com

vercel env add VITE_CLOUDINARY_CLOUD_NAME production
# Enter: your-cloud-name

vercel env add VITE_CLOUDINARY_UPLOAD_PRESET production
# Enter: business-master-uploads

# Production deployment
vercel --prod
```

✅ **Frontend Deployed on Vercel!**

---

## 5. Final Configuration

### Step 1: Update Backend CORS

Update `backend/.env` or environment variables:
```env
CLIENT_URL=https://business-master.vercel.app
CORS_ORIGIN=https://business-master.vercel.app
```

### Step 2: Update Frontend API URL

Ensure `frontend/.env.production` has correct backend URL:
```env
VITE_API_URL=https://business-master-api.onrender.com/api/v1
```

### Step 3: Configure Custom Domain (Optional)

#### For Vercel (Frontend):
1. Go to project **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `tutormaster.com`
4. Follow DNS configuration instructions
5. Add DNS records to your domain provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### For Backend (Render):
1. Go to service **Settings** → **Custom Domains**
2. Add domain: `api.tutormaster.com`
3. Add CNAME record to DNS:
   ```
   Type: CNAME
   Name: api
   Value: business-master-api.onrender.com
   ```

---

## 6. Testing Deployment

### Step 1: Test Backend API
```bash
# Test health endpoint
curl https://business-master-api.onrender.com/api/v1/health

# Expected response:
# {"success":true,"message":"API is running","timestamp":"...","version":"1.0.0"}
```

### Step 2: Test Frontend
1. Open browser: https://business-master.vercel.app
2. You should see the home page
3. Try to register: Click "Become a Tutor"
4. Try to login

### Step 3: Test Complete Flow
1. **Register as Parent**:
   - Go to https://business-master.vercel.app/register/parent
   - Fill the form
   - Submit

2. **Login**:
   - Use registered credentials
   - Should redirect to parent dashboard

3. **Test Features**:
   - View dashboard
   - Check notifications
   - Try finding tutors

---

## 7. Environment Variables Checklist

### Backend Environment Variables (Render/Heroku)
```env
✅ NODE_ENV=production
✅ PORT=5000
✅ DATABASE_URL=postgresql://... (from Supabase/Railway/Neon)
✅ JWT_ACCESS_SECRET=min-32-chars-random-string
✅ JWT_REFRESH_SECRET=different-min-32-chars-random-string
✅ JWT_ACCESS_EXPIRES_IN=15m
✅ JWT_REFRESH_EXPIRES_IN=7d
✅ CLOUDINARY_CLOUD_NAME=your-cloud-name
✅ CLOUDINARY_API_KEY=your-api-key
✅ CLOUDINARY_API_SECRET=your-api-secret
✅ EMAIL_HOST=smtp.gmail.com
✅ EMAIL_PORT=587
✅ EMAIL_SECURE=false
✅ EMAIL_USER=your-email@gmail.com
✅ EMAIL_PASSWORD=your-16-char-app-password
✅ EMAIL_FROM=Business Master <noreply@businessmaster.com>
✅ CLIENT_URL=https://business-master.vercel.app
✅ CORS_ORIGIN=https://business-master.vercel.app
```

### Frontend Environment Variables (Vercel)
```env
✅ VITE_API_URL=https://business-master-api.onrender.com/api/v1
✅ VITE_SOCKET_URL=https://business-master-api.onrender.com
✅ VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
✅ VITE_CLOUDINARY_UPLOAD_PRESET=business-master-uploads
```

---

## 8. Step-by-Step Deployment (Complete Walkthrough)

### 🔷 PHASE 1: Cloudinary (5 minutes)

```bash
1. Visit: https://cloudinary.com/users/register/free
2. Create account
3. Verify email
4. Copy: Cloud Name, API Key, API Secret
5. Create upload preset (unsigned, folder: business-master)
6. Save credentials for later
```

---

### 🔷 PHASE 2: Database (10 minutes)

#### Using Supabase:
```bash
1. Visit: https://supabase.com
2. Sign in with GitHub
3. Click "New Project"
4. Fill:
   - Name: business-master
   - Password: [Strong password]
   - Region: [Closest to you]
5. Wait for database creation (2-3 min)
6. Go to Settings → Database
7. Copy "Connection string (URI)"
8. Save for backend deployment
```

---

### 🔷 PHASE 3: Backend Deployment (15 minutes)

#### Using Render.com:
```bash
1. Visit: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   Name: business-master-api
   Root Directory: backend
   Environment: Node
   Build Command: npm install && npx prisma generate
   Start Command: npm start
6. Add all environment variables (see checklist above)
7. Click "Create Web Service"
8. Wait for deployment (5-10 min)
9. Once deployed, go to Shell tab
10. Run: npx prisma migrate deploy
11. Run: npx prisma db seed
12. Copy service URL: https://business-master-api.onrender.com
```

---

### 🔷 PHASE 4: Frontend Deployment to Vercel (10 minutes)

```bash
# Step 1: Push to GitHub (if not done)
cd "/Users/supun/Desktop/Business Master"
git init
git add .
git commit -m "Complete Business Master system"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/business-master.git
git branch -M main
git push -u origin main

# Step 2: Deploy to Vercel
1. Visit: https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your repository
5. Configure:
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
6. Add environment variables:
   VITE_API_URL = https://business-master-api.onrender.com/api/v1
   VITE_SOCKET_URL = https://business-master-api.onrender.com
   VITE_CLOUDINARY_CLOUD_NAME = your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET = business-master-uploads
7. Click "Deploy"
8. Wait 2-3 minutes
9. Your app is live!
```

---

## 9. Post-Deployment Configuration

### Step 1: Update Backend CORS
In your backend deployment (Render/Heroku), update:
```env
CLIENT_URL=https://business-master.vercel.app
CORS_ORIGIN=https://business-master.vercel.app
```

Then redeploy backend.

### Step 2: Test Everything
```bash
# Test API
curl https://business-master-api.onrender.com/api/v1/health

# Test Frontend
# Open: https://business-master.vercel.app
```

### Step 3: Seed Admin Account
```bash
# Using Render Shell or Heroku CLI
npx prisma db seed

# Default admin credentials:
# Email: admin@businessmaster.com
# Password: Admin@123 (change immediately!)
```

---

## 10. Gmail Setup for Emails

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Follow setup instructions

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter: "Business Master"
5. Click **"Generate"**
6. Copy the 16-character password
7. Use this as `EMAIL_PASSWORD` in backend env

### Step 3: Test Email
```bash
# After deployment, test registration
# You should receive welcome email
```

---

## 11. Twilio Setup for SMS (Optional)

### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up for free trial
3. Verify your phone number
4. Get $15 trial credit

### Step 2: Get Credentials
1. Go to Console Dashboard
2. Copy:
   ```
   Account SID: ACxxxxxxxxxxxxxxxxx
   Auth Token: your-auth-token
   ```

### Step 3: Get Phone Number
1. Click **"Get a Trial Number"**
2. Confirm number
3. Copy: `+1234567890`

### Step 4: Add to Environment
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 12. Deployment Checklist

### Before Deployment:
- [ ] All code pushed to GitHub
- [ ] Cloudinary account created
- [ ] PostgreSQL database ready
- [ ] Gmail app password generated
- [ ] Environment variables prepared
- [ ] Database migration files ready

### After Deployment:
- [ ] Backend health check passes
- [ ] Frontend loads successfully
- [ ] Database seeded with initial data
- [ ] User registration works
- [ ] Login works
- [ ] File uploads work (test with tutor documents)
- [ ] Emails sending correctly
- [ ] Real-time notifications working
- [ ] All API endpoints responding

---

## 13. Quick Reference URLs

### Development:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Production (Your URLs will be):
- Frontend: https://business-master.vercel.app
- Backend: https://business-master-api.onrender.com
- Database: [Your Supabase/Railway/Neon dashboard]

### Service Dashboards:
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com
- Supabase: https://app.supabase.com
- Cloudinary: https://cloudinary.com/console
- GitHub: https://github.com/yourusername/business-master

---

## 14. Troubleshooting

### Issue: Vercel build fails
**Solution**:
```bash
# Make sure package.json is in frontend folder
# Check build command: npm run build
# Verify all dependencies are in package.json
```

### Issue: Backend can't connect to database
**Solution**:
```bash
# Check DATABASE_URL format
# Ensure IP whitelist (Supabase: allow all IPs: 0.0.0.0/0)
# Test connection string locally first
```

### Issue: CORS error
**Solution**:
```bash
# Update backend CLIENT_URL to match Vercel URL
# Restart backend service
```

### Issue: File upload fails
**Solution**:
```bash
# Verify Cloudinary credentials
# Check upload preset is "unsigned"
# Ensure file size < 5MB
```

### Issue: Emails not sending
**Solution**:
```bash
# Use Gmail App Password (not regular password)
# Check EMAIL_USER and EMAIL_PASSWORD are correct
# Verify Gmail account has 2FA enabled
```

---

## 15. Cost Breakdown (Free Tier)

### Free Services:
- ✅ **Vercel**: Free tier (100GB bandwidth)
- ✅ **Render**: Free tier (750 hours/month)
- ✅ **Supabase**: Free tier (500MB database)
- ✅ **Cloudinary**: Free tier (25GB storage, 25GB bandwidth)
- ✅ **Gmail**: Free (email sending)

### Paid Services (Optional):
- Twilio: $15 trial, then pay-as-you-go ($0.0075/SMS)

**Total Cost**: **$0/month** on free tiers! 🎉

---

## 16. Scaling Considerations

### When to Upgrade:
- **Database**: When > 500MB data (Supabase paid tier)
- **Backend**: When > 750 hours/month (Render Starter: $7/mo)
- **Frontend**: When > 100GB bandwidth (Vercel Pro: $20/mo)
- **Cloudinary**: When > 25GB bandwidth (Paid tiers start at $89/mo)

---

## 🎉 YOU'RE DONE!

**Your complete system is now deployed and accessible worldwide!**

✅ Backend API live  
✅ Frontend app live  
✅ Database online  
✅ File uploads working  
✅ Emails configured  
✅ Ready for users  

**Live URLs**:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.onrender.com`

---

## 📞 Quick Support

### If you get stuck:
1. Check deployment logs (Vercel/Render dashboards)
2. Verify environment variables
3. Test API endpoints individually
4. Check database connection

### Useful Commands:
```bash
# View Vercel logs
vercel logs

# View Render logs
# Go to Render dashboard → Logs tab

# Test API locally first
cd backend && npm run dev

# Test frontend locally first
cd frontend && npm run dev
```

---

**🎊 CONGRATULATIONS! YOUR SYSTEM IS DEPLOYED! 🎊**

**Frontend**: Live on Vercel  
**Backend**: Live on Render  
**Database**: Live on Supabase  
**Files**: Live on Cloudinary  

**Everything is working and ready to use!** 🚀✨

