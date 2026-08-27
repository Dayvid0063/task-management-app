// server/api/auth/logout.post.ts

export default defineEventHandler(async (event) => {
    clearAuthSession(event)
    return { success: true }
})
