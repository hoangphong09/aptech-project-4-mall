import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})

import { Inter, Roboto_Mono, Libre_Baskerville as V0_Font_Libre_Baskerville, IBM_Plex_Mono as V0_Font_IBM_Plex_Mono, Lora as V0_Font_Lora } from 'next/font/google'

// Initialize fonts
const _libreBaskerville = V0_Font_Libre_Baskerville({ subsets: ['latin'], weight: ["400","700"], variable: '--v0-font-libre-baskerville' })
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"], variable: '--v0-font-ibm-plex-mono' })
const _lora = V0_Font_Lora({ subsets: ['latin'], weight: ["400","500","600","700"], variable: '--v0-font-lora' })
const _v0_fontVariables = `${_libreBaskerville.variable} ${_ibmPlexMono.variable} ${_lora.variable}`

export const metadata: Metadata = {
  title: "ATlogistics - Nhập hàng Trung Quốc giá gốc",
  description: "Nền tảng nhập hàng Trung Quốc uy tín, giá tốt nhất",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${robotoMono.variable} antialiased`}>
      <body className={_v0_fontVariables}>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
