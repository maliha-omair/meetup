const express = require('express')
const router = express.Router();
const cookieParser = require("cookie-parser");
const app = express();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Group, Image, Membership, Venue } = require('../../db/models');
const { Op, Sequelize } = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { isCoHost, isGroup, isOrganizer, notAuthorizedErr } = require('../../utils/common');

app.use(cookieParser());


const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .isIn([true, false])
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: false })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: false })
        .withMessage("State is required"),
    handleValidationErrors
];

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



router.post("/", requireAuth, validateNewGroup, async (req, res, next) => {
   
    const { name, about, type, private, city, state } = req.body;
    const newGroup = await Group.create({
        name,
        about,
        type,
        private,
        city,
        state,
        organizerId: req.user.id
    });
    res.status(201)
    res.json(newGroup)
});

router.get("/", async (req, res, next) => {
   
    const groups = await Group.findAll({
        attributes: {
            include: [

                [Sequelize.fn('COUNT', Sequelize.col('Memberships.memberId')), 'numMembers']
            ]
        },
        include: [
            {
                model: Membership,
                attributes: ['id']
            }, {
                model: Image,
                attributes: ['id', 'groupId', 'url']
            }],
        group: 'Group.Id'

    })
    res.status(200)
    res.json(groups)
});

router.get("/current", requireAuth, async (req, res) => {
    const group = await Group.findAll({
        where: {
            organizerId: req.user.id
        },
        attributes: {
            include: [

                [Sequelize.fn('COUNT', Sequelize.col('Memberships.groupId')), 'numMembers']
            ]
        },
        include: [{
            model: Membership,
            attributes: []
        }, {
            model: Image,
            attributes: ['id', 'groupId', 'url']
        }],
        group: 'Group.Id'
    });

    res.status(200)
    res.json(group)
});

router.get("/:groupId", requireAuth, async (req, res, next) => {
    const groupId = req.params.groupId;
    if (!await (isGroup(groupId))) return groupNotFoundError(req, res, next)

    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        },
        attributes: {
            include: [

                [Sequelize.fn('COUNT', Sequelize.col('Memberships.groupId')), 'numMembers']
            ]
        },
        include: [{
            model: Membership,
            attributes: []
        }, {
            model: Image,
            attributes: ['id', 'url', 'groupId']
        }, {
            model: User,
            as: 'Organizer'
        }, {
            model: Venue
        }],
        group: 'Group.Id'
    });
    res.status(200)
    res.json(group)


});

router.post("/:groupId/images", requireAuth, async (req, res, next) => {
    const groupId = req.params.groupId;
    const { url } = req.body;

    if (!(await isGroup(groupId))) return groupNotFoundError(req, res, next);
    if (!(await isOrganizer(groupId, req.user))) return notAuthorizedErr(req, res, next)

    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            organizerId: req.user.id
        }
    });

    const newImage = await Image.create({
        url,
        userId: req.user.id,
        groupId: req.params.groupId,
        eventId: null
    })

    let result = {}
    result.id = newImage.id;
    result.imageableId = parseInt(groupId);
    result.url = url;
    res.status(200);
    res.json(result);
});

router.put("/:groupId", validateNewGroup, requireAuth, async (req, res, next) => {
    const { groupId } = req.params
    const { name, about, type, private, city, state } = req.body;
    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            organizerId: req.user.id
        }
    });
    if (group) {
        const updatedGroup = await group.update({
            name,
            about,
            type,
            private,
            city,
            state
        }, {
            where: {
                id: groupId
            }
        });
        res.status(200);
        res.json(updatedGroup)
    } else {
        groupNotFoundError(req, res, next);
    }
});

router.delete("/:groupId", requireAuth, async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            organizerId: req.user.id
        }
    });
    if (group) {
        group.destroy();
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });

    } else {
        groupNotFoundError(req, res, next);
    }
});

// MemberShip

router.get("/:groupId/members", async (req, res, next) => {
    const groupId = req.params.groupId
    let result = {}
    const hasGroup = await Membership.findAll({
        where: {
            groupId: groupId
        }
    });
    console.log("groupId is ", groupId);
    console.log("group is ", hasGroup)
    if (!hasGroup || hasGroup.length < 1) return groupNotFoundError(req, res, next);

    if (!isOrganizer(groupId, req.user)) {
        const members = await User.findAll({
            include: {
                model: Membership,
                where: {
                    groupId: groupId,
                    status: {
                        [Op.notIn]: ['pending']
                    }
                }
            },
        })
        result.Members = members;
        res.json(result);
    } else {
        const members = await User.findAll({
            include: {
                model: Membership,
                attributes: ['status'],
                where: {
                    groupId: groupId
                }
            },
        })
        result.Members = members;
        res.json(result);
    }
})

