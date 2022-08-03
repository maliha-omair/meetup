
const { User, Group, Image, Membership, Venue } = require('../db/models');

async function isGroup(groupId) {
    const group = await Group.findByPk(groupId);
    if (!group ) return false
    else return true
}

async function isCoHost(groupId, user) {
    const isHost = await Membership.findOne({
        where: {
            groupId: groupId,
            memberId: user.id,
            status: "co-host"
        }
    });
    if (!isHost || isHost.length < 1) return false
    else return true
}

async function isOrganizer(groupId, user) {
    const isOrganizer = await Group.findOne({
        where: {
            Id: groupId,
            organizerId: user.id
        }
    });
    if (!isOrganizer || isOrganizer.length < 1) return false
    else return true
}

function venueNotFoundError(req, _res, next) {
    const err = new Error("Group couldn't be found");
    err.title = 'Not Found';
    err.errors = ['Not Found'];
    err.status = 404;
    return next(err);
}

function notAuthorizedErr(req, _res, next) {
    const err = new Error("Forbidden");
    err.title = 'Not Authorized';
    err.errors = ["User is not authorized"];
    err.status = 403;
    return next(err);
}

module.exports = { isGroup, isCoHost, isOrganizer, notAuthorizedErr, venueNotFoundError };