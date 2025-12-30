import { Record } from "../types";
import fs from "../db/sqlite";
import db from '../db/sqlite';

const addRecord = async (record: Record) => {
    db.prepare('INSERT INTO records (id, date, size, patientId, doctorId) VALUES (?, ?, ?, ?, ?)')
        .run(record.id, record.date, record.size, record.patientId, record.doctorId);
}

const getAllRecords = async (doctorId: string | undefined, patientId: string | undefined): Promise<Record[]> => {
    return db.prepare('SELECT * FROM records').all() as Record[];
}

const findRecordById = async (id: string | undefined): Promise<Record | null> => {
    const record = db.prepare('SELECT * FROM records WHERE id = ?').get(id) as Record | null;
    return record || null;
}

const deleteRecord = async (id: string) => {
    db.prepare('DELETE FROM records WHERE id = ?')
        .run(id);
}

export default { addRecord, getAllRecords, findRecordById, deleteRecord };