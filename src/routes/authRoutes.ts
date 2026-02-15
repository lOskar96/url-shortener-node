import { Router } from 'express'
import {
  register,
  login,
  logout,
  changeUsername
} from '../controllers/authController.js'
import { deleteUser } from '../controllers/authController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.put('/changeUsername', changeUsername)
router.delete('/deleteUser', deleteUser)

export default router
