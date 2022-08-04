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

// router.post("/:eventId/images", requireAuth, async (req, res, next) => {
//     const eventId = req.params.eventId;
//     const { url } = req.body;

//     if (!(await isEvent(eventId))) return eventNotFoundError(req, res, next);
//     if (!(await isOrganizer(groupId, req.user))) return notAuthorizedErr(req, res, next)

//     const event = await Group.findOne({
//         where: {
//             id: eventId,
//             organizerId: req.user.id
//         }
//     });

//     const newImage = await Image.create({
//         url,
//         userId: req.user.id,
//         groupId: req.params.groupId,
//         eventId: null
//     })

//     let result = {}
//     result.id = newImage.id;
//     result.imageableId = parseInt(groupId);
//     result.url = url;
//     res.status(200);
//     res.json(result);
// });


function eventNotFoundError(req, _res, next) {
    const err = new Error("Event couldn't be found");
    err.title = 'Not Found';
    err.errors = ['Not Found'];
    err.status = 404;
    return next(err);
}
module.exports = router;