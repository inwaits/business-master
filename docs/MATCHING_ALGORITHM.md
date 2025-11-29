# Tutor Matching Algorithm - Business Master

## Overview
The matching algorithm is designed to connect parents with the most suitable tutors based on multiple criteria including subject expertise, location, availability, performance, and real-time response.

---

## Matching Criteria & Scoring

### 1. Core Requirements (Must Match - Binary Filter)
These are **mandatory** criteria. Tutors who don't meet these are excluded:

- ✅ **Subject & Grade Match**: Tutor teaches the requested subject and grade
- ✅ **Verification Status**: Tutor must be `APPROVED`
- ✅ **Account Status**: Tutor must be `ACTIVE`
- ✅ **Availability**: Tutor is available (not suspended, not at max capacity)

### 2. Weighted Scoring Criteria
After filtering, remaining tutors are scored (0-100 scale):

#### A. Location Match (Weight: 25%)
```
Same City: 25 points
Same Province: 15 points
Different Province: 5 points
```

#### B. Time Slot Availability (Weight: 25%)
```
Exact match (all preferred slots): 25 points
Partial match (some slots): 15 points
Flexible (any available slots): 10 points
```

#### C. Performance Score (Weight: 20%)
```
Score = (Tutor Performance Score / 5) × 20
Example: 4.5/5 = 18 points
```

#### D. Rating & Reviews (Weight: 15%)
```
Score = (Average Rating / 5) × 15
Example: 4.8/5 = 14.4 points
```

#### E. Experience & Completion Rate (Weight: 10%)
```
Completion Rate = (Completed Classes / Total Classes) × 10
Example: 48/50 = 96% = 9.6 points
```

#### F. Response Time & Priority (Weight: 5%)
```
Priority Badge: +5 points
Fast responder: +3 points
New tutor (needs exposure): +2 points
```

---

## Algorithm Flow

### Phase 1: Request Creation
```
1. Parent submits match request:
   - Student details
   - Subject & Grade
   - Preferred location
   - Preferred time slots
   - Additional notes

2. System creates MatchRequest with:
   - Status: PENDING
   - ExpiresAt: 24 hours from now

3. System triggers matching process
```

### Phase 2: Tutor Filtering
```sql
-- Pseudocode for filtering query

SELECT tutors.*
FROM tutors
JOIN tutor_subjects ON tutors.id = tutor_subjects.tutor_id
JOIN tutor_availability ON tutors.id = tutor_availability.tutor_id
WHERE 
  -- Core requirements
  tutors.verification_status = 'APPROVED' AND
  tutors.user.status = 'ACTIVE' AND
  tutors.is_available = true AND
  
  -- Subject match
  tutor_subjects.subject_id = :requested_subject AND
  tutor_subjects.grade_id = :requested_grade AND
  
  -- Availability check
  EXISTS (
    SELECT 1 FROM tutor_availability ta
    WHERE ta.tutor_id = tutors.id
    AND ta.is_active = true
    AND ta.day_of_week IN (:preferred_days)
    AND time_overlap(ta.start_time, ta.end_time, :preferred_times)
  )
```

### Phase 3: Scoring Algorithm
```javascript
function calculateMatchScore(tutor, matchRequest) {
  let score = 0;
  
  // 1. Location Score (25 points)
  if (tutor.city === matchRequest.preferredCity) {
    score += 25;
  } else if (tutor.province === getProvince(matchRequest.preferredCity)) {
    score += 15;
  } else {
    score += 5;
  }
  
  // 2. Time Slot Match (25 points)
  const availableSlots = tutor.availability;
  const requestedSlots = matchRequest.preferredTimes;
  const matchedSlots = countMatchingSlots(availableSlots, requestedSlots);
  
  if (matchedSlots === requestedSlots.length) {
    score += 25; // All slots match
  } else if (matchedSlots > 0) {
    score += 15; // Partial match
  } else {
    score += 10; // Has some availability
  }
  
  // 3. Performance Score (20 points)
  score += (tutor.performanceScore / 5) * 20;
  
  // 4. Rating (15 points)
  score += (tutor.averageRating / 5) * 15;
  
  // 5. Completion Rate (10 points)
  const completionRate = tutor.completedClasses / Math.max(tutor.totalClasses, 1);
  score += completionRate * 10;
  
  // 6. Bonus Points (5 points)
  if (hasBadge(tutor, 'PRIORITY')) {
    score += 5;
  } else if (tutor.averageResponseTime < 300) { // 5 minutes
    score += 3;
  } else if (tutor.totalClasses < 10) { // New tutor
    score += 2;
  }
  
  return Math.min(score, 100); // Cap at 100
}
```

