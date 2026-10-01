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

export const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_request, response) => response.json({ success: true, data: { status: 'ok' }, error: null }));
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/pets', petRouter);
app.use('/api/v1/vaccinations', vaccinationRouter);
app.use('/api/v1/owners', ownerRouter);
app.use('/api/v1/portal', portalRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/audit', auditRouter);
app.use('/api/v1/auth', authRouter);

if (require.main === module) {
  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => console.log(`Happy Paws API listening on port ${port}`));
}
