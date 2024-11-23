const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    travelDates: {
        type: Date,
        required: [true, 'Please provide the start date of the trip'],
    },
    numberOfTravelers: {
        type: Number,
        required: [true, 'Please specify the number of travelers'],
        min: [1, 'Number of travelers must be at least 1'],
    },
    packagePrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'pending', 'canceled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Middleware to calculate totalPrice
bookingSchema.pre('save', function(next) {
    this.totalPrice = this.packagePrice * this.numberOfTravelers;
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
