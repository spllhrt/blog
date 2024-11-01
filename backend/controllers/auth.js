const User = require('../models/user');
const sendToken = require('../utils/jwtToken.js');
const cloudinary = require('cloudinary').v2;

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

    sendToken(user, 200, res);
};

// Register User
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter wdwemail and password' });
    }

    try {
        const user = await User.create({ email, password });
        sendToken(user, 201, res);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all users
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
// Exporting all functions
module.exports = {
    registerUser,
    loginUser,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
};
