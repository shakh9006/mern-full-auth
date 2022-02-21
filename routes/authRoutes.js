const router = require('express').Router;
const AuthController = require('../controllers/AuthController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/activate', AuthController.activationLink);
router.get('/refresh_token', AuthController.refreshToken);

module.exports = router;