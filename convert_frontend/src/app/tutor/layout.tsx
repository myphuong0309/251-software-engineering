import { ReactNode } from "react";
import { RoleHeader } from "@/components/role-header";

const navLinks = [
  { label: "Dashboard", href: "/tutor", icon: "fa-solid fa-border-all", exact: true },
  { label: "Availability", href: "/tutor/availability", icon: "fa-regular fa-calendar" },
  { label: "Mentees", href: "/tutor/mentees", icon: "fa-solid fa-users" },
  { label: "Resources", href: "/tutor/resources", icon: "fa-solid fa-book-open" },
];

export default function TutorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white font-sans min-h-screen text-gray-800 overflow-y-scroll">
      <RoleHeader links={navLinks} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
