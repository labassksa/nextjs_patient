import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  // Statuses
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  inactive: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50",
  closed: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50",
  cancelled: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  open: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50",
  expired: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
  // Roles
  admin: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
  doctor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  patient: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50",
  marketer: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50",
  user: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50",
  // Organization types
  pharmacy: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-50",
  laboratory: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50",
  "home care": "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-50",
  school: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  // Deal types
  subscription: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  revenue_share: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  // Specialties
  "general practice": "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50",
  dermatology: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50",
  pediatrics: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50",
  "internal medicine": "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50",
  psychiatry: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50";

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize font-medium text-xs border",
        style,
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
