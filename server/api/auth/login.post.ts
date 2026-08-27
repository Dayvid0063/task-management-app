// server/api/auth/login.post.ts
import { z } from 'zod'
import { User } from '../../models/user.model'

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email('A valid email is required'),
    password: z.string().min(1, 'Password is required'),
})

export default defineEventHandler(async (event) => {
    const result = loginSchema.safeParse(await readBody(event))
    if (!result.success) {
        throw createError({ statusCode: 400, message: result.error?.issues[0]?.message ?? 'Validation error' })
    }

    const { email, password } = result.data

    // select('+password') because the field is select:false on the model.
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.verifyPassword(password))) {
        throw createError({ statusCode: 401, message: 'Invalid email or password' })
    }

    setSession(event, String(user._id))

    return { success: true }
})
