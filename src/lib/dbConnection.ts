import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number,
}

const connection: ConnectionObject = {}

const dbConnect = async (): Promise<void> => {
    if (connection.isConnected) {
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_DB_URI || "")
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully 🚀🚀")
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}
export default dbConnect