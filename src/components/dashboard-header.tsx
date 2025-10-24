"use client";

import Link from "next/link";
import {
  Home,
  Briefcase,
  FileText,
  Users,
  BarChart,
  Bot,
  PanelLeft,
  BookOpenCheck,
  Search,
  ClipboardList,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/user-nav";
import { usePathname } from "next/navigation";
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


export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || "student";
  const currentNavItems = navItems[role as UserRole] || navItems.student;

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1 && segments[0] === 'dashboard') {
        return 'Dashboard';
    }
    const currentPath = `/${segments.join('/')}`;
    const item = Object.values(navItems).flat().find(navItem => navItem.href === currentPath);
    return item ? item.label : "Page";
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <BookOpenCheck className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">PrashikshanConnect</span>
            </Link>
            {currentNavItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <UserNav />
    </header>
  );
}
