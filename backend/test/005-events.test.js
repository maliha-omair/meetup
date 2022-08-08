const request = require('supertest');
const expect = require('chai').expect;
const {faker} = require('@faker-js/faker');
const app = require('../app');
const { Attendee, Membership } = require('../db/models');

const agent = request.agent(app);


let xsrfToken = null;
let currentUser = null;
let currentGroup = null;
let currentVenue = null;

const newUser = {
    "firstName": faker.name.firstName(),
    "lastName": faker.name.lastName(),
    "email": faker.internet.email(),
    "username": faker.internet.userName(),
    "password": faker.internet.password(12)
};

const newGroup = {
    name: faker.random.words(3),
    about: faker.lorem.words(70),
    type: "In person",
    private: true,
    city: faker.address.cityName(),
    state: faker.address.state()
};

const newVenue = {
    address: faker.address.street(),
    city: faker.address.city(),
    state: faker.address.state(),
    lat: parseFloat(faker.address.latitude()),
    lng: parseFloat(faker.address.longitude())
};


describe("/api/events", function() {
    before(async function () {
        const response1 = await agent.get("/api/csrf/restore");
        xsrfToken = response1.body['XSRF-Token'];
        expect(xsrfToken).to.be.not.null;


        const responseSignup = await agent.post("/api/signup")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newUser)
        .expect(200);
        currentUser = responseSignup.body;

        const responseGroup =  await agent.post("/api/groups")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newGroup)
        .expect(201);
        currentGroup = responseGroup.body;

        const venueResponse =  await agent.post(`/api/groups/${currentGroup.id}/venues`)
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newVenue)
        .expect(200);
        currentVenue = venueResponse.body;

    });  

    describe("POST /api/events/:eventId/images", function() {   
        let currentEvent = null;

        before( async function() {
            const newEvent = {
                venueId: currentVenue.id,
                name: faker.lorem.words(3),
                type: 'Online',
                capacity: 10,
                price: faker.commerce.price(max= 100),
                description: faker.lorem.words(10),
                startDate: "2025-11-19T20:00:00.000Z",
                endDate: "2026-11-19T20:00:00.000Z"
            }
            const response =  await agent.post(`/api/groups/${currentGroup.id}/events`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newEvent)
            .expect(200);

            currentEvent = response.body;
        });

        it("should throw error if current user is not attendee and tries to add new image to the event", async function() {
            const newImage = {
                url: faker.image.abstract()
            }
            const response =  await agent.post(`/api/events/${currentEvent.id}/images`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newImage)
            .expect(403);


        });

        it("should add new image to the event if current user is attendee", async function() {

            await Attendee.create({
                userId: currentUser.id,
                eventId: currentEvent.id,
                status: "member"
            });


            const newImage = {
                url: faker.image.abstract()
            }
            const response =  await agent.post(`/api/events/${currentEvent.id}/images`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newImage)
            .expect(200);
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.url).to.eql(newImage.url);
            expect(response.body.imageableId).to.eql(currentEvent.id);

        });

    });

    describe("GET /api/events", function() {   
        let currentEvent = null;

        before( async function() {
            for(let i=0; i< 20; i++)
            {
                const newEvent = {
                    venueId: currentVenue.id,
                    name: faker.lorem.words(3),
                    type: 'Online',
                    capacity: 10,
                    price: faker.commerce.price(max= 100),
                    description: faker.lorem.words(10),
                    startDate: "2025-11-19T20:00:00.000Z",
                    endDate: "2026-11-19T20:00:00.000Z"
                }
                const response =  await agent.post(`/api/groups/${currentGroup.id}/events`)
                .set('XSRF-Token',xsrfToken)
                .set('Accept', 'application/json')
                .send(newEvent)
                .expect(200);
            }
        });

        it("should list events", async function() {
            const response =  await agent.get(`/api/events?page=0&size=5`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .expect(200);
            expect(response.body.Events).to.have.lengthOf(5);

        });

    });


    describe("POST /api/events/:eventId/attendance", function() {   
        let currentEvent = null;
        let agent2 = request.agent(app)
        let localXsrfToken  = null;
        let localUser  = null;
        before( async function() {
            const newEvent = {
                venueId: currentVenue.id,
                name: faker.lorem.words(3),
                type: 'Online',
                capacity: 10,
                price: faker.commerce.price(max= 100),
                description: faker.lorem.words(10),
                startDate: "2025-11-19T20:00:00.000Z",
                endDate: "2026-11-19T20:00:00.000Z"
            }
            const response =  await agent.post(`/api/groups/${currentGroup.id}/events`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newEvent)
            .expect(200);
            currentEvent = response.body

            const response1 = await agent2.get("/api/csrf/restore");
            localXsrfToken = response1.body['XSRF-Token'];
            expect(localXsrfToken).to.be.not.null;
    
   
            
            const responseSignup = await agent2.post("/api/signup")
            .set('XSRF-Token',localXsrfToken)
            .set('Accept', 'application/json')
            .send({
                "firstName": faker.name.firstName(),
                "lastName": faker.name.lastName(),
                "email": faker.internet.email(),
                "username": faker.internet.userName(),
                "password": faker.internet.password(12)
            })
            .expect(200);
            localUser = responseSignup.body;
    

            await Membership.create({
                groupId: currentGroup.id,
                memberId: localUser.id,
                status: 'pending'
            });
        });

        it("should add current user as attenee to event", async function() {

            const response =  await agent2.post(`/api/events/${currentEvent.id}/attendees`)
            .set('XSRF-Token',localXsrfToken)
            .set('Accept', 'application/json')
            .expect(200);
            console.log(response.body);            
            
            expect(response.body.eventId).to.be.eql(currentEvent.id);
            expect(response.body.userId).to.be.eql(localUser.id);
            expect(response.body.status).to.be.eql('pending');

        });

    });

});