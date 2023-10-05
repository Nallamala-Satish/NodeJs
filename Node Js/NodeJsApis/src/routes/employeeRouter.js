const express = require('express')
const multer = require('multer');
const Upload = multer();
const storage = multer.memoryStorage();
const upload1 = multer({ storage: storage });
const { validateSignUpRequest, requestValidator, validateSignInRequest, uploadMiddleware } = require('../validator/employeeValidations');
const { signUp, signIn, dropdownApi, getDropdownApi, getCountries, upload, getFiles, downloadFiles, uploadFiles, } = require('../controller/employeeController');
const router = express.Router()

router.route("/signUp").post(uploadMiddleware,validateSignUpRequest,requestValidator,signUp);
router.route('/signIn').post(validateSignInRequest,requestValidator,signIn);
router.route("/countries").post(dropdownApi)
router.route('/Countries').get(getDropdownApi)
router.route('/getCountries').get(getCountries)
router.route("/upload").post(upload)
router.route("/getFiles").get(getFiles)
router.route("/getFiles/:name").get(downloadFiles)

module.exports = router;