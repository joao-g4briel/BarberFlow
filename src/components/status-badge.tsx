import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type AppointmentStatus } from "@/lib/constants";

const statusVariants = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "default",
  CANCELED: "danger",
} as const;

export function StatusBadge({ status }: { status: string }) {
  const safeStatus = status as AppointmentStatus;

  return (
    <Badge variant={statusVariants[safeStatus] ?? "muted"}>
      {STATUS_LABELS[safeStatus] ?? status}
    </Badge>
  );
}
