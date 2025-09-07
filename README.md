# EduTrack - University Management System

A full-stack application for managing university registrations, programs, and SPOCs with MongoDB Atlas and Passport authentication.

## Setup Instructions

### 1. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from "Connect" > "Connect your application"

### 2. Backend Setup
```bash
cd server
npm install
```

Update `.env` file with your MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/edutrack?retryWrites=true&w=majority
SESSION_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```

## Features

### Authentication (Passport.js)
- **Admin**: Passcode-based authentication (ADMIN2025)
- **University**: Username/password with approval status check
- **SPOC**: Username/password authentication

### Data Storage (MongoDB Atlas)
- **Universities**: Registration details, approval status
- **Programs**: Academic programs with university association
- **SPOCs**: Single Point of Contacts for programs

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - University registration
- `GET /api/universities` - Get all universities (admin only)
- `PATCH /api/universities/:id/status` - Update university status
- `GET /api/programs` - Get programs
- `POST /api/programs` - Create program
- `GET /api/spocs` - Get SPOCs
- `POST /api/spocs` - Create SPOC

## Default Credentials
- **Admin**: Passcode: `ADMIN2025`

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, Passport.js
- **Database**: MongoDB Atlas
- **Authentication**: Passport Local Strategy with sessions