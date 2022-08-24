const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { User, Group, Image, Membership, Venue, Event , Attendee} = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { Op, Sequelize} = require('sequelize')
const  { isGroup, isCoHost, isOrganizer, notAuthorizedErr, venueNotFoundError,isEvent } = require('../../utils/common');
const { route } = require('./session');

const validateQueryParams = [
    check('page')
        .optional()
        .isNumeric()
        .isInt({ min: 0, max: 10 })
        .withMessage('Page must be greater than or equal to 0'),
    check('size')
        .optional()
        .isInt({ min: 0, max: 20 })
        .withMessage('About must be 50 characters or more'),
    check('name')
        .optional()
        .isString()
        .withMessage("Name must be a string"),
    check('type')
        .optional()
        .isString()
        .isIn(['In person', 'Online'])
        .withMessage("Type must be 'Online' or 'In Person'"),
    check('startDate')
        .optional()
        .isISO8601('yyyy-mm-dd')
        .withMessage("Start date must be a valid datetime"),
    
    handleValidationErrors
];

const validateUpdateEvent = [
    check('venueId')
        .custom((value, {req}) => {
            
                   return Venue.findAll({
                        where : {id: value}
                    }).then(venue => {
                        if (venue.length <= 0) {
                            return Promise.reject('Venue does not exist')
                        }
                    })              
        }),       
    
    check('name')
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        .isIn(['Online', 'In person'])
        .withMessage('Type must be Online or In person'),
    check('capacity')
        .isNumeric()
        .withMessage("Capacity must be an integer"),
    check('price')
        .isNumeric()
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: false })
        .withMessage("Description is required"),
    check('startDate')
        .isISO8601()
        .isAfter()
        .withMessage("Start date must be in the future"),
    check('endDate')
        .isISO8601()
    .custom((value, {req}) =>{
            if(new Date(value) <= new Date(req.body.startDate)) throw new Error('End date is less than start date')
            return true;
        })
        ,
        
    handleValidationErrors
];



router.get("/", validateQueryParams, async (req, res, next) => {
   
    let { page, size, name, type, startDate} = req.query;
    
    
    
    if(!page) page =0
    if(!size) size =20
    
    let pagination = {}
    let where = {}
    if(name)where.name = name
    if(type) where.type= type
    if(startDate)where.startDate = startDate

    pagination.limit = size
    pagination.offset = size * (page )
    
    const events = await Event.findAll({
       
       
        include: [
            
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
            },
            
        ],
        
        where,
         ...pagination
     

    });
    for(let i=0; i<events.length; i++){
        events[i] = events[i].toJSON();
        events[i].numAttending = await Attendee.count({
            where:{
                eventId : events[i].id
            }
        })
    }
    const result = {};
    result.Events = events
    res.status(200)
    res.json(result)

});

router.delete("/:eventId", requireAuth, async (req,res,next)=>{
    const eventId = req.params.eventId
    if(!(await isEvent(eventId))) return eventNotFoundError(req,res,next)

    const event = await Event.findByPk(eventId)
    if(event){
        event.destroy();
        res.status(200);
        res.json({
            "message": "Successfully deleted"
        });
    }
});


router.put("/:eventId", requireAuth,validateUpdateEvent, async (req,res,next)=>{
    const eventId = parseInt(req.params.eventId);
    const {venueId,name,type,capacity,price,description,startDate,endDate} = req.body
    const e = await Event.findByPk(eventId);
    if(!e) return eventNotFoundError(req, res, next);
    const group = await e.getGroup();
    if ((await isOrganizer(group.id, req.user) ) || (await isCoHost(group.id, req.user))) {
        e.venueId = venueId;
        e.name = name;
        e.description =description;
        e.type =type;
        e.capacity =capacity;
        e.price =price;
        e.startDate =startDate;
        e.endDate =endDate;
        await e.save();
        res.status(200);
        res.json(e);

    } else {
        return notAuthorizedErr(req, res, next)
    }
    
});

