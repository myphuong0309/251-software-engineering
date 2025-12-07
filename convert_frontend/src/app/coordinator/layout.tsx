'use client';

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Meeting Management",
    href: "/coordinator/meeting-management",
    icon: "fa-solid fa-calendar-check",
  },
  {
    label: "User Management",
    href: "/coordinator/users-management",
    icon: "fa-solid fa-users",
  },
  {
    label: "Reports & Analytics",
    href: "/coordinator/reports",
    icon: "fa-solid fa-chart-pie",
  },
];

function SidebarLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/coordinator"
      ? pathname === "/coordinator"
      : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
        active
          ? "bg-blue-50 text-blue-600 shadow-sm"
          : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
      }`}
    >
      <i className={`${icon} w-5 text-center`} /> {label}
    </Link>
  );
}

export default function CoordinatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-2 text-blue-800 font-bold text-xl border-b border-gray-100">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <div>
            <p>BK Tutor</p>
            <p className="text-xs text-gray-400 font-normal">Program</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center" /> Logout
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-64 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
