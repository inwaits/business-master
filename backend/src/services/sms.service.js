const twilio = require('twilio');

let twilioClient = null;

// Initialize Twilio client if credentials are provided
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

/**
 * Send SMS
 * @param {string} to - Recipient phone number
 * @param {string} message - SMS message
 */
async function sendSMS(to, message) {
  if (!twilioClient) {
    console.warn('⚠️  Twilio not configured. SMS not sent.');
    return null;
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log('📱 SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('❌ SMS send failed:', error);
    throw error;
  }
}

/**
 * Send match notification SMS
 */
async function sendMatchNotificationSMS(tutor, matchRequest) {
  const message = `New student request! Grade ${matchRequest.grade.name}, Subject: ${matchRequest.subject.name}. Check your dashboard to accept.`;
  
  return sendSMS(tutor.phoneNumber, message);
}

/**
 * Send session reminder SMS
 */
async function sendSessionReminderSMS(phoneNumber, session) {
  const message = `Session reminder: ${session.subject.name} on ${new Date(session.sessionDate).toLocaleDateString()} at ${session.startTime}. Location: ${session.location}`;
  
  return sendSMS(phoneNumber, message);
}

/**
 * Send OTP SMS
 */
async function sendOTPSMS(phoneNumber, otp) {
  const message = `Your Business Master verification code is: ${otp}. Valid for 10 minutes.`;
  
  return sendSMS(phoneNumber, message);
}

module.exports = {
  sendSMS,
  sendMatchNotificationSMS,
  sendSessionReminderSMS,
  sendOTPSMS,
};

