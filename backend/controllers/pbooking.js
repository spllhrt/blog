const Booking = require('../models/pbooking');
const Package = require('../models/package'); // If package data needs updating

// Create a new booking
exports.newBooking = async (req, res) => {
    const {
        packageId,
        travelDates,
        numberOfTravelers,
        packagePrice
    } = req.body;

    try {
        const booking = await Booking.create({
            packageId,
            travelDates,
            numberOfTravelers,
            packagePrice,
            totalPrice: packagePrice * numberOfTravelers,
            user: req.user.id // Assuming the user is authenticated
        });

        return res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        return res.status(400).json({ message: 'Error creating booking', error: error.message });
    }
};

// Get bookings by user
exports.myBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('packageId');
        if (!bookings) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }
        return res.status(200).json({
            success: true,
            bookings
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate('packageId');
        if (!booking) {
            return res.status(404).json({ message: 'No booking found with this ID' });
        }
        return res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving booking', error: error.message });
    }
};

// Get all bookings (admin)
exports.allBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user packageId');
        let totalRevenue = 0;
        bookings.forEach(booking => {
            totalRevenue += booking.totalPrice;
        });

        return res.status(200).json({
            success: true,
            totalRevenue,
            bookings
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving all bookings', error: error.message });
    }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'No booking found with this ID' });
        }
        return res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'No booking found' });
        }
        if (booking.bookingStatus === 'confirmed') {
            return res.status(400).json({ message: 'Booking already confirmed' });
        }

        booking.bookingStatus = req.body.status;
        await booking.save();

        return res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating booking status', error: error.message });
    }
};

// Total bookings count
exports.totalBookings = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        return res.status(200).json({
            success: true,
            totalBookings
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error counting total bookings', error: error.message });
    }
};

// Total revenue
exports.totalRevenue = async (req, res) => {
    try {
        const revenue = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            totalRevenue: revenue[0]?.totalRevenue || 0
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error calculating total revenue', error: error.message });
    }
};

// Revenue per user
exports.revenuePerUser = async (req, res) => {
    try {
        const revenuePerUser = await Booking.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: "$userDetails" },
            {
                $group: {
                    _id: "$userDetails.name",
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        return res.status(200).json({
            success: true,
            revenuePerUser
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error calculating revenue per user', error: error.message });
    }
};
