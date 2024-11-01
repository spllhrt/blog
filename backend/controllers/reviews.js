const Review = require('../models/reviews');
const cloudinary = require('cloudinary').v2; // Ensure you're using the correct import
const APIFeatures = require('../utils/apiFeatures');


// Get all reviews
exports.getReviews = async (req, res) => {
    try {
        const resPerPage = 4;
        const reviewsCount = await Review.countDocuments();
        const apiFeatures = new APIFeatures(Review.find(), req.query).search().filter();
        apiFeatures.pagination(resPerPage);
        const reviews = await apiFeatures.query;


        if (!reviews.length) {
            return res.status(400).json({ message: 'No reviews found' });
        }


        const filteredReviewsCount = reviews.length;


        return res.status(200).json({
            success: true,
            reviews,
            filteredReviewsCount,
            resPerPage,
            reviewsCount,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Error loading reviews',
            error: error.message,
        });
    }
};


// Get single review
exports.getSingleReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }


        return res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Create new review
exports.createReview = async (req, res) => { // Renamed function
    try {
        let images = req.files ? req.files.map(file => file.path) : [];


        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else if (Array.isArray(req.body.images)) {
            images = images.concat(req.body.images);
        }


        const imagesLinks = await Promise.all(images.map(async (image) => {
            try {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'reviews',
                    width: 150,
                    crop: 'scale',
                });
                return {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                throw new Error('Error uploading image to Cloudinary');
            }
        }));


        req.body.images = imagesLinks;
        const review = await Review.create(req.body);


        return res.status(201).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message,
        });
    }
};


// Update a review
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }


        if (req.body.comments) {
            review.comments = req.body.comments;
        }


        const imagesLinks = req.files && req.files.length > 0 ? [] : review.images;


        if (req.files) {
            for (const image of review.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }


            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'reviews',
                    width: 150,
                    crop: 'scale',
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }


        review.images = imagesLinks;
        await review.save();


        return res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error('Update review error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Review deleted',
        });
    } catch (error) {
        console.error('Delete review error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
