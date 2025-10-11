"use client"

import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProductRecommendations from "@/components/product-recommendations"
import FlashSales from "@/components/flash-sales"
import BrandSection from "@/components/brand-section"
import ProductGrid from "@/components/product-grid"
import Footer from "@/components/footer"
import { SAMPLE_PRODUCT_IDS } from "@/lib/api"
import { useLanguage } from "@/contexts/language-context"

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { t } = useLanguage()
  const debugSession = useSession()
    useEffect(()=>{
      console.log("Session Data: "+ debugSession.data?.user.username);
      console.log("Session Status: "+ debugSession.status);
    }, [debugSession])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <div className="container mx-auto px-4 py-10 space-y-10">
          <ProductRecommendations />
          <FlashSales />
          <BrandSection
            title={t("internationalBrands")}
            brands={[
              { name: "Nike", logo: "/nike-logo.svg" },
              { name: "Dessuu", logo: "/dessuu-logo.svg" },
              { name: "Popmart", logo: "/popmart-logo.svg" },
              { name: "Deerma", logo: "/deerma-logo.svg" },
              { name: "Peak", logo: "/peak-logo.svg" },
              { name: "Huawei", logo: "/huawei-logo.svg" },
            ]}
            productIds={SAMPLE_PRODUCT_IDS.shoes}
          />
          <BrandSection
            title={t("localBrands")}
            brands={[
              { name: "Logitech" },
              { name: "Razer" },
              { name: "Corsair" },
              { name: "SteelSeries" },
              { name: "HyperX" },
            ]}
            productIds={SAMPLE_PRODUCT_IDS.keyboards}
          />
          <ProductGrid title={t("womenFashion")} productIds={SAMPLE_PRODUCT_IDS.womenFashion} />
          <ProductGrid title={t("menFashion")} productIds={SAMPLE_PRODUCT_IDS.menFashion} />
          <ProductGrid title={t("kidsFashion")} productIds={SAMPLE_PRODUCT_IDS.kidsFashion} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
