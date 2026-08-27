// server/plugins/db.ts

export default defineNitroPlugin(async () => {
    await connectDB()
    console.log('MongoDB connected via server plugin')
})
