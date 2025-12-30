import { Request, Response } from "express";
import z from "zod";
import repo from "../../Repositories/patients";    

const deletePatient = async (req: Request, res: Response) => {
    const id = req.params.id;

    if(!id || typeof id !== 'string' || !z.string().min(1).safeParse(id).success) 
        return res.status(400).send('Invalid ID');

    try {

        await repo.deletePatient(id);

        res.status(204).send();
    }
    catch (e) {
        res.status(500).send('Error deleting patient');
    }
}

export default deletePatient;