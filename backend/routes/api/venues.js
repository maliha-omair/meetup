const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { User, Group, Image, Membership, Venue } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const  { isGroup, isCoHost, isOrganizer, notAuthorizedErr, venueNotFoundError,isEvent } = require('../../utils/common');
// const group = require("./groups")


const validateNewVenue = [
    check('address')
        .exists({ checkFalsy: false })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: false })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: false })
        .withMessage("state is required"),
    check('lat')
        .isNumeric({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .isNumeric({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];



router.put("/:venueId", requireAuth,validateNewVenue, async (req, res, next) => {

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




module.exports = router;