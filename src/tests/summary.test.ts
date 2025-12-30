import request from 'supertest';
import app from '..';

let summaryId = '';
let patientId = 1;
let doctorId = 1;

describe('Summary API', () => {

    let summaryId: string | null = null;

    it("should  fetch all summaries for a doctor and patient", async () => {
        const res = await request(app)
            .get(`/api/summaries?doctorId=${doctorId}&patientId=${patientId}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
            summaryId = res.body[0].id;
        }
    });

    it('should get a summary by id', async () => {
        const res = await request(app)
            .get(`/api/summaries/${summaryId}`);
        expect(res.status).toBe(summaryId !== null ? 200 : 404);
        if (summaryId === null) return;
        expect(res.body).toHaveProperty('id', summaryId);
    });

    if (summaryId !== null) {
        it('should delete a summary', async () => {
            const res = await request(app)
                .delete(`/api/summaries/${summaryId}`);
            expect(res.status).toBe(204);
        });
    }
});
