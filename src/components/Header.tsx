import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    name: "home",
    href: "/",
  },
  {
    name: "projects",
    href: "/projects",
  },
  {
    name: "contact",
    href: "/contact",
  },
  {
    name: "guestbook",
    href: "/guestbook",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto max-w-3xl px-8 py-6">
        <nav className="flex items-center justify-between">
          <ul className="flex gap-4 sm:gap-8">
            {navLinks.map((nav, id) => (
              // This line has been changed to apply the class to all links
              <li key={id} className="link special-link">
                <Link href={nav.href}>{nav.name}</Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 sm:gap-4">
            <ChatToggle />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}