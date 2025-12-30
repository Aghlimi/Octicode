import request from 'supertest';
import app from '..';

let doctorId = 1;
let patientId = 1;
describe('Records API', () => {
    let recordId: string | null = null;
    it('should create a new record', async () => {
        const res = await request(app)
            .post(`/api/records/?doctorId=${doctorId}&patientId=${patientId}q`)
            .send({
                date: '2024-01-01',
                size: 100,
                doctorId,
                patientId
            });
        expect(res.status).toBe(201);
    });

    it('should get all records', async () => {
        const res = await request(app)
            .get(`/api/records/?doctorId=${doctorId}&patientId=${patientId}`);
        if(res.status != 200){
            console.error("Error response:", res.body);
        }
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
            recordId = res.body[0].id;
        }
    });
    
    it('should get a record by id', async () => {
        const res = await request(app)
        .get(`/api/records/${recordId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', recordId);
    });
    
    
    it('should delete a record', async () => {
        const res = await request(app)
        .delete(`/api/records/${recordId}`);
        expect(res.status).toBe(204);
    });
    return;
});
