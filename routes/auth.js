const {Router}= require('express');
const authcontrol=require('../authcontrol');

const router= Router();
router.get('/signup', authcontrol.signup_get);
router.post('/signup',authcontrol.signup_post);
router.get('/signin', authcontrol.signin_get);
router.post('/signin',authcontrol.signin_post);
router.get('/logout', authcontrol.logout_get);
router.get('/adminAuth', authcontrol.adminAuth_get);
router.post('/adminAuth',authcontrol.adminAuth_post);



module.exports= router;