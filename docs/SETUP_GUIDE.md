# Setup Guide - Business Master Tutor Management System

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Setup](#database-setup)
5. [Third-Party Services](#third-party-services)
6. [Development Workflow](#development-workflow)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **PostgreSQL**: v14.x or higher
- **Git**: Latest version

### Optional but Recommended
- **VS Code**: With extensions (ESLint, Prettier, Prisma)
- **Postman**: For API testing
- **pgAdmin**: PostgreSQL GUI tool

### Check Installations
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
psql --version    # Should be v14+
git --version
```

---

## Backend Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/business-master.git
cd business-master
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Create `.env` file in `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/business_master"

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Business Master <noreply@businessmaster.com>

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+94XXXXXXXXX

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@businessmaster.com
ADMIN_PASSWORD=SecureAdminPass123!

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Settings
SESSION_PRICE=4000
TUTOR_PERCENTAGE=0.5
PLATFORM_PERCENTAGE=0.5
MIN_PAYOUT_AMOUNT=10000
```

### Step 4: Generate Strong Secrets
```bash
# Generate JWT secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Setup Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Create database migration
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed
```

### Step 6: Start Development Server
```bash
# Start with nodemon (auto-reload)
npm run dev

# Or start normally
npm start
```

Server should start at `http://localhost:5000`

### Step 7: Test Backend
```bash
# Test health endpoint
curl http://localhost:5000/api/v1/health

# Response should be:
# {"success":true,"message":"Server is running"}
```

---

## Frontend Setup

### Step 1: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables
Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### Step 3: Configure TailwindCSS
File `tailwind.config.js` should already exist:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
        }
      }
    },
  },
  plugins: [],
}
```

### Step 4: Start Development Server
```bash
npm run dev
```

Frontend should start at `http://localhost:5173`

### Step 5: Test Frontend
Open browser and navigate to `http://localhost:5173`

---

## Database Setup

### Option 1: Local PostgreSQL

#### Install PostgreSQL (macOS)
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### Install PostgreSQL (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Install PostgreSQL (Windows)
Download installer from: https://www.postgresql.org/download/windows/

#### Create Database
```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE business_master;

# Create user (optional)
CREATE USER business_admin WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE business_master TO business_admin;

# Exit
\q
```

### Option 2: Cloud Database (Recommended for Production)

#### Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Update `DATABASE_URL` in `.env`

#### DigitalOcean Managed Database
1. Go to https://www.digitalocean.com/products/managed-databases
2. Create PostgreSQL cluster
3. Get connection string
4. Update `DATABASE_URL` in `.env`

#### AWS RDS
1. Create PostgreSQL instance in AWS RDS
2. Configure security groups
3. Get connection string
4. Update `DATABASE_URL` in `.env`

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Seed Data Script

Create `prisma/seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@businessmaster.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      isVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create Subjects
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Sinhala',
    'Tamil',
    'Science',
    'History',
    'Geography',
    'ICT',
    'Commerce',
    'Accounting',
  ];

  for (const name of subjects) {
    await prisma.subject.create({
      data: { name, isActive: true },
    });
  }

  console.log(`✅ Created ${subjects.length} subjects`);

  // Create Grades
  const grades = [
    { name: 'Grade 1', level: 'PRIMARY' },
    { name: 'Grade 2', level: 'PRIMARY' },
    { name: 'Grade 3', level: 'PRIMARY' },
    { name: 'Grade 4', level: 'PRIMARY' },
    { name: 'Grade 5', level: 'PRIMARY' },
    { name: 'Grade 6', level: 'SECONDARY' },
    { name: 'Grade 7', level: 'SECONDARY' },
    { name: 'Grade 8', level: 'SECONDARY' },
    { name: 'Grade 9', level: 'SECONDARY' },
    { name: 'Grade 10', level: 'SECONDARY' },
    { name: 'Grade 11', level: 'SECONDARY' },
    { name: 'O/L', level: 'SECONDARY' },
    { name: 'A/L', level: 'ADVANCED' },
  ];

  for (const grade of grades) {
    await prisma.grade.create({
      data: grade,
    });
  }

  console.log(`✅ Created ${grades.length} grades`);

  // Create System Settings
  const settings = [
    { key: 'SESSION_PRICE', value: '4000' },
    { key: 'TUTOR_PERCENTAGE', value: '50' },
    { key: 'PLATFORM_PERCENTAGE', value: '50' },
    { key: 'MIN_PAYOUT_AMOUNT', value: '10000' },
    { key: 'MATCH_REQUEST_EXPIRY_HOURS', value: '24' },
  ];

  for (const setting of settings) {
    await prisma.systemSettings.create({
      data: setting,
    });
  }

  console.log(`✅ Created ${settings.length} system settings`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update `package.json`:
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Run seed:
```bash
npx prisma db seed
```

---

## Third-Party Services

### 1. Cloudinary Setup

#### Create Account
1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard
4. Copy: Cloud Name, API Key, API Secret
5. Update `.env` file

#### Create Upload Preset
1. Go to Settings > Upload
2. Click "Add upload preset"
3. Signing Mode: Unsigned
4. Folder: `business-master`
5. Copy preset name
6. Update frontend `.env`

### 2. Email Setup (Gmail)

#### Enable App Password
1. Go to Google Account settings
2. Security > 2-Step Verification (enable it)
3. Security > App passwords
4. Generate app password for "Mail"
5. Copy password
6. Update backend `.env`

#### Configure Nodemailer
Already configured in `src/services/email.service.js`

### 3. SMS Setup (Twilio)

#### Create Account
1. Go to https://www.twilio.com
2. Sign up for account
3. Verify phone number
4. Get trial credit ($15)
5. Go to Console Dashboard
6. Copy: Account SID, Auth Token
7. Get Twilio phone number
8. Update backend `.env`

#### Test SMS
```javascript
// In backend, run this test
const twilio = require('twilio');
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

