import Url from "../models/Url.js";
import { generateCode } from "../utils/generateCode.js";
import { normalizeUrl } from "../utils/normalizeUrl.js";

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    console.log(req.body);
    if (!originalUrl)
      return res.status(400).json({ message: "Falta la URL original" });

    const userId = req.user._id;

    const normalizedUrl = normalizeUrl(originalUrl);
    let url = await Url.findOne({ originalUrl: normalizedUrl, user: userId });
    if (url) return res.json(url);

    const shortCode = generateCode();
    const newUrl = await Url.create({
      originalUrl: normalizedUrl,
      shortCode,
      user: userId,
    });

    res.status(201).json(newUrl);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    console.log("entra");

    const { code } = req.params;

    let url = await Url.findOne({ shortCode: code });
    console.log(url.originalUrl);
    if (!url) return res.status(404).json({ message: "URL no encontrada" });
    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUserUrls = async (req, res) => {
  const urls = await Url.find({ user: req.user._id });
  res.json(urls);
};
