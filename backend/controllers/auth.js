const User = require('../models/user')

const loginUser = async (req, res) => {
    res.json({ mssg: 'login user' });
}

const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password }); 
        res.status(201).json({ email, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { registerUser, loginUser };
