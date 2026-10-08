export const PRODUCT_IMAGE_FALLBACK = "/og-image.jpg";

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";
const CLOUDINARY_SOURCE =
  "https://res.cloudinary.com/dvjjqokdy/image/upload/";
const CATALOG_IMAGE_PROXY = "/catalog-image/";

export const getProductImageUrl = (url, width = 640) => {
  if (!url) return PRODUCT_IMAGE_FALLBACK;

  const safeWidth = Math.max(160, Math.min(Number(width) || 640, 1600));

  if (
    url.startsWith(CLOUDINARY_SOURCE) &&
    url.includes(CLOUDINARY_UPLOAD_SEGMENT)
  ) {
    const imagePath = url.slice(CLOUDINARY_SOURCE.length);
    return `${CATALOG_IMAGE_PROXY}f_auto,q_auto:eco,c_limit,w_${safeWidth}/${imagePath}`;
  }

  return url;
};

export const useProductImageFallback = (event) => {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "true") return;

  image.dataset.fallbackApplied = "true";
  image.removeAttribute("srcset");
  image.src = PRODUCT_IMAGE_FALLBACK;
};
