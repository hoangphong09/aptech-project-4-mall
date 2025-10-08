import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://api.tmapi.top/1688/category/info"
const API_TOKEN = process.env.TMAPI_TOKEN

interface Category1688 {
  id: string
  name: string
  icon?: string
  level?: number
  parent_id?: string
}

// Mock categories as fallback
const MOCK_CATEGORIES: Category1688[] = [
  { id: "1", name: "服装服饰", icon: "👕", level: 1, parent_id: "0" },
  { id: "2", name: "母婴用品", icon: "👶", level: 1, parent_id: "0" },
  { id: "3", name: "电子配件", icon: "🔌", level: 1, parent_id: "0" },
  { id: "4", name: "办公文具", icon: "✏️", level: 1, parent_id: "0" },
  { id: "5", name: "美容护理", icon: "🍃", level: 1, parent_id: "0" },
  { id: "6", name: "家用电器", icon: "🔌", level: 1, parent_id: "0" },
  { id: "7", name: "汽车配件", icon: "🚗", level: 1, parent_id: "0" },
  { id: "8", name: "运动户外", icon: "⚽", level: 1, parent_id: "0" },
  { id: "9", name: "箱包皮具", icon: "👜", level: 1, parent_id: "0" },
]

export async function GET(request: NextRequest) {
  console.log("[v0] Fetching categories from API")

  // Use mock data for now
  console.log("[v0] Using mock category data")
  return NextResponse.json({ categories: MOCK_CATEGORIES })

  // Uncomment below to use real API when ready
  /*
  if (!API_TOKEN || API_TOKEN === "demo" || API_TOKEN.trim() === "") {
    console.log("[v0] Using mock categories - API token not configured")
    return NextResponse.json({ categories: MOCK_CATEGORIES })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${API_BASE_URL}?apiToken=${API_TOKEN}`, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    })

    clearTimeout(timeoutId)

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("[v0] Category API returned non-JSON response:", contentType)
      return NextResponse.json({ categories: MOCK_CATEGORIES })
    }

    if (!response.ok) {
      console.error("[v0] Category API request failed:", response.status)
      return NextResponse.json({ categories: MOCK_CATEGORIES })
    }

    const result = await response.json()

    if (result.code === 200 && result.data) {
      return NextResponse.json({ categories: result.data })
    }

    console.log("[v0] Category API returned unsuccessful code:", result.code)
    return NextResponse.json({ categories: MOCK_CATEGORIES })
  } catch (error) {
    console.error("[v0] Error fetching categories:", error instanceof Error ? error.message : error)
    return NextResponse.json({ categories: MOCK_CATEGORIES })
  }
  */
}
