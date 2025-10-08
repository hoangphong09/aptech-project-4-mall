"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { getProducts } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedProductTitle } from "@/lib/product-utils"
import type { Product1688 } from "@/lib/api"

interface Product {
  id: string
  title: string
  price: string
  originalPrice?: string
  image: string
  sales?: number
  discount?: number
  originalProduct?: Product1688
}

interface ProductGridProps {
  title: string
  productIds: string[]
  showBanner?: boolean
}

export default function ProductGrid({ title, productIds, showBanner = true }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)

      const fetchedProducts = await getProducts(productIds)
      const transformed = fetchedProducts.map((p) => {
        const price = Number.parseFloat(p.price || "0")
        const originalPrice = Number.parseFloat(p.original_price || "0")
        const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

        return {
          id: p.item_id,
          title: p.title,
          price: `${Math.round(price).toLocaleString()} đ`,
          originalPrice: originalPrice > 0 ? `¥${(originalPrice / 1000).toFixed(1)}` : undefined,
          image: p.main_imgs?.[0] || "/placeholder.svg",
          sales: p.sales,
          discount,
          originalProduct: p,
        }
      })

      setProducts(transformed)
      setLoading(false)
    }

    fetchProducts()
  }, [productIds])

  if (loading) {
    return (
      <div>
        <div className="h-8 bg-muted rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {showBanner && <div className="row-span-2 bg-muted rounded-lg animate-pulse"></div>}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          href="#"
          className="text-sm text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1"
        >
          {t("viewMore")}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 auto-rows-fr">
        {showBanner && (
          <div className="row-span-2 rounded-lg overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-300 to-blue-200 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-sm">A</span>
                  </div>
                  <span className="text-white font-bold text-lg">ATlogistics</span>
                </div>
                <h3 className="text-white text-2xl font-bold leading-tight mb-2" style={{ fontFamily: "serif" }}>
                  {t("trendyItems")}
                </h3>
                <h3 className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: "serif" }}>
                  {t("allNightLong")}
                </h3>
              </div>
              <div className="mt-auto">
                <div className="bg-white rounded-full px-6 py-2 inline-flex items-center gap-2 shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-orange-500 font-bold text-sm">{t("discoverNow")}</span>
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  1688
                </div>
                <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 h-10 leading-5">
                  {product.originalProduct
                    ? getTranslatedProductTitle(product.originalProduct, language)
                    : product.title}
                </h3>

                <div className="flex items-center gap-2 mb-2 text-xs">
                  {product.discount > 0 && (
                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200">
                      {product.discount}% {t("buyAgain")}
                    </span>
                  )}
                  {product.sales !== undefined && (
                    <span className="text-gray-500">
                      {t("sold")} {product.sales.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-orange-500 font-bold text-lg">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 text-sm line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
