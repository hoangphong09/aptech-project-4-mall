export interface Product1688 {
  item_id: string
  title: string
  price: string
  original_price?: string
  main_imgs: string[]
  video?: string
  shop_name: string
  seller_id: string
  sales: number
  category_name: string
}

// Sample product IDs for demo purposes
export const SAMPLE_PRODUCT_IDS = {
  recommendations: ["123456789", "987654321", "456789123", "789123456"],
  suggestions: ["321654987", "654987321", "147258369", "369258147"],
  flashSales: ["111222333", "444555666", "777888999", "101112131", "141516171", "181920212"],
  shoes: ["nike001", "nike002", "nike003", "nike004", "nike005", "nike006"],
  keyboards: ["161718192", "202122232", "242526272", "282930313"],
  womenFashion: [
    "women001",
    "women002",
    "women003",
    "women004",
    "women005",
    "women006",
    "women007",
    "women008",
    "women009",
    "women010",
  ],
  menFashion: ["484950515", "525354555", "565758596", "606162636"],
  kidsFashion: ["646566676", "686970717", "727374757", "767778798"],
}

// Fetch products from our secure API route
export async function getProducts(itemIds: string[]): Promise<Product1688[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const response = await fetch(`/api/products?ids=${itemIds.join(",")}`, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("[v0] API request failed:", response.status)
      return []
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("[v0] API returned non-JSON response:", contentType)
      return []
    }

    const result = await response.json()
    return result.products || []
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("[v0] Request timeout - API took too long to respond")
      } else {
        console.error("[v0] Error fetching products:", error.message)
      }
    } else {
      console.error("[v0] Error fetching products:", error)
    }
    return []
  }
}

// Transform API data to our internal format
export function transformProductData(apiProduct: Product1688) {
  return {
    id: apiProduct.item_id,
    title: apiProduct.title,
    price: formatPrice(apiProduct.price),
    oldPrice: apiProduct.original_price ? formatPrice(apiProduct.original_price) : undefined,
    image: apiProduct.main_imgs?.[0] || "/diverse-products-still-life.png",
    views: apiProduct.sales?.toString() || "0",
    shopName: apiProduct.shop_name,
    category: apiProduct.category_name,
  }
}

function formatPrice(price: string): string {
  // Convert price to Vietnamese dong format
  const numPrice = Number.parseFloat(price)
  if (isNaN(numPrice)) return price

  // Assuming conversion rate (this should be dynamic in production)
  const vndPrice = Math.round(numPrice * 3790)
  return vndPrice.toLocaleString("vi-VN")
}
