import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Megaphone,
  Building2,
  Package,
  CreditCard,
  Ticket,
  ClipboardList,
} from "lucide-react";

export const sidebarNavigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Consultations", href: "/dashboard/consultations", icon: ClipboardList },
  { label: "Doctors", href: "/dashboard/doctors", icon: Stethoscope },
  { label: "Marketers", href: "/dashboard/marketers", icon: Megaphone },
  { label: "Organizations", href: "/dashboard/organizations", icon: Building2 },
  { label: "Bundles", href: "/dashboard/bundles", icon: Package },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
  { label: "Promo Codes", href: "/dashboard/promo-codes", icon: Ticket },
];
