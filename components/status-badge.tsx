import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return {
          label: "Received",
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        }
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          variant: "default" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        }
      case "RESOLVED":
        return {
          label: "Resolved",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        }
      default:
        return {
          label: status,
          variant: "outline" as const,
          className: "",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
