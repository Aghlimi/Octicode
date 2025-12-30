import { Request, Response } from "express";
import repo from "../../Repositories/patients";

const getPatients = async (req: Request, res: Response) => {
    try {
        const patients = await repo.getAllPatients();
        return res.json(patients);
    }
    catch (e: any) {
        console.error("Error fetching patients:", e);
        return res.status(200).json([]);
    }

}

export default getPatients;