import { Request, Response } from "express";
import { z } from "zod";
import { Patient } from "../../types";
import repo from "../../Repositories/patients";

const getPatient =  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!z.string().min(1).safeParse(id).success)
        return res.status(400).send('Invalid ID');

    try {

        const patient: Patient | null = await repo.findPatientById(id);

        if (!patient) 
            return res.status(404).send('Patient not found');

        res.send(patient);
    }
    catch (e) {
        res.status(500).send('Error retrieving patient');
    }
}

export default getPatient;