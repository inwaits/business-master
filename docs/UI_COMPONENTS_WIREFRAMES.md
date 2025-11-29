# UI Components & Wireframes - Business Master

## Component Hierarchy

```
App
├── Router
│   ├── Public Routes
│   │   ├── Home
│   │   ├── About
│   │   ├── Contact
│   │   └── Auth
│   │       ├── Login
│   │       ├── Register (Tutor)
│   │       └── Register (Parent)
│   │
│   ├── Protected Routes
│   │   ├── Admin Dashboard
│   │   │   ├── Overview
│   │   │   ├── Tutor Management
│   │   │   ├── Parent Management
│   │   │   ├── Session Monitoring
│   │   │   ├── Complaints
│   │   │   ├── Revenue Analytics
│   │   │   ├── Communications
│   │   │   └── Settings
│   │   │
│   │   ├── Tutor Dashboard
│   │   │   ├── Dashboard Home
│   │   │   ├── Profile
│   │   │   ├── Classes
│   │   │   ├── Earnings
│   │   │   ├── Training
│   │   │   └── Notifications
│   │   │
│   │   ├── Parent Dashboard
│   │   │   ├── Dashboard Home
│   │   │   ├── Find Tutor
│   │   │   ├── My Sessions
│   │   │   ├── Payments
│   │   │   ├── Reviews
│   │   │   └── Resources
│   │   │
│   │   └── Supervisor Dashboard
│   │       ├── Dashboard Home
│   │       ├── Interviews
│   │       ├── Audits
│   │       └── Payouts
│   │
│   └── Error Pages
│       ├── 404 Not Found
│       └── 403 Unauthorized
```

---

## Detailed Component Structure

### 1. Common Components (Shared Across All Roles)

#### 1.1 Navigation Components
```jsx
// Navbar.jsx
<Navbar>
  <Logo />
  <NavigationLinks role={userRole} />
  <NotificationBell unreadCount={5} />
  <UserMenu>
    <UserAvatar />
    <Dropdown>
      <Profile />
      <Settings />
      <Logout />
    </Dropdown>
  </UserMenu>
</Navbar>
```

#### 1.2 Sidebar
```jsx
// Sidebar.jsx
<Sidebar isCollapsed={collapsed}>
  <SidebarHeader>
    <Logo />
    <CollapseButton />
  </SidebarHeader>
  
  <SidebarMenu>
    {menuItems.map(item => (
      <SidebarItem 
        icon={item.icon}
        label={item.label}
        path={item.path}
        badge={item.badge}
        active={isActive(item.path)}
      />
    ))}
  </SidebarMenu>
  
  <SidebarFooter>
    <HelpCenter />
    <SupportChat />
  </SidebarFooter>
</Sidebar>
```

#### 1.3 UI Components Library
```jsx
// Button.jsx
<Button
  variant="primary | secondary | outline | danger"
  size="sm | md | lg"
  loading={isLoading}
  disabled={isDisabled}
  icon={IconComponent}
  onClick={handleClick}
>
  Button Text
</Button>

// Input.jsx
<Input
  type="text | email | password | number"
  label="Label"
  placeholder="Placeholder"
  error={errorMessage}
  helperText="Helper text"
  icon={IconComponent}
  onChange={handleChange}
/>

// Select.jsx
<Select
  label="Select Option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  multiple={false}
  searchable={true}
  onChange={handleChange}
/>

// Card.jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardActions>
      <IconButton />
    </CardActions>
  </CardHeader>
  <CardBody>
    Content
  </CardBody>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>

// Modal.jsx
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  size="sm | md | lg | xl | full"
  title="Modal Title"
>
  <ModalBody>
    Content
  </ModalBody>
  <ModalFooter>
    <Button onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit}>Confirm</Button>
  </ModalFooter>
</Modal>

// Table.jsx
<Table
  columns={columns}
  data={data}
  pagination={true}
  sortable={true}
  searchable={true}
  loading={isLoading}
  onRowClick={handleRowClick}
/>

// Badge.jsx
<Badge 
  variant="success | warning | danger | info"
  size="sm | md | lg"
>
  Badge Text
</Badge>

// Alert.jsx
<Alert
  type="success | error | warning | info"
  title="Alert Title"
  message="Alert message"
  dismissible={true}
  onClose={handleClose}
/>

// FileUpload.jsx
<FileUpload
  accept=".jpg,.png,.pdf"
  maxSize={5242880} // 5MB
  multiple={false}
  onUpload={handleUpload}
  progress={uploadProgress}
/>

// Loader.jsx
<Loader 
  size="sm | md | lg"
  variant="spinner | dots | bar"
  overlay={true}
/>

// Pagination.jsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>

// SearchBar.jsx
<SearchBar
  placeholder="Search..."
  onSearch={handleSearch}
  filters={filterOptions}
  debounceTime={300}
/>

// Tabs.jsx
<Tabs defaultTab="tab1">
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel id="tab1">
    Content 1
  </TabPanel>
  <TabPanel id="tab2">
    Content 2
  </TabPanel>
</Tabs>

// Tooltip.jsx
<Tooltip content="Tooltip text" position="top | bottom | left | right">
  <Button>Hover me</Button>
</Tooltip>

// Avatar.jsx
<Avatar
  src={userImage}
  alt={userName}
  size="sm | md | lg | xl"
  status="online | offline | away"
/>

// DatePicker.jsx
<DatePicker
  label="Select Date"
  value={selectedDate}
  minDate={minDate}
  maxDate={maxDate}
  onChange={handleDateChange}
/>

// TimePicker.jsx
<TimePicker
  label="Select Time"
  value={selectedTime}
  format="12h | 24h"
  interval={30} // minutes
  onChange={handleTimeChange}
/>
```

---

## 2. Authentication Pages

