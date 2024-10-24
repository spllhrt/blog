const express = require('express')

//controller function
const { registerUser, loginUser } = require('../controllers/auth')

const router = express.Router()

//login route
router.post('/login', loginUser)

//signup
router.post('/register', registerUser)

module.exports = router