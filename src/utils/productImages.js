export const PRODUCT_IMAGE_FALLBACK = "/og-image.jpg";

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

export const getProductImageUrl = (url, width = 640) => {
  if (!url) return PRODUCT_IMAGE_FALLBACK;

  const safeWidth = Math.max(160, Math.min(Number(width) || 640, 1600));

  if (
    url.includes("res.cloudinary.com/") &&
    url.includes(CLOUDINARY_UPLOAD_SEGMENT)
  ) {
    return url.replace(
      CLOUDINARY_UPLOAD_SEGMENT,
      `${CLOUDINARY_UPLOAD_SEGMENT}f_auto,q_auto:eco,c_limit,w_${safeWidth}/`,
    );
  }

  return url;
};

export const getProductImageSrcSet = (url, widths = [320, 640]) => {
  if (!url || !url.includes("res.cloudinary.com/")) return undefined;

  return widths
    .map((width) => {
      const srcSetUrl = getProductImageUrl(url, width).replaceAll(",", "%2C");
      return `${srcSetUrl} ${width}w`;
    })
    .join(", ");
};

export const useProductImageFallback = (event) => {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "true") return;

  image.dataset.fallbackApplied = "true";
  image.removeAttribute("srcset");
  image.src = PRODUCT_IMAGE_FALLBACK;
};