### Phase 4: Tutor Notification
```
1. Sort filtered tutors by match score (highest first)

2. Select top 10 tutors

3. Send real-time notification to all 10 tutors via:
   - Socket.io push notification
   - SMS alert (if enabled)
   - In-app notification

4. Notification includes:
   - Student grade & subject
   - Preferred time slots
   - Location
   - Match score (for transparency)
   - Accept button
   - Expiry timer (24 hours)
```

### Phase 5: First-Come-First-Served
```
1. Tutors see notification on dashboard

2. First tutor to click "Accept" gets priority

3. System marks MatchRequest as:
   - Status: TUTOR_MATCHED
   - MatchedTutorId: tutor.id
   - MatchedAt: current timestamp

4. All other tutors receive update:
   - "This request has been accepted by another tutor"

5. Parent receives notification:
   - "Tutor found! Please confirm"
   - Tutor profile & details shown
```

### Phase 6: Parent Confirmation
```
1. Parent reviews matched tutor:
   - Profile
   - Rating & reviews
   - Credentials
   - Availability

2. Parent can:
   - Accept: Confirm and schedule session
   - Reject: Request new match (re-trigger algorithm)

3. If accepted:
   - Session created with status: SCHEDULED
   - Both parties notified
   - Payment invoice generated

4. If rejected:
   - MatchRequest status back to PENDING
   - Matched tutor notified (with reason if provided)
   - Algorithm re-runs with remaining tutors
```

---

## Special Cases

### Case 1: No Tutors Available
```
If no tutors match the criteria:

1. System sends email to Admin
2. Parent notified: "No tutors available currently"
3. Request stays PENDING
4. System checks every 6 hours for new tutors
5. Auto-expires after 7 days
```

### Case 2: Multiple Simultaneous Accepts
```
Race condition handling:

1. Use database transaction with row locking
2. First transaction to commit wins
3. Other tutors receive "Already accepted" error
4. Atomic update ensures only one tutor matched
```

### Case 3: Tutor Doesn't Respond (24 hours)
```
1. MatchRequest expires
2. Status updated to EXPIRED
3. Parent notified
4. Parent can re-submit request
5. Algorithm runs again with fresh data
```

### Case 4: Parent Rejects Multiple Tutors
```
After 3 rejections:

1. Admin/Supervisor notified for manual intervention
2. Parent contacted to refine requirements
3. Matching criteria may be relaxed:
   - Expand location radius
   - Flexible time slots
   - Consider tutors with slightly lower ratings
```

---

## Algorithm Optimization Strategies

### 1. Caching
```javascript
// Cache frequently accessed data
const cache = {
  activeTutors: [], // Refresh every 5 minutes
  tutorAvailability: {}, // Refresh on update
  performanceScores: {} // Refresh daily
};
```

### 2. Indexing
```sql
-- Database indexes for fast queries
CREATE INDEX idx_tutor_verification ON tutors(verification_status, status);
CREATE INDEX idx_tutor_subjects ON tutor_subjects(subject_id, grade_id);
CREATE INDEX idx_tutor_city ON tutors(city);
CREATE INDEX idx_tutor_score ON tutors(performance_score DESC);
CREATE INDEX idx_match_request_status ON match_requests(status, expires_at);
```

### 3. Background Jobs
```javascript
// Cron job: Check expired match requests
cron.schedule('*/30 * * * *', async () => {
  const expiredRequests = await MatchRequest.findExpired();
  
  for (const request of expiredRequests) {
    await request.update({ status: 'EXPIRED' });
    await notifyParent(request.parentId, 'Match request expired');
  }
});

// Cron job: Re-run matching for pending requests
cron.schedule('0 */6 * * *', async () => {
  const pendingRequests = await MatchRequest.findPending();
  
  for (const request of pendingRequests) {
    await runMatchingAlgorithm(request.id);
  }
});
```

### 4. Load Balancing
```
For high-traffic scenarios:

1. Queue match requests using Redis/Bull
2. Process matches asynchronously
3. Distribute notifications via message queue
4. Scale notification workers horizontally
```

---

## Real-Time Notification System

### WebSocket Implementation
```javascript
// Server-side (Socket.io)
io.on('connection', (socket) => {
  socket.on('tutor:join', ({ tutorId }) => {
    socket.join(`tutor:${tutorId}`);
  });
});

// Emit match notification to specific tutors
function notifyTutors(tutorIds, matchRequest) {
  tutorIds.forEach(tutorId => {
    io.to(`tutor:${tutorId}`).emit('match:new', {
      matchRequestId: matchRequest.id,
      student: matchRequest.student,
      subject: matchRequest.subject,
      location: matchRequest.preferredCity,
      expiresAt: matchRequest.expiresAt,
      score: matchRequest.score // Their match score
    });
  });
}
```

