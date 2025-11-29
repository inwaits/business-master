# API Documentation - Business Master Tutor Management System

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.businessmaster.com/api/v1
```

## Authentication
All authenticated endpoints require:
```
Authorization: Bearer {access_token}
```

Refresh tokens should be stored securely (httpOnly cookies recommended).

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Register User
```
POST /auth/register
```

**Body (Tutor)**:
```json
{
  "role": "TUTOR",
  "email": "tutor@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe",
  "phoneNumber": "+94771234567",
  "nicPassport": "123456789V",
  "dateOfBirth": "1995-01-15",
  "address": "123 Main St, Colombo",
  "city": "Colombo",
  "province": "Western",
  "university": "University of Colombo",
  "degree": "BSc Computer Science",
  "graduationYear": 2018,
  "yearsOfExperience": 3
}
```

**Body (Parent)**:
```json
{
  "role": "PARENT",
  "email": "parent@example.com",
  "password": "SecurePassword123!",
  "fullName": "Jane Smith",
  "phoneNumber": "+94771234567",
  "address": "456 Park Ave, Kandy",
  "city": "Kandy",
  "province": "Central",
  "students": [
    {
      "fullName": "Child Name",
      "gradeId": "uuid-grade-10",
      "school": "Royal College",
      "dateOfBirth": "2010-05-20"
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "tutor@example.com",
      "role": "TUTOR",
      "status": "PENDING"
    }
  }
}
```

### 1.2 Login
```
POST /auth/login
```

**Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "TUTOR",
      "status": "ACTIVE"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 900
  }
}
```

### 1.3 Refresh Token
```
POST /auth/refresh
```

**Body**:
```json
{
  "refreshToken": "refresh-token"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token",
    "expiresIn": 900
  }
}
```

### 1.4 Logout
```
POST /auth/logout
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 1.5 Forgot Password
```
POST /auth/forgot-password
```

**Body**:
```json
{
  "email": "user@example.com"
}
```

### 1.6 Reset Password
```
POST /auth/reset-password
```

**Body**:
```json
{
  "token": "reset-token",
  "newPassword": "NewPassword123!"
}
```

---

## 2. TUTOR ENDPOINTS

### 2.1 Complete Tutor Profile
```
PUT /tutors/profile/complete
```
**Headers**: Authorization: Bearer {token}

**Body** (multipart/form-data):
```
fullName: John Doe
subjects: ["uuid-math", "uuid-physics"]
grades: ["uuid-grade-10", "uuid-grade-11"]
availability: [
  {
    "dayOfWeek": "MONDAY",
    "startTime": "14:00",
    "endTime": "18:00"
  }
]
idDocument: [File]
universityId: [File]
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile completed. Awaiting admin verification",
  "data": {
    "tutor": {
      "id": "uuid",
      "verificationStatus": "DOCUMENTS_SUBMITTED"
    }
  }
}
```

### 2.2 Get Tutor Profile
```
GET /tutors/profile
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "tutor": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "tutor@example.com",
      "phoneNumber": "+94771234567",
      "city": "Colombo",
      "verificationStatus": "APPROVED",
      "performanceScore": 4.7,
      "totalClasses": 50,
      "completedClasses": 48,
      "averageRating": 4.8,
      "availableBalance": 50000,
      "subjects": [
        {
          "id": "uuid",
          "name": "Mathematics",
          "grade": "Grade 10"
        }
      ],
      "availability": [
        {
          "dayOfWeek": "MONDAY",
          "startTime": "14:00",
          "endTime": "18:00"
        }
      ]
    }
  }
}
```

### 2.3 Get Tutor Sessions
```
GET /tutors/sessions?status=SCHEDULED&page=1&limit=10
```
**Headers**: Authorization: Bearer {token}

**Query Parameters**:
- status: SCHEDULED | COMPLETED | CANCELLED
- page: 1
- limit: 10

**Response** (200):
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "sessionDate": "2025-12-01T00:00:00Z",
        "startTime": "14:00",
        "endTime": "16:00",
        "status": "SCHEDULED",
        "student": {
          "fullName": "Student Name",
          "grade": "Grade 10"
        },
        "subject": "Mathematics",
        "location": "123 Street, Colombo"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 2.4 Mark Attendance
```
POST /tutors/sessions/:sessionId/attendance
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "attendanceStatus": "PRESENT"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

### 2.5 Submit Session Report
```
POST /tutors/sessions/:sessionId/report
```
**Headers**: Authorization: Bearer {token}

