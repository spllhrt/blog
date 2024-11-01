const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter package name'],
    },
    description: {
        type: String,
        required: [true, 'Please enter package description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter package price'],
    },
    stocks: {
        type: Number,
        required: [true, 'Please enter package stocks'],
    },
    availableDates: [
        {
            startDate: {
                type: Date,
                required: [true, 'Please enter start date'],
            },
            endDate: {
                type: Date,
                required: [true, 'Please enter end date'],
            },
        },
    ],
    locations: [
        {
            type: String,
            required: [true, 'Please enter locations'],
        },
    ],
    features: [
        {
            type: String,
            required: [true, 'Please enter features'],
        },
    ],
    itinerary: {
        type: String,
        required: [true, 'Please enter itinerary details'], // Added itinerary field
    },
    status: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available',
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please enter category'],
    },
}, {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('Package', packageSchema);
