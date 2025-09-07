import express from 'express';
import Attendance from '../models/Attendance.js';
import Timetable from '../models/Timetable.js';
import SectionStudent from '../models/SectionStudent.js';

const router = express.Router();

// Get attendance for a specific class
router.get('/:timetableId', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { timetableId } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    // Get timetable details
    const timetable = await Timetable.findById(timetableId)
      .populate('sectionId', 'name year semester')
      .populate('courseId', 'name code')
      .populate('facultyId', 'name');

    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Get students in the section
    const sectionStudents = await SectionStudent.find({ sectionId: timetable.sectionId })
      .populate('studentId', 'fullName universityRollNo');

    // Get existing attendance record for this date
    let attendance = await Attendance.findOne({ 
      timetableId, 
      date: new Date(date) 
    });

    res.json({ 
      success: true, 
      data: {
        timetable,
        students: sectionStudents,
        attendance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark attendance for a class
router.post('/:timetableId', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { timetableId } = req.params;
    const { date, students } = req.body;

    // Get timetable details
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Calculate counts
    const totalStudents = students.length;
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = totalStudents - presentCount;

    // Create or update attendance record
    const attendanceData = {
      timetableId,
      sectionId: timetable.sectionId,
      courseId: timetable.courseId,
      facultyId: req.user.id,
      date: new Date(date),
      students,
      totalStudents,
      presentCount,
      absentCount
    };

    const attendance = await Attendance.findOneAndUpdate(
      { timetableId, date: new Date(date) },
      attendanceData,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: attendance });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Attendance already marked for this date' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// Get attendance summary for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { studentId } = req.params;
    
    // Get attendance records for the student
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