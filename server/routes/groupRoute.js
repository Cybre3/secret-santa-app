const router = require('express')();
const groupsController = require('../controllers/groupsController');

router.get('/', groupsController.get.allGroups);

router.patch('/:group/:id', groupsController.patch.assignPersonToUser);
router.patch('/:group', groupsController.patch.addUserToGroup);
router.patch('/', groupsController.patch.removePersonById);


module.exports = router;