### 2.1 Login Page
```jsx
<AuthLayout>
  <LoginForm>
    <Logo />
    <Heading>Welcome Back</Heading>
    
    <Input
      type="email"
      label="Email"
      placeholder="Enter your email"
    />
    
    <Input
      type="password"
      label="Password"
      placeholder="Enter your password"
    />
    
    <RememberMe>
      <Checkbox label="Remember me" />
      <Link to="/forgot-password">Forgot Password?</Link>
    </RememberMe>
    
    <Button variant="primary" fullWidth>
      Sign In
    </Button>
    
    <Divider>OR</Divider>
    
    <SignupPrompt>
      Don't have an account?
      <Link to="/register">Sign up as Tutor</Link>
      <Link to="/register/parent">Sign up as Parent</Link>
    </SignupPrompt>
  </LoginForm>
</AuthLayout>
```

### 2.2 Tutor Registration (Multi-Step)
```jsx
<AuthLayout>
  <RegistrationWizard>
    {/* Step 1: Account Creation */}
    <Step1>
      <Heading>Create Your Account</Heading>
      <Input type="email" label="Email" />
      <Input type="password" label="Password" />
      <Input type="password" label="Confirm Password" />
      <Button onClick={nextStep}>Next</Button>
    </Step1>
    
    {/* Step 2: Personal Information */}
    <Step2>
      <Heading>Personal Information</Heading>
      <Input label="Full Name" />
      <Input label="NIC/Passport" />
      <Input type="tel" label="Phone Number" />
      <DatePicker label="Date of Birth" />
      <Input label="Address" />
      <Select label="City" options={cities} />
      <Select label="Province" options={provinces} />
      <Button onClick={nextStep}>Next</Button>
    </Step2>
    
    {/* Step 3: Education Details */}
    <Step3>
      <Heading>Education & Qualifications</Heading>
      <Select label="University" options={universities} />
      <Input label="Degree" />
      <Select label="Graduation Year" />
      <Input type="number" label="Years of Experience" />
      <TextArea label="Bio (Optional)" />
      <Button onClick={nextStep}>Next</Button>
    </Step3>
    
    {/* Step 4: Subjects & Availability */}
    <Step4>
      <Heading>Teaching Subjects</Heading>
      <MultiSelect label="Subjects" options={subjects} />
      <MultiSelect label="Grades" options={grades} />
      
      <Heading>Availability</Heading>
      <AvailabilitySelector>
        {daysOfWeek.map(day => (
          <DaySlot key={day}>
            <Checkbox label={day} />
            <TimePicker label="From" />
            <TimePicker label="To" />
          </DaySlot>
        ))}
      </AvailabilitySelector>
      <Button onClick={nextStep}>Next</Button>
    </Step4>
    
    {/* Step 5: Document Upload */}
    <Step5>
      <Heading>Upload Documents</Heading>
      <FileUpload
        label="NIC/Passport Copy"
        accept=".jpg,.png,.pdf"
        required
      />
      <FileUpload
        label="University ID"
        accept=".jpg,.png,.pdf"
        required
      />
      <Checkbox label="I agree to Terms & Conditions" />
      <Button onClick={handleSubmit} loading={isSubmitting}>
        Complete Registration
      </Button>
    </Step5>
    
    <ProgressIndicator currentStep={currentStep} totalSteps={5} />
  </RegistrationWizard>
</AuthLayout>
```

### 2.3 Parent Registration
```jsx
<AuthLayout>
  <ParentRegistrationForm>
    {/* Parent Details */}
    <Section>
      <Heading>Parent Information</Heading>
      <Input label="Full Name" />
      <Input type="email" label="Email" />
      <Input type="password" label="Password" />
      <Input type="tel" label="Phone Number" />
      <Input label="Address" />
      <Select label="City" options={cities} />
    </Section>
    
    {/* Student Details */}
    <Section>
      <Heading>Student Information</Heading>
      <Input label="Student Full Name" />
      <Select label="Grade" options={grades} />
      <Input label="School (Optional)" />
      <DatePicker label="Date of Birth (Optional)" />
      
      <Button variant="outline" onClick={addAnotherStudent}>
        + Add Another Student
      </Button>
    </Section>
    
    <Checkbox label="I agree to Terms & Conditions" />
    <Button variant="primary" fullWidth onClick={handleSubmit}>
      Create Account
    </Button>
  </ParentRegistrationForm>
</AuthLayout>
```

---

## 3. Admin Dashboard Components

### 3.1 Admin Dashboard Home
```jsx
<DashboardLayout role="admin">
  <DashboardHeader>
    <Heading>Admin Dashboard</Heading>
    <DateRangePicker />
  </DashboardHeader>
  
  {/* Stats Cards */}
  <StatsGrid>
    <StatCard
      title="Total Tutors"
      value="150"
      change="+12%"
      trend="up"
      icon={<UsersIcon />}
    />
    <StatCard
      title="Active Sessions"
      value="45"
      change="+8%"
      trend="up"
      icon={<SessionIcon />}
    />
    <StatCard
      title="Monthly Revenue"
      value="Rs. 3,600,000"
      change="+15%"
      trend="up"
      icon={<MoneyIcon />}
    />
    <StatCard
      title="Pending Approvals"
      value="8"
      change="-2"
      trend="down"
      icon={<ClockIcon />}
    />
  </StatsGrid>
  
  {/* Charts */}
  <ChartsSection>
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <Select options={['This Month', 'Last 3 Months', 'This Year']} />
      </CardHeader>
      <CardBody>
        <LineChart data={revenueData} />
      </CardBody>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Sessions by Subject</CardTitle>
      </CardHeader>
      <CardBody>
        <PieChart data={subjectData} />
      </CardBody>
    </Card>
  </ChartsSection>
  
  {/* Recent Activities */}
  <Card>
    <CardHeader>
      <CardTitle>Recent Activities</CardTitle>
      <Button variant="outline" size="sm">View All</Button>
    </CardHeader>
    <CardBody>
      <ActivityList>
        {activities.map(activity => (
          <ActivityItem
            type={activity.type}
            message={activity.message}
            timestamp={activity.timestamp}
            avatar={activity.avatar}
          />
        ))}
      </ActivityList>
    </CardBody>
  </Card>
</DashboardLayout>
```

