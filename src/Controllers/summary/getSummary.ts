import { Request, Response } from "express";
import { z } from "zod";
import repo from "../../Repositories/summaries";

const getSummary = async (req: Request, res: Response) => {

    const id = req.params.id;
    if (!id || typeof id !== 'string' || !z.string().min(1).safeParse(id).success)
        return res.status(400).json({ error: 'Invalid record ID' });

    try {
        const summary = await repo.findSummaryById(id);
        if (!summary)
            return res.status(404).json({ error: 'Summary not found' });

        return res.status(200).json(summary);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve summary' });
    }
}

export default getSummary;
