import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import University from '../models/University.js';
import SPOC from '../models/SPOC.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

// Admin strategy
passport.use('admin', new LocalStrategy({
  usernameField: 'passcode',
  passwordField: 'passcode'
}, async (passcode, password, done) => {
  if (passcode === 'ADMIN2025') {
    return done(null, { id: 'admin', role: 'admin', username: 'admin' });
  }
  return done(null, false);
}));

// University strategy
passport.use('university', new LocalStrategy(
  async (username, password, done) => {
    try {
      const university = await University.findOne({ username, status: 'approved' });
      if (!university) return done(null, false);
      
      const isMatch = await university.comparePassword(password);
      if (!isMatch) return done(null, false);
      
      return done(null, { 
        id: university._id, 
        role: 'university', 
        username: university.username,
        universityId: university._id 
      });
    } catch (error) {
      return done(error);
    }
  }
));

// SPOC strategy
passport.use('spoc', new LocalStrategy(
  async (username, password, done) => {
    try {
      const spoc = await SPOC.findOne({ username });
      if (!spoc) return done(null, false);
      
      const isMatch = await spoc.comparePassword(password);
      if (!isMatch) return done(null, false);
      
      return done(null, { 
        id: spoc._id, 
        role: 'spoc', 
        username: spoc.username,
        universityId: spoc.universityId,
        programId: spoc.programId 
      });
    } catch (error) {
      return done(error);
    }
  }
));

// Student strategy
passport.use('student', new LocalStrategy(
  async (username, password, done) => {
    try {
      const student = await Student.findOne({ username });
      if (!student) return done(null, false);
      
      const isMatch = await student.comparePassword(password);
      if (!isMatch) return done(null, false);
      
      return done(null, { 
        id: student._id, 
        role: 'student', 
        username: student.username,
        universityId: student.universityId,
        programId: student.programId 
      });
    } catch (error) {
      return done(error);
    }
  }
));

// Faculty strategy
passport.use('faculty', new LocalStrategy({
  usernameField: 'facultyId',
  passwordField: 'password'
}, async (facultyId, password, done) => {
    try {
      const faculty = await Faculty.findOne({ facultyId });
      if (!faculty) return done(null, false);
      
      const isMatch = await faculty.comparePassword(password);
      if (!isMatch) return done(null, false);
      
      return done(null, { 
        id: faculty._id, 
        role: 'faculty', 
        facultyId: faculty.facultyId,
        name: faculty.name,
        universityId: faculty.universityId,
        programId: faculty.programId 
      });
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;