const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

// Define User schema
const userSchema = new Schema({
    name: {
        type: String,
        required: [false, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters'],
        // This will be used for normal logins.
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
    },
    profileImage: {
        type: String, // For Google login users to store their profile image URL
    },
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: String,
        default: 'active'
    },
    last_login: {
        type: Date,
        required: false // Assuming last_login is not required; change as needed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});




// Pre-save hook for password hashing before saving normal users (not Google users)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }




    // Only hash the password if it is provided (for normal users)
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});




// JWT generation method
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};




// Compare password method (for normal users)
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};




// Export the model
module.exports = mongoose.model('User', userSchema);
