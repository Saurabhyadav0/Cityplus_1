"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DepartmentDropdown } from "@/components/department-dropdown";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Shield,
  Filter,
  Users,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED";
  location?: string;
  photoUrl?: string;
  assignedTo?: string;
  createdAt: string;
  citizen: {
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // if (!user) {
    //   router.push("/auth/login")
    //   return
    // }
    // if (user.role !== "ADMIN") {
    //   router.push("/")
    //   return
    // }
    fetchComplaints();
  }, [user, router]);

  useEffect(() => {
    filterComplaints();
  }, [complaints, statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/complaints");
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load complaints",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch complaints error:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.category === categoryFilter
      );
    }

    setFilteredComplaints(filtered);
  };

  const updateComplaint = async (
    id: string,
    updates: { status?: string; assignedTo?: string }
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedComplaint = await response.json();
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? updatedComplaint : c))
        );
        toast({
          title: "Success",
          description: "Complaint updated successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update complaint",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update complaint error:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getStatusCounts = () => {
    return {
      total: complaints.length,
      received: complaints.filter((c) => c.status === "RECEIVED").length,
      inProgress: complaints.filter((c) => c.status === "IN_PROGRESS").length,
      resolved: complaints.filter((c) => c.status === "RESOLVED").length,
    };
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(complaints.map((c) => c.category)));
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "garbage":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "pothole":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "lighting":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "water":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const categories = getUniqueCategories();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all civic issue reports
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Reports
              </CardDescription>
              <CardTitle className="text-2xl">{statusCounts.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Received
              </CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {statusCounts.received}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                In Progress
              </CardDescription>
              <CardTitle className="text-2xl text-yellow-600">
                {statusCounts.inProgress}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolved
              </CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {statusCounts.resolved}
              </CardTitle>
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
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Status
                  </label>
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
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category
                  </label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
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

        {/* Complaints Table */}
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {complaints.length === 0
                  ? "No reports yet"
                  : "No reports match your filters"}
              </h3>
              <p className="text-muted-foreground">
                {complaints.length === 0
                  ? "Reports will appear here as citizens submit them."
                  : "Try adjusting your filters to see more reports."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Reports ({filteredComplaints.length})</CardTitle>
              <CardDescription>
                Manage status and department assignments for civic issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Citizen</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium text-foreground text-balance">
                              {complaint.title}
                            </div>
                            <div className="text-sm text-muted-foreground text-pretty">
                              {complaint.description.length > 100
                                ? `${complaint.description.substring(
                                    0,
                                    100
                                  )}...`
                                : complaint.description}
                            </div>

                            {complaint.location && (
                              <div className="text-xs text-blue-600 underline mt-1">
                                <Link
                                target="blank"
                                  href={`/map?lat=${
                                    complaint.location.split(",")[0]
                                  }&lng=${complaint.location.split(",")[1]}`}
                                >
                                  {complaint.location}
                                </Link>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {complaint.citizen.name}
                            </div>
                            <div className="text-muted-foreground">
                              {complaint.citizen.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(complaint.category)}
                          >
                            {complaint.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={complaint.status}
                            onValueChange={(value) =>
                              updateComplaint(complaint.id, { status: value })
                            }
                            disabled={updatingIds.has(complaint.id)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="RECEIVED">Received</SelectItem>
                              <SelectItem value="IN_PROGRESS">
                                In Progress
                              </SelectItem>
                              <SelectItem value="RESOLVED">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="w-40">
                            <DepartmentDropdown
                              value={complaint.assignedTo ?? null}
                              onValueChange={(value) =>
                                updateComplaint(complaint.id, {
                                  assignedTo: value,
                                })
                              }
                              disabled={updatingIds.has(complaint.id)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(complaint.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