### SMS Integration (Optional)
```javascript
// Twilio/SMS Gateway
async function sendSMSAlert(phoneNumber, message) {
  await twilioClient.messages.create({
    body: message,
    from: '+94XXXXXXXXX',
    to: phoneNumber
  });
}

// Send to top 5 tutors only (to reduce SMS costs)
const topTutors = sortedTutors.slice(0, 5);
for (const tutor of topTutors) {
  if (tutor.smsNotificationsEnabled) {
    await sendSMSAlert(
      tutor.phoneNumber,
      `New student request! Grade ${grade}, Subject: ${subject}. Check your dashboard.`
    );
  }
}
```

---

## Performance Metrics

### Track Algorithm Effectiveness
```javascript
// Store in analytics table
const metrics = {
  averageMatchTime: 'Time from request to match',
  firstResponseTime: 'Time until first tutor accepts',
  matchAcceptanceRate: 'Tutors accepting / Tutors notified',
  parentConfirmationRate: 'Parents confirming / Matches made',
  rejectionsPerRequest: 'Number of tutor rejections per request'
};
```

### A/B Testing
```
Test different variations:
- Number of tutors notified (5, 10, 15)
- Notification timing strategies
- Scoring weight adjustments
- Expiry timeframes (12h, 24h, 48h)
```

---

## Example: Complete Match Flow

```javascript
// Step 1: Parent submits request
const matchRequest = await MatchRequest.create({
  parentId: 'parent-uuid',
  studentId: 'student-uuid',
  subjectId: 'math-uuid',
  gradeId: 'grade-10-uuid',
  preferredCity: 'Colombo',
  preferredTimes: [
    { dayOfWeek: 'MONDAY', startTime: '14:00', endTime: '16:00' },
    { dayOfWeek: 'WEDNESDAY', startTime: '15:00', endTime: '17:00' }
  ],
  additionalNotes: 'Student needs help with algebra',
  status: 'PENDING',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
});

// Step 2: Filter tutors
const eligibleTutors = await Tutor.findAll({
  where: {
    verificationStatus: 'APPROVED',
    isAvailable: true,
    '$user.status$': 'ACTIVE',
    '$subjects.subjectId$': matchRequest.subjectId,
    '$subjects.gradeId$': matchRequest.gradeId
  },
  include: [
    { model: TutorSubject, as: 'subjects' },
    { model: TutorAvailability, as: 'availability' },
    { model: User, as: 'user' }
  ]
});

// Step 3: Score and sort
const scoredTutors = eligibleTutors
  .map(tutor => ({
    tutor,
    score: calculateMatchScore(tutor, matchRequest)
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10); // Top 10

// Step 4: Notify tutors
await notifyTutors(
  scoredTutors.map(st => st.tutor.id),
  matchRequest
);

// Step 5: First tutor accepts
socket.on('match:accept', async ({ matchRequestId, tutorId }) => {
  const updated = await MatchRequest.update(
    {
      status: 'TUTOR_MATCHED',
      matchedTutorId: tutorId,
      matchedAt: new Date()
    },
    {
      where: {
        id: matchRequestId,
        status: 'PENDING' // Ensures atomic update
      }
    }
  );
  
  if (updated) {
    // Notify parent
    io.to(`parent:${matchRequest.parentId}`).emit('match:found', {
      tutor: await Tutor.findByPk(tutorId)
    });
    
    // Notify other tutors
    io.to(`match:${matchRequestId}`).emit('match:taken');
  }
});

// Step 6: Parent confirms
await Session.create({
  tutorId: matchRequest.matchedTutorId,
  parentId: matchRequest.parentId,
  studentId: matchRequest.studentId,
  subjectId: matchRequest.subjectId,
  gradeId: matchRequest.gradeId,
  sessionDate: '2025-12-05',
  startTime: '14:00',
  endTime: '16:00',
  location: 'Parent address',
  status: 'SCHEDULED',
  totalAmount: 4000,
  tutorAmount: 2000,
  platformAmount: 2000
});

await matchRequest.update({ status: 'CONFIRMED', confirmedAt: new Date() });
```

---

## Future Enhancements

### 1. Machine Learning Integration
```
Train ML model on historical data:
- Successful matches (parent confirmed)
- Rejected matches (with reasons)
- Session completion rates
- Review scores

Use model to predict:
- Likelihood of parent acceptance
- Optimal tutor selection
- Best time slots
- Pricing optimization
```

### 2. Dynamic Pricing
```
Adjust tutor rates based on:
- Demand in area
- Time of day/week
- Tutor performance score
- Parent budget
```

### 3. Smart Scheduling
```
AI-powered suggestions:
- Optimal session times
- Session frequency
- Learning patterns
- Student progress tracking
```

### 4. Geographical Optimization
```
Use Google Maps API:
- Calculate actual travel distance
- Consider traffic patterns
- Suggest meeting points
- Optimize tutor routes (multiple sessions)
```

This matching algorithm balances speed, fairness, and quality to create optimal tutor-student pairs while maintaining platform efficiency.

