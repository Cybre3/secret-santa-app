const router = require('express')();
const giftsController = require('../controllers/giftsController');
const usersController = require('../controllers/usersController');
const validator = require('../middleware/validateMiddleware');
const { validate: validateUser } = require('../models/userModel');

router.get('/', usersController.get.allUsers);

router.post('/', validator(validateUser), usersController.post.addNewUser);

router.patch('/secret-santa/:id', giftsController.patch.addNewGift);

module.exports = router;