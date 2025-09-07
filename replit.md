# EduTrack - Educational Management System

## Overview
EduTrack is a comprehensive educational management system built with React/TypeScript frontend and Node.js/Express backend with MongoDB database. The system manages universities, programs, faculty, students, and academic activities.

## Recent Changes (September 7, 2025)
- Initial setup completed for Replit environment
- Configured MongoDB with proper data directory
- Updated backend server to use localhost binding on port 3001
- Configured Vite frontend to allow all hosts and serve on port 5000
- Fixed API endpoints to work with Replit proxy setup
- Set up deployment configuration for VM deployment
- All workflows are running successfully

## Project Architecture

### Frontend (React + TypeScript + Vite)
- **Port**: 5000 (configured for Replit proxy)
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS
- **Components**: Organized by user role (Admin, University, SPOC, Faculty, Student)
- **State Management**: React Context for authentication

### Backend (Node.js + Express)
- **Port**: 3001 (localhost binding for internal communication)
- **Database**: MongoDB via Mongoose ODM
- **Authentication**: Passport.js with session management
- **API Structure**: RESTful endpoints organized by entity type

### Database (MongoDB)
- **Connection**: Local MongoDB instance at mongodb://localhost:27017/edutrack
- **Data Path**: /tmp/mongodb (configured for Replit environment)
- **Models**: Universities, Programs, SPOCs, Students, Faculty, Courses, Sections, etc.

## User Preferences
- The system follows a multi-tenant architecture supporting different user roles
- Authentication-based routing with role-specific dashboards
- Comprehensive academic management features

## Key Features
- University registration and approval system
- Program and course management
- Student enrollment and section management
- Faculty assignment and class coordination
- Timetable and schedule management
- Analytics and reporting capabilities
- Certificate and resume management for students

## Environment Configuration
- MongoDB runs as a background service
- Backend API server handles authentication and data operations
- Frontend serves the user interface with proper CORS configuration
- All components work together in the Replit cloud environment