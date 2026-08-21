import Bike from "../models/BikeModel.js";
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


export {
    addBike,
    updateBike,
    deleteBike
}
