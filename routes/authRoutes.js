const router = require('express').Router();
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/authMiddleware');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activationLink);
router.get('/refresh_token', UserController.refreshToken);
router.get('/users', auth, UserController.getUsers);

module.exports = router;