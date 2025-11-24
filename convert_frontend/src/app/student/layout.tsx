import { ReactNode } from "react";
import { RoleHeader } from "@/components/role-header";

const navLinks = [
  { label: "Dashboard", href: "/student", icon: "fa-solid fa-border-all", exact: true },
  { label: "Find a Tutor", href: "/student/find-tutor", icon: "fa-solid fa-magnifying-glass" },
  { label: "My Schedule", href: "/student/schedule", icon: "fa-regular fa-calendar" },
  { label: "Resources", href: "/student/resources", icon: "fa-solid fa-book-open" },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white font-sans min-h-screen text-gray-800 overflow-y-scroll">
      <RoleHeader links={navLinks} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
