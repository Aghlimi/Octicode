import express, { Request, Response } from 'express';
import Router from './Router/index.js';
import databaseInit from './db/init.js';
import { logger } from './Middlewares/logger.js';
import { rateLimiter } from './Middlewares/rateLimiter.js';

const app = express();
const port = 3000;

app.use(rateLimiter);

app.use(express.json());

app.use(logger);

// that important for load balancers and uptime monitors
app.get('/up', (req, res) => { res.send('Server is up and running') });

app.use('/api', Router);
export default app;


async function startServer() {
  databaseInit();

  await app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer();
