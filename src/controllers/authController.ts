import { Url } from '../models/Url'
import { User, UserDocument } from '../models/User'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

const isProduction = process.env.NODE_ENV === 'production'

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
  })
}

const resCookie = (res: Response, token: string): Response => {
  return res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  })
}

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    username,
    email,
    password
  }: { username: string; email: string; password: string } = req.body
  const userExists: UserDocument | null = await User.findOne({ email })
  if (userExists)
    return res.status(400).json({ message: 'Usuario ya existente' })

  const user = (await User.create({
    username,
    email,
    password
  })) as UserDocument

  const token = generateToken(user._id)
  resCookie(res, token)

  return res.status(201).json({
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  })
}

export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body
  const user: UserDocument | null = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' })
  }

  const token = generateToken(user._id)

  resCookie(res, token)

  return res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  })
}

export const logout = (req: Request, res: Response): Response => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/'
  })

  return res.json({ message: 'Logout correcto' })
}

export const changeUsername = async (req: Request, res: Response) => {
  const { username, id }: { username: string; id: string } = req.body

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const { _id, ...user } = updatedUser.toObject()
    const responseUser = {
      ...user,
      id: _id
    }

    res.json({
      message: 'Username actualizado correctamente',
      user: responseUser
    })
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(500).json({ message: e.message })
    }
    return res.status(500).json({ message: 'Error inesperado', error: e })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    await Url.deleteMany({ user: id })
    await user.deleteOne()
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(500).json({ message: e.message })
    }
    return res.status(500).json({ message: 'Error inesperado', error: e })
  }
}
