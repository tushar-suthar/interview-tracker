const { Router } = require('express');
const multer = require('multer');
const authController = require('../controllers/authController');
const { requireAuth, checkUser, adminAuth } = require('../middleware/authMiddleware');


const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout',requireAuth, authController.logout_get);
router.get('/topics',requireAuth,authController.topic_get);
router.get('/topics/:name',requireAuth,authController.question_get);
router.get('/companies/:name',requireAuth,authController.experience_get);
// router.get('/admin',adminAuth,authController.topic_get);
router.post('/addquestion', authController.question_post);
router.post('/addexperience', authController.experience_post);
router.get('/check' , adminAuth ,(req,res) => {
    res.render('../adminpanel/addquestion')
})
router.get('/dummy' , requireAuth ,(req,res) => {
    res.render('../adminpanel/addexperience')
})
router.get('/blogs', (req,res) => {
    res.render('blogs')
} )
router.get('/adminpanel' ,(req,res) => {
    res.render('adminpanel')
})
router.get('/admintopics',authController.admintopic_get);








module.exports = router;
