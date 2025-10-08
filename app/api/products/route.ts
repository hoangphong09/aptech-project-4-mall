import { type NextRequest, NextResponse } from "next/server"
import { getMockProduct } from "@/lib/mock-products"

const API_BASE_URL = "https://tmapi.top/api/ali/item-detail"
const API_TOKEN = process.env.TMAPI_TOKEN

interface Product1688 {
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const itemIds = searchParams.get("ids")

  if (!itemIds) {
    return NextResponse.json({ error: "Missing item IDs" }, { status: 400 })
  }

  console.log("[v0] Using comprehensive mock data")
  const ids = itemIds.split(",")
  const products = ids.map((id) => getMockProduct(id)).filter((p): p is Product1688 => p !== null)

  return NextResponse.json({ products })

  // Original API code commented out - uncomment to use real API
  /*
  if (!API_TOKEN || API_TOKEN === "demo" || API_TOKEN.trim() === "") {
    console.log("[v0] Using mock data - API token not configured")
    return NextResponse.json({
      products: itemIds.split(",").map((id) => generateMockProduct(id)),
    })
  }

  try {
    const ids = itemIds.split(",")
    const promises = ids.map(async (id) => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(`${API_BASE_URL}?item_id=${id}&apiToken=${API_TOKEN}`, {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error(`[v0] API returned non-JSON response for item ${id}:`, contentType)
          return generateMockProduct(id)
        }

        if (!response.ok) {
          console.error(`[v0] API request failed for item ${id}:`, response.status)
          return generateMockProduct(id)
        }

        const result = await response.json()

        if (result.code === 200 && result.data) {
          return result.data
        }

        console.log(`[v0] API returned unsuccessful code for item ${id}:`, result.code)
        return generateMockProduct(id)
      } catch (error) {
        console.error(`[v0] Error fetching item ${id}:`, error instanceof Error ? error.message : error)
        return generateMockProduct(id)
      }
    })

    const results = await Promise.all(promises)
    const products = results.filter((p) => p !== null)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({
      products: itemIds.split(",").map((id) => generateMockProduct(id)),
    })
  }
  */
}
