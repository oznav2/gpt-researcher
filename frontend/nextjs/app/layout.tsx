import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import PlausibleProvider from "next-plausible";
import "./globals.css";

const inter = Lexend({ subsets: ["latin"] });

let title = "GPT Researcher";
let description =
  "A research assistant vanquishing hallucinations";
let url = "https://github.com/assafelovic/gpt-researcher";
let ogimage = "/favicon.ico";
let sitename = "GPT Researcher";

export const metadata: Metadata = {
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
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <head>
        <PlausibleProvider domain="localhost:3000" />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col justify-between bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main className="flex flex-col items-center justify-center min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
