import mongoose, { mongo } from "mongoose";



const ReservationSchema = new mongoose.Schema(
    {
        bike: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bike",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fromDate: {
            type: Date,
            required: true,
        },
        toDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "cancelled"],
            default: "active",
        },
        rating:{
            type:Number,
            min:1,
            max:5,
            default:null
        }
    },
    {
        timestamps: true,
    }
);

const Reservation = mongoose.model("Reservation", ReservationSchema);
export default Reservation;