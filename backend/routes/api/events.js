const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { User, Group, Image, Membership, Venue, Event } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const  { isGroup, isCoHost, isOrganizer, notAuthorizedErr, venueNotFoundError,isEvent } = require('../../utils/common');

router.get("/", async (req, res, next) => {
   
    const event = await Event.findAll({
        // attributes: {
        //     include: [

        //         [Sequelize.fn('COUNT', Sequelize.col('Memberships.id')), 'numMembers']
        //     ]
        // },
        include: [
            // {
            //     model: Membership,
            //     attributes: []
            // },
             {
                model: Image,
                attributes: ['id', 'groupId', 'url']
            },
            {
                model: Group,
                attributes:['id','name','city','state']
            },
            {
                model: Venue,
                attributes:['id','city','state']
            }
        ],
        // group: ['Group.id','Images.id']

    })
    res.status(200)
    res.json(event)

});

router.get("/:eventId", async (req, res, next) => {
    const eventId = req.params.eventId;
    if(!(await isEvent(eventId))) return eventNotFoundError(req,res,next)

    const event = await Event.findAll({
        where :{
            id : eventId
        },
        // attributes: {

        //     include: [

        //         [Sequelize.fn('COUNT', Sequelize.col('Memberships.id')), 'numMembers']
        //     ]
        // },
        include: [
            // {
            //     model: Membership,
            //     attributes: []
            // },
             
            {
                model: Group,
                attributes:['id','name','city','state']
            },
            {
                model: Venue,
                attributes:['id','city','state']
            },
            {
                model: Image,
                attributes: ['id', 'groupId', 'url']
            }
        ],
        // group: ['Group.id','Images.id']

    })
    res.status(200)
    res.json(event)

});

function eventNotFoundError(req, _res, next) {
    const err = new Error("Event couldn't be found");
    err.title = 'Not Found';
    err.errors = ['Not Found'];
    err.status = 404;
    return next(err);
}
module.exports = router;