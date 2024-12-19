export const signupEmailTemplate = (username, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to BlogMotion!</title>
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
          padding: 20px;
        }
        .logo {
          width: 150px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 24px;
          color: #333;
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          padding: 12px 20px;
          background-color: #A8A5B9; 
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          text-align: center;
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
          <h2 style="color: #44E57F;">Blog Motion</h2>
        </div>
        <p class="greeting">Hi ${username},</p>
        <p>Welcome to BlogMotion! We're thrilled to have you join our vibrant community of storytellers and dreamers. Let's get you started on your journey by verifying your email address.</p>
        <p>To complete your registration and activate your account, please click the button below to verify your email:</p>
        <p><a href="${verificationUrl}" class="button">Verify Email</a></p>
        <p>If you didn't sign up for this account, please ignore this email.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} BlogMotion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
