const express = require('express')
const { signUp, login, verifyToken, Home, getToken, UploadProducts, uploadImg,
     getProducts, getStates, getCountries, Countries, States,  } = require('../controller/userController')
const router = express.Router()
const multer = require('multer');
const upload = multer();

router.route('/register').post(signUp)
router.route('/login').post(login)
router.route('/getFiles').get(verifyToken,Home)
router.route('/upload').post(uploadImg,UploadProducts)
router.route('/getProducts').get(getProducts)
router.route('/getToken').get(getToken)
router.route('/countries').post(Countries)
router.route('/states').post(States)
router.route('/getCountries').get(getCountries)
router.route('/getStates/:id').get(getStates)

module.exports = router;