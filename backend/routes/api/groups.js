const express = require('express')
const router = express.Router();
const cookieParser = require("cookie-parser");
const app = express();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Group , Image , Membership } = require('../../db/models');
const{Op} = require('sequelize')
const {  requireAuth } = require('../../utils/auth');
const membership = require('../../db/models/membership');

app.use(cookieParser());


const validateNewGroup = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({max:60})
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
    check('type')
      .isIn(['Online','In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .isIn([true,false])
      .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: false })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: false })
        .withMessage("State is required"),
    handleValidationErrors
];


router.post("/",requireAuth,validateNewGroup,async (req,res,next)=>{
    // let user = await User.findByPk(req.user.id);
        const {name,about,type,private,city,state} = req.body;
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

router.get("/", async (req,res,next)=>{
    const result = {}
    const groups = await Group.findAll({
        include:{
            model: Image,
            // as: 'previewImage',
            attributes:[['url','previewImage']],
            limit: 1,        
        },  
            
    })
    // const updatedGroups = groups.map(g => {
    //     g= g.toJSON();
    //     // console.log(g)
    //     // console.log(g.Images[0].url)
    //     if(g.Images[0].url ){
    //         g.previewImage = g.Images[0].url   
    //         g.Images = null
    //     }
    //     // return g;
    // });

    res.status(200)
    res.json(groups)
});

router.get("/current",requireAuth, async (req,res)=>{
    const group = await Group.findAll({
        where: {
            organizerId: req.user.id
        }
    });
    res.status(200)
    res.json(group)
});

router.get("/:groupId",requireAuth, async (req,res)=>{

    const group = await Group.findOne({
        where: {
            id:req.params.groupId
        },
        include:[{
            model: Image,
            attributes: ['id', 'url', ['groupId', 'imageableId']   ]
        },{
            model: User
        }]
    });
    if(!group){
        res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
        })
    }else{
        res.json(group)
    }
    
});

router.post("/:groupId/images",requireAuth, async (req,res)=>{
    const group = await Group.findOne({
        where: {
            id : req.params.groupId,
            organizerId : req.user.id 
        }
    });
    if(group){
        const {url} = req.body;
        console.log("image url", url)
        console.log("user is", req.user.id)
        const newImage = await Image.create({
            url,
            userId: req.user.id,
            groupId: req.params.groupId,
            eventId: null
        })
        res.status(200)
        res.json(newImage)
    }else{
        res.status(404)
        res.json({
            "message" : "Group couldn't be found",
            "status" : 404
        })
    }
    
});

router.put("/:groupId", validateNewGroup, requireAuth, async(req,res)=>{
    const { groupId } = req.params
    const {name,about,type,private,city,state} = req.body;
    const group = await Group.findOne({
        where: {
            id : req.params.groupId,
            organizerId : req.user.id 
        }
    });
    if(group){
        const updatedGroup = await group.update({
            name,
            about,
            type,
            private,
            city,
            state
        },{
            where: {
                id: groupId
            }
        });
        res.status(200);
        res.json(updatedGroup)
    }else{
        res.status(404)
        res.json({
            "message" : "Group couldn't be found",
            "status" : 404
        })
    }
});

router.delete("/:groupId", requireAuth, async(req,res)=>{
    const group = await Group.findOne({
        where: {
            id : req.params.groupId,
            organizerId : req.user.id 
        }
    });
    if(group){
         group.destroy();
         res.json({
            "message": "Successfully deleted",
            "statusCode": 200
         });

    }else{
        res.status(404)
        res.json({
            "message" : "Group couldn't be found",
            "status" : 404
        });
    }
});

// MemberShip
async function isOrganizer(groupId,user){
    const isOrganizer = await Group.findOne({
        where:{
            Id: groupId,
            organizerId : user.id
        }
    });
    if(isOrganizer) return true
    else return false
}

router.get("/:groupId/members",  async(req,res,next)=>{
    const groupId = req.params.groupId
    let result = {}
    
    if(!isOrganizer(groupId,req.user)) {
        const members = await User.findAll({
            include: {
                model: Membership,
                where: {
                    groupId: groupId,
                    status: {
                        [Op.notIn]:['pending']
                    }                    
                }
            },
        })
        result.Members = members;
        res.json(result);
    }else{
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

router.post("/:groupId/members", requireAuth, async(req,res,next)=>{
   
    const groupId = req.params.groupId;
    const memberId = req.user.id
    const status = "pending"

    const group = await Group.findByPk(groupId);
    if(!group){
       return groupNotFoundError(req,res,next)
    }

    const member = await Membership.findOne({
        where: {
            memberId: memberId,
            groupId: groupId
        }
    })
    if(member){
        if(member.status === 'pending'){
            return userAlreadyRequestedErr(req,res,next);
        }else{
            return userAlreadyMemberErr(req,res,next);
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

async function isCoHost(groupId,user){
    const isHost = await Membership.findOne({
        where:{
            groupId:groupId,
            memberId: user.id,
            status : "co-host"
        }
    });
    if(isHost) return true
    else return false
}

router.put("/:groupId/members", requireAuth, async(req,res,next)=>{
    const { memberId, status} = req.body;
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId,{
        include: {
            model: Membership,
            where: {
                memberId: memberId
            }
            
        }
    });
    
    const user = await User.findByPk(memberId);
    if(!group) return groupNotFoundError(req,res,next);    
    if(!user) return userNotFoundError(req,res,next);
    if(!group.Memberships) return membershipNotFoundErr(req,res,next); 
    if(group.Memberships.length !== 1) return membershipNotFoundErr(req,res,next); 
    
    if(status === "co-host" && group.Memberships[0].status === "member" && isOrganizer(groupId, req.user)){
        console.log("status to change is co-host, user has status member and he is organizer")
        group.Memberships[0].status = "co-host"
        await group.Memberships[0].save();
        res.json(membership);
    }else if(status === "member" && group.Memberships[0].status === "pending" && (isOrganizer(groupId, req.user) || isCoHost(groupId,req.user))){
        console.log("status to change is member, user has status pending and he is organizer")
        group.Memberships[0].status = "member";
        await group.Memberships[0].save();
        res.json(group.Memberships[0]);
    };
    
              
});

function userAlreadyMemberErr(req,_res, next) {
    const err = new Error("User is already a member of the group");
    err.title = 'Bad Request';
    err.errors = ["Already a member"];
    err.status = 404;
    return next(err);
}
function userAlreadyRequestedErr(req,_res, next) {
    const err = new Error("Membership has already been requested");
    err.title = 'Bad Request';
    err.errors = ["Membership has already been requested"];
    err.status = 404;
    return next(err);
}
function membershipNotFoundErr(req,_res, next) {
    const err = new Error("Membership between the user and the group does not exits");
    err.title = 'Not Found';
    err.errors = ["Membership Not Found"];
    err.status = 404;
    return next(err);
}
function userNotFoundError(req,_res, next) {
    const err = new Error("Validation Error");
    err.title = 'Bad Request';
    err.errors = ["User couldn't be found"];
    err.status = 400;
    return next(err);
}
function groupNotFoundError(req,_res, next) {
    const err = new Error("Group couldn't be found");
    err.title = 'Not Found';
    err.errors = ['Not Found'];
    err.status = 404;
    return next(err);
}

module.exports = router;