### 3.2 Tutor Approval Component
```jsx
<DashboardLayout role="admin">
  <PageHeader>
    <Heading>Tutor Approvals</Heading>
    <SearchBar placeholder="Search tutors..." />
  </PageHeader>
  
  <Tabs defaultTab="pending">
    <TabList>
      <Tab id="pending">Pending (8)</Tab>
      <Tab id="approved">Approved</Tab>
      <Tab id="rejected">Rejected</Tab>
    </TabList>
    
    <TabPanel id="pending">
      <TutorApprovalList>
        {pendingTutors.map(tutor => (
          <TutorApprovalCard key={tutor.id}>
            <TutorInfo>
              <Avatar src={tutor.avatar} size="lg" />
              <div>
                <Name>{tutor.fullName}</Name>
                <Email>{tutor.email}</Email>
                <Badge variant="warning">Pending Verification</Badge>
              </div>
            </TutorInfo>
            
            <TutorDetails>
              <DetailRow label="University" value={tutor.university} />
              <DetailRow label="Degree" value={tutor.degree} />
              <DetailRow label="Experience" value={`${tutor.experience} years`} />
              <DetailRow label="Subjects" value={tutor.subjects.join(', ')} />
              <DetailRow label="City" value={tutor.city} />
            </TutorDetails>
            
            <DocumentsSection>
              <Heading size="sm">Uploaded Documents</Heading>
              <DocumentPreview>
                <DocumentCard
                  label="NIC/Passport"
                  url={tutor.idDocumentUrl}
                  onView={() => openDocument(tutor.idDocumentUrl)}
                />
                <DocumentCard
                  label="University ID"
                  url={tutor.universityIdUrl}
                  onView={() => openDocument(tutor.universityIdUrl)}
                />
              </DocumentPreview>
            </DocumentsSection>
            
            <ActionButtons>
              <Button
                variant="danger"
                onClick={() => openRejectModal(tutor.id)}
              >
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => scheduleInterview(tutor.id)}
              >
                Schedule Interview
              </Button>
              <Button
                variant="primary"
                onClick={() => approveTutor(tutor.id)}
              >
                Approve
              </Button>
            </ActionButtons>
          </TutorApprovalCard>
        ))}
      </TutorApprovalList>
    </TabPanel>
  </Tabs>
  
  {/* Rejection Modal */}
  <Modal
    isOpen={showRejectModal}
    onClose={closeRejectModal}
    title="Reject Tutor Application"
  >
    <ModalBody>
      <TextArea
        label="Reason for Rejection"
        placeholder="Please provide a reason..."
        required
      />
    </ModalBody>
    <ModalFooter>
      <Button onClick={closeRejectModal}>Cancel</Button>
      <Button variant="danger" onClick={handleReject}>
        Confirm Rejection
      </Button>
    </ModalFooter>
  </Modal>
</DashboardLayout>
```

### 3.3 Revenue Analytics
```jsx
<DashboardLayout role="admin">
  <PageHeader>
    <Heading>Revenue Analytics</Heading>
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onChange={handleDateChange}
    />
  </PageHeader>
  
  {/* Summary Cards */}
  <RevenueStats>
    <StatCard
      title="Total Revenue"
      value="Rs. 10,000,000"
      subtitle="Platform share: Rs. 5,000,000"
    />
    <StatCard
      title="Tutor Payouts"
      value="Rs. 4,500,000"
      subtitle="Pending: Rs. 500,000"
    />
    <StatCard
      title="Average Session Price"
      value="Rs. 4,000"
    />
    <StatCard
      title="Commission Rate"
      value="50%"
    />
  </RevenueStats>
  
  {/* Revenue Chart */}
  <Card>
    <CardHeader>
      <CardTitle>Revenue Over Time</CardTitle>
      <ButtonGroup>
        <Button size="sm" active>Monthly</Button>
        <Button size="sm">Weekly</Button>
        <Button size="sm">Daily</Button>
      </ButtonGroup>
    </CardHeader>
    <CardBody>
      <LineChart
        data={revenueChartData}
        xAxis="date"
        yAxis="revenue"
        lines={[
          { key: 'totalRevenue', label: 'Total Revenue', color: '#3B82F6' },
          { key: 'platformShare', label: 'Platform Share', color: '#10B981' }
        ]}
      />
    </CardBody>
  </Card>
  
  {/* Revenue Breakdown */}
  <GridLayout columns={2}>
    <Card>
      <CardHeader>
        <CardTitle>Revenue by City</CardTitle>
      </CardHeader>
      <CardBody>
        <BarChart data={cityRevenueData} />
      </CardBody>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Subject</CardTitle>
      </CardHeader>
      <CardBody>
        <PieChart data={subjectRevenueData} />
      </CardBody>
    </Card>
  </GridLayout>
  
  {/* Top Earning Tutors */}
  <Card>
    <CardHeader>
      <CardTitle>Top Earning Tutors</CardTitle>
    </CardHeader>
    <CardBody>
      <Table
        columns={[
          { key: 'name', label: 'Tutor Name' },
          { key: 'sessions', label: 'Sessions' },
          { key: 'earnings', label: 'Earnings' },
          { key: 'rating', label: 'Rating' }
        ]}
        data={topTutors}
      />
    </CardBody>
  </Card>
</DashboardLayout>
```

---

## 4. Tutor Dashboard Components

