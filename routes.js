const express = require('express');
const controllers=require('./controllers');
const router = express.Router();



router.get('/mail/emails', controllers.getAllemails);
router.get('/mail/thread/:id', controllers.getMessageDetails);
router.get('/mail/reply', controllers.sendReply);


module.exports = router;