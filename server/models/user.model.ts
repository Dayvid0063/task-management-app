// server/models/user.model.ts
import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

export interface IUserMethods {
    verifyPassword(candidate: string): Promise<boolean>
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        // Never returned by default; load with .select('+password') in the login route.
        password: { type: String, required: true, select: false },
    },
    { timestamps: true }
)

// Hash only when the password changed, so profile updates don't re-hash.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.verifyPassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password)
}

// models.User || model(...) guards against OverwriteModelError on HMR.
export const User = (mongoose.models.User as UserModel) || mongoose.model<IUser, UserModel>('User', userSchema)
export default User