### 4.1 Tutor Dashboard Home
```jsx
<DashboardLayout role="tutor">
  <DashboardHeader>
    <Greeting>Welcome back, {tutorName}!</Greeting>
    <PerformanceBadge score={performanceScore} />
  </DashboardHeader>
  
  {/* Quick Stats */}
  <StatsGrid>
    <StatCard
      title="Upcoming Classes"
      value="5"
      icon={<CalendarIcon />}
    />
    <StatCard
      title="Completed This Month"
      value="12"
      icon={<CheckIcon />}
    />
    <StatCard
      title="Available Balance"
      value="Rs. 50,000"
      icon={<WalletIcon />}
      action={
        <Button size="sm" onClick={requestPayout}>
          Withdraw
        </Button>
      }
    />
    <StatCard
      title="Average Rating"
      value="4.8"
      icon={<StarIcon />}
    />
  </StatsGrid>
  
  {/* Match Notifications */}
  {matchRequests.length > 0 && (
    <MatchNotificationSection>
      <Heading>New Student Requests</Heading>
      {matchRequests.map(request => (
        <MatchNotificationCard key={request.id}>
          <MatchInfo>
            <Badge variant="info">New Request</Badge>
            <Subject>{request.subject}</Subject>
            <Grade>Grade {request.grade}</Grade>
            <Location>📍 {request.location}</Location>
            <TimeSlots>
              {request.preferredTimes.map(slot => (
                <TimeSlot key={slot.id}>
                  {slot.dayOfWeek} {slot.startTime}-{slot.endTime}
                </TimeSlot>
              ))}
            </TimeSlots>
          </MatchInfo>
          <ExpiryTimer expiresAt={request.expiresAt} />
          <ActionButtons>
            <Button variant="outline" onClick={() => viewDetails(request.id)}>
              View Details
            </Button>
            <Button variant="primary" onClick={() => acceptMatch(request.id)}>
              Accept Request
            </Button>
          </ActionButtons>
        </MatchNotificationCard>
      ))}
    </MatchNotificationSection>
  )}
  
  {/* Upcoming Sessions */}
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Sessions</CardTitle>
      <Link to="/tutor/classes">View All</Link>
    </CardHeader>
    <CardBody>
      <SessionList>
        {upcomingSessions.map(session => (
          <SessionCard key={session.id}>
            <SessionDate>{formatDate(session.sessionDate)}</SessionDate>
            <SessionTime>{session.startTime} - {session.endTime}</SessionTime>
            <StudentInfo>
              <Avatar src={session.student.avatar} size="sm" />
              <StudentName>{session.student.name}</StudentName>
              <Grade>Grade {session.grade}</Grade>
            </StudentInfo>
            <Subject>{session.subject}</Subject>
            <Location>📍 {session.location}</Location>
            <Button size="sm" onClick={() => viewSession(session.id)}>
              View Details
            </Button>
          </SessionCard>
        ))}
      </SessionList>
    </CardBody>
  </Card>
  
  {/* Recent Reviews */}
  <Card>
    <CardHeader>
      <CardTitle>Recent Reviews</CardTitle>
    </CardHeader>
    <CardBody>
      <ReviewList>
        {recentReviews.map(review => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <Avatar src={review.parent.avatar} size="sm" />
              <ParentName>{review.parent.name}</ParentName>
              <Rating value={review.rating} />
            </ReviewHeader>
            <ReviewComment>{review.comment}</ReviewComment>
            <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
          </ReviewCard>
        ))}
      </ReviewList>
    </CardBody>
  </Card>
</DashboardLayout>
```

### 4.2 Class Management
```jsx
<DashboardLayout role="tutor">
  <PageHeader>
    <Heading>My Classes</Heading>
    <FilterBar>
      <Select
        options={[
          { value: 'all', label: 'All Sessions' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
        ]}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
      />
    </FilterBar>
  </PageHeader>
  
  <Tabs defaultTab="calendar">
    <TabList>
      <Tab id="calendar">Calendar View</Tab>
      <Tab id="list">List View</Tab>
    </TabList>
    
    <TabPanel id="calendar">
      <Calendar
        events={sessions}
        onEventClick={openSessionModal}
        onDateClick={handleDateClick}
      />
    </TabPanel>
    
    <TabPanel id="list">
      <Table
        columns={[
          { key: 'date', label: 'Date & Time', sortable: true },
          { key: 'student', label: 'Student' },
          { key: 'subject', label: 'Subject' },
          { key: 'location', label: 'Location' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions' }
        ]}
        data={sessions}
        renderCell={{
          status: (session) => (
            <Badge variant={getStatusVariant(session.status)}>
              {session.status}
            </Badge>
          ),
          actions: (session) => (
            <ActionButtons>
              {session.status === 'SCHEDULED' && (
                <>
                  <IconButton
                    icon={<CheckIcon />}
                    tooltip="Mark Attendance"
                    onClick={() => markAttendance(session.id)}
                  />
                  <IconButton
                    icon={<DocumentIcon />}
                    tooltip="Submit Report"
                    onClick={() => submitReport(session.id)}
                  />
                </>
              )}
              <IconButton
                icon={<EyeIcon />}
                tooltip="View Details"
                onClick={() => viewSession(session.id)}
              />
            </ActionButtons>
          )
        }}
        pagination={true}
        pageSize={10}
      />
    </TabPanel>
  </Tabs>
  
  {/* Session Details Modal */}
  <Modal
    isOpen={showSessionModal}
    onClose={closeSessionModal}
    title="Session Details"
    size="lg"
  >
    <ModalBody>
      <SessionDetails>
        <DetailSection>
          <Label>Student</Label>
          <Value>
            <Avatar src={selectedSession?.student.avatar} size="sm" />
            {selectedSession?.student.name}
          </Value>
        </DetailSection>
        
        <DetailSection>
          <Label>Subject & Grade</Label>
          <Value>{selectedSession?.subject} - Grade {selectedSession?.grade}</Value>
        </DetailSection>
        
        <DetailSection>
          <Label>Date & Time</Label>
          <Value>
            {formatDate(selectedSession?.sessionDate)} <br />
            {selectedSession?.startTime} - {selectedSession?.endTime}
          </Value>
        </DetailSection>
        
        <DetailSection>
          <Label>Location</Label>
          <Value>{selectedSession?.location}</Value>
        </DetailSection>
        
        <DetailSection>
          <Label>Status</Label>
          <Value>
            <Badge variant={getStatusVariant(selectedSession?.status)}>
              {selectedSession?.status}
            </Badge>
          </Value>
        </DetailSection>
        
        {selectedSession?.reportSubmitted && (
          <DetailSection>
            <Label>Session Report</Label>
            <Value>
              <Button
                variant="outline"
                size="sm"
                onClick={() => viewReport(selectedSession.reportUrl)}
              >
                View Report
              </Button>
            </Value>
          </DetailSection>
        )}
      </SessionDetails>
    </ModalBody>
    <ModalFooter>
      {selectedSession?.status === 'SCHEDULED' && (
        <>
          <Button onClick={() => openAttendanceModal(selectedSession.id)}>
            Mark Attendance
          </Button>
          <Button
            variant="primary"
            onClick={() => openReportModal(selectedSession.id)}
          >
            Submit Report
          </Button>
        </>
      )}
    </ModalFooter>
  </Modal>
  
  {/* Attendance Modal */}
  <Modal
    isOpen={showAttendanceModal}
    onClose={closeAttendanceModal}
    title="Mark Attendance"
  >
    <ModalBody>
      <RadioGroup
        label="Student Attendance"
        options={[
          { value: 'PRESENT', label: 'Present' },
          { value: 'ABSENT', label: 'Absent' },
          { value: 'LATE', label: 'Late' }
        ]}
        value={attendanceStatus}
        onChange={setAttendanceStatus}
      />
    </ModalBody>
    <ModalFooter>
      <Button onClick={closeAttendanceModal}>Cancel</Button>
      <Button variant="primary" onClick={submitAttendance}>
        Submit
      </Button>
    </ModalFooter>
  </Modal>
  
  {/* Report Submission Modal */}
  <Modal
    isOpen={showReportModal}
    onClose={closeReportModal}
    title="Submit Session Report"
    size="lg"
  >
    <ModalBody>
      <Form>
        <TextArea
          label="Session Summary"
          placeholder="What topics were covered in this session?"
          rows={4}
          required
        />
        
        <TextArea
          label="Homework Assigned"
          placeholder="Describe the homework given to the student..."
          rows={3}
        />
        
        <FileUpload
          label="Attach Report (Optional)"
          accept=".pdf,.doc,.docx"
          maxSize={5242880}
        />
      </Form>
    </ModalBody>
    <ModalFooter>
      <Button onClick={closeReportModal}>Cancel</Button>
      <Button
        variant="primary"
        onClick={handleReportSubmit}
        loading={isSubmitting}
      >
        Submit Report
      </Button>
    </ModalFooter>
  </Modal>
</DashboardLayout>
```

