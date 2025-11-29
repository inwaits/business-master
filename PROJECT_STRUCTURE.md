# Business Master - Tutor Management System
## Complete MERN Stack Project Structure

```
business-master/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   ├── jwt.js
│   │   │   └── constants.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── tutor.controller.js
│   │   │   ├── parent.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── supervisor.controller.js
│   │   │   ├── session.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── matching.controller.js
│   │   │   ├── notification.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── tutor.service.js
│   │   │   ├── parent.service.js
│   │   │   ├── matching.service.js
│   │   │   ├── payment.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── email.service.js
│   │   │   ├── sms.service.js
│   │   │   ├── cloudinary.service.js
│   │   │   └── analytics.service.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── tutor.routes.js
│   │   │   ├── parent.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── supervisor.routes.js
│   │   │   ├── session.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── notification.routes.js
│   │   │   └── index.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── tutor.validator.js
│   │   │   ├── parent.validator.js
│   │   │   └── session.validator.js
│   │   ├── utils/
│   │   │   ├── jwt.util.js
│   │   │   ├── password.util.js
│   │   │   ├── upload.util.js
│   │   │   ├── logger.util.js
│   │   │   └── helpers.js
│   │   ├── jobs/
│   │   │   ├── reportGenerator.job.js
│   │   │   ├── payoutProcessor.job.js
│   │   │   └── notificationScheduler.job.js
│   │   ├── sockets/
│   │   │   ├── index.js
│   │   │   └── notification.socket.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── TutorApproval.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── SessionMonitoring.jsx
│   │   │   │   ├── ComplaintManagement.jsx
│   │   │   │   ├── RevenueAnalytics.jsx
│   │   │   │   ├── CommissionSettings.jsx
│   │   │   │   ├── BannerManagement.jsx
│   │   │   │   └── BulkCommunication.jsx
│   │   │   ├── tutor/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Registration.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── ClassList.jsx
│   │   │   │   ├── ClassDetails.jsx
│   │   │   │   ├── AttendanceMarking.jsx
│   │   │   │   ├── SessionReport.jsx
│   │   │   │   ├── Earnings.jsx
│   │   │   │   ├── PayoutRequest.jsx
│   │   │   │   ├── TrainingVideos.jsx
│   │   │   │   ├── Notifications.jsx
│   │   │   │   └── PerformanceScore.jsx
│   │   │   ├── parent/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Registration.jsx
│   │   │   │   ├── TutorSearch.jsx
│   │   │   │   ├── TutorProfile.jsx
│   │   │   │   ├── SessionList.jsx
│   │   │   │   ├── SessionDetails.jsx
│   │   │   │   ├── Homework.jsx
│   │   │   │   ├── Payment.jsx
│   │   │   │   ├── PaymentHistory.jsx
│   │   │   │   ├── Feedback.jsx
│   │   │   │   ├── Complaints.jsx
│   │   │   │   └── Resources.jsx
│   │   │   ├── supervisor/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ClassMonitoring.jsx
│   │   │   │   ├── TutorInterview.jsx
│   │   │   │   ├── ReportAudit.jsx
│   │   │   │   ├── PayoutApproval.jsx
│   │   │   │   └── TutorScoring.jsx
│   │   │   └── matching/
│   │   │       ├── MatchingRequest.jsx
│   │   │       ├── TutorCard.jsx
│   │   │       └── ConfirmMatch.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Unauthorized.jsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── tutorSlice.js
│   │   │   │   ├── parentSlice.js
│   │   │   │   ├── sessionSlice.js
│   │   │   │   ├── notificationSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   └── api/
│   │   │       ├── authApi.js
│   │   │       ├── tutorApi.js
│   │   │       ├── parentApi.js
│   │   │       ├── sessionApi.js
│   │   │       └── paymentApi.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useNotifications.js
│   │   │   └── useDebounce.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── routes.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── MATCHING_ALGORITHM.md
│   ├── UI_WIREFRAMES.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── DEPLOYMENT_GUIDE.md
│
└── README.md
```

## Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Form Validation**: React Hook Form + Zod
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Refresh Tokens
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **SMS**: Twilio/SMS Gateway
- **Real-time**: Socket.io
- **Cron Jobs**: node-cron
- **Validation**: Joi/Zod
- **Security**: helmet, cors, rate-limit

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: AWS/DigitalOcean/Heroku
- **CDN**: Cloudflare
- **Monitoring**: PM2, Winston Logger

