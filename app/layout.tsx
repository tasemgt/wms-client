import type React from "react"
import type { Metadata } from "next"
import { Roboto, Questrial } from "next/font/google"
import "./globals.css"

const roboto = Questrial({
  subsets: ["latin"],
  weight: "400", //["100", "300", "400", "500", "700", "900"],
  style: ["normal"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wedding Management System",
  description: "Complete wedding invitation and guest management platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
