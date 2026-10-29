export function getProductVideoUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (!/\.(mp4|mov|webm|m4v)$/i.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export const productHasVideo = (product) => Boolean(getProductVideoUrl(product.video));
