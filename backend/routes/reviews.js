const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    getReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews');
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Public routes
router.get('/reviews', getReviews);
router.get('/review/:id', getSingleReview);

// Public route for creating a review
router.post('/review/new', upload.array('images', 5), createReview);

// Public route for updating a review
router.put('/review/:id', upload.array('images', 5), updateReview);

// Admin routes for managing reviews
router.post('/admin/review/new', upload.array('images', 5), createReview);
router.route('/admin/review/:id')
    .put(upload.array('images', 5), updateReview)
    .delete(deleteReview);

module.exports = router;
