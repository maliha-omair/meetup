const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { User, Group, Image, Membership, Venue, Event } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const  { isGroup, isCoHost, isOrganizer, notAuthorizedErr, venueNotFoundError,isEvent } = require('../../utils/common');
// const group = require("./groups")


const validateVenueUpdate = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];

function venueIsInUse(req, _res, next) {
    const err = new Error("Cannot delete, as an event is happening at this venue");
    err.title = 'Bad Request';
    err.errors = ["Cannot delete, as an event is happening at this Venue"];
    err.status = 400;
    return next(err);
}
router.put("/:venueId", requireAuth,validateVenueUpdate, async (req, res, next) => {

    const{ address, city, state, lat, lng } = req.body;
    const venueId = req.params.venueId;
    const venue = await Venue.findByPk(venueId);

    if (!venue) return venueNotFoundError(req,res,next);

    if ((await isOrganizer(venue.groupId, req.user)) || (await isCoHost(venue.groupId, req.user))) {
        venue.address = address;
        venue.city = city;
        venue.state = state;
        venue.lat = lat;
        venue.lng = lng;
        venue.save();
        res.status(200)
        res.json(venue)
    } else {
        return notAuthorizedErr(req,res,next);
    }
});


router.delete("/:venueId", requireAuth, async (req, res, next) => {
    const venue = await Venue.findOne({
        where: {
            id: req.params.venueId,           
        }
    });
    if (!venue) return venueNotFoundError(req, res, next);
    const event = await Event.findAll({
        where:{
            venueId: req.params.venueId           
        }
    })
    if(event && event.length > 0) return venueIsInUse(req, res, next);
    

    if ((await isOrganizer(venue.groupId, req.user)) || (await isCoHost(venue.groupId, req.user))) {
        await venue.destroy();
    }else {
        return notAuthorizedErr(req,res,next);
    }
    
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });

});

module.exports = router;