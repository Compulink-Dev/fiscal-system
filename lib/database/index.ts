import mongoose from 'mongoose';

export async function dbConnect() {

    if (mongoose.connection.readyState >= 1) return;
    try {
        mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error' + err);
            process.exit();
        })
    } catch (error) {
        console.log(error);
    }
}