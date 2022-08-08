const request = require('supertest');
const expect = require("chai").expect;
const app = require('../app');


const agent = request.agent(app);

describe("GET /api/csrf/restore", function() {
    it("should return CSRF token", async function() {
        const response = await agent.get("/api/csrf/restore")
        .expect('Content-Type', /json/)
        .expect(200);
        expect(response.status).to.eql(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.body).to.have.property('XSRF-Token');
        expect(response.body['XSRF-Token']).to.be.a('string');
    });
});