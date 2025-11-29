const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email
 * @param {object} options - Email options
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw error;
  }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail(user) {
  const html = `
    <h1>Welcome to Business Master!</h1>
    <p>Hello ${user.fullName || user.email},</p>
    <p>Thank you for registering with Business Master.</p>
    <p>Your account has been created successfully.</p>
    <br/>
    <p>Best regards,</p>
    <p>Business Master Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to Business Master',
    html,
  });
}

/**
 * Send tutor verification email
 */
async function sendTutorVerificationEmail(tutor, status, reason = null) {
  const isApproved = status === 'APPROVED';
  
  const html = `
    <h1>Tutor Verification ${isApproved ? 'Approved' : 'Update'}</h1>
    <p>Hello ${tutor.fullName},</p>
    ${isApproved ? `
      <p>Congratulations! Your tutor profile has been approved.</p>
      <p>You can now start accepting student requests.</p>
    ` : `
      <p>Your tutor application status: ${status}</p>
      ${reason ? `<p>Reason: ${reason}</p>` : ''}
    `}
    <br/>
    <p>Best regards,</p>
    <p>Business Master Team</p>
  `;

  return sendEmail({
    to: tutor.user.email,
    subject: `Tutor Verification ${isApproved ? 'Approved' : 'Update'}`,
    html,
  });
}

/**
 * Send match notification email
 */
async function sendMatchNotificationEmail(tutor, matchRequest) {
  const html = `
    <h1>New Student Request!</h1>
    <p>Hello ${tutor.fullName},</p>
    <p>A new student is looking for a tutor matching your profile.</p>
    <ul>
      <li>Subject: ${matchRequest.subject.name}</li>
      <li>Grade: ${matchRequest.grade.name}</li>
      <li>Location: ${matchRequest.preferredCity}</li>
    </ul>
    <p>Login to your dashboard to accept this request.</p>
    <br/>
    <p>Best regards,</p>
    <p>Business Master Team</p>
  `;

  return sendEmail({
    to: tutor.user.email,
    subject: 'New Student Request - Business Master',
    html,
  });
}

/**
 * Send session reminder email
 */
async function sendSessionReminderEmail(user, session) {
  const html = `
    <h1>Session Reminder</h1>
    <p>Hello,</p>
    <p>This is a reminder for your upcoming session:</p>
    <ul>
      <li>Subject: ${session.subject.name}</li>
      <li>Date: ${new Date(session.sessionDate).toLocaleDateString()}</li>
      <li>Time: ${session.startTime} - ${session.endTime}</li>
      <li>Location: ${session.location}</li>
    </ul>
    <br/>
    <p>Best regards,</p>
    <p>Business Master Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Session Reminder - Business Master',
    html,
  });
}

/**
 * Send payment confirmation email
 */
async function sendPaymentConfirmationEmail(parent, payment) {
  const html = `
    <h1>Payment Confirmation</h1>
    <p>Hello ${parent.fullName},</p>
    <p>Your payment has been received successfully.</p>
    <ul>
      <li>Amount: Rs. ${payment.amount.toLocaleString()}</li>
      <li>Transaction ID: ${payment.transactionId}</li>
      <li>Date: ${new Date(payment.paymentDate).toLocaleString()}</li>
    </ul>
    <p>Thank you for using Business Master.</p>
    <br/>
    <p>Best regards,</p>
    <p>Business Master Team</p>
  `;

  return sendEmail({
    to: parent.user.email,
    subject: 'Payment Confirmation - Business Master',
    html,
  });
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <br/>
    <p>Best regards,</p>
    <p>Business Master Team</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset - Business Master',
    html,
  });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendTutorVerificationEmail,
  sendMatchNotificationEmail,
  sendSessionReminderEmail,
  sendPaymentConfirmationEmail,
  sendPasswordResetEmail,
};

