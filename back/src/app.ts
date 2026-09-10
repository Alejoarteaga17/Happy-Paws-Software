import cors from 'cors';
import express from 'express';
import { appointmentRouter } from './routes/appointment.routes';
import { vaccinationRouter } from './routes/vaccination.routes';

export const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_request, response) => response.json({ success: true, data: { status: 'ok' }, error: null }));
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/vaccinations', vaccinationRouter);

if (require.main === module) {
  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => console.log(`Happy Paws API listening on port ${port}`));
}