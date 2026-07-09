import { useEffect } from "react";

export const SITE_URL = "https://globalgsstore.com";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-image.jpg`;
export const INSTAGRAM_URL = "https://www.instagram.com/global.gs_/";
export const TIKTOK_URL = "https://www.tiktok.com/@juliovasquezpolanco";

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const trimDescription = (value) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
};

function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  keywords = "",
  robots = "index, follow",
  schema,
}) {
  useEffect(() => {
    const pageTitle = title || "Global-GS Store";
    const pageDescription = trimDescription(description);
    const canonicalUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const socialImage = image?.startsWith("http") ? image : DEFAULT_SOCIAL_IMAGE;

    document.title = pageTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: pageDescription,
    });

    if (keywords) {
      upsertMeta('meta[name="keywords"]', {
        name: "keywords",
        content: keywords,
      });
    }

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });

    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "es_DO",
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Global-GS Store",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: pageDescription,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: socialImage,
    });
    upsertMeta('meta[property="og:image:secure_url"]', {
      property: "og:image:secure_url",
      content: socialImage,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: pageTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: pageDescription,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: socialImage,
    });

    const schemaElementId = "global-gs-jsonld";
    let schemaElement = document.getElementById(schemaElementId);

    if (!schemaElement) {
      schemaElement = document.createElement("script");
      schemaElement.id = schemaElementId;
      schemaElement.type = "application/ld+json";
      document.head.appendChild(schemaElement);
    }

    if (schema) {
      schemaElement.textContent = JSON.stringify(schema);
    } else {
      schemaElement.textContent = "";
    }
  }, [description, image, keywords, path, robots, schema, title, type]);

  return null;
}

export default Seo;
