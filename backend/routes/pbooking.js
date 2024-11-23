const express = require('express');
const router = express.Router();

const { 
    newBooking, 
    myBookings, 
    getBookingById, 
    allBookings, 
    deleteBooking, 
    updateBookingStatus, 
    totalBookings, 
    totalRevenue, 
    revenuePerUser 
} = require('../controllers/pbooking');

// Route for creating a new booking
router.post('/booking/new', newBooking);

// Route for retrieving user's bookings
router.get('/bookings/me', myBookings);

// Route for retrieving a single booking by ID
router.get('/booking/:id', getBookingById);

// Admin routes
router.get('/admin/bookings', allBookings);
router.route('/admin/booking/:id')
    .delete(deleteBooking)
    .put(updateBookingStatus);

// Aggregated data routes (Admin only)
router.get('/admin/total-bookings', totalBookings);
router.get('/admin/total-revenue', totalRevenue);
router.get('/admin/revenue-per-user', revenuePerUser);

module.exports = router;
