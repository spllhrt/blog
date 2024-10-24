const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); 
    }

    this.password = await bcrypt.hash(this.password, 10);
    next(); 
});

module.exports = mongoose.model('User', userSchema);