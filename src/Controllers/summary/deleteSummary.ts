import { Request, Response } from "express";
import { z } from "zod";
import repo from "../../Repositories/summaries";

const getSummary = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || !z.string().min(1).safeParse(id).success)
        return res.status(400).json({ error: 'Invalid record ID' });

    repo.deleteSummary(id);

    return res.status(204).send();
}
export default getSummary;