router.post("/:groupId/members", requireAuth, async (req, res, next) => {

    const groupId = req.params.groupId;
    const memberId = req.user.id
    const status = "pending"


    if (!isGroup(groupId)) {
        return groupNotFoundError(req, res, next)
    }

    const member = await Membership.findOne({
        where: {
            memberId: memberId,
            groupId: groupId
        }
    })
    if (member) {
        if (member.status === 'pending') {
            return userAlreadyRequestedErr(req, res, next);
        } else {
            return userAlreadyMemberErr(req, res, next);
        }
    }

    const newMember = await Membership.create({
        groupId: groupId,
        memberId: memberId,
        status: status
    });
    res.status(200);
    res.json(newMember);

});



router.put("/:groupId/members", requireAuth, async (req, res, next) => {
    const { memberId, status } = req.body;
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId, {
        include: {
            model: Membership,
            where: {
                memberId: memberId
            }

        }
    });

    const user = await User.findByPk(memberId);
    if (!group) return groupNotFoundError(req, res, next);
    if (!user || user.length < 1) return userNotFoundError(req, res, next);
    if (!group.Memberships) return membershipNotFoundErr(req, res, next);
    if (group.Memberships.length !== 1) return membershipNotFoundErr(req, res, next);

    if (status === "co-host" && group.Memberships[0].status === "member" && isOrganizer(groupId, req.user)) {
        group.Memberships[0].status = "co-host"
        await group.Memberships[0].save();
        res.json(group.Memberships[0]);
    } else if (status === "member" && group.Memberships[0].status === "pending" && (isOrganizer(groupId, req.user) || isCoHost(groupId, req.user))) {
        group.Memberships[0].status = "member";
        await group.Memberships[0].save();
        res.json(group.Memberships[0]);
    };
});

router.delete(":groupId/membership", requireAuth, async (req, res, next) => {
    const groupId = req.params.groupId;
    const { memberId } = req.body;
    if (!isGroup(groupId)) return groupNotFoundError(req, res, next);

    const user = await User.findByPk(memberId);
    if (!user) return userNotFoundError(req, res, next);

    const membership = await Membership.findOne({
        where: {
            memberId: memberId
        }
    });
    if (!membership) return membershipNotExistsErr(req, res, next);
    if (membership.memberId === req.user.id || isCoHost(groupId, req.user)) {
        membership.destroy();
        res.json({
            "message": "Successfully deleted membership from group",
            "status": 200
        });
    } else {
        res.json({
            "message": "Unauthorized",
            "status": 401
        });
    }
});

//Venues

router.get("/:groupId/venues", requireAuth, async (req, res, next) => {

    const groupId = req.params.groupId;
    console.log("group Id is ", groupId);
    if (!(await isGroup(groupId))) return groupNotFoundError(req, res, next);
    if ((await isOrganizer(groupId, req.user)) || (await isCoHost(groupId, req.user))) {
        const venue = await Venue.findAll({
            where: {
                groupId: groupId
            }
        })
        res.status(200)
        res.json(venue)
    } else {
        return notAuthorizedErr(req, res, next);
    }
});

router.post("/:groupId/venues", requireAuth, validateNewVenue, async (req, res, next) => {

    console.log("in here")
    const { address, city, state, lat, lng } = req.body;
    const groupId = req.params.groupId;

    if (!isGroup(groupId)) return groupNotFoundError(req, res, next);

    if ((await isOrganizer(groupId, req.user) ) || (await isCoHost(groupId, req.user))) {
        const newVenue = await Venue.create({
            groupId,
            address,
            city,
            state,
            lat,
            lng
        });
        res.status(200);
        res.json(newVenue);
    } else {
        return notAuthorizedErr(req, res, next)
    }
});

function membershipNotExistsErr(req, _res, next) {
    const err = new Error("Membership does not exist for this User");
    err.title = 'Not Found';
    err.errors = ["Not a member"];
    err.status = 404;
    return next(err);
}
function userAlreadyMemberErr(req, _res, next) {
    const err = new Error("User is already a member of the group");
    err.title = 'Bad Request';
    err.errors = ["Already a member"];
    err.status = 404;
    return next(err);
}
function userAlreadyRequestedErr(req, _res, next) {
    const err = new Error("Membership has already been requested");
    err.title = 'Bad Request';
    err.errors = ["Membership has already been requested"];
    err.status = 404;
    return next(err);
}
function membershipNotFoundErr(req, _res, next) {
    const err = new Error("Membership between the user and the group does not exits");
    err.title = 'Not Found';
    err.errors = ["Membership Not Found"];
    err.status = 404;
    return next(err);
}
function userNotFoundError(req, _res, next) {
    const err = new Error("Validation Error");
    err.title = 'Bad Request';
    err.errors = ["User couldn't be found"];
    err.status = 400;
    return next(err);
}
function groupNotFoundError(req, _res, next) {
    const err = new Error("Group couldn't be found");
    err.title = 'Not Found';
    err.errors = ['Not Found'];
    err.status = 404;
    return next(err);
}

// exports.isGroup = isGroup;
// exports.isCoHost = isCoHost;
// exports.isOrganizer = isOrganizer;

module.exports = router;