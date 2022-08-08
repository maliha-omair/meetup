const request = require('supertest');
const expect = require('chai').expect;
const {faker} = require('@faker-js/faker');
const app = require('../app');


const agent = request.agent(app);
var xsrfToken = null;

describe("POST /api/signup", function() {
    before(async function () {
        const response = await agent.get("/api/csrf/restore");
        xsrfToken = response.body['XSRF-Token'];
        expect(xsrfToken).to.be.not.null;
    });

    it("creates new user", async function() {
        const newUser = {
            "firstName": faker.name.firstName(),
            "lastName": faker.name.lastName(),
            "email": faker.internet.email(),
            "username": faker.internet.userName(),
            "password": faker.internet.password(12)
          };

        const response = await agent.post("/api/signup")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newUser);
         
        
        expect(response.status).to.eql(200);
        expect(response.body.firstName).to.eql(newUser.firstName);
        expect(response.body.lastName).to.eql(newUser.lastName);
        expect(response.body.email).to.eql(newUser.email);
        expect(response.body).to.not.have.property('username');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('token');
        expect(response.body.token).to.be.a('string');
    });

    it("should throw error on dublicate signup", async function() {
        const newUser = {
            "firstName": faker.name.firstName(),
            "lastName": faker.name.lastName(),
            "email": faker.internet.email(),
            "username": faker.internet.userName(),
            "password": faker.internet.password(12)
          };
        const dublicateUser = {
            "firstName": faker.name.firstName(),
            "lastName": faker.name.lastName(),
            "email": newUser.email,
            "username": faker.internet.userName(),
            "password": faker.internet.password(12)
        };
        const response1 = await agent.post("/api/signup")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newUser)
        .expect(200);
        
        const response2 = await agent.post("/api/signup")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(dublicateUser)
        .expect(403);

       
        expect(response2.body.message).to.eql("User already exists");
        expect(response2.body.statusCode).to.eql(403);
        expect(response2.body.errors).to.not.be.null;
        expect(response2.body.errors.email).to.eql('User with that email already exists');
        
    });

    it("should throw bad request on validation errors", async function() {
        const newUser = {
            
            "email": "fakeemail",
            "username": faker.internet.userName(),
            "password": faker.internet.password(12)
          };

        const response = await agent.post("/api/signup")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newUser);
         
        
        expect(response.status).to.eql(400);
        expect(response.body.message).to.eql("Validation Error");
        expect(response.body.statusCode).to.eql(400);
        expect(response.body.errors).to.not.be.null;
        expect(response.body.errors.email).to.eql("Invalid email");
        expect(response.body.errors.firstName).to.eql("First Name is required");
        expect(response.body.errors.lastName).to.eql("Last Name is required");
    });
});