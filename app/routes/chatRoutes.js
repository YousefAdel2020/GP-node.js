const { Router } = require('express');
const router = Router();

const {verifyToken} = require('../controllers/tokenController');

router.get('/',verifyToken, (req, res) => {
    res.render("chat.ejs")
})

module.exports = router;