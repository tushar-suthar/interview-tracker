const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');


const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout',requireAuth, authController.logout_get);
router.get('/topics',requireAuth,authController.topic_get);
router.get('/topics/:name',requireAuth,authController.question_get);
// router.get('/admin',adminAuth,authController.topic_get);
router.post('/addquestion', authController.question_post);
router.get('/check' , (req,res) => {
    res.render('../adminpanel/addquestion')
})










module.exports = router;
