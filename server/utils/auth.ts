// server/utils/auth.ts
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import { User } from '../models/user.model'

const COOKIE_NAME = 'tm_user_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Sign a session token for the user and set it as an httpOnly cookie.
export function setSession(event: H3Event, userId: string) {
    const { sessionSecret } = useRuntimeConfig(event)
    const token = jwt.sign({ id: userId }, sessionSecret, { expiresIn: '7d' })
    setCookie(event, COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: MAX_AGE,
    })
}

export function clearAuthSession(event: H3Event) {
    deleteCookie(event, COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    })
}

// Verify the session cookie and return the user, or throw 401.
export async function requireAuth(event: H3Event) {
    const { sessionSecret } = useRuntimeConfig(event)
    const token = getCookie(event, COOKIE_NAME)
    if (!token) {
        throw createError({ statusCode: 401, message: 'Not authenticated' })
    }

    try {
        const decoded = jwt.verify(token, sessionSecret) as { id: string }
        const user = await User.findById(decoded.id)
        if (!user) {
            throw createError({ statusCode: 401, message: 'User not found' })
        }
        return user
    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({ statusCode: 401, message: 'Invalid or expired session' })
    }
}
