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
    const event = await Event.findAll({
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
                where: {'organizerId' : userId},
                include: [
                    {
                        model:User, 
                        as: 'Organizer',
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ],
                
            },
            {
                model: Venue,
                attributes:['id','city','state']
            }
        ],
        group: ['Event.id','Images.id','Group.id','Venue.id','Group->Organizer.id']
        });
    res.status(200)
    res.json({Events: event})
    

});


module.exports = router;