router.get("/:eventId", async (req, res, next) => {
    const eventId = req.params.eventId;
    if(!(await isEvent(eventId))) return eventNotFoundError(req,res,next)

    const event = await Event.findAll({
        where :{
            id : eventId
        },      
        attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('Attendees.id')), 'numAttending']
                ]
            },
        include: [
            {
                model: Attendee,
                attributes: []
            },
             
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
        group: ['Event.id','Images.id','Group.id','Venue.id']
    })
    res.status(200)
    res.json(event)

});

router.get("/:eventId/attendees", async (req,res,next)=>{
    const eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId);
    
    if(!event) return eventNotFoundError(req,res,next);

    const groupId = event.groupId;


    if((await isOrganizer(groupId,req.user)) || ((await isCoHost(groupId,req.user)))){
        const attendance = await Attendee.findAll({
            where: {
                eventId: eventId               
            },
            attributes: ['eventId','userId','status']
        });
        res.status(200);
        res.json(attendance);
    }else if(!(await isOrganizer(groupId,req.user)) || (!(await isCoHost(groupId,req.user)))){
        const attendance = await Attendee.findAll({
            
            where: {
                eventId: eventId,
                status: {
                    [Op.notIn]: ['pending']
                }
            },
            attributes: ['eventId','userId','status']
        });
        res.status(200);
        res.json(attendance);
    }

});

router.delete("/:eventId/attendees", requireAuth, async (req,res,next)=>{
    const eventId = parseInt(req.params.eventId)
   
    const userId = req.body.userId;

    const event = await Event.findByPk(eventId)
    if(!event) return eventNotFoundError(req,res,next);

    const attendance = await Attendee.findOne({
        where:{
            eventId: eventId,
            userId : userId
        }        
    });

    
    if(!attendance) return attendanceNotFoundErr(req,res,next)

    const groupId = attendance.groupId;
    if((req.user.id === attendance.userId) || (await isOrganizer(groupId,req.user) || (await isCoHost(groupId,req.user)))){
        await attendance.destroy();
        res.status(200);
        res.json({
            "message": "Successfully deleted attendance from event"
        })
    }else{
        return notUserOrOrganizerErr(req,res,next)
    }
});

router.post("/:eventId/attendees",requireAuth, async (req,res,next)=>{
    const eventId = parseInt(req.params.eventId);
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
    });
    if(newAttendee){
        const result = {
            eventId: newAttendee.eventId,
            userId: newAttendee.userId,
            status: newAttendee.status
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
    if(!(await isOrganizer(groupId,req.user)) && !(await isCoHost(groupId,user))) notAuthorizedErr(req,res,next);
    attendee.status = status;
    attendee.save();
    res.status(200);
    res.json(attendee);   
});

router.post("/:eventId/images", requireAuth, async(req,res,next)=>{
    const eventId = parseInt(req.params.eventId);
    const url = req.body.url;
    if(!(await isEvent(eventId))) return eventNotFoundError(req,res,next);
    const attendee = await Attendee.findOne({
        where:{
            eventId:eventId,
            userId:req.user.id,
        }
    });
    if(!attendee) return notAuthorizedErr(req,res,next);
    
    const image = await Image.create({
        url:url,
        userId: req.user.id,
        groupId: null,
        eventId: eventId
    })
    res.status(200)
    res.json({
        id:image.id,
        imageableId: eventId,
        url: image.url
    })   
    
});

function notUserOrOrganizerErr(req, _res, next) {
    const err = new Error("Only the User or organizer may delete an Attendance");
    err.title = 'Forbidden';
    err.errors = ["not authorized"];
    err.status = 403;
    return next(err);
}
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
function eventNotFoundError(req, _res, next) {
    const err = new Error("Event couldn't be found");
    err.title = 'Not Found';
    err.errors = ['Not Found'];
    err.status = 404;
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



module.exports = router;