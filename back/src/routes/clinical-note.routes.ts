import { Router } from 'express';
import { createClinicalNote, listClinicalNotes, updateClinicalNote } from '../controllers/clinical-note.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const clinicalNoteRouter = Router();
clinicalNoteRouter.use(requireAuth);
clinicalNoteRouter.get('/', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), listClinicalNotes);
clinicalNoteRouter.post('/', requireRoles('ADMIN', 'VET'), createClinicalNote);
clinicalNoteRouter.put('/:id', requireRoles('ADMIN', 'VET'), updateClinicalNote);
