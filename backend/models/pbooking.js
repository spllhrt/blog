const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user ID for the booking'],
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package', // Assuming you have a Package model
        required: [true, 'Please provide package ID for the booking'],
    },
    travelDates: {
        startDate: {
            type: Date,
            required: [true, 'Please provide the start date of the trip'],
        },
        endDate: {
            type: Date,
            required: [true, 'Please provide the end date of the trip'],
        }
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
        enum: ['confirmed', 'pending', 'canceled'], // Possible statuses
        default: 'pending', // Default status
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model('Booking', bookingSchema);
