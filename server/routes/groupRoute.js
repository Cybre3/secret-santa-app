const router = require('express')();
const groupsController = require('../controllers/groupsController');

router.get('/', groupsController.get.allGroups);

router.patch('/', groupsController.patch.removePersonById);
router.patch('/:group', groupsController.patch.addUserToGroup);
router.patch('/:group/:id', groupsController.patch.assignPersonToUser);


module.exports = router;