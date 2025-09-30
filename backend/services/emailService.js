const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Create a test account for development
const createTestAccount = async () => {
  return await nodemailer.createTestAccount();
};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'user@example.com', // generated ethereal user
    pass: process.env.SMTP_PASS || 'password', // generated ethereal password
  },
});

// Generate verification token
const generateVerificationToken = () => {
  return uuidv4();
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"ANNU ERP" <${process.env.EMAIL_FROM || 'noreply@annuerp.com'}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <h2>Welcome to ANNU ERP</h2>
      <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify Email Address</a></p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  transporter,
  generateVerificationToken,
  sendVerificationEmail,
};
