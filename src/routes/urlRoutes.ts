import { Router } from 'express'
import {
  getUserUrls,
  shortenUrl,
  deleteUrl,
  editUrl
} from '../controllers/urlController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.post('/shorten', protect, shortenUrl)
router.get('/', protect, getUserUrls)
router.delete('/removeURL/:id', protect, deleteUrl)
router.put('/editURL', protect, editUrl)

export default router
