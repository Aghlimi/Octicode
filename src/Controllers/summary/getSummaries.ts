
import { Request, Response } from "express";
import repo from "../../Repositories/summaries";
import { z } from "zod";

const getSummaries = async (req: Request, res: Response) => {
    const { doctorId, patientId } = req.query;

    const parseResult = z.object({
        doctorId: z.string().min(1),
        patientId: z.string().min(1),
    }).safeParse({ doctorId, patientId });


    if (parseResult.success === false || !doctorId || !patientId)
        return res.status(400).json({ error: 'Invalid doctorId or patientId' });
    if (typeof doctorId !== 'string' || typeof patientId !== 'string')
        return res.status(400).json({ error: 'doctorId and patientId must be strings' });

    try {
        const summaries = await repo.getAllSummaries(doctorId, patientId);
        if (!summaries)
            return res.status(404).json({ error: 'No summaries found' });

        res.send(summaries);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve summaries' });
    }
}

export default getSummaries;
