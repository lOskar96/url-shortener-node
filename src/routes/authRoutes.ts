import { Router } from 'express'
import {
  register,
  login,
  logout,
  changeUsername
} from '../controllers/authController'
import { deleteUser } from '../controllers/authController'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.put('/changeUsername', changeUsername)
router.delete('/deleteUser', deleteUser)

export default router
