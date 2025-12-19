"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ChatToggle from "./ChatToggle";

const navLinks = [
  { name: "home", href: "/" },
  { name: "projects", href: "/projects" },
  { name: "contact", href: "/contact" },
  { name: "guestbook", href: "/guestbook" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6">
      {/* 1. The Centered Glassmorphic Pill */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-black/10"
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                isActive ? "text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              {/* The Sliding "Active" Background */}
              {isActive && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 -z-10 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {link.name}
            </Link>
          );
        })}
      </motion.nav>

      {/* 2. The Chat Toggle (Positioned absolutely to the right) */}
      <div className="absolute right-6 top-6 sm:right-12">
        <ChatToggle />
      </div>
    </header>
  );
}