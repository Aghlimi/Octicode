import express from 'express';
import recordsController from '../Controllers/Records';
const app = express.Router();

// that important for load balancers and uptime monitors
// in case of we build microservices system in future
app.get('/up', function (req, res) {
    res.send('API is up and running');
});

app.get('/', recordsController.getRecords);
app.get('/:id', recordsController.getRecord);
app.post('/', recordsController.addRecord);
app.delete('/:id', recordsController.deleteRecord);

export default app;