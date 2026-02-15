import jwt from 'jsonwebtoken'
import { User, UserDocument } from '../models/User.js'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
  user?: UserDocument
}

interface DecodedToken extends JwtPayload {
  id: string
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const token: string | undefined = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'No token, acceso denegado' })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken

    const user = await User.findById(decoded.id).select('-password') as UserDocument | null

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
