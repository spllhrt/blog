const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { 
    registerUser,
    loginUser,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
} = require('../controllers/auth');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/admin/users', allUsers);
router.route('/admin/user/:id')
    .get(getUserDetails)
    .delete(deleteUser)
    .put(updateUser);

module.exports = router;