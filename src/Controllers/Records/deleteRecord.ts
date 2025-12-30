import { Request, Response } from "express";
import { z } from "zod";
import repo from "../../Repositories/records";

const deleteRecord = (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || typeof id !== 'string' || !z.string().min(1).safeParse(id).success)
        return res.status(400).json({ error: 'Invalid record ID' });

    repo.deleteRecord(id);

    return res.status(204).send();
}

export default deleteRecord;