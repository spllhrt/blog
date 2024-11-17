const express = require('express');
const passport = require('passport');
const router = express.Router();
const upload = require('../config/multer'); // Import multer config

const { 
    registerUser,
    loginUser,
    googleLogin,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
} = require('../controllers/auth');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login', 
}), (req, res) => {
    res.redirect('http://localhost:5173/dashboard'); 
});


router.post('/register', upload.single('profileImage'), registerUser); // Use registerUser
router.post('/login', loginUser);
router.post('/google-login', googleLogin); // If using google-login POST route
router.get('/admin/users', allUsers);
router.route('/admin/user/:id')
    .get(getUserDetails)
    .delete(deleteUser)
    .put(updateUser);


module.exports = router;
