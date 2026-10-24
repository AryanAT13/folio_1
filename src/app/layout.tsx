import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Calistoga, Inter } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/VideoBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "My personal site.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  // Matches the top edge of the background video (and the body background in globals.css)
  // so the mobile browser's status/address bar blends into the page instead of a black strip.
  themeColor: "#1a1f1e",
  colorScheme: "dark",
};

// No session is read here on purpose: reading cookies in the root layout makes every page
// dynamic. The guestbook fetches its own session; the rest of the site is static.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          inter.variable,
          calistoga.variable,
        )}
      >
        <VideoBackground />
        <Providers>
          <Header />
          {/* Main container with spacing for the fixed header */}
          <div className="mx-auto flex max-w-3xl flex-col px-6 pt-32 sm:px-8 sm:pt-40">
            <main className="grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
