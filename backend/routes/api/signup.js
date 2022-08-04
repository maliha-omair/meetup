// backend/routes/api/users.js
const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
 
    const { firstName, lastName, email, password, username } = req.body;
    if(await User.userExists(email)){
        return res.json(
          {
            "message": "User already exists",
            "statusCode": 403,
            "errors": {
              "email": "User with that email already exists"
            }
          }
        )
    }
    const user = await User.signup({ firstName, lastName, email, username, password });
    const token = await setTokenCookie(res, user);
    return res.json({
      user, token
    });
  }
);

module.exports = router;