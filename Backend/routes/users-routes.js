const express = require('express');
const {check} = require('express-validator') 

const usersControllers = require('../controllers/users-controller');
const fileUpload = require("../Middleware/file-upload");

const router = express.Router();

router.get('/', usersControllers.getUsers);
router.post('/login', usersControllers.login);
router.post('/signup', 
fileUpload.single('image'),
   [
    check('email').normalizeEmail().isEmail(),
    check('name').not().isEmpty(),
    check('password').isLength({min : 6})
   ], 
   usersControllers.signup);
 
module.exports = router;
