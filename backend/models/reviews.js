const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user ID for the review'],
    },
    comments: {
        type: String,
        required: [true, 'Please add comments for the review'],
        trim: true,
        maxLength: [500, 'Comments cannot exceed 500 characters']
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    
});


module.exports = mongoose.model('Review', reviewSchema);
