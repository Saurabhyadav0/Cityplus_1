import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User } from "lucide-react"

interface ComplaintCardProps {
  complaint: {
    id: string
    title: string
    description: string
    category: string
    status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED"
    location?: string
    photoUrl?: string
    createdAt: string
    citizen: {
      name: string
      email: string
    }
  }
  showCitizen?: boolean
}

export function ComplaintCard({ complaint, showCitizen = false }: ComplaintCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "garbage":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "pothole":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "lighting":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "water":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-balance">{complaint.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={getCategoryColor(complaint.category)}>
                {complaint.category}
              </Badge>
              <StatusBadge status={complaint.status} />
            </div>
          </div>
          {complaint.photoUrl && (
            <img
              src={complaint.photoUrl || "/placeholder.svg"}
              alt="Issue photo"
              className="w-16 h-16 object-cover rounded-md ml-4 flex-shrink-0"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4 text-pretty">
          {complaint.description.length > 150 ? `${complaint.description.substring(0, 150)}...` : complaint.description}
        </CardDescription>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Reported {formatDate(complaint.createdAt)}</span>
          </div>

          {complaint.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{complaint.location}</span>
            </div>
          )}

          {showCitizen && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>By {complaint.citizen.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
