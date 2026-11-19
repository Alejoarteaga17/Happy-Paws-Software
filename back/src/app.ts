import cors from 'cors';
import express from 'express';
import { appointmentRouter } from './routes/appointment.routes';
import { petRouter } from './routes/pet.routes';
import { vaccinationRouter } from './routes/vaccination.routes';
import { ownerRouter } from './routes/owner.routes';
import { portalRouter } from './routes/portal.routes';
import { userRouter } from './routes/user.routes';
import { auditRouter } from './routes/audit.routes';
import { authRouter } from './routes/auth.routes';
import { clinicalNoteRouter } from './routes/clinical-note.routes';
import { searchRouter } from './routes/search.routes';
import { rejectUnsafeInput } from './middlewares/input-security.middleware';
import { corsOptions } from './config/cors';

export const app = express();
app.use(cors(corsOptions));
app.use(express.json({ limit: '100kb' }));
app.use(rejectUnsafeInput);
app.use((_request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'no-referrer');
  next();
});
app.get('/health', (_request, response) => response.json({ success: true, data: { status: 'ok' }, error: null }));
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/pets', petRouter);
app.use('/api/v1/vaccinations', vaccinationRouter);
app.use('/api/v1/owners', ownerRouter);
app.use('/api/v1/portal', portalRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/audit', auditRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clinical-notes', clinicalNoteRouter);
app.use('/api/v1/search', searchRouter);

if (require.main === module) {
  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => console.log(`Happy Paws API listening on port ${port}`));
}
