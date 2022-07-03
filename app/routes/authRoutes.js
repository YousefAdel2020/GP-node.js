const { Router } = require('express');
const jwt = require("jsonwebtoken");

const authController = require('../controllers/authController');
const {verifyToken} = require('../controllers/tokenController');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
  

router.get("/", verifyToken, (req, res) => {
    console.log(req.user_id)
    res.status(200).send(`Welcome ${req.user_id}`);
});
  
module.exports = router;