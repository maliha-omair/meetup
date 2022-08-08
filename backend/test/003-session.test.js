const request = require('supertest');
const expect = require('chai').expect;
const {faker} = require('@faker-js/faker');
const app = require('../app');


const agent = request.agent(app);
var xsrfToken = null;

const newUser = {
    "firstName": faker.name.firstName(),
    "lastName": faker.name.lastName(),
    "email": faker.internet.email(),
    "username": faker.internet.userName(),
    "password": faker.internet.password(12)
};

describe("/api/session", function() {
    before(async function () {
        const response = await agent.get("/api/csrf/restore");
        xsrfToken = response.body['XSRF-Token'];
        expect(xsrfToken).to.be.not.null;


        await agent.post("/api/signup")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newUser)
        .expect(200);

    });  

    describe("POST /api/session", function() {   

        it("should log in the user using email", async function() {
            
            const response =  await agent.post("/api/session")
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                "credential": newUser.email,
                "password": newUser.password
            })
            .expect(200);
        
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.firstName).to.eql(newUser.firstName);
            expect(response.body.lastName).to.eql(newUser.lastName);
            expect(response.body.email).to.eql(newUser.email);
            expect(response.body).to.not.have.property('username');
            expect(response.body).to.not.have.property('password');
            expect(response.body).to.have.property('token');
            expect(response.body.token).to.be.a('string');
        });

        it("should log in the user using username", async function() {
            
            const response =  await agent.post("/api/session")
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                "credential": newUser.username,
                "password": newUser.password
            })
            .expect(200);
        
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.firstName).to.eql(newUser.firstName);
            expect(response.body.lastName).to.eql(newUser.lastName);
            expect(response.body.email).to.eql(newUser.email);
            expect(response.body).to.not.have.property('username');
            expect(response.body).to.not.have.property('password');
            expect(response.body).to.have.property('token');
            expect(response.body.token).to.be.a('string');
        });
        
    
    });

    describe("GET /api/session", function() {
        
        it("should return current user", async function() {
            
            const response =  await agent.post("/api/session")
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                "credential": newUser.email,
                "password": newUser.password
            })
            .expect(200);
        
            const response2 = await agent.get("/api/session")
            .expect(200);

           
            expect(response2.body).to.have.property('id');
            expect(response2.body.id).to.be.a('number');
            expect(response2.body.firstName).to.eql(newUser.firstName);
            expect(response2.body.lastName).to.eql(newUser.lastName);
            expect(response2.body.email).to.eql(newUser.email);
            expect(response2.body).to.not.have.property('username');
            expect(response2.body).to.not.have.property('password');
            expect(response2.body).to.not.have.property('token');
            
        });
        
        describe("DELETE /api/session", function() {
        
            it("should logout current user", async function() {
                
                const response =  await agent.post("/api/session")
                .set('XSRF-Token',xsrfToken)
                .set('Accept', 'application/json')
                .send({
                    "credential": newUser.email,
                    "password": newUser.password
                })
                .expect(200);
            
                const response2 = await agent.delete("/api/session")
                .set('XSRF-Token',xsrfToken)
                .expect(200);
                
                expect(response2.body.message).to.eql("success");
                
               
                
            });
        });
    
    });
});
