const router = require('express').Router();
const UserController = require('../controllers/UserController');
const UploadController = require('../controllers/UploadController');
const auth = require('../middlewares/authMiddleware');
const authAdmin = require('../middlewares/authAdminMiddleware')
const uploadAvatar = require('../middlewares/uploadMiddleware');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/activate', UserController.activationLink);
router.post('/refresh_token', UserController.refreshToken);
router.post('/forgot_password', UserController.forgotPassword);
router.post('/reset_password', auth, UserController.resetPassword);
router.post('/avatar_upload', auth, uploadAvatar, UploadController.uploadAvatar);

router.get('/logout', UserController.logout);
router.get('/access_token', UserController.getAccessToken);
router.get('/user_data', auth, UserController.getUserData);
router.get('/users', auth, authAdmin, UserController.getUsersList);

router.patch('/update_user_data', auth, UserController.updateUserData);
router.patch('/update_user_role', auth, authAdmin, UserController.updateUserRole);

router.delete('/delete_user', auth, UserController.deleteUser);


module.exports = router;