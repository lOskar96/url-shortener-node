import { Router } from 'express'
import {
  getUserUrls,
  redirectUrl,
  shortenUrl,
  deleteUrl,
  editUrl
} from '../controllers/urlController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/shorten', protect, shortenUrl)
router.get('/', protect, getUserUrls)
router.get('/:code', redirectUrl)
router.delete('/removeURL/:id', protect, deleteUrl)
router.put('/editURL', protect, editUrl)

export default router
