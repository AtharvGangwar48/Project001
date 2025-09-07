import express from 'express';
import Student from '../models/Student.js';
import SectionStudent from '../models/SectionStudent.js';
import Faculty from '../models/Faculty.js';
import Section from '../models/Section.js';

const router = express.Router();

// Get all students managed by the faculty (class coordinator)
router.get('/by-faculty', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Get sections where this faculty is class coordinator
    const facultySections = await Section.find({ 
      classCoordinatorId: req.user.id 
    });

    if (facultySections.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const sectionIds = facultySections.map(s => s._id);

    // Get all students in these sections
    const sectionStudents = await SectionStudent.find({ 
      sectionId: { $in: sectionIds } 
    })
    .populate('studentId', 'fullName studentId universityRollNo email phone username')
    .populate('sectionId', 'name year semester');

    const students = sectionStudents.map(ss => ({
      ...ss.studentId.toObject(),
      section: ss.sectionId,
      sectionRollNo: ss.sectionRollNo
    }));

    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new student account (faculty as class coordinator)
router.post('/create-student', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const {
      fullName,
      studentId,
      universityRollNo,
      email,
      phone,
      username,
      password,
      sectionId
    } = req.body;

    // Get faculty details to inherit university and program
    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    // Verify faculty is class coordinator for the section (if provided)
    if (sectionId) {
      const section = await Section.findOne({ 
        _id: sectionId, 
        classCoordinatorId: req.user.id 
      });
      
      if (!section) {
        return res.status(403).json({ 
          success: false, 
          message: 'You are not the class coordinator for this section' 
        });
      }
    }

    // Create student
    const student = new Student({
      fullName,
      studentId,
      universityRollNo,
      email,
      phone,
      username,
      password,
      universityId: faculty.universityId,
      programId: faculty.programId
    });

    await student.save();

    // Assign to section if provided
    if (sectionId) {
      const sectionStudent = new SectionStudent({
        studentId: student._id,
        sectionId,
        sectionRollNo: studentId, // Use studentId as section roll number
        academicYear: new Date().getFullYear(),
        enrollmentDate: new Date()
      });

      await sectionStudent.save();
    }

    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully',
      data: student 
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ 
        success: false, 
        message: `${field} already exists` 
      });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
});

// Get student attendance summary
router.get('/student-attendance/:studentId', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { studentId } = req.params;

    // Verify faculty has access to this student (is class coordinator)
    const sectionStudent = await SectionStudent.findOne({ studentId })
      .populate('sectionId');

    if (!sectionStudent || sectionStudent.sectionId.classCoordinatorId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have access to this student' 
      });
    }

    // Get attendance records for the student
    const Attendance = (await import('../models/Attendance.js')).default;
    const attendanceRecords = await Attendance.find({
      'students.studentId': studentId
    })
    .populate('courseId', 'name code')
    .populate('timetableId')
    .sort({ date: -1 });

    const summary = attendanceRecords.map(record => {
      const studentAttendance = record.students.find(s => s.studentId.toString() === studentId);
      return {
        date: record.date,
        course: record.courseId,
        status: studentAttendance?.status,
        timetable: record.timetableId
      };
    });

    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;