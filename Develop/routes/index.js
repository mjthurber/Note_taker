const express = require('express');
const router = express.Router();
const routerNotes = require('./notes');

router.use('/notes', routerNotes);

module.exports = router;