// backend/routes/api/session.js
const express = require('express')
const { User } = require('../../db/models');
const router = express.Router();


router.get("/", async (req, res, next) => {

    const userId = req.body;
    const user = await User.findByPk(userId)        
    
    res.status(200)
    res.json(user)

});

module.exports = router;