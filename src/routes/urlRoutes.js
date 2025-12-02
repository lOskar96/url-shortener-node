import { Router } from "express";
import {
  getUserUrls,
  redirectUrl,
  shortenUrl,
} from "../controllers/urlController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/shorten", protect, shortenUrl);
router.get("/", protect, getUserUrls);
router.get("/:code", redirectUrl);

export default router;
