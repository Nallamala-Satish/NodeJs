const { addUser, getUsers, updateUser, getUser, deleteUser, getToken } = require("../controller/userController")
const express =require('express')
const router = express.Router()

router.route("/getToken").get(getToken)
router.route("/addUser").post(addUser)
router.route("/getUsers").get(getUsers)
router.route("/updateUser/:id").put(updateUser)
router.route("/getUser/:id").get(getUser)
router.route("/deleteUser/:id").delete(deleteUser)

module.exports = router;