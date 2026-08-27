// server/api/auth/me.get.ts

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event)

    return {
        success: true,
        user: {
            id: String(user._id),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    }
})
