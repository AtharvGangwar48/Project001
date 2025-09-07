# EduTrack - Educational Management System

## Overview
EduTrack is a comprehensive educational management system built with React/TypeScript frontend and Node.js/Express backend with MongoDB database. The system manages universities, programs, faculty, students, and academic activities.

## Recent Changes (September 7, 2025)
- **Initial Setup**: Completed full Replit environment configuration with MongoDB, Node.js backend, and React frontend
- **Class Scheduling**: Enhanced SPOC timetable creation with proper API connections and fixed NewTimetableForm
- **Attendance System**: Built comprehensive attendance marking system for faculty with React Router integration
- **Student Management**: Implemented student account creation functionality for class coordinators with section assignment
- **Activity Workflow**: Created complete student activity submission and approval system with faculty review interface
- **Dashboard Enhancement**: Upgraded Faculty Dashboard with tabbed navigation (Overview, Student Management, Classes & Schedule, Activity Approvals)
- **API Integration**: Fixed all hardcoded localhost URLs to work with Replit's proxy environment
- **Database Models**: Utilized existing comprehensive models for Attendance, StudentActivity, and StudentDetails
- **Authentication & Authorization**: Implemented role-based access control throughout the system
- **All workflows running successfully** with proper port configurations and CORS settings

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

## User Preferences & Workflows

### SPOC (Student Program Coordinator)
- Create and manage class timetables using the timetable creation system
- Oversee program-wide activities and student management
- Access comprehensive scheduling and coordination tools

### Faculty (Class Coordinators)
- **Student Management**: Create student accounts and assign to sections
- **Attendance Tracking**: Mark attendance for assigned classes with detailed records
- **Activity Approvals**: Review and approve student activity submissions (certificates, internships, courses)
- **Class Coordination**: Manage sections and course assignments

### Students
- **Activity Submission**: Submit certificates, academic results, internships, and extracurricular activities
- **Attendance Viewing**: Access personal attendance records and class schedules
- **Document Management**: Upload and manage proof documents via Google Drive links
- **Status Tracking**: Monitor approval status of submitted activities

### System Design Principles
- **Multi-tenant Architecture**: University-specific data isolation
- **Role-Based Access Control**: Secure, permission-based feature access
- **Workflow-Driven**: Approval processes for critical academic activities
- **Integration-Ready**: Google Drive document management and external API support

## Key Features

### Core Academic Management
- **University & Program Management**: Registration, approval, and administration system
- **Student Lifecycle**: Account creation by class coordinators, section enrollment, and profile management
- **Faculty Operations**: Course assignments, class coordination, and section management
- **Timetable System**: SPOC-driven class scheduling with faculty and student access

### Attendance & Activity Tracking  
- **Attendance Marking**: Faculty can mark attendance for classes with student-wise tracking
- **Activity Submissions**: Students submit certificates, achievements, and academic records
- **Approval Workflow**: Class coordinators review and approve student activity submissions
- **Document Management**: Google Drive integration for proof and certificate storage

### Dashboard & User Experience
- **Role-Based Dashboards**: Customized interfaces for Admin, University, SPOC, Faculty, and Students
- **Tabbed Navigation**: Organized Faculty Dashboard with Overview, Student Management, Classes, and Approvals
- **Real-Time Updates**: Live attendance tracking and activity approval status
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Technical Features
- **Authentication System**: Secure login with session management and role-based access
- **API Architecture**: RESTful endpoints with proper error handling and validation
- **Database Design**: MongoDB with comprehensive models and relationships
- **File Integration**: React Router for attendance forms and activity management

## Environment Configuration

### Production Setup
- **MongoDB**: Local instance with proper data persistence at /tmp/mongodb
- **Backend Server**: Node.js/Express on port 3001 with session management
- **Frontend**: Vite React server on port 5000 with Replit proxy support
- **API Routing**: Dynamic URL handling for development vs production environments

### Development Features
- **Hot Module Replacement**: Vite HMR for rapid frontend development
- **Nodemon**: Automatic backend restart on file changes
- **CORS Configuration**: Proper cross-origin setup for Replit environment
- **Session Management**: Persistent authentication across page reloads

### Key Technical Achievements
- ✅ **Fixed API Connectivity**: Resolved localhost vs Replit URL issues
- ✅ **React Router Integration**: Attendance forms accessible via URL routing
- ✅ **Database Relationships**: Proper population of MongoDB references
- ✅ **File Upload Handling**: Google Drive integration for document management
- ✅ **Error Handling**: Comprehensive validation and user feedback
- ✅ **Responsive Design**: Mobile-friendly interface with Tailwind CSS