import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, unique: true, trim: true },
  course: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  parentName: { type: String, trim: true, default: '' },
  parentPhone: { type: String, trim: true, default: '' },
  parentEmail: { type: String, lowercase: true, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  photo: { type: String, trim: true, default: '' },
  signature: { type: String, trim: true, default: '' },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
