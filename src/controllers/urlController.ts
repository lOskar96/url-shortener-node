import { Url } from '../models/Url'
import { generateCode } from '../utils/generateCode'
import { normalizeUrl } from '../utils/normalizeUrl'
import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'

interface UrlDto {
  id?: string
  originalUrl: string
  shortLink?: string
  description?: string
}

export const shortenUrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { originalUrl, shortLink, description }: UrlDto = req.body
    if (!originalUrl)
      return res.status(400).json({ message: 'Falta la URL original' })
    if (!!shortLink && shortLink.length !== 6) {
      return res.status(400).json({
        message: 'El código del enlace debe tener exactamente 6 caracteres'
      })
    }
    if (
      shortLink &&
      (await Url.findOne({ shortCode: shortLink, user: req.user?._id }))
    )
      return res.status(400).json({ message: 'El código del enlace ya existe' })
    const userId: string | undefined = req.user?._id

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
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(500).json({ message: e.message })
    }
    return res.status(500).json({ message: 'Error inesperado', error: e })
  }
}

export const redirectUrl = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { code } = req.params

    let url = await Url.findOne({ shortCode: code })
    if (!url) return res.status(404).json({ message: 'URL no encontrada' })
    url.clicks += 1
    await url.save()

    res.status(302).redirect(url.originalUrl)
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(500).json({ message: e.message })
    }
    return res.status(500).json({ message: 'Error inesperado', error: e })
  }
}

export const getUserUrls = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const urls = await Url.find({ user: req.user?._id })
  res.json(urls)
}

export const deleteUrl = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params
  const url = await Url.findById(id)

  if (!url) return res.status(404).json({ message: 'URL no encontrada' })
  await url.deleteOne()
  res.json({ message: 'URL eliminada correctamente' })
}

export const editUrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response | void> => {
  const { id, originalUrl, description }: UrlDto = req.body

  const url = await Url.findById(id)

  if (!url) return res.status(404).json({ message: 'URL no encontrada' })

  const normalizedUrl = normalizeUrl(originalUrl)

  await url.updateOne({
    originalUrl: normalizedUrl,
    description
  })

  res.json(url)
}
