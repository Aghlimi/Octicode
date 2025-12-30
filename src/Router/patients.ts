import express, { type Request, type Response } from "express";
import Patients from "../Controllers/Patients";
const app = express.Router();

// that important for load balancers and uptime monitors
// in case of we build microservices system in future

app.get('/up', function (req, res) {
    res.send('API is up and running');
});

app.get('/', Patients.getPatients);
app.post('/', Patients.addPatient);
app.put('/:id', Patients.updatePatient);
app.delete('/:id', Patients.deletePatient);
app.get('/:id', Patients.getPatient);

export default app;