// Correct export syntax for functions
const User = require('../models/user');
const sendToken = require('../utils/jwtToken.js');
const cloudinary = require('cloudinary').v2;
const { OAuth2Client } = require('google-auth-library');

// Google OAuth2 Client Setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Use the correct Google Client ID

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' });
    }

    let user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }
    // Use sendToken to generate and send the JWT token
    sendToken(user, 200, res);
};


// Register User
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email and password' });
    }

    try {
        const user = await User.create({ email, password });
        // Use sendToken to generate and send the JWT token
        sendToken(user, 201, res);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Google Login
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // This should match the Google Client ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        username: name || 'Anonymous', // Use a default if name is not available
        email,
        password: '', // No password needed for Google login
        profileImage: picture || 'default_image_url', // Ensure a profile image exists
      });
      await user.save();
    }

    // Use sendToken to generate and send the JWT token (consistent with other routes)
    sendToken(user, 200, res);
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed. Please try again later.' });
  }
};

const allUsers = async (req, res, next) => {
    const users = await User.find();
    if (!users || users.length === 0) {
        return res.status(400).json({ error: 'No users found' });
    }

    return res.status(200).json({
        success: true,
        users
    });
};

// Get user details by ID
const getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(400).json({ message: `User not found with id: ${req.params.id}` });
    }

    return res.status(200).json({
        success: true,
        user
    });
};

// Update user by admin
const updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        status: req.body.status
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(400).json({ message: `User not updated with id: ${req.params.id}` });
    }
    
    return res.status(200).json({
        success: true,
        user // Optionally return the updated user data
    });
};

const deleteUser = async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);
	if (!user) {
		return res.status(404).json({
			success: false,
			message: 'User not found'
		})
	}

	return res.status(200).json({
		success: true,
		message: 'User deleted'
	})
}
module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
};


