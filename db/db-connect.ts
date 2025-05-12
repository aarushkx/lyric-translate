import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectToDatabase = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log(
            "Already connected to the database. Connection is still active."
        );
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!, {});
        connection.isConnected = db.connections[0].readyState;
        console.log("MongoDB connected successfully!");
    } catch (error: any) {
        console.log("MongoDB connection failed!");
        console.error(error);
        process.exit(0);
    }
};
