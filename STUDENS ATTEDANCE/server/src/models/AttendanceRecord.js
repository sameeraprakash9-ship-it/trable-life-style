import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

attendanceRecordSchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model('AttendanceRecord', attendanceRecordSchema);
