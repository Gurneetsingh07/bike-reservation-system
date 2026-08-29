import mongoose from "mongoose";
import Reservation from "../models/ReservationModel.js";
import Bike from "../models/BikeModel.js";

const createReservation = async (req, res) => {
    try {
        const { bikeId, fromDate, toDate } = req.body
        if (!bikeId || !fromDate || !toDate) {
            return res.status(400).json({
                success: false,
                message: "bikeId, fromDate and toDate are required",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(bikeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid bike ID",
            });
        }
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).json({
                success: false,
                message: "Bike not found",
            });
        }
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format",
            });
        }
        if (startDate > endDate) {
            return res.status(400).json({
                success: false,
                message: "From date cannot be greater than to date",
            });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            return res.status(400).json({
                success: false,
                message: "From date cannot be in the past",
            });
        }
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required",
            });
        }
        const existingReservation = await Reservation.findOne({
            bike: bikeId,
            status: "active",

            // Date overlap condition
            fromDate: {
                $lte: endDate,
            },

            toDate: {
                $gte: startDate,
            },
        });

        if (existingReservation) {
            return res.status(409).json({
                success: false,
                message: "Bike is not available for the selected dates",
            });
        }
        const reservation = await Reservation.create({
            bike: bikeId,
            user: userId,
            fromDate: startDate,
            toDate: endDate,
            status: "active",
        });
        return res.status(201).json({
            success: true,
            message: "Bike reserved successfully",
            reservation,
        });
    }
    catch (error) {
        console.error("Create reservation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const cancelReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(reservationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reservation ID",
            });
        }
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }
        if (reservation.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot cancel another user's reservation",
            });
        }
        if (reservation.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Reservation is already cancelled",
            });
        }
        reservation.status = "cancelled";
        await reservation.save();

        return res.status(200).json({
            success: true,
            message: "Reservation cancelled successfully",
            reservation,
        });
    }
    catch (error) {
        console.error("Cancel reservation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const rateReservation = async (req, res) => {
    try {
        const {reservationId} = req.params;
        const { rating } = req.body;
        if (!mongoose.Types.ObjectId.isValid(reservationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reservation ID",
            });
        }
        if (rating === undefined || rating === null) {
            return res.status(400).json({
                success: false,
                message: "Rating is required",
            });
        }
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5",
            });
        }
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }
        if (reservation.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot rate another user's reservation",
            });
        }
        if (reservation.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Only active reservations can be rated",
            });
        }
        if (reservation.rating !== null && reservation.rating !== undefined) {
            return res.status(400).json({
                success: false,
                message: "Reservation has already been rated",
            });
        }
        reservation.rating = rating;
        await reservation.save();
        return res.status(200).json({
            success: true,
            message: "Reservation rated successfully",
            reservation,
        });

    }
    catch (error) {
        console.error("Rate reservation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const getReservationsByBike = async (req, res) => {
    try {
        const { bikeId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(bikeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid bike ID",
            });
        }
        const reservations = await Reservation.find({ bike: bikeId }).populate("user", "name email");
        
        return res.status(200).json({
            success: true,
            reservations,
        });
    } catch (error) {
        console.error("Get reservations by bike error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


export {
    createReservation,
    cancelReservation,
    rateReservation,
    getReservationsByBike
}