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
    // The header strip is full-width but transparent, so it must not swallow taps on the
    // content scrolling underneath it; only the nav and the chat toggle are interactive.
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-center justify-center px-3 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6">
      <nav className="animate-nav-enter pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/10 bg-black/20 px-2 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-black/10 sm:gap-1 sm:px-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                // Adjusted text size for mobile (text-xs) vs desktop (text-sm)
                "relative rounded-full px-3 py-2 text-xs font-medium transition-colors duration-300 [-webkit-tap-highlight-color:transparent] sm:px-4 sm:text-sm",
                isActive ? "text-white" : "text-zinc-400 hover:text-white"
              )}
            >
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
      </nav>

      <div className="pointer-events-auto absolute right-6 top-[max(1.5rem,env(safe-area-inset-top))] hidden md:block">
        <div className="rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-md transition-all hover:bg-white/10">
          <ChatToggle />
        </div>
      </div>
    </header>
  );
}
