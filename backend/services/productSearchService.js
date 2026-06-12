import Product from "../models/Product.js";

export const normalizeText = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const getSearchScore = (product, query) => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;

  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  const name = normalizeText(product.name);
  const description = normalizeText(product.description);
  const category = normalizeText(product.category);
  const searchable = `${name} ${description} ${category}`;

  let score = 0;

  if (name === normalizedQuery) score += 140;
  if (name.includes(normalizedQuery)) score += 90;
  if (category.includes(normalizedQuery)) score += 45;
  if (description.includes(normalizedQuery)) score += 35;

  words.forEach((word) => {
    if (name.includes(word)) score += 24;
    if (category.includes(word)) score += 12;
    if (description.includes(word)) score += 8;
  });

  if (words.length > 1 && words.every((word) => searchable.includes(word))) {
    score += 30;
  }

  return score;
};

export const searchProducts = async (query, limit = 3) => {
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });

  return products
    .map((product) => ({
      product,
      score: getSearchScore(product, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
};
