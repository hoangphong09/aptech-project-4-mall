"use client"

import { useState, useEffect } from "react"
import { getProducts, SAMPLE_PRODUCT_IDS, transformProductData } from "@/lib/api"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedProductTitle } from "@/lib/product-utils"

export default function ProductRecommendations() {
  const { t, language } = useLanguage()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)

      const recProducts = await getProducts(SAMPLE_PRODUCT_IDS.recommendations)
      const recTransformed = recProducts.map((p, index) => ({
        ...transformProductData(p),
        rank: index + 1,
        originalProduct: p,
      }))

      const sugProducts = await getProducts(SAMPLE_PRODUCT_IDS.suggestions)
      const sugTransformed = sugProducts.map((p) => ({ ...transformProductData(p), originalProduct: p }))

      setRecommendations(recTransformed)
      setSuggestions(sugTransformed)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 py-3 border-b border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 py-3 border-b border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Best Sellers */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-bold text-gray-900">{t("bestSelling")}</h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 bg-gray-50 border-y border-gray-200 text-sm font-medium text-gray-700">
          <div>{t("product")}</div>
          <div className="text-right">{t("price")}</div>
          <div className="text-right w-32">{t("salesVolume")}</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {recommendations.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer items-center">
                {/* Product Column */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">1688</span>
                    </div>
                    <h3 className="text-sm text-gray-900 line-clamp-2">
                      {product.originalProduct
                        ? getTranslatedProductTitle(product.originalProduct, language)
                        : product.title}
                    </h3>
                  </div>
                </div>

                {/* Price Column */}
                <div className="text-right">
                  <span className="text-[#FF6600] font-medium text-sm whitespace-nowrap">{product.price}</span>
                </div>

                {/* Sales Volume Column */}
                <div className="text-right w-32">
                  <span className="text-gray-600 text-sm">{product.sales?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-bold text-gray-900">{t("suggested")}</h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 bg-gray-50 border-y border-gray-200 text-sm font-medium text-gray-700">
          <div>{t("product")}</div>
          <div className="text-right">{t("price")}</div>
          <div className="text-right w-32">{t("salesVolume")}</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {suggestions.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer items-center">
                {/* Product Column */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">1688</span>
                    </div>
                    <h3 className="text-sm text-gray-900 line-clamp-2">
                      {product.originalProduct
                        ? getTranslatedProductTitle(product.originalProduct, language)
                        : product.title}
                    </h3>
                  </div>
                </div>

                {/* Price Column */}
                <div className="text-right">
                  <span className="text-[#FF6600] font-medium text-sm whitespace-nowrap">{product.price}</span>
                </div>

                {/* Sales Volume Column */}
                <div className="text-right w-32">
                  <span className="text-gray-600 text-sm">{product.sales?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
