
const express =require('express')
const { getEmail } = require('../controller/email');
const { upload, getFiles } = require('../controller/employeeController');
const router = express.Router()


router.route("/getEmail").get(getEmail)

module.exports = router;