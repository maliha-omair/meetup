const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { User, Group, Image, Membership, Venue } = require('../../db/models');
const  { isGroup, isCoHost, isOrganizer, notAuthorizedErr, venueNotFoundError,isEvent } = require('../../utils/common');

router.delete("/:imageId/", requireAuth, async (req,res,next)=>{
    const imageId = req.params.imageId;
    const image = await Image.findByPk(imageId);
    console.log(imageId, " ", image)
    if(!image) return imageNotFoundError(req,res,next);
    if(image.userId === req.user.id){
        await image.destroy();
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });
    }else{
        return notAuthorizedErr(req,res,next)
    }
});


function imageNotFoundError(req, _res, next) {
    const err = new Error("Image couldn't be found");
    err.title = 'Not Found';
    err.errors = ['Not Found'];
    err.status = 404;
    return next(err);
}
module.exports = router;