**Body** (multipart/form-data):
```
summary: Covered quadratic equations and solved 10 problems
homework: Complete exercises 1-20 on page 45
reportFile: [File - optional]
```

**Response** (200):
```json
{
  "success": true,
  "message": "Session report submitted successfully"
}
```

### 2.6 Get Earnings Summary
```
GET /tutors/earnings
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "totalEarnings": 100000,
    "availableBalance": 50000,
    "pendingBalance": 20000,
    "withdrawnAmount": 30000,
    "recentPayments": [
      {
        "sessionId": "uuid",
        "date": "2025-11-28",
        "amount": 2000,
        "status": "COMPLETED"
      }
    ]
  }
}
```

### 2.7 Request Payout
```
POST /tutors/payout-request
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "amount": 50000,
  "bankDetails": {
    "bankName": "Bank of Ceylon",
    "accountNumber": "123456789",
    "accountHolderName": "John Doe",
    "branchCode": "001"
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Payout request submitted",
  "data": {
    "payoutRequest": {
      "id": "uuid",
      "amount": 50000,
      "status": "PENDING",
      "requestedAt": "2025-11-29T10:00:00Z"
    }
  }
}
```

### 2.8 Get Training Videos
```
GET /tutors/training-videos
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "uuid",
        "title": "Effective Teaching Techniques",
        "description": "Learn how to engage students",
        "videoUrl": "https://youtube.com/...",
        "duration": 1200,
        "completed": true
      }
    ]
  }
}
```

---

## 3. PARENT ENDPOINTS

### 3.1 Get Parent Dashboard
```
GET /parents/dashboard
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid",
        "fullName": "Child Name",
        "grade": "Grade 10",
        "upcomingSessions": 3,
        "completedSessions": 15
      }
    ],
    "upcomingSessions": [
      {
        "id": "uuid",
        "sessionDate": "2025-12-01",
        "startTime": "14:00",
        "tutor": {
          "fullName": "John Doe",
          "rating": 4.8
        },
        "subject": "Mathematics"
      }
    ],
    "totalSpent": 60000,
    "pendingPayments": 8000
  }
}
```

### 3.2 Search Tutors
```
GET /parents/search-tutors?subject=uuid&grade=uuid&city=Colombo&page=1&limit=10
```
**Headers**: Authorization: Bearer {token}

**Query Parameters**:
- subject: Subject UUID
- grade: Grade UUID
- city: City name
- page: 1
- limit: 10

