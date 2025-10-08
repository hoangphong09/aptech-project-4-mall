import type { Product1688 } from "./api"
import type { MultilingualProduct } from "./mock-products"
import type { Language } from "./translations"

export function getTranslatedProductTitle(product: MultilingualProduct, language: Language): string {
  switch (language) {
    case "en":
      return product.title_en || product.title
    case "zh":
      return product.title_zh || product.title
    case "vi":
    default:
      return product.title
  }
}

export function getTranslatedProduct(product: MultilingualProduct, language: Language): Product1688 {
  return {
    ...product,
    title: getTranslatedProductTitle(product, language),
  }
}
