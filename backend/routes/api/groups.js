const express = require('express')
const router = express.Router();
const cookieParser = require("cookie-parser");
const app = express();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Group , Image } = require('../../db/models');
const {  requireAuth } = require('../../utils/auth');

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
            attributes:['url'],
            limit: 1,        
        },  
            
    })
    const updatedGroups = groups.map(g => {
        g= g.toJSON();
        console.log(g)
        console.log(g.Images[0].url)
        if(g.Images[0].url ){
            g.previewImage = g.Images[0].url   
            g.Images = null
        }
        return g;
    });
    res.status(200)
    res.json(updatedGroups)
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
            attributes: ['id', 'url']
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
    console.log("group", group)
   
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
        console.log("new Image", newImage)
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

module.exports = router;