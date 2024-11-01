const Booking = require('../models/pbooking');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');


// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const resPerPage = 10;
        const bookingsCount = await Booking.countDocuments();
        const apiFeatures = new APIFeatures(Booking.find(), req.query).filter().pagination(resPerPage);
        const bookings = await apiFeatures.query;


        if (!bookings.length) {
            return res.status(400).json({ message: 'No bookings found' });
        }


        const filteredBookingsCount = bookings.length;


        return res.status(200).json({
            success: true,
            bookings,
            filteredBookingsCount,
            resPerPage,
            bookingsCount,
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({
            success: false,
            message: 'Error loading bookings',
            error: error.message,
        });
    }
};


// Get single booking
exports.getSingleBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }


        return res.status(200).json({
            success: true,
            booking,
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Create new booking
exports.createBooking = async (req, res) => {
    try {
        const { userId, packageId, travelDates, numberOfTravelers, bookingStatus } = req.body;


        if (!userId || !packageId || !travelDates || !travelDates.startDate || !travelDates.endDate || !numberOfTravelers) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }


        const booking = await Booking.create({
            userId,
            packageId,
            travelDates,
            numberOfTravelers,
            bookingStatus,
            packagePrice,
            totalPrice
        });


        return res.status(201).json({
            success: true,
            booking,
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message,
        });
    }
};


// Update a booking
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }


        const { travelDates, numberOfTravelers, bookingStatus } = req.body;


        if (travelDates) booking.travelDates = travelDates;
        if (numberOfTravelers) booking.numberOfTravelers = numberOfTravelers;
        if (bookingStatus) booking.bookingStatus = bookingStatus;


        await booking.save();


        return res.status(200).json({
            success: true,
            booking,
        });
    } catch (error) {
        console.error('Update booking error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Booking deleted',
        });
    } catch (error) {
        console.error('Delete booking error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
