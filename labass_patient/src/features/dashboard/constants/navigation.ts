import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Megaphone,
  Building2,
  CreditCard,
  Ticket,
  ClipboardList,
  Pill,
  UserCheck,
  MessageCircle,
} from "lucide-react";

export const sidebarNavigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Consultations", href: "/dashboard/consultations", icon: ClipboardList },
  { label: "Drug Search", href: "/dashboard/drug-search", icon: Pill },
  { label: "Doctors", href: "/dashboard/doctors", icon: Stethoscope },
  { label: "Marketers", href: "/dashboard/marketers", icon: Megaphone },
  { label: "Organizations", href: "/dashboard/organizations", icon: Building2 },
  { label: "Organizations Subscriptions", href: "/dashboard/subscriptions/organizations", icon: CreditCard },
  { label: "Individuals Subscriptions", href: "/dashboard/subscriptions/individuals", icon: UserCheck },
  { label: "Promo Codes", href: "/dashboard/promo-codes", icon: Ticket },
  { label: "WhatsApp", href: "/dashboard/whatsapp", icon: MessageCircle },
];
