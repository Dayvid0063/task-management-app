// server/api/auth/register.post.ts
import { z } from 'zod'
import { User } from '../../models/user.model'

const registerSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.string().trim().toLowerCase().email('A valid email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default defineEventHandler(async (event) => {
    const result = registerSchema.safeParse(await readBody(event))
    if (!result.success) {
        throw createError({ statusCode: 400, message: result.error?.issues[0]?.message ?? 'Invalid input' })
    }

    const { firstName, lastName, email, password } = result.data

    const existing = await User.findOne({ email })
    if (existing) {
        throw createError({ statusCode: 409, message: 'An account with this email already exists' })
    }

    const user = await User.create({ firstName, lastName, email, password })
    setSession(event, String(user._id))

    return { success: true }
})
