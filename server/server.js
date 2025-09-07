import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import passport from './config/passport.js';

// Routes
import authRoutes from './routes/auth.js';
import universityRoutes from './routes/universities.js';
import programRoutes from './routes/programs.js';
import spocRoutes from './routes/spocs.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import sectionRoutes from './routes/sections.js';
import facultyRoutes from './routes/faculty.js';
import sectionCourseRoutes from './routes/sectionCourses.js';
import studentDetailsRoutes from './routes/studentDetails.js';
import sectionStudentRoutes from './routes/sectionStudents.js';
import timetableRoutes from './routes/timetable.js';
import reportRoutes from './routes/reports.js';
import metricsRoutes from './routes/metrics.js';
import classScheduleRoutes from './routes/classSchedule.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 12 * 60 * 60 * 1000 // 12 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/spocs', spocRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/section-courses', sectionCourseRoutes);
app.use('/api/student-details', studentDetailsRoutes);
app.use('/api/section-students', sectionStudentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/class-schedule', classScheduleRoutes);

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on localhost:${PORT}`);
});