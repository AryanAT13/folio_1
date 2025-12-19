import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next"; 
import { Calistoga, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
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
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

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
        <SessionProvider session={session}>
          <Providers>
            <Header />
            {/* Main container with spacing for the fixed header */}
            <div className="mx-auto flex max-w-3xl flex-col px-8 pt-32 sm:pt-40">
              <main className="grow">{children}</main>
              <Footer />
            </div>
            <Toaster richColors position="top-center" />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}