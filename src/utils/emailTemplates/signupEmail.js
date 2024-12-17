export const signupEmailTemplate = (username, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Application</title>
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
          <h2>Welcome to Our Application!</h2>
        </div>
        <p>Hi ${username},</p>
        <p>Thank you for signing up. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
        <p><a href="${verificationUrl}" class="button">Verify Email</a></p>
        <p>If you didn't sign up for this account, please ignore this email.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Our Application. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