### 4.3 Earnings & Payouts
```jsx
<DashboardLayout role="tutor">
  <PageHeader>
    <Heading>Earnings & Payouts</Heading>
  </PageHeader>
  
  {/* Earnings Summary */}
  <EarningsSummary>
    <BalanceCard variant="primary">
      <BalanceLabel>Available Balance</BalanceLabel>
      <BalanceAmount>Rs. 50,000</BalanceAmount>
      <Button
        variant="primary"
        fullWidth
        onClick={openPayoutModal}
        disabled={availableBalance < 10000}
      >
        Request Payout
      </Button>
      {availableBalance < 10000 && (
        <HelperText>Minimum payout amount: Rs. 10,000</HelperText>
      )}
    </BalanceCard>
    
    <BalanceCard>
      <BalanceLabel>Pending Balance</BalanceLabel>
      <BalanceAmount>Rs. 20,000</BalanceAmount>
      <HelperText>From 10 sessions awaiting completion</HelperText>
    </BalanceCard>
    
    <BalanceCard>
      <BalanceLabel>Total Earnings</BalanceLabel>
      <BalanceAmount>Rs. 100,000</BalanceAmount>
      <HelperText>From 50 completed sessions</HelperText>
    </BalanceCard>
    
    <BalanceCard>
      <BalanceLabel>Withdrawn Amount</BalanceLabel>
      <BalanceAmount>Rs. 30,000</BalanceAmount>
      <HelperText>3 successful payouts</HelperText>
    </BalanceCard>
  </EarningsSummary>
  
  {/* Earnings Chart */}
  <Card>
    <CardHeader>
      <CardTitle>Earnings Over Time</CardTitle>
      <Select
        options={[
          { value: 'month', label: 'This Month' },
          { value: '3months', label: 'Last 3 Months' },
          { value: 'year', label: 'This Year' }
        ]}
      />
    </CardHeader>
    <CardBody>
      <AreaChart
        data={earningsData}
        xAxis="date"
        yAxis="earnings"
        color="#10B981"
      />
    </CardBody>
  </Card>
  
  {/* Payout History */}
  <Card>
    <CardHeader>
      <CardTitle>Payout History</CardTitle>
    </CardHeader>
    <CardBody>
      <Table
        columns={[
          { key: 'requestDate', label: 'Request Date', sortable: true },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' },
          { key: 'approvedDate', label: 'Approved Date' },
          { key: 'completedDate', label: 'Completed Date' }
        ]}
        data={payoutHistory}
        renderCell={{
          status: (payout) => (
            <Badge variant={getPayoutStatusVariant(payout.status)}>
              {payout.status}
            </Badge>
          ),
          amount: (payout) => `Rs. ${payout.amount.toLocaleString()}`
        }}
        pagination={true}
      />
    </CardBody>
  </Card>
  
  {/* Payout Request Modal */}
  <Modal
    isOpen={showPayoutModal}
    onClose={closePayoutModal}
    title="Request Payout"
    size="md"
  >
    <ModalBody>
      <Form>
        <Input
          type="number"
          label="Amount"
          max={availableBalance}
          value={payoutAmount}
          onChange={(e) => setPayoutAmount(e.target.value)}
          helperText={`Available: Rs. ${availableBalance.toLocaleString()}`}
        />
        
        <Divider />
        
        <Heading size="sm">Bank Details</Heading>
        
        <Select
          label="Bank Name"
          options={banks}
          value={bankName}
          onChange={setBankName}
        />
        
        <Input
          label="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        
        <Input
          label="Account Holder Name"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
        />
        
        <Input
          label="Branch Code"
          value={branchCode}
          onChange={(e) => setBranchCode(e.target.value)}
        />
        
        <Alert type="info">
          Payout requests are processed within 3-5 business days after approval.
        </Alert>
      </Form>
    </ModalBody>
    <ModalFooter>
      <Button onClick={closePayoutModal}>Cancel</Button>
      <Button
        variant="primary"
        onClick={submitPayoutRequest}
        loading={isSubmitting}
      >
        Submit Request
      </Button>
    </ModalFooter>
  </Modal>
</DashboardLayout>
```

---

## 5. Parent Dashboard Components

