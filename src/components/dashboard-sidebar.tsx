"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  Home,
  Briefcase,
  FileText,
  Users,
  BarChart,
  Bot,
  LogOut,
  Settings,
  ClipboardList,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/types";

const navItems = {
  student: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/internships", icon: Briefcase, label: "Internships" },
    { href: "/dashboard/applications", icon: FileText, label: "My Applications" },
    { href: "/dashboard/resume", icon: ClipboardList, label: "My Resume" },
    { href: "/dashboard/recommendations", icon: Bot, label: "AI Recommendations" },
  ],
  faculty: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/mous", icon: Users, label: "Manage MoUs" },
    { href: "/dashboard/reports", icon: BarChart, label: "Reports" },
    { href: "/dashboard/internships", icon: Briefcase, label: "All Internships" },
  ],
  industry: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/manage-internships", icon: Briefcase, label: "Manage Internships" },
    { href: "/dashboard/applications", icon: FileText, label: "Applicants" },
  ],
};

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        href={href}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </Link>
    </TooltipTrigger>
    <TooltipContent side="right">{label}</TooltipContent>
  </Tooltip>
);

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const role = user?.role || "student";
  const currentNavItems = navItems[role as UserRole] || navItems.student;

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <BookOpenCheck className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">PrashikshanConnect</span>
          </Link>
          {currentNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
           <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
