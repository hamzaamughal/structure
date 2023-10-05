const express = require('express')
const router = express.Router()

const {
  createUser,
  getAllUsers,
  forgotPassword,
} = require('../controllers/userController.js')

router.route('/').post(createUser).get(getAllUsers)
router.route('/forgotPassword').post(forgotPassword)

module.exports = router
