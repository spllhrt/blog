const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");


const {
    createBooking,
    getBookings,         // Make sure these functions are defined and imported correctly
    getSingleBooking,
    updateBooking,       // This is likely missing or undefined
    deleteBooking,
} = require('../controllers/pbooking');
// Uncomment the line below if you have authentication middleware
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


// Public routes
router.get('/bookings', getBookings);
router.get('/booking/:id', getSingleBooking);


// Admin routes for creating, updating, and deleting bookings
router.post('/admin/booking/new', createBooking);
router.get('/admin/booking/:id', getSingleBooking);
router.patch('/admin/booking/:id', updateBooking);
router.route('/admin/booking/:id')
    .patch(updateBooking)
    .delete(deleteBooking);


module.exports = router;
