// backend/routes/api/session.js
const { Sequelize } = require('sequelize')
const express = require('express');
const { requireAuth } = require('../../utils/auth');

const { User, Group, Image, Membership, Venue, Event , Attendee} = require('../../db/models');

const router = express.Router();


router.get("/", async (req, res, next) => {

    const userId = req.body;
    const user = await User.findByPk(userId)        
    
    res.status(200)
    res.json(user)

});

router.get("/events", requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const group = await Group.findOne({
        where:{
            organizerId: userId
        }
    })
    if(group) {
        const event = await Event.findAll({
            where :{
                groupId :group.id
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
                    model: Image,
                    attributes: ['id', 'groupId', 'url']
                },
                {
                    model: Group,
                    attributes:['id','name','city','state','organizerId'],
                    include: [
                        {
                            model:User, 
                            as: 'Organizer',
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    ]
                },
                {
                    model: Venue,
                    attributes:['id','city','state']
                }
            ],
            group: ['Event.id','Images.id','Group.id','Venue.id']
        })
        res.status(200)
        res.json({Events: event})
    }else {
        res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
        })
    }
    

});


module.exports = router;