### 5.1 Parent Dashboard Home
```jsx
<DashboardLayout role="parent">
  <DashboardHeader>
    <Greeting>Welcome, {parentName}!</Greeting>
  </DashboardHeader>
  
  {/* Student Cards */}
  <StudentSection>
    <SectionHeader>
      <Heading>My Students</Heading>
      <Button variant="outline" onClick={openAddStudentModal}>
        + Add Student
      </Button>
    </SectionHeader>
    
    <StudentGrid>
      {students.map(student => (
        <StudentCard key={student.id}>
          <StudentAvatar>{student.name.charAt(0)}</StudentAvatar>
          <StudentName>{student.name}</StudentName>
          <Grade>Grade {student.grade}</Grade>
          <StudentStats>
            <StatItem>
              <StatLabel>Upcoming</StatLabel>
              <StatValue>{student.upcomingSessions}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Completed</StatLabel>
              <StatValue>{student.completedSessions}</StatValue>
            </StatItem>
          </StudentStats>
          <Button
            size="sm"
            variant="outline"
            onClick={() => findTutor(student.id)}
          >
            Find Tutor
          </Button>
        </StudentCard>
      ))}
    </StudentGrid>
  </StudentSection>
  
  {/* Upcoming Sessions */}
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Sessions</CardTitle>
      <Link to="/parent/sessions">View All</Link>
    </CardHeader>
    <CardBody>
      {upcomingSessions.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📅</EmptyStateIcon>
          <EmptyStateText>No upcoming sessions</EmptyStateText>
          <Button onClick={openFindTutorModal}>Find a Tutor</Button>
        </EmptyState>
      ) : (
        <SessionList>
          {upcomingSessions.map(session => (
            <SessionCard key={session.id}>
              <SessionInfo>
                <SessionDate>{formatDate(session.sessionDate)}</SessionDate>
                <SessionTime>{session.startTime} - {session.endTime}</SessionTime>
              </SessionInfo>
              
              <TutorInfo>
                <Avatar src={session.tutor.avatar} size="md" />
                <div>
                  <TutorName>{session.tutor.fullName}</TutorName>
                  <Rating value={session.tutor.rating} size="sm" />
                  <Subject>{session.subject}</Subject>
                </div>
              </TutorInfo>
              
              <SessionActions>
                <IconButton
                  icon={<MessageIcon />}
                  tooltip="Message Tutor"
                  onClick={() => messageTutor(session.tutor.id)}
                />
                <IconButton
                  icon={<LocationIcon />}
                  tooltip="View Location"
                  onClick={() => viewLocation(session.location)}
                />
                <Button
                  size="sm"
                  onClick={() => viewSessionDetails(session.id)}
                >
                  View Details
                </Button>
              </SessionActions>
            </SessionCard>
          ))}
        </SessionList>
      )}
    </CardBody>
  </Card>
  
  {/* Pending Payments */}
  {pendingPayments.length > 0 && (
    <Alert type="warning" title="Pending Payments">
      You have {pendingPayments.length} pending payments totaling Rs. {totalPendingAmount.toLocaleString()}.
      <Button size="sm" variant="primary" onClick={navigateToPayments}>
        Make Payment
      </Button>
    </Alert>
  )}
  
  {/* Recent Activity */}
  <GridLayout columns={2}>
    <Card>
      <CardHeader>
        <CardTitle>Recent Homework</CardTitle>
      </CardHeader>
      <CardBody>
        <HomeworkList>
          {recentHomework.map(hw => (
            <HomeworkItem key={hw.id}>
              <HomeworkSubject>{hw.subject}</HomeworkSubject>
              <HomeworkDescription>{hw.description}</HomeworkDescription>
              <HomeworkMeta>
                <span>Assigned: {formatDate(hw.assignedDate)}</span>
                <Badge variant={hw.completed ? 'success' : 'warning'}>
                  {hw.completed ? 'Completed' : 'Pending'}
                </Badge>
              </HomeworkMeta>
            </HomeworkItem>
          ))}
        </HomeworkList>
      </CardBody>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
      </CardHeader>
      <CardBody>
        <ReportList>
          {recentReports.map(report => (
            <ReportItem key={report.id}>
              <ReportSubject>{report.subject}</ReportSubject>
              <ReportSummary>{report.summary}</ReportSummary>
              <ReportMeta>
                <span>{formatDate(report.createdAt)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => viewReport(report.id)}
                >
                  View
                </Button>
              </ReportMeta>
            </ReportItem>
          ))}
        </ReportList>
      </CardBody>
    </Card>
  </GridLayout>
</DashboardLayout>
```

