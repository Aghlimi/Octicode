import { Request, Response } from "express";
import { z } from "zod";
import { Patient } from "../../types";
import repo from "../../Repositories/patients";

const patientSchema = z.object({
    name: z.string().min(1),
    age: z.number().min(0),
    address: z.string().min(1)
});

const safeResponse = (res: Response, newPatient: Patient) => {

    try { repo.addPatient(newPatient); }

    catch (e) { return res.status(422).send('Error adding patient'); }

    return res.status(201).send(newPatient);
}

const addPatient = async (req: Request, res: Response) => {

    if (!patientSchema.safeParse(req.body).success)
        return res.status(400).send('Invalid patient data');

    const newPatient: Patient = { id: Date.now().toString(), ...req.body };

    return safeResponse(res, newPatient);
}

export default addPatient;