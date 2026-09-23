import { Router } from 'express';
import { createStudent, deleteStudent, listStudents, updateStudent } from '../controllers/studentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listStudents);
router.post('/', createStudent);
router.patch('/:id', updateStudent);
router.delete('/:id', deleteStudent);
export default router;
