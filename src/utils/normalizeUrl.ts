export const normalizeUrl = (originalUrl: string): string => {
  try {
    let tempUrl = originalUrl
    if (!/^https?:\/\//i.test(originalUrl)) {
      tempUrl = 'https://' + originalUrl
    }

    const urlObj = new URL(tempUrl)
    let normalized: string = urlObj.hostname + urlObj.pathname

    if (normalized.endsWith('/')) normalized = normalized.slice(0, -1)

    return urlObj.protocol + '//' + normalized
  } catch (err) {
    return originalUrl
  }
}
