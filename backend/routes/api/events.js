const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { User, Group, Image, Membership, Venue, Event , Attendee} = require('../../db/models');
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

router.get("/:eventId/attendees",requireAuth, async (req,res,next)=>{

});

router.post("/:eventId/attendees",requireAuth, async (req,res,next)=>{
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    if(!event) return eventNotFoundError(req,res,next);
    if(!(await isMember(event.groupId,req.user))) return notAuthorizedErr(req,res,next);

    const attendee = await Attendee.findOne({
        where: {
            userId: req.user.id,
            eventId: eventId
        }
    })
    if (attendee) {
        if (attendee.status === 'pending') {
            return attendanceAlreadyRequestedErr(req, res, next);
        } else {
            return userAlreadyAttendeeErr(req, res, next);
        }
    }

    const newAttendee = await Attendee.create({
        userId: req.user.id,
        eventId: eventId,
        status: "pending"
    })
    if(newAttendee){
        const result = {
            eventId: eventId,
            userId: req.user.id,
            status: "pending"
        }
        res.status(200);
        res.json(result)

    }else{
        res.json("error")
    }

   
    
});

router.put("/:eventId/attendees", requireAuth, async (req, res, next) => {
    const { userId, status } = req.body;
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    
    const attendee = await Attendee.findOne({
        where:{
            eventId: eventId,
            userId: userId
        }
        
    });
    const user = await User.findByPk(userId);
    if (!user) return userNotFoundError(req, res, next);
    if(!event) return eventNotFoundError(req, res, next);    
    if (!attendee) return attendanceNotFoundErr(req, res, next);    
    if (status === "pending") cannotChangeStatusError(req,res,next);
    const groupId = event.groupId;
    if(!(await isOrganizer(groupId,req.user))) notAuthorizedErr(req,res,next);
    attendee.status = status;
    attendee.save();
    res.status(200);
    res.json(attendee);   
});

function userNotFoundError(req, _res, next) {
    const err = new Error("Validation Error");
    err.title = 'Validation Error';
    err.errors = ["User couldn't be found"];
    err.status = 400;
    return next(err);
}
function cannotChangeStatusError(req, _res, next) {
    const err = new Error("Cannot change an attendance status to pending");
    err.title = 'Validation Error';
    err.errors = ["Cannot change status"];
    err.status = 400;
    return next(err);
}

function attendanceNotFoundErr(req, _res, next) {
    const err = new Error("Attendance between the user and the event does not exist");
    err.title = 'Not Found';
    err.errors = ["Attendance Not Found"];
    err.status = 404;
    return next(err);
}
function userAlreadyAttendeeErr(req, _res, next) {
    const err = new Error("User is already an attendee of the event");
    err.title = 'Bad Request';
    err.errors = ["Already an attendee"];
    err.status = 404;
    return next(err);
}
function attendanceAlreadyRequestedErr(req, _res, next) {
    const err = new Error("Attendance has already been requested");
    err.title = 'Bad Request';
    err.errors = ["Attendance is pending"];
    err.status = 400;
    return next(err);
}

async function isMember(groupId,user){
    const member = await Membership.findAll({
        where:{
            memberId: user.id,
            groupId: groupId
        }
    });
    if(!member || member.length < 1) return false;
    else return true;


}
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