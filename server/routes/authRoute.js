const authController = require('../controllers/authController');

const router = require('express')();

router.get('/:email', authController.get.checkUserEmail);
router.post('/', authController.post.authenticateUser);

module.exports = router;