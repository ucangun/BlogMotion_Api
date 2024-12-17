export const forgotPasswordEmailTemplate = (
  username,
  verificationCode,
  resetURL
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
        }
        .header {
          text-align: center;
          padding: 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Reset Request</h2>
        </div>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password. Please use the verification code below to proceed with resetting your password:</p>
        <p><strong>Verification Code:</strong> ${verificationCode}</p>
        <p>This code will expire in 10 minutes. If you didn't request a password reset, please ignore this email.</p>
        <p>To reset your password, click the link below:</p>
        <p><a href="${resetURL}" class="button">Reset Password</a></p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Our Application. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
