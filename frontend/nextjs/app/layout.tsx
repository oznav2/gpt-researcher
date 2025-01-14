import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import Script from 'next/script'
import PlausibleProvider from "next-plausible";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL 
? process.env.NEXT_PUBLIC_SITE_URL
: "http://localhost:3000";

const inter = Lexend({ 
  subsets: ["latin"],
  variable: "--font-lexend",
});

let title = "עמית מחקר";
let description =
  "אפליקציה מבוססת מאגר סוכני בינה חכמה הפועלים כצוות לביצוע מחקר באינטרנט ";
let url = "https://wow.ilanel.co.il";
let ogimage = "/favicon.ico";
let sitename = "עמית מחקר";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  manifest: '/manifest.json',
  title,
  description,
  icons: {
    icon: [
      { url: "/ios/192.png", sizes: "192x192", type: "image/png" },
      { url: "/ios/512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-precomposed.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", rel: "apple-touch-icon" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png", rel: "apple-touch-icon-precomposed" }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "עמית מחקר",
    startupImage: [
      {
        url: "/ios/512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/ios/1024.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      }
    ]
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'עמית מחקר'
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
    lang="he" 
    dir="rtl"
    className={`${inter.variable} overscroll-contain scroll-smooth`}
    suppressHydrationWarning
    >
      <head>
        <PlausibleProvider 
          domain={`localhost:3000${process.env.NODE_ENV === 'production' ? ',wow.ilanel.co.il' : ''}`}
          trackOutboundLinks={true}
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.className} flex min-h-screen flex-col justify-between`}
      >
        {children}
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('Service Worker registered successfully');
                  })
                  .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                  });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
