# Fix "Failed to create timetable entry" Error

## Tasks
- [x] Update TimetableForm.tsx to display specific error messages from backend
- [ ] Add client-side validation to prevent duplicate scheduling attempts
- [ ] Test the fix by attempting to schedule a class
- [ ] Verify backend error handling is working correctly

## Details
- Error occurs when submitting timetable form in SPOCDashboard
- Backend returns specific errors like "Time slot already occupied" but frontend shows generic message
- Unique index on Timetable model prevents overlapping classes for same section
