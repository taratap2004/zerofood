import type { Metadata } from "next"
import { Providers } from "./providers"
import { StructuredData } from "@/lib/components/StructuredData"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://zerofood-woad.vercel.app/'),
  title: "ZeroFood - Restaurant Management System",
  description: "Modern table management and ordering system for small to medium restaurants. Complete solution for restaurant operations, menu management, and customer service.",
  keywords: "restaurant management, table booking, menu management, ordering system, restaurant POS, table management system",
  authors: [{ name: "ZeroFood Team" }],
  creator: "ZeroFood",
  publisher: "ZeroFood",

  // Open Graph
  openGraph: {
    title: "MeFood - Restaurant Management System",
    description: "Modern table management and ordering system for small to medium restaurants. Complete solution for restaurant operations, menu management, and customer service.",
    url: "https://zerofood-woad.vercel.app/",
    siteName: "ZeroFood",
    images: [
      {
        url: "/zero.png",
        width: 1200,
        height: 630,
        alt: "ZeroFood Restaurant Management System",
      },
      {
        url: "/zero.png",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "MeFood - Restaurant Management System",
    description: "Modern table management and ordering system for restaurants. Complete solution for operations, menu management, and customer service.",
    images: ["/og-image.svg"],
    creator: "@mefood",
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tags (add your actual verification codes when available)
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },

  // App-specific
  applicationName: "MeFood",
  category: "Business",

  // Icons and manifest
  icons: {
    icon: [
      { url: '/zero.png', sizes: '32x32', type: 'image/png' },
      { url: '/zero.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/zero.png',
  },

  manifest: "/manifest.json",

  // Additional structured data
  other: {
    "theme-color": "#1976d2",
    "color-scheme": "light dark",
    "twitter:image": "/og-image.svg",
    "twitter:image:alt": "MeFood Restaurant Management System",
    "og:image:width": "1200",
    "og:image:height": "630",
    "fb:app_id": "your-facebook-app-id", // Replace with actual Facebook App ID
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData type="WebApplication" />
        <StructuredData type="Organization" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
