import request from "supertest";
import app from "..";
let id = "";
describe("Health Check", () => {
    it("should return 200 and status ok", async () => {
        const res = await request(app).get("/up");
        expect(res.status).toBe(200);
        expect(res.text).toBe("Server is up and running");

    });
});

describe("create patient", () => {
    it("should create a new patient", async () => {
        const res = await request(app)
            .post("/api/patients")
            .send({
                name: "John Doe",
                age: 30,
                address: "123 Main St"
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        id = res.body.id;
    });
});

describe("get patients", () => {
    it("should get patients", async () => {
        const res = await request(app)
            .get("/api/patients");
            expect(res.status).toBe(200);
    });
});

describe("get patient", () => {
    it("should get a patient", async () => {
        const res = await request(app)
            .get(`/api/patients/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", id);
    });
});

describe("update patient", () => {
    it("should update a patient", async () => {
        const res = await request(app)
            .put(`/api/patients/${id}`)
            .send({
                name: "Jane Doe",
                age: 25,
                address: "456 Main St"
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Jane Doe");
    });
});

describe("delete patient", () => {
    it("should delete a patient", async () => {
        const res = await request(app)
            .delete("/api/patients/" + id);
        expect(res.status).toBe(204);
    });
});

