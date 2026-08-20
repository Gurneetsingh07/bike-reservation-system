import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bikeRoutes from "./routes/bikeRoutes.js";
import userRoutes from "./routes/userRoutes.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use("/bikes", bikeRoutes);
app.use("/user",userRoutes)

console.log("Mongo URI exists:", !!process.env.MONGO_URI);
connectDB().then(() => {
    app.listen(5000, () => {
        console.log("server is running on port 5000");
    });
})
