import express from 'express';
import summariesController from '../Controllers/summary';
const app = express.Router();

// that important for load balancers and uptime monitors
// in case of we build microservices system in future
app.get('/up', function (req, res) {
    res.send('API is up and running');
});

app.get('/:id', summariesController.getSummary);
app.get('/', summariesController.getSummaries);
app.delete('/:id', summariesController.deleteSummary);

export default app;