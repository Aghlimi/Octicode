import { Request, Response } from "express";
import repo from "../../Repositories/records";
import { z } from "zod";
const getRecords = async (req: Request, res: Response) => {

    const { doctorId, patientId } = req.query;

    const parseResult = z.object({
        doctorId: z.string().min(1),
        patientId: z.string().min(1),
    }).safeParse({ doctorId, patientId });

    if (parseResult.success === false)
        return res.status(400).json({ error: 'Invalid doctorId or patientId' });

    try {
        const records = await repo.getAllRecords(doctorId, patientId);
        if (!records)
            return res.status(404).json({ error: 'No records found' });

        res.send(records);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve records' });
    }
}

export default getRecords;