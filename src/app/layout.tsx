import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import BaseToaster from "~/components/BaseToaster"
import { cn } from "~/lib/utils"

const inter = Inter({ subsets: ["latin"] })
export const runtime = "edge"

export const metadata: Metadata = {
  title: {
    default: "Share",
    template: "%s | Share",
  },
  description: "Share your music from the edge 🪐",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL as string),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Share",
    description: "Share your music from the edge 🪐",
    url: new URL(process.env.NEXT_PUBLIC_BASE_URL as string).href,
    locale: "en_US",
  },
  twitter: {
    title: "Share",
    description: "Share your music from the edge 🪐",
    creator: "@darryl_codes",
    site: new URL(process.env.NEXT_PUBLIC_BASE_URL as string).href,
    card: "summary_large_image",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "mx-auto flex h-screen w-full max-w-5xl flex-col space-y-6 bg-black p-3"
        )}
      >
        <div className="flex h-fit w-full max-w-5xl">
          <Link href="/">
            <p className="text-2xl font-bold text-white">Share</p>
          </Link>
        </div>
        <main className="h-full w-full">
          {children}
          <BaseToaster />
        </main>
      </body>
    </html>
  )
}
