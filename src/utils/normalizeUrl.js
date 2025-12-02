export const normalizeUrl = (originalUrl) => {
  try {
    let tempUrl = originalUrl;
    if (!/^https?:\/\//i.test(originalUrl)) {
      tempUrl = "https://" + originalUrl; // agrega https si no tiene
    }

    const urlObj = new URL(tempUrl);
    let normalized = urlObj.hostname + urlObj.pathname;

    if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);

    return urlObj.protocol + "//" + normalized; // ✅ incluye protocolo
  } catch (err) {
    return originalUrl; // fallback
  }
};
