import { Request, Response } from "express";
import { z } from "zod";
import { Patient } from "../../types";
import repo from "../../Repositories/patients";

const updatePatient = async (req: Request, res: Response) => {
    const id = req.params.id;
    const patientData = req.body;

    if (typeof id !== "string" || !z.string().min(1).safeParse(id).success)
        return res.status(400).send('Invalid ID');

    const patientSchema = z.object({
        name: z.string().min(1).optional(),
        age: z.number().min(0).optional(),
        address: z.string().min(1).optional()
    });

    const parseResult = patientSchema.safeParse(patientData);
    if (!parseResult.success)
        return res.status(400).send('Invalid patient data');

    try {
        const existingPatient: Patient | null = await repo.findPatientById(id);

        if (!existingPatient)
            return res.status(404).send('Patient not found');

        const newPatientData: Patient = { id, ...parseResult.data } as Patient;

        await repo.updatePatient(id, newPatientData);

        res.send(newPatientData);
    }
    catch (e) {
        res.status(500).send('Error updating patient');
    }
}

export default updatePatient;