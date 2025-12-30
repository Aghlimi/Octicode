import { Request, Response } from "express";
import { z } from "zod";
import repo from "../../Repositories/records";
import { tr } from "zod/locales";

const getRecord = async (req: Request, res: Response) => {

    const id = req.params.id;
    if (!id || typeof id !== 'string' || !z.string().min(1).safeParse(id).success)
        return res.status(400).json({ error: 'Invalid record ID' });

    try {
        const record = await repo.findRecordById(id);
        if (!record)
            return res.status(404).json({ error: 'Record not found' });

        return res.status(200).json(record);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve record' });
    }
}

export default getRecord;