**Response** (200):
```json
{
  "success": true,
  "data": {
    "tutors": [
      {
        "id": "uuid",
        "fullName": "John Doe",
        "city": "Colombo",
        "subjects": ["Mathematics", "Physics"],
        "averageRating": 4.8,
        "totalClasses": 50,
        "performanceScore": 4.7,
        "hourlyRate": 2000,
        "availability": [
          {
            "dayOfWeek": "MONDAY",
            "startTime": "14:00",
            "endTime": "18:00"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 3.3 Request Tutor Match
```
POST /parents/match-request
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "studentId": "uuid",
  "subjectId": "uuid",
  "gradeId": "uuid",
  "preferredCity": "Colombo",
  "preferredTimes": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "14:00",
      "endTime": "16:00"
    },
    {
      "dayOfWeek": "WEDNESDAY",
      "startTime": "15:00",
      "endTime": "17:00"
    }
  ],
  "additionalNotes": "Student needs help with algebra"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Match request created. Finding suitable tutors...",
  "data": {
    "matchRequest": {
      "id": "uuid",
      "status": "PENDING",
      "expiresAt": "2025-12-06T10:00:00Z"
    }
  }
}
```

### 3.4 Get Sessions
```
GET /parents/sessions?status=SCHEDULED&studentId=uuid&page=1&limit=10
```
**Headers**: Authorization: Bearer {token}

**Response**: Similar to tutor sessions with parent perspective

### 3.5 Make Payment
```
POST /parents/payments
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "sessionId": "uuid",
  "amount": 4000,
  "paymentMethod": "CARD",
  "transactionId": "txn_123456"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "payment": {
      "id": "uuid",
      "amount": 4000,
      "status": "COMPLETED",
      "paymentDate": "2025-11-29T10:00:00Z"
    }
  }
}
```

### 3.6 Submit Review
```
POST /parents/reviews
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "sessionId": "uuid",
  "rating": 5,
  "punctuality": 5,
  "knowledge": 5,
  "teaching": 5,
  "behavior": 5,
  "comment": "Excellent tutor! Very patient and knowledgeable."
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Review submitted successfully"
}
```

### 3.7 Submit Complaint
```
POST /parents/complaints
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "tutorId": "uuid",
  "sessionId": "uuid",
  "subject": "Tutor was late",
  "description": "The tutor arrived 30 minutes late without prior notice."
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Complaint submitted. Our team will review it.",
  "data": {
    "complaint": {
      "id": "uuid",
      "status": "PENDING"
    }
  }
}
```

---

## 4. ADMIN ENDPOINTS

### 4.1 Get Admin Dashboard
```
GET /admin/dashboard
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalTutors": 150,
      "activeTutors": 120,
      "pendingTutors": 30,
      "totalParents": 500,
      "totalSessions": 2000,
      "completedSessions": 1800,
      "monthlyRevenue": 3600000,
      "pendingComplaints": 5
    },
    "recentActivities": [
      {
        "type": "TUTOR_REGISTRATION",
        "message": "New tutor John Doe registered",
        "timestamp": "2025-11-29T09:00:00Z"
      }
    ],
    "charts": {
      "revenueByMonth": [...],
      "sessionsBySubject": [...],
      "tutorsByCity": [...]
    }
  }
}
```

### 4.2 Get Pending Tutor Approvals
```
GET /admin/tutors/pending?page=1&limit=10
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "tutors": [
      {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "tutor@example.com",
        "university": "University of Colombo",
        "degree": "BSc Computer Science",
        "subjects": ["Mathematics", "Physics"],
        "verificationStatus": "DOCUMENTS_SUBMITTED",
        "idDocumentUrl": "https://cloudinary.com/...",
        "universityIdUrl": "https://cloudinary.com/...",
        "createdAt": "2025-11-25T10:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 4.3 Approve/Reject Tutor
```
POST /admin/tutors/:tutorId/verify
```
**Headers**: Authorization: Bearer {token}

**Body (Approve)**:
```json
{
  "action": "APPROVE"
}
```

**Body (Reject)**:
```json
{
  "action": "REJECT",
  "reason": "Invalid university documents"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Tutor approved successfully"
}
```

### 4.4 Suspend/Activate User
```
PATCH /admin/users/:userId/status
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "status": "SUSPENDED",
  "reason": "Multiple complaints received"
}
```

### 4.5 Get All Sessions
```
GET /admin/sessions?status=COMPLETED&page=1&limit=20
```
**Headers**: Authorization: Bearer {token}

**Response**: List of all sessions with filters

### 4.6 Get Complaints
```
GET /admin/complaints?status=PENDING&page=1&limit=10
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "uuid",
        "parent": {
          "fullName": "Jane Smith"
        },
        "tutor": {
          "fullName": "John Doe"
        },
        "subject": "Tutor was late",
        "description": "...",
        "status": "PENDING",
        "createdAt": "2025-11-28T10:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 4.7 Resolve Complaint
```
PATCH /admin/complaints/:complaintId
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "status": "RESOLVED",
  "resolution": "Spoke with tutor. They apologized and will be punctual."
}
```

### 4.8 Revenue Analytics
```
GET /admin/analytics/revenue?startDate=2025-01-01&endDate=2025-12-31
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "totalRevenue": 10000000,
    "platformRevenue": 5000000,
    "tutorPayouts": 4500000,
    "pendingPayouts": 500000,
    "revenueByMonth": [...],
    "revenueByCity": [...],
    "topEarningTutors": [...]
  }
}
```

### 4.9 Bulk Email/SMS
```
POST /admin/communications/broadcast
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "type": "EMAIL",
  "recipients": "ALL_TUTORS",
  "subject": "Important Update",
  "message": "Dear tutors, please note..."
}
```

### 4.10 Manage Banners
```
POST /admin/banners
```
**Headers**: Authorization: Bearer {token}

**Body** (multipart/form-data):
```
title: Welcome Offer
image: [File]
link: /promotions/welcome
position: HOME
isActive: true
order: 1
```

---

## 5. SUPERVISOR ENDPOINTS

### 5.1 Get Supervisor Dashboard
```
GET /supervisor/dashboard
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "pendingInterviews": 5,
    "pendingPayouts": 10,
    "sessionsToAudit": 15,
    "upcomingInterviews": [...]
  }
}
```

### 5.2 Schedule Interview
```
POST /supervisor/interviews/schedule
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "tutorId": "uuid",
  "scheduledAt": "2025-12-05T10:00:00Z",
  "meetingLink": "https://zoom.us/j/123456",
  "notes": "Review teaching credentials"
}
```

### 5.3 Complete Interview
```
PATCH /supervisor/interviews/:interviewId/complete
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "status": "COMPLETED",
  "interviewScore": 8.5,
  "feedback": "Excellent communication skills. Recommended for approval."
}
```

### 5.4 Get Payout Requests
```
GET /supervisor/payout-requests?status=PENDING&page=1&limit=10
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "payoutRequests": [
      {
        "id": "uuid",
        "tutor": {
          "fullName": "John Doe",
          "totalClasses": 50,
          "performanceScore": 4.7
        },
        "amount": 50000,
        "bankDetails": {...},
        "requestedAt": "2025-11-28T10:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 5.5 Approve/Reject Payout
```
PATCH /supervisor/payout-requests/:payoutId
```
**Headers**: Authorization: Bearer {token}

**Body (Approve)**:
```json
{
  "action": "APPROVE"
}
```

**Body (Reject)**:
```json
{
  "action": "REJECT",
  "reason": "Incomplete bank details"
}
```

### 5.6 Audit Session
```
POST /supervisor/sessions/:sessionId/audit
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "auditScore": 9.0,
  "comments": "Excellent session report. Well documented."
}
```

---

## 6. MATCHING SYSTEM ENDPOINTS

### 6.1 Get Match Notifications (Tutor)
```
GET /matching/notifications
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "matchRequests": [
      {
        "id": "uuid",
        "student": {
          "fullName": "Child Name",
          "grade": "Grade 10"
        },
        "subject": "Mathematics",
        "preferredTimes": [...],
        "location": "Colombo",
        "expiresAt": "2025-12-06T10:00:00Z"
      }
    ]
  }
}
```

### 6.2 Accept Match (Tutor)
```
POST /matching/:matchRequestId/accept
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "message": "Match accepted. Awaiting parent confirmation.",
  "data": {
    "matchRequest": {
      "id": "uuid",
      "status": "MATCHED"
    }
  }
}
```

### 6.3 Confirm Match (Parent)
```
POST /matching/:matchRequestId/confirm
```
**Headers**: Authorization: Bearer {token}

**Body**:
```json
{
  "sessionDate": "2025-12-05",
  "startTime": "14:00",
  "location": "123 Main St, Colombo"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Session scheduled successfully",
  "data": {
    "session": {
      "id": "uuid",
      "sessionDate": "2025-12-05",
      "startTime": "14:00",
      "status": "SCHEDULED"
    }
  }
}
```

---

## 7. COMMON ENDPOINTS

### 7.1 Get Subjects
```
GET /common/subjects
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "subjects": [
      {
        "id": "uuid",
        "name": "Mathematics",
        "description": "Advanced Mathematics"
      }
    ]
  }
}
```

### 7.2 Get Grades
```
GET /common/grades
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "grades": [
      {
        "id": "uuid",
        "name": "Grade 10",
        "level": "SECONDARY"
      }
    ]
  }
}
```

### 7.3 Get Notifications
```
GET /notifications?page=1&limit=20
```
**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "SESSION",
        "title": "New Session Scheduled",
        "message": "You have a session on Dec 5 at 2:00 PM",
        "isRead": false,
        "createdAt": "2025-11-29T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {...}
  }
}
```

### 7.4 Mark Notification as Read
```
PATCH /notifications/:notificationId/read
```
**Headers**: Authorization: Bearer {token}

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `CONFLICT` (409): Resource already exists
- `INTERNAL_SERVER_ERROR` (500): Server error

---

## Rate Limiting
- 100 requests per 15 minutes per IP
- 1000 requests per day per user

## File Upload Limits
- Maximum file size: 5MB
- Allowed formats: JPG, PNG, PDF
- Cloudinary handles all file uploads

## WebSocket Events (Socket.io)

### Client → Server
- `join_room`: Join user-specific notification room
- `mark_read`: Mark notification as read

### Server → Client
- `new_notification`: New notification received
- `match_request`: New match request for tutor
- `session_updated`: Session status changed
- `payment_received`: Payment confirmation

**Connection**:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt-token'
  }
});

socket.on('connect', () => {
  socket.emit('join_room', { userId: 'uuid' });
});

socket.on('new_notification', (data) => {
  console.log('New notification:', data);
});
```

