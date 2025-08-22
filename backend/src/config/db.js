const mongoose = require("mongoose");

const logger=require("./logger");

const connectDB= async ()=>{
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/zinr_restaurant';
        await mongoose.connect(mongoUri);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1); // Exit the process with failure
    }
}


module.exports=connectDB;