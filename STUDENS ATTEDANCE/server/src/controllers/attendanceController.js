import AttendanceRecord from '../models/AttendanceRecord.js';

export const listAttendance = async (request, response) => {
  const date = request.query.date ? new Date(`${request.query.date}T00:00:00.000Z`) : new Date();
  const start = new Date(date); start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1);
  const records = await AttendanceRecord.find({ date: { $gte: start, $lt: end } }).populate('student', 'name rollNo course');
  return response.json({ records });
};

export const upsertAttendance = async (request, response) => {
  const { student, date, status, notes } = request.body;
  if (!student || !date || !status) return response.status(400).json({ message: 'Student, date, and status are required' });
  const record = await AttendanceRecord.findOneAndUpdate({ student, date: new Date(date) }, { student, date: new Date(date), status, notes }, { new: true, upsert: true, runValidators: true });
  return response.json({ record });
};
