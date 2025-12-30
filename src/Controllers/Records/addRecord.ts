import { Request, Response } from "express";
import repo from "../../Repositories/records";
import { Record } from "../../types"
import { z } from "zod";

const recordSchema = z.object({
    date: z.string().min(1),
    size: z.number().min(1),
    doctorId: z.string().min(1),
    patientId: z.string().min(1),
});

const addRecord = async (req: Request, res: Response) => {
    const data = req.body;
    const { doctorId, patientId } = req.query;

    const parseResult = recordSchema.safeParse({ ...data, doctorId, patientId });
    if (!parseResult.success)
        return res.status(400).json({ error: parseResult.error });

    const recordData: Record = {
        id: Date.now().toString(),
        date: data.date,
        size: data.size,
        patientId: data.patientId,
        doctorId: data.doctorId,
    };

    try {
        await repo.addRecord(recordData);
        // post record to processing queue to stt in case of future implementation
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to add record' });
    }
    res.status(201).json("Record added successfully");
}

export default addRecord;