import Student from '../models/Student.js';

export const listStudents = async (request, response) => {
  const page = Math.max(Number(request.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(request.query.limit) || 10, 1), 100);
  const search = request.query.search?.trim();
  const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { rollNo: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
  const [students, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Student.countDocuments(filter),
  ]);
  return response.json({ students, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

export const createStudent = async (request, response) => {
  const required = ['name', 'email', 'phone', 'rollNo', 'course', 'year'];
  if (required.some((field) => !request.body[field])) return response.status(400).json({ message: 'Name, email, phone, rollNo, course, and year are required' });
  const student = await Student.create(request.body);
  return response.status(201).json({ student });
};

export const updateStudent = async (request, response) => {
  const student = await Student.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  if (!student) return response.status(404).json({ message: 'Student not found' });
  return response.json({ student });
};

export const deleteStudent = async (request, response) => {
  const student = await Student.findByIdAndDelete(request.params.id);
  if (!student) return response.status(404).json({ message: 'Student not found' });
  return response.json({ message: 'Student deleted' });
};
