import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });
        console.log("MongoDb connected successfully");
    }
    catch (error) {
        console.log("Mongo connection error");
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;
