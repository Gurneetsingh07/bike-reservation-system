import Bike from "../models/BikeModel.js";
const addBike = async (req, res) => {
    try {
        const { name, color, location, isAvailable, rating } = req.body;
        if (!name || !color || !location) {
            return res.status(400).json({
                message: "name,color and location are required"
            });
        }
        const bike = await Bike.create({
            name,
            color,
            location,
            isAvailable,
            rating
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



export {
    addBike
}
