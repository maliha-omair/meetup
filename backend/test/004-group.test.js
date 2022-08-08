const request = require('supertest');
const expect = require('chai').expect;
const {faker} = require('@faker-js/faker');
const app = require('../app');
const { Membership } = require('../db/models');

const agent = request.agent(app);

let xsrfToken = null;
let currentUser = null;
let newGroupId = null;

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


describe("/api/groups", function() {
    before(async function () {
        const response1 = await agent.get("/api/csrf/restore");
        xsrfToken = response1.body['XSRF-Token'];
        expect(xsrfToken).to.be.not.null;


        const response = await agent.post("/api/signup")
        .set('XSRF-Token',xsrfToken)
        .set('Accept', 'application/json')
        .send(newUser)
        .expect(200);
        currentUser = response.body;

    });  

    describe("POST /api/groups", function() {   

        it("should create a group", async function() {
            
            const response =  await agent.post("/api/groups")
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newGroup)
            .expect(201);
        
            
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.organizerId).to.eql(currentUser.id);
            expect(response.body.name).to.eql(newGroup.name);
            expect(response.body.about).to.eql(newGroup.about);
            expect(response.body.type).to.eql(newGroup.type);
            expect(response.body.private).to.eql(newGroup.private);
            expect(response.body.city).to.eql(newGroup.city);
            expect(response.body.state).to.eql(newGroup.state);
            expect(response.body).to.have.property('createdAt');
            expect(response.body).to.have.property('updatedAt');
            newGroupId = response.body.id;
        });   

        it("should return bad request on validation errors", async function() {
            
            const newGroup = {
                name: "012356789 012356789 012356789 012356789 012356789 012356789 012356789 012356789",
                about: "012356789",
                type: "InLine",
                private: "Zero",
            };
            const response =  await agent.post("/api/groups")
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newGroup)
            .expect(400);
        
            expect(response.body.message).to.eql("Validation Error");
            expect(response.body.statusCode).to.eql(400);
            expect(response.body.errors).to.be.not.null;
            expect(response.body.errors.name).to.eql('Name must be 60 characters or less');
            expect(response.body.errors.about).to.eql('About must be 50 characters or more');
            expect(response.body.errors.type).to.eql('Type must be \'Online\' or \'In person\'');
            expect(response.body.errors.private).to.eql('Private must be a boolean');
            expect(response.body.errors.city).to.eql('City is required');
            expect(response.body.errors.state).to.eql('State is required');
        });   

    });   

    describe("POST /api/groups/:groupId/image", function() {   

        it("should crate and return a new image for the group specified by id", async function() {
            
            const newImage = {
                url: faker.image.abstract()
            };
            const response =  await agent.post(`/api/groups/${newGroupId}/images`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newImage)
            .expect(200);
        
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.url).to.eql(newImage.url);
            expect(response.body.imageableId).to.eql(newGroupId);
        });   

        it("should return 404 if group does not exist", async function() {
            
            const newImage = {
                url: faker.image.abstract()
            };
            const response =  await agent.post(`/api/groups/99999999/images`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newImage)
            .expect(404);
        
            expect(response.body.message).to.eql('Group couldn\'t be found');
            expect(response.body.statusCode).to.eql(404);
        });   

        it("should return Bad request for validation errors", async function() {
            
            const newImage = {
                
            };
            const response =  await agent.post(`/api/groups/${newGroupId}/images`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newImage)
            .expect(400);

            expect(response.body.message).to.eql('Validation Error');
            expect(response.body.statusCode).to.eql(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.url).to.eql('Url is required');
        });   


    });   

    describe("POST /api/groups/:groupId/venues", function() {   

        it("should crate and return a new venue for the group specified by id", async function() {
            
            const newVenue = {
                address: faker.address.street(),
                city: faker.address.city(),
                state: faker.address.state(),
                lat: parseFloat(faker.address.latitude()),
                lng: parseFloat(faker.address.longitude())
            };
            const response =  await agent.post(`/api/groups/${newGroupId}/venues`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newVenue)
            .expect(200);
        
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.groupId).to.eql(newGroupId);
            expect(response.body.address).to.eql(newVenue.address);
            expect(response.body.city).to.eql(newVenue.city);
            expect(response.body.state).to.eql(newVenue.state);
            expect(response.body.lat).to.eql(newVenue.lat);
            expect(response.body.lng).to.eql(newVenue.lng);
        });   

        it("should return 404 if group does not exist", async function() {
            
            const newVenue = {
                address: faker.address.street(),
                city: faker.address.city(),
                state: faker.address.state(),
                lat: faker.address.latitude(),
                lng: faker.address.longitude()
            };
            const response =  await agent.post(`/api/groups/99999999/venues`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newVenue)
            .expect(404);
        
            expect(response.body.message).to.eql('Group couldn\'t be found');
            expect(response.body.statusCode).to.eql(404);
        });   

        it("should return bad request for validation errors", async function() {
            
            const newVenue = {
                lat: 200,
                lng: -200
            };
            const response =  await agent.post(`/api/groups/${newGroupId}/venues`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newVenue)
            .expect(400);
        
            expect(response.body.message).to.eql('Validation Error');
            expect(response.body.statusCode).to.eql(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.address).to.eql("Street address is required");
            expect(response.body.errors.city).to.eql("City is required");
            expect(response.body.errors.state).to.eql("State is required");
            expect(response.body.errors.lat).to.eql("Latitude is not valid");
            expect(response.body.errors.lng).to.eql("Longitude is not valid");
        });   
    });   




    describe("POST /api/groups/:groupId/members", function() {   
        let csrfResponse = null;
        let member = null;
        const newAgent = request.agent(app);
        before(async function () {
            csrfResponse = await newAgent.get("/api/csrf/restore");
            member = (await newAgent.post("/api/signup")
            .set('XSRF-Token',csrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .send({
                "firstName": faker.name.firstName(),
                "lastName": faker.name.lastName(),
                "email": faker.internet.email(),
                "username": faker.internet.userName(),
                "password": faker.internet.password(12)
            })
            .expect(200)).body;

        });

        it("should request a new membership for a group based on the group's id", async function() {
    
            const response =  await newAgent.post(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',csrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .expect(200);
            
        
            expect(response.body.groupId).to.eql(newGroupId);
            expect(response.body.memberId).to.eql(member.id);
            expect(response.body.status).to.eql("pending");
        });   

        it("should return not found if group does not exists", async function() {
            
            const response =  await newAgent.post(`/api/groups/999999/members`)
            .set('XSRF-Token',csrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .expect(404);
            
        
            expect(response.body.message).to.eql('Group couldn\'t be found');
            expect(response.body.statusCode).to.eql(404);
        });   

        it("should return error if membership is already requested", async function() {
    
            const response =  await newAgent.post(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',csrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .expect(400);
            
        
            expect(response.body.message).to.eql('Membership has already been requested');
            expect(response.body.statusCode).to.eql(400);
            
        });   

        it("should return error if user is already a member", async function() {
    
            const m = await Membership.findOne({
                where: {
                    memberId: member.id,
                    groupId: newGroupId
                }
            });
            m.status = "member";
            await m.save();

            const response =  await newAgent.post(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',csrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .expect(400);
            
        
            expect(response.body.message).to.eql('User is already a member of the group');
            expect(response.body.statusCode).to.eql(400);
            
        });   
    });   

    describe("GET /api/groups/:groupId", function() {   

        it("should get details of a group", async function() {
            const response =  await agent.get(`/api/groups/${newGroupId}`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .expect(200);

            expect(response.body.id).to.be.eql(newGroupId);
            expect(response.body.organizerId).to.be.eql(currentUser.id);
            expect(response.body.name).to.be.eql(newGroup.name);
            expect(response.body.about).to.be.eql(newGroup.about);
            expect(response.body.type).to.be.eql(newGroup.type);
            expect(response.body.city).to.be.eql(newGroup.city);
            expect(response.body.state).to.be.eql(newGroup.state);
            expect(response.body.numMembers).to.be.eql(1);
            expect(response.body.Images).to.be.not.null;
            expect(response.body.Images.length).to.be.eql(1);
            expect(response.body.Organizer).to.be.not.null;
            expect(response.body.Venues.length).to.be.eql(1);
        });



    });


    describe("PUT /api/groups/:groupId/members", function() {   

        let memberCsrfResponse = null;
        let coHostCsrfResponse = null;

        let memberUser = null;
        let coHostUser = null;
        const memberAgent = request.agent(app);
        const coHostAgent = request.agent(app);
        before(async function () {
            memberCsrfResponse = await memberAgent.get("/api/csrf/restore");
            coHostCsrfResponse = await coHostAgent.get("/api/csrf/restore");

            memberUser = (await memberAgent.post("/api/signup")
            .set('XSRF-Token',memberCsrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .send({
                "firstName": faker.name.firstName(),
                "lastName": faker.name.lastName(),
                "email": faker.internet.email(),
                "username": faker.internet.userName(),
                "password": faker.internet.password(12)
            })
            .expect(200)).body;

            coHostUser = (await coHostAgent.post("/api/signup")
            .set('XSRF-Token',coHostCsrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .send({
                "firstName": faker.name.firstName(),
                "lastName": faker.name.lastName(),
                "email": faker.internet.email(),
                "username": faker.internet.userName(),
                "password": faker.internet.password(12)
            })
            .expect(200)).body;

            await Membership.create({
                groupId: newGroupId,
                memberId: memberUser.id,
                status: "pending"
            });

            await Membership.create({
                groupId: newGroupId,
                memberId: coHostUser.id,
                status: "co-host"
            });

        });

        it("should allow organizer to change the status of a membership specified by group's id", async function() {
    
            const response =  await agent.put(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                memberId: memberUser.id,
                status: 'member'
            })
            .expect(200);
            
        
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.groupId).to.eql(newGroupId);
            expect(response.body.memberId).to.eql(memberUser.id);
            expect(response.body.status).to.eql("member");
        });   

        it("should allow organizer to promote member to co-host for a gorup specified by group's id", async function() {
    
            const m = await Membership.findOne({
                where: {
                    memberId: memberUser.id,
                    groupId: newGroupId
                }
            });
            m.status = "pending";
            await m.save();

            const response =  await agent.put(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                memberId: memberUser.id,
                status: 'co-host'
            })
            .expect(200);
            
        
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.groupId).to.eql(newGroupId);
            expect(response.body.memberId).to.eql(memberUser.id);
            expect(response.body.status).to.eql("co-host");
        });   


        it("should not allow changing membership status to pending for a gorup specified by group's id", async function() {
    
            const m = await Membership.findOne({
                where: {
                    memberId: memberUser.id,
                    groupId: newGroupId
                }
            });
            m.status = "member";
            await m.save();

            const response =  await agent.put(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                memberId: memberUser.id,
                status: 'pending'
            });
            
            expect(response.body.message).to.eql('Validation Error');
            expect(response.body.statusCode).to.eql(400);
            expect(response.body.errors).to.not.be.null; 
            expect(response.body.errors.memberId).to.eql("Cannot change a membership status to 'pending'");
        });   


        it("should allow co-host to change the status of a membership specified by group's id", async function() {
    
            const m = await Membership.findOne({
                where: {
                    memberId: memberUser.id,
                    groupId: newGroupId
                }
            });
            m.status = "pending";
            await m.save();

            const response =  await coHostAgent.put(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',coHostCsrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .send({
                memberId: memberUser.id,
                status: 'member'
            })
            .expect(200);
            
        
            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.groupId).to.eql(newGroupId);
            expect(response.body.memberId).to.eql(memberUser.id);
            expect(response.body.status).to.eql("member");
        });   


        it("should return bad request if user could not be found", async function() {
    
            const response =  await agent.put(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                memberId: 999999,
                status: 'member'
            })
            .expect(400);
            
        
            expect(response.body.message).to.eql('Validation Error');
            expect(response.body.statusCode).to.eql(400);
            expect(response.body.errors).to.not.be.null; 
            expect(response.body.errors.memberId).to.eql("User couldn't be found");
        });   

        it("should return not found if group counldn't be found", async function() {
    
            const response =  await agent.put(`/api/groups/9999999/members`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send({
                memberId: memberUser.id,
                status: 'member'
            })
            .expect(404);
            
        
            expect(response.body.message).to.eql('Group couldn\'t be found');
            expect(response.body.statusCode).to.eql(404);

        });   

        it("throw 404 if membership does exist", async function() {
    
            const m = await Membership.findOne({
                where: {
                    memberId: memberUser.id,
                    groupId: newGroupId
                }
            });
            await m.destroy();


            const response =  await coHostAgent.put(`/api/groups/${newGroupId}/members`)
            .set('XSRF-Token',coHostCsrfResponse.body['XSRF-Token'])
            .set('Accept', 'application/json')
            .send({
                memberId: memberUser.id,
                status: 'member'
            })
            .expect(404);
            
        
            expect(response.body.message).to.eql('Membership between the user and the group does not exist');
            expect(response.body.statusCode).to.eql(404);
        });   

    });



    describe("POST /api/groups/:groupId/events", function() {   

        it("should create and return a new event for the group specified by id", async function() {
            
            const newVenue = {
                address: faker.address.street(),
                city: faker.address.city(),
                state: faker.address.state(),
                lat: parseFloat(faker.address.latitude()),
                lng: parseFloat(faker.address.longitude())
            };
            const venueResponse =  await agent.post(`/api/groups/${newGroupId}/venues`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newVenue)
            .expect(200);
        
            const newEvent = {
                venueId: venueResponse.body.id,
                name: faker.lorem.words(3),
                type: 'Online',
                capacity: 10,
                price: faker.commerce.price(max= 100),
                description: faker.lorem.words(10),
                startDate: "2025-11-19T20:00:00.000Z",
                endDate: "2026-11-19T20:00:00.000Z"
            }
            const response =  await agent.post(`/api/groups/${newGroupId}/events`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newEvent)
            .expect(200);


            expect(response.body).to.have.property('id');
            expect(response.body.id).to.be.a('number');
            expect(response.body.groupId).to.eql(newGroupId);
            expect(response.body.name).to.eql(newEvent.name);
            expect(response.body.type).to.eql(newEvent.type);
            expect(response.body.capacity).to.eql(newEvent.capacity);
            expect(response.body.price).to.eql(newEvent.price);
            expect(response.body.description).to.eql(newEvent.description);
            expect(response.body.startDate).to.eql(newEvent.startDate);
            expect(response.body.endDate).to.eql(newEvent.endDate);
        });   

        it("should return 404 if group does not exist", async function() {
            


            const newVenue = {
                address: faker.address.street(),
                city: faker.address.city(),
                state: faker.address.state(),
                lat: parseFloat(faker.address.latitude()),
                lng: parseFloat(faker.address.longitude())
            };
            const venueResponse =  await agent.post(`/api/groups/${newGroupId}/venues`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newVenue)
            .expect(200);
            
            const newEvent = {
                venueId: venueResponse.body.id,
                name: faker.lorem.words(3),
                type: 'Online',
                capacity: 10,
                price: faker.commerce.price(max= 10),
                description: faker.lorem.words(10),
                startDate: faker.date.soon(),
                endDate: faker.date.future()
            }

            const response =  await agent.post(`/api/groups/99999999/events`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newEvent)
            .expect(404);
        
            expect(response.body.message).to.eql('Group couldn\'t be found');
            expect(response.body.statusCode).to.eql(404);
        });   

        it("should return bad request for validation errors", async function() {
            
            const newVenue = {
                address: faker.address.street(),
                city: faker.address.city(),
                state: faker.address.state(),
                lat: parseFloat(faker.address.latitude()),
                lng: parseFloat(faker.address.longitude())
            };
            const venueResponse =  await agent.post(`/api/groups/${newGroupId}/venues`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newVenue)
            .expect(200);
        
            const newEvent = {
                venueId: 99999,
                name: "123",
                type: 'Online2',
                capacity: 2.5,
                price: "test",
                startDate: "2011-11-19 20:00:00",
                endDate: "2010-11-19 20:00:00"
            }
            const response =  await agent.post(`/api/groups/${newGroupId}/events`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newEvent)
            .expect(400);

        
            expect(response.body.message).to.eql('Validation Error');
            expect(response.body.statusCode).to.eql(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.venueId).to.eql("Venue does not exist");
            expect(response.body.errors.name).to.eql("Name must be at least 5 characters");
            expect(response.body.errors.type).to.eql("Type must be Online or In person");
            expect(response.body.errors.price).to.eql("Price is invalid");
            expect(response.body.errors.description).to.eql("Description is required");
            expect(response.body.errors.startDate).to.eql("Start date must be in the future");
            expect(response.body.errors.endDate).to.eql("End date is less than start date");
        });   
    });   



    describe("GET /api/groups/:groupId/events", function() {   

        it("should get all events of the group specified by id", async function() {
            
            const newVenue = {
                address: faker.address.street(),
                city: faker.address.city(),
                state: faker.address.state(),
                lat: parseFloat(faker.address.latitude()),
                lng: parseFloat(faker.address.longitude())
            };
            const venueResponse =  await agent.post(`/api/groups/${newGroupId}/venues`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .send(newVenue)
            .expect(200);
        
            for(let i = 0; i < 5; i++){
                const newEvent = {
                    venueId: venueResponse.body.id,
                    name: faker.lorem.words(3),
                    type: 'Online',
                    capacity: 10,
                    price: faker.commerce.price(max= 100),
                    description: faker.lorem.words(10),
                    startDate: "2025-11-19T20:00:00.000Z",
                    endDate: "2026-11-19T20:00:00.000Z"
                }
                await agent.post(`/api/groups/${newGroupId}/events`)
                .set('XSRF-Token',xsrfToken)
                .set('Accept', 'application/json')
                .send(newEvent)
                .expect(200);
            }


            const response =  await agent.get(`/api/groups/${newGroupId}/events`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .expect(200);

            expect(response.body).to.have.property('Events');
            expect(response.body.Events).to.be.an('array');
            expect(response.body.Events).to.have.lengthOf.at.least(5);
        });   

        it("should return not found if group counldn't be found", async function() {
    
            const response =  await agent.get(`/api/groups/9999999/events`)
            .set('XSRF-Token',xsrfToken)
            .set('Accept', 'application/json')
            .expect(404);
            
        
            expect(response.body.message).to.eql('Group couldn\'t be found');
            expect(response.body.statusCode).to.eql(404);

        });           
    });
});
