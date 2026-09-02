import Bike from "../models/BikeModel.js";
import ReservationModel from "../models/ReservationModel.js"

const addBike = async (req, res) => {
    try {
        const { name, color, location, isAvailable } = req.body;
        if (!name || !color || !location) {
            return res.status(400).json({
                message: "name,color and location are required"
            });
        }
        const bike = await Bike.create({
            name: name.trim(),
            color: color.trim(),
            location: location.trim(),
            isAvailable: isAvailable != undefined ? isAvailable : true

        });
        res.status(201).json({
            message: "Bike added succesfully",
            bike,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to add bike",
            error: error.message
        });
    }
};

const updateBike = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, color, location, isAvailable } = req.body;

        const bike = await Bike.findById(id);
        if (!bike) {
            return res.status(404).json({
                message: "Bike not found"
            })
        }
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Name cannot be empty"
                });
            }

            bike.name = name.trim();
        }

        if (color !== undefined) {
            if (!color.trim()) {
                return res.status(400).json({
                    message: "Color cannot be empty"
                });
            }

            bike.color = color.trim();
        }

        if (location !== undefined) {
            if (!location.trim()) {
                return res.status(400).json({
                    message: "Location cannot be empty"
                });
            }

            bike.location = location.trim();
        }

        if (isAvailable !== undefined) {
            bike.isAvailable = isAvailable;
        }

        await bike.save();

        return res.status(200).json({
            message: "Bike updated successfully",
            bike
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update bike",
            error: error.message
        })
    }
}

const deleteBike = async (req, res) => {
    try {
        const { id } = req.params;
        const bike = await Bike.findById(id);
        if (!bike) {
            return res.status(404).json({
                message: "Bike not found"
            });
        }
        await Bike.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Bike deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete bike",
            error: error.message
        });
    }
}

const getBikes = async (req, res) => {
    try {
        const {
            name,
            color,
            location,
            minRating,
            fromDate,
            toDate,
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or limit",
            });
        }
        if ((fromDate && !toDate) || (!fromDate && toDate)) {
            return res.status(400).json({
                success: false,
                message: "Both fromDate and toDate are required",
            });
        }

        const query = {};
        if (req.user?.role !== "manager") {
            query.isAvailable = true;
        }

        if (name) {
            query.name = {
                $regex: name,
                $options: "i",
            };
        }

        if (color) {
            query.color = {
                $regex: `^${color}$`,
                $options: "i",
            };
        }

        if (location) {
            query.location = {
                $regex: location,
                $options: "i",
            };
        }

        if (minRating) {
            const rating = Number(minRating);

            if (isNaN(rating)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid minimum rating",
                });
            }

            query.rating = {
                $gte: rating,
            };
        }

        if (fromDate && toDate) {
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            endDate.setHours(23, 59, 59, 999);

            if (
                isNaN(startDate) ||
                isNaN(endDate) ||
                startDate < today ||
                endDate < startDate
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date range",
                });
            }

            const reservations = await ReservationModel.find({
                status: "active",
                fromDate: { $lte: endDate },
                toDate: { $gte: startDate },
            }).select("bike");

            query._id = {
                $nin: reservations.map(
                    (reservation) => reservation.bike
                ),
            };
        }

        const skip = (pageNumber - 1) * limitNumber;

        const totalBikes = await Bike.countDocuments(query);

        const bikes = await Bike.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bikes,
            totalPages: Math.ceil(totalBikes / limitNumber),
        });

    } catch (error) {
        console.error("Get bikes error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export {
    addBike,
    updateBike,
    deleteBike,
    getBikes,
}
