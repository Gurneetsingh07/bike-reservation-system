import mongoose from "mongoose";
const bikeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const Bike = mongoose.model("Bike", bikeSchema);

export default Bike;