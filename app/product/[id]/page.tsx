import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductDetail from "@/components/product-detail"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          }
        >
          <ProductDetail productId={params.id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
