import { Summary } from "../types";
import db from "../db/sqlite";


const addSummary = async (summary: Summary) => {
    db.prepare('INSERT INTO summaries (id, recordId, patientId, doctorId, summaryText) VALUES (?, ?, ?, ?, ?)')
        .run(summary.id, summary.recordId, summary.patientId, summary.doctorId, summary.summaryText);
}

const getAllSummaries = async (doctorId: string, patientId: string): Promise<Summary[]> => {
    return db.prepare('SELECT * FROM summaries').all() as Summary[];
}

const findSummaryById = async (id: string | undefined): Promise<Summary | null> => {
    const summary = db.prepare('SELECT * FROM summaries WHERE id = ?').get(id) as Summary | null;
    return summary || null;
}

const deleteSummary = async (id: string) => {
    db.prepare('DELETE FROM summaries WHERE id = ?')
        .run(id);
}

export default { addSummary, getAllSummaries, findSummaryById, deleteSummary };