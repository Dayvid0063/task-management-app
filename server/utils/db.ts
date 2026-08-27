// server/utils/db.ts
import mongoose from 'mongoose'

// Reuse the live connection if present, otherwise open one (prevents HMR connection leaks).
export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    const { mongodbUri } = useRuntimeConfig()
    if (!mongodbUri) {
        throw createError({ statusCode: 500, message: 'MongoDB URI is not configured' })
    }

    try {
        await mongoose.connect(mongodbUri)
        return mongoose.connection
    } catch (error) {
        console.error('MongoDB connection error:', error)
        throw createError({ statusCode: 500, message: 'Database connection failed' })
    }
}
