import { Url } from '../models/Url.js'
import { generateCode } from '../utils/generateCode.js'
import { normalizeUrl } from '../utils/normalizeUrl.js'

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, shortLink, description } = req.body
    if (!originalUrl)
      return res.status(400).json({ message: 'Falta la URL original' })
    if (!!shortLink && shortLink.length !== 6) {
      return res.status(400).json({
        message: 'El código del enlace debe tener exactamente 6 caracteres'
      })
    }
    if (
      shortLink &&
      (await Url.findOne({ shortCode: shortLink, user: req.user._id }))
    )
      return res.status(400).json({ message: 'El código del enlace ya existe' })
    const userId = req.user._id

    const normalizedUrl = normalizeUrl(originalUrl)
    let url = await Url.findOne({ originalUrl: normalizedUrl, user: userId })
    if (url) return res.json(url)

    let shortCode = shortLink ?? generateCode()
    while (await Url.findOne({ shortCode })) shortCode = generateCode()
    const newUrl = await Url.create({
      originalUrl: normalizedUrl,
      shortCode,
      description,
      user: userId
    })

    res.status(201).json(newUrl)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params

    let url = await Url.findOne({ shortCode: code })
    if (!url) return res.status(404).json({ message: 'URL no encontrada' })
    url.clicks += 1
    await url.save()

    res.status(302).redirect(url.originalUrl)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const getUserUrls = async (req, res) => {
  const urls = await Url.find({ user: req.user._id })
  res.json(urls)
}

export const deleteUrl = async (req, res) => {
  const { id } = req.params
  const url = await Url.findById(id)
  console.log(id, url)

  if (!url) return res.status(404).json({ message: 'URL no encontrada' })
  await url.deleteOne()
  res.json({ message: 'URL eliminada correctamente' })
}

export const editUrl = async (req, res) => {
  const { id, originalUrl, description } = req.body

  const url = await Url.findById(id)

  if (!url) return res.status(404).json({ message: 'URL no encontrada' })

  const normalizedUrl = normalizeUrl(originalUrl)

  await url.updateOne({
    originalUrl: normalizedUrl,
    description
  })

  res.json(url)
}
