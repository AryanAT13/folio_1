import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers"; // I assume your theme provider is here
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Calistoga, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider"; // We will create this
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(); // Get session on the server

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          inter.variable,
          calistoga.variable,
        )}
      >
        <VideoBackground/> {/* The SessionProvider needs to wrap your app */}
        <SessionProvider session={session}>
          <Providers>
            <Header />
            <div className="mx-auto flex max-w-3xl flex-col px-8">
              <main className="grow">{children}</main>
            </div>
            <Footer />
            <Toaster richColors position="top-center" />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}