client.messages
  .create({
    body: 'Test message from Business Master',
    from: '+94XXXXXXXXX',
    to: '+94YYYYYYYYY'
  })
  .then(message => console.log('✅ SMS sent:', message.sid))
  .catch(error => console.error('❌ SMS failed:', error));
```

### 4. Socket.io Setup

Already configured in:
- Backend: `src/sockets/index.js`
- Frontend: `src/hooks/useSocket.js`

Test real-time connection:
```javascript
// Frontend component
import { useSocket } from '@/hooks/useSocket';

function Component() {
  const socket = useSocket();
  
  useEffect(() => {
    socket?.on('test-event', (data) => {
      console.log('Received:', data);
    });
  }, [socket]);
}
```

---

## Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat: implement user authentication"

# Push to remote
git push origin feature/user-authentication

# Create Pull Request on GitHub

# After merge, update main
git checkout main
git pull origin main
```

### Code Style

#### ESLint Configuration
```bash
# Install ESLint
npm install -D eslint

# Initialize
npx eslint --init

# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

#### Prettier Configuration
Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Testing

#### Backend Tests
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

#### Frontend Tests
```bash
# Run tests
npm test

# E2E tests
npm run test:e2e
```

### Database Management

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio

# View current schema
npx prisma db pull

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

---

## Deployment

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# or download from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create business-master-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your-secret
# ... (set all required env vars)

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# View logs
heroku logs --tail
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod

# Set environment variables
vercel env add VITE_API_URL
```

### Frontend Deployment (Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

### Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: business_master
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://admin:password@postgres:5432/business_master
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## Troubleshooting

### Common Issues

#### Issue: Database connection failed
```
Error: Can't reach database server
```
**Solution**:
- Check if PostgreSQL is running: `brew services list` (macOS)
- Verify DATABASE_URL in .env
- Check firewall settings
- Test connection: `psql -h localhost -U username -d business_master`

#### Issue: Port already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>
```

#### Issue: Prisma Client not generated
```
Error: @prisma/client did not initialize yet
```
**Solution**:
```bash
npx prisma generate
```

#### Issue: JWT token invalid
```
Error: JsonWebTokenError: invalid signature
```
**Solution**:
- Clear browser localStorage
- Check JWT_ACCESS_SECRET matches between token creation and verification
- Token might be expired, try logging in again

#### Issue: CORS error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**:
- Update `CLIENT_URL` in backend .env
- Check CORS configuration in `backend/src/app.js`

#### Issue: File upload fails
```
Error: Cloudinary upload failed
```
**Solution**:
- Verify Cloudinary credentials in .env
- Check upload preset is set to "unsigned"
- Verify file size < 5MB
- Check internet connection

#### Issue: Emails not sending
```
Error: Nodemailer authentication failed
```
**Solution**:
- Use Gmail App Password, not regular password
- Enable "Less secure app access" (if needed)
- Check EMAIL_HOST and EMAIL_PORT
- Verify email and password are correct

### Database Reset (Development Only)
```bash
# WARNING: This will delete all data
npx prisma migrate reset
npx prisma db seed
```

### Clear Node Modules and Reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Enable Debug Mode
```bash
# Backend
DEBUG=* npm run dev

# Frontend
VITE_DEBUG=true npm run dev
```

---

## Additional Resources

### Documentation
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

### Tutorials
- [Prisma with PostgreSQL](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql)
- [JWT Authentication](https://jwt.io/introduction)
- [Socket.io Guide](https://socket.io/docs/v4/)

### Support
- Create issue on GitHub
- Email: support@businessmaster.com
- Discord: [Join our server]

---

## Quick Start (TL;DR)

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Edit with your values
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env  # Edit with your values
npm run dev

# Access
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# Admin: admin@businessmaster.com / Admin@123
```

🎉 You're ready to start developing!

