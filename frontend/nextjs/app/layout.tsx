import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import PlausibleProvider from "next-plausible";
import "./globals.css";

const inter = Lexend({ subsets: ["latin"] });

let title = "עמית מחקר";
let description =
  "עמית מחקר מתקדם";
let url = "https://github.com/oznav2/gpt-researcher";
let ogimage = "/favicon.ico";
let sitename = "AI Researcher";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
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
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <PlausibleProvider domain="localhost:3000,wow.ilanel.co.il" trackOutboundLinks={true} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.className} flex min-h-screen flex-col justify-between`}
      >
        {children}
      </body>
    </html>
  );
}