### 5.2 Find Tutor / Search
```jsx
<DashboardLayout role="parent">
  <PageHeader>
    <Heading>Find a Tutor</Heading>
  </PageHeader>
  
  {/* Search Filters */}
  <FilterPanel>
    <Select
      label="Student"
      options={students}
      value={selectedStudent}
      onChange={setSelectedStudent}
    />
    
    <Select
      label="Subject"
      options={subjects}
      value={selectedSubject}
      onChange={setSelectedSubject}
    />
    
    <Select
      label="Grade"
      options={grades}
      value={selectedGrade}
      onChange={setSelectedGrade}
    />
    
    <Select
      label="City"
      options={cities}
      value={selectedCity}
      onChange={setSelectedCity}
    />
    
    <Select
      label="Availability"
      options={daysOfWeek}
      value={selectedDay}
      onChange={setSelectedDay}
      multiple
    />
    
    <Button variant="primary" onClick={searchTutors}>
      Search Tutors
    </Button>
  </FilterPanel>
  
  {/* Results */}
  {isLoading ? (
    <Loader size="lg" />
  ) : tutors.length === 0 ? (
    <EmptyState>
      <EmptyStateIcon>🔍</EmptyStateIcon>
      <EmptyStateText>No tutors found matching your criteria</EmptyStateText>
      <EmptyStateSubText>
        Try adjusting your filters or let us find the best match for you.
      </EmptyStateSubText>
      <Button onClick={openMatchRequestModal}>Request Auto-Match</Button>
    </EmptyState>
  ) : (
    <>
      <ResultsHeader>
        <ResultCount>{tutors.length} tutors found</ResultCount>
        <SortDropdown>
          <Select
            options={[
              { value: 'relevance', label: 'Most Relevant' },
              { value: 'rating', label: 'Highest Rated' },
              { value: 'experience', label: 'Most Experienced' },
              { value: 'price', label: 'Price: Low to High' }
            ]}
            value={sortBy}
            onChange={setSortBy}
          />
        </SortDropdown>
      </ResultsHeader>
      
      <TutorGrid>
        {tutors.map(tutor => (
          <TutorCard key={tutor.id}>
            <TutorHeader>
              <Avatar src={tutor.avatar} size="lg" />
              <TutorBadges>
                {tutor.badges.map(badge => (
                  <Badge key={badge} variant="success" size="sm">
                    {badge}
                  </Badge>
                ))}
              </TutorBadges>
            </TutorHeader>
            
            <TutorInfo>
              <TutorName>{tutor.fullName}</TutorName>
              <Rating value={tutor.averageRating} />
              <ReviewCount>({tutor.totalReviews} reviews)</ReviewCount>
              
              <TutorMeta>
                <MetaItem>
                  <Icon><LocationIcon /></Icon>
                  {tutor.city}
                </MetaItem>
                <MetaItem>
                  <Icon><BookIcon /></Icon>
                  {tutor.totalClasses} classes
                </MetaItem>
                <MetaItem>
                  <Icon><AwardIcon /></Icon>
                  {tutor.yearsOfExperience} years exp.
                </MetaItem>
              </TutorMeta>
              
              <Subjects>
                {tutor.subjects.slice(0, 3).map(subject => (
                  <SubjectTag key={subject}>{subject}</SubjectTag>
                ))}
                {tutor.subjects.length > 3 && (
                  <SubjectTag>+{tutor.subjects.length - 3} more</SubjectTag>
                )}
              </Subjects>
              
              <Bio>{tutor.bio}</Bio>
              
              <PriceTag>Rs. {tutor.hourlyRate} / hour</PriceTag>
            </TutorInfo>
            
            <TutorActions>
              <Button
                variant="outline"
                fullWidth
                onClick={() => viewTutorProfile(tutor.id)}
              >
                View Profile
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => requestTutor(tutor.id)}
              >
                Request Tutor
              </Button>
            </TutorActions>
          </TutorCard>
        ))}
      </TutorGrid>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )}
  
  {/* Match Request Modal */}
  <Modal
    isOpen={showMatchRequestModal}
    onClose={closeMatchRequestModal}
    title="Request Tutor Match"
    size="md"
  >
    <ModalBody>
      <Form>
        <Select
          label="Student"
          options={students}
          value={matchRequest.studentId}
          onChange={(value) => updateMatchRequest('studentId', value)}
          required
        />
        
        <Select
          label="Subject"
          options={subjects}
          value={matchRequest.subjectId}
          onChange={(value) => updateMatchRequest('subjectId', value)}
          required
        />
        
        <Select
          label="Grade"
          options={grades}
          value={matchRequest.gradeId}
          onChange={(value) => updateMatchRequest('gradeId', value)}
          required
        />
        
        <Select
          label="Preferred City"
          options={cities}
          value={matchRequest.preferredCity}
          onChange={(value) => updateMatchRequest('preferredCity', value)}
          required
        />
        
        <Label>Preferred Time Slots</Label>
        <TimeSlotSelector>
          {daysOfWeek.map(day => (
            <TimeSlotRow key={day}>
              <Checkbox
                label={day}
                checked={matchRequest.preferredDays.includes(day)}
                onChange={() => toggleDay(day)}
              />
              {matchRequest.preferredDays.includes(day) && (
                <>
                  <TimePicker
                    value={getTimeSlot(day, 'start')}
                    onChange={(time) => setTimeSlot(day, 'start', time)}
                  />
                  <span>to</span>
                  <TimePicker
                    value={getTimeSlot(day, 'end')}
                    onChange={(time) => setTimeSlot(day, 'end', time)}
                  />
                </>
              )}
            </TimeSlotRow>
          ))}
        </TimeSlotSelector>
        
        <TextArea
          label="Additional Notes (Optional)"
          placeholder="Any specific requirements..."
          value={matchRequest.notes}
          onChange={(e) => updateMatchRequest('notes', e.target.value)}
        />
        
        <Alert type="info">
          We'll notify suitable tutors. The first to accept will be matched with you.
        </Alert>
      </Form>
    </ModalBody>
    <ModalFooter>
      <Button onClick={closeMatchRequestModal}>Cancel</Button>
      <Button
        variant="primary"
        onClick={submitMatchRequest}
        loading={isSubmitting}
      >
        Submit Request
      </Button>
    </ModalFooter>
  </Modal>
</DashboardLayout>
```

---

## 6. Supervisor Dashboard Components

