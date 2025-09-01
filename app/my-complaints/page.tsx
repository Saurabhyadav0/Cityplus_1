"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ComplaintCard } from "@/components/complaint-card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { FileText, Plus, Filter } from "lucide-react"
import Link from "next/link"

interface Complaint {
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

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()


  useEffect(() => {
    // if (!user) {
    //   console.log("User not authenticated, redirecting to login")
    //   router.push("/auth/login")
    //   return
    // }
    fetchComplaints()
  }, [user, router])

  useEffect(() => {
    filterComplaints()
  }, [complaints, statusFilter, categoryFilter])

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/complaints")
      if (response.ok) {
        const data = await response.json()
        setComplaints(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load complaints",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Fetch complaints error:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterComplaints = () => {
    let filtered = complaints

    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.category === categoryFilter)
    }

    setFilteredComplaints(filtered)
  }

  const getStatusCounts = () => {
    return {
      total: complaints.length,
      received: complaints.filter((c) => c.status === "RECEIVED").length,
      inProgress: complaints.filter((c) => c.status === "IN_PROGRESS").length,
      resolved: complaints.filter((c) => c.status === "RESOLVED").length,
    }
  }

  const getUniqueCategories = () => {
    return Array.from(new Set(complaints.map((c) => c.category)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your complaints...</p>
          </div>
        </div>
      </div>
    )
  }

  const statusCounts = getStatusCounts()
  const categories = getUniqueCategories()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              My Reports
            </h1>
            <p className="text-muted-foreground mt-2">Track the status of your civic issue reports</p>
          </div>
          <Link href="/report">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Reports</CardDescription>
              <CardTitle className="text-2xl">{statusCounts.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Received</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{statusCounts.received}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">{statusCounts.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Resolved</CardDescription>
              <CardTitle className="text-2xl text-green-600">{statusCounts.resolved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        {complaints.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="RECEIVED">Received</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {complaints.length === 0 ? "No reports yet" : "No reports match your filters"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {complaints.length === 0
                  ? "Start by reporting your first civic issue to help improve your community."
                  : "Try adjusting your filters to see more reports."}
              </p>
              {complaints.length === 0 && (
                <Link href="/report">
                  <Button>Report Your First Issue</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
