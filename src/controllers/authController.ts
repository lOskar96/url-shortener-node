import { Url } from '../models/Url.js'
import { User, UserDocument } from '../models/User.js'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
}

const resCookie = (res: Response, token: string): Response => {
  return res.cookie('token', token, {
    httpOnly: true,
    secure: false, // poner false solo en localhost para pruebas
    sameSite: 'Lax',
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
  if (userExists)hhj
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

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
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

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    path: '/'
  })

  return res.json({ message: 'Logout correcto' })
}

export const changeUsername = async (req, res) => {
  const { username, id } = req.body

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

    const user = updatedUser.toObject()
    const responseUser = {
      ...user,
      id: user._id
    }

    delete responseUser._id

    res.json({
      message: 'Username actualizado correctamente',
      user: responseUser
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    await Url.deleteMany({ user: id })
    await user.deleteOne()
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}
