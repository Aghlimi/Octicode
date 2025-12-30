import express from 'express';
import patientsRouter from './patients';
import recordsRouter from './records';
import summariesRouter from './summaries';
const app = express.Router();

app.use('/patients', patientsRouter);
app.use('/records', recordsRouter);
app.use("/summaries",summariesRouter);

export default app;