# 🔨 BlogMotion API - Backend

**BlogMotion API** is a modern backend solution built with **Node.js** and **Express.js** to handle blogging platform functionalities, including user authentication, blog management, and interaction features like likes and comments. This API powers the BlogMotion frontend with efficient CRUD operations and secure endpoints for a seamless user experience.

## 🌟 Project Purpose

The purpose of the BlogMotion API is to provide robust backend support for the **BlogMotion** platform, enabling users to:

- Manage their accounts securely.
- Write, edit, and delete blogs.
- Interact with blogs by liking, commenting, and sharing.
- Perform all actions securely with JWT-based authentication.

## 📼 Outcome

![BlogMotion API]()

## 🔨 Technologies Used

- **Node.js**: JavaScript runtime environment for building the server-side application.
- **Express.js**: Web framework for handling routing, middleware, and requests.
- **MongoDB & Mongoose**: For data storage and schema modeling.
- **JWT (JSON Web Tokens)**: Ensures secure authentication and protected route access.
- **Nodemailer**: Sends email notifications for password resets and email verification.
- **Bcryptjs**: Hashes and compares passwords for secure user authentication.
- **dotenv**: Manages environment variables like database credentials and JWT secrets.
- **Swagger UI**: Provides interactive API documentation for easy exploration of endpoints.
- **ReDoc**: Simplifies API documentation for enhanced developer usability.
- **CORS**: Handles cross-origin requests, enabling secure frontend-backend communication.
- **Helmet**: Adds security headers to the API responses for improved security.
- **Rate-Limiter**: Limits excessive API requests, preventing abuse and enhancing reliability.
- **XSS & mongoSanitize**: Protects against cross-site scripting (XSS) and NoSQL injection attacks.
- **Express-Async-Errors**: Simplifies error handling for asynchronous routes.
- **Cookie-Parser**: Parses cookies for session management.

## ⚙️ Features

### **🔨 Blog Management**

- Create, read, update, and delete blogs with advanced text formatting.
- Allow users to interact with blogs by liking and commenting.
- Share blogs across various platforms.

### **🔒 Authentication**

- Secure login and registration using JWT.
- `Google OAuth` integration for simplified user onboarding.
- Password reset via email with secure 6-digit codes.
- Email verification to activate user accounts post-registration.

### **💜 API Documentation**

- **Swagger UI**: [Swagger Documentation](https://blogmotion-api.onrender.com/documents/swagger)
- **ReDoc**: [ReDoc Documentation](https://blogmotion-api.onrender.com/documents/redoc)

### **🔄 CORS Configuration**

- CORS middleware ensures secure cross-origin communication with the frontend.

### **📊 Real-time Updates**

- The API provides real-time data to keep the frontend updated dynamically.

### **🚦 Authentication Flow**

1. **User Authentication**:
   - JWT tokens manage user sessions and authorize access to protected resources.
   - Users can register/login with either email and password or Google OAuth.
2. **Protected Routes**:
   - Routes like blog creation and account management require valid tokens.
3. **Email Verification**:
   - Users must verify their email addresses via a verification link to activate accounts.

## 🚀 Deployment

The API is deployed on **Render** and accessible via the following URL:  
[BlogMotion API Live Demo](https://blogmotion-api.onrender.com/)

## 📦 At the End of This Project, You Will Learn:

- Developing secure and scalable **Node.js** APIs with **Express.js**.
- Managing **authentication** and **authorization** with JWT.
- Using **MongoDB** and **Mongoose** for efficient data modeling.
- Protecting APIs against **XSS**, **NoSQL injections**, and **other vulnerabilities**.
- Documenting APIs using **Swagger UI** and **ReDoc**.

![ERD]()

<p align="center">🚀 Happy Coding with BlogMotion API! 🚀</p>
