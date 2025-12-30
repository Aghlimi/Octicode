import { Patient } from "../types"
import db from '../db/sqlite'

const addPatient = async (patient: Patient) => {
    db.prepare('INSERT INTO patients (id, name, age, address) VALUES (?, ?, ?, ?)')
        .run(patient.id, patient.name, patient.age, patient.address);
}

const getAllPatients = async (): Promise<Patient[]> => {
    return db.prepare('SELECT * FROM patients').all() as Patient[];
}

const findPatientById = async (id: string | undefined): Promise<Patient | null> => {
    return db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as Patient | null;
}

const updatePatient = async (id: string, updatedData: Patient) => {
    db.prepare('UPDATE patients SET name = ?, age = ?, address = ? WHERE id = ?')
        .run(updatedData.name, updatedData.age, updatedData.address, id);
}

const deletePatient = async (id: string) => {
    db.prepare('DELETE FROM patients WHERE id = ?')
        .run(id);
}

export default { addPatient, getAllPatients, findPatientById, updatePatient, deletePatient };