### 6.1 Supervisor Dashboard
```jsx
<DashboardLayout role="supervisor">
  <PageHeader>
    <Heading>Supervisor Dashboard</Heading>
  </PageHeader>
  
  <StatsGrid>
    <StatCard
      title="Pending Interviews"
      value="5"
      icon={<InterviewIcon />}
    />
    <StatCard
      title="Pending Payouts"
      value="10"
      icon={<WalletIcon />}
    />
    <StatCard
      title="Sessions to Audit"
      value="15"
      icon={<AuditIcon />}
    />
    <StatCard
      title="Active Tutors"
      value="120"
      icon={<UsersIcon />}
    />
  </StatsGrid>
  
  <Tabs defaultTab="interviews">
    <TabList>
      <Tab id="interviews">Interviews (5)</Tab>
      <Tab id="payouts">Payout Approvals (10)</Tab>
      <Tab id="audits">Session Audits (15)</Tab>
    </TabList>
    
    {/* Interviews Tab */}
    <TabPanel id="interviews">
      <Card>
        <CardHeader>
          <CardTitle>Pending Interviews</CardTitle>
          <Button onClick={openScheduleModal}>Schedule New</Button>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              { key: 'tutor', label: 'Tutor' },
              { key: 'scheduledDate', label: 'Scheduled Date' },
              { key: 'meetingLink', label: 'Meeting Link' },
              { key: 'status', label: 'Status' },
              { key: 'actions', label: 'Actions' }
            ]}
            data={interviews}
            renderCell={{
              tutor: (interview) => (
                <TutorCell>
                  <Avatar src={interview.tutor.avatar} size="sm" />
                  <div>
                    <TutorName>{interview.tutor.fullName}</TutorName>
                    <TutorEmail>{interview.tutor.email}</TutorEmail>
                  </div>
                </TutorCell>
              ),
              meetingLink: (interview) => (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(interview.meetingLink)}
                >
                  Join Meeting
                </Button>
              ),
              actions: (interview) => (
                <ActionButtons>
                  <Button
                    size="sm"
                    onClick={() => completeInterview(interview.id)}
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reschedule(interview.id)}
                  >
                    Reschedule
                  </Button>
                </ActionButtons>
              )
            }}
          />
        </CardBody>
      </Card>
    </TabPanel>
    
    {/* Payouts Tab */}
    <TabPanel id="payouts">
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              { key: 'tutor', label: 'Tutor' },
              { key: 'amount', label: 'Amount' },
              { key: 'bankDetails', label: 'Bank Details' },
              { key: 'requestDate', label: 'Request Date' },
              { key: 'performance', label: 'Performance' },
              { key: 'actions', label: 'Actions' }
            ]}
            data={payoutRequests}
            renderCell={{
              tutor: (payout) => (
                <TutorCell>
                  <Avatar src={payout.tutor.avatar} size="sm" />
                  <div>
                    <TutorName>{payout.tutor.fullName}</TutorName>
                    <Badge variant="info">
                      {payout.tutor.totalClasses} classes
                    </Badge>
                  </div>
                </TutorCell>
              ),
              bankDetails: (payout) => (
                <BankDetails>
                  <div>{payout.bankDetails.bankName}</div>
                  <div>{payout.bankDetails.accountNumber}</div>
                </BankDetails>
              ),
              performance: (payout) => (
                <PerformanceIndicator>
                  <Rating value={payout.tutor.performanceScore} size="sm" />
                  <CompletionRate>
                    {payout.tutor.completionRate}% completion
                  </CompletionRate>
                </PerformanceIndicator>
              ),
              actions: (payout) => (
                <ActionButtons>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => approvePayout(payout.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => rejectPayout(payout.id)}
                  >
                    Reject
                  </Button>
                </ActionButtons>
              )
            }}
          />
        </CardBody>
      </Card>
    </TabPanel>
    
    {/* Audits Tab */}
    <TabPanel id="audits">
      <Card>
        <CardHeader>
          <CardTitle>Sessions to Audit</CardTitle>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              { key: 'session', label: 'Session' },
              { key: 'tutor', label: 'Tutor' },
              { key: 'date', label: 'Date' },
              { key: 'report', label: 'Report' },
              { key: 'actions', label: 'Actions' }
            ]}
            data={sessionsToAudit}
            renderCell={{
              session: (session) => (
                <SessionInfo>
                  <Subject>{session.subject}</Subject>
                  <Grade>Grade {session.grade}</Grade>
                </SessionInfo>
              ),
              report: (session) => (
                session.reportUrl ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => viewReport(session.reportUrl)}
                  >
                    View Report
                  </Button>
                ) : (
                  <Badge variant="warning">No report</Badge>
                )
              ),
              actions: (session) => (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => openAuditModal(session.id)}
                >
                  Audit Session
                </Button>
              )
            }}
          />
        </CardBody>
      </Card>
    </TabPanel>
  </Tabs>
</DashboardLayout>
```

---

## 7. Responsive Design Considerations

### Mobile Breakpoints (TailwindCSS)
```css
/* sm: 640px - Small devices (phones) */
/* md: 768px - Medium devices (tablets) */
/* lg: 1024px - Large devices (desktops) */
/* xl: 1280px - Extra large devices */
/* 2xl: 1536px - 2X Extra large devices */
```

### Mobile Navigation
```jsx
// Mobile: Bottom Tab Bar
<MobileTabBar>
  <TabItem icon={<HomeIcon />} label="Home" active />
  <TabItem icon={<ClassesIcon />} label="Classes" />
  <TabItem icon={<NotificationsIcon />} label="Alerts" />
  <TabItem icon={<ProfileIcon />} label="Profile" />
</MobileTabBar>

// Mobile: Hamburger Menu
<MobileHeader>
  <HamburgerButton onClick={toggleMenu} />
  <Logo />
  <NotificationIcon />
</MobileHeader>

<MobileDrawer isOpen={menuOpen} onClose={toggleMenu}>
  <DrawerContent>
    <UserProfile />
    <NavigationMenu items={menuItems} />
  </DrawerContent>
</MobileDrawer>
```

### Responsive Tables
```jsx
// Desktop: Standard table
// Mobile: Card-based layout
<ResponsiveTable>
  {isMobile ? (
    <CardList>
      {data.map(item => (
        <MobileCard key={item.id}>
          {/* Card view for mobile */}
        </MobileCard>
      ))}
    </CardList>
  ) : (
    <Table columns={columns} data={data} />
  )}
</ResponsiveTable>
```

---

## 8. UI Design Specifications

### Color Palette
```css
/* Primary Colors */
--primary: #3B82F6;      /* Blue */
--primary-dark: #2563EB;
--primary-light: #DBEAFE;

/* Secondary Colors */
--secondary: #10B981;    /* Green */
--secondary-dark: #059669;
--secondary-light: #D1FAE5;

/* Status Colors */
--success: #10B981;      /* Green */
--warning: #F59E0B;      /* Amber */
--danger: #EF4444;       /* Red */
--info: #3B82F6;         /* Blue */

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Background */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;
```

### Typography
```css
/* Font Family */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```css
/* Spacing Scale (rem) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Border Radius
```css
--radius-sm: 0.125rem;   /* 2px */
--radius: 0.25rem;       /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Fully rounded */
```

This comprehensive UI documentation provides a complete component structure for building the Business Master application with React, TailwindCSS, and modern design patterns.

