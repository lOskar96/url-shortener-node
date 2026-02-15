import { Schema, model, HydratedDocument } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
  username: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>

const userSchema = new Schema<IUser, {}, IUserMethods>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  const user = this as UserDocument

  if (!user.isModified('password')) return next()

  user.password = await bcrypt.hash(user.password, 10)
  next()
})

userSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export const User = model<IUser>('User', userSchema)
