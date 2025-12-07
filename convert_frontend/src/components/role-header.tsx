'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";

type NavLink = {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
};

export function RoleHeader({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const { auth } = useAuth();
  const initials = useMemo(() => {
    if (!auth.fullName) return "BK";
    return auth.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [auth.fullName]);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3 text-blue-800 font-bold text-xl">
        <img src="/logo.png" alt="BK Logo" className="h-10 w-auto object-contain" />
        <span>Tutor Program</span>
      </div>
      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition flex items-center gap-2 ${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4"
                  : "hover:text-blue-600"
              }`}
            >
              <i className={link.icon} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-blue-600" aria-label="Notifications">
          <i className="fa-regular fa-bell text-lg" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
            {initials}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {auth.fullName || "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}
