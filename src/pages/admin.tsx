import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";

const AdminPage = () => {
  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // State for service listings
  const [listings, setListings] = useState([
    {
      id: "1",
      title: "Math Tutoring for High School Students",
      category: "Tutoring",
      location: "Downtown",
      status: "pending",
      contact: "john.doe@example.com",
      description:
        "Experienced math tutor offering help with algebra, calculus, and statistics.",
      availability: "Weekdays after 4pm, weekends",
      createdAt: "2023-06-15",
    },
    {
      id: "2",
      title: "House Cleaning Services",
      category: "Cleaning",
      location: "Westside",
      status: "approved",
      contact: "clean@example.com",
      description: "Professional house cleaning with eco-friendly products.",
      availability: "Monday-Friday, 9am-5pm",
      createdAt: "2023-06-14",
    },
    {
      id: "3",
      title: "Computer Repair and IT Support",
      category: "Tech Help",
      location: "Eastside",
      status: "rejected",
      contact: "techguy@example.com",
      description:
        "Fix computer issues, virus removal, and general tech support.",
      availability: "Evenings and weekends",
      createdAt: "2023-06-13",
    },
  ]);

  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // State for editing
  const [editingListing, setEditingListing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Handle login
  const handleLogin = () => {
    // In a real app, this would validate against an environment variable or secure backend
    if (password === "admin123") {
      // Example password, would be env variable in production
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid password");
    }
  };

  // Filter listings based on search and filters
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? listing.category === categoryFilter
      : true;
    const matchesStatus = statusFilter ? listing.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setListings(
      listings.map((listing) =>
        listing.id === id ? { ...listing, status: newStatus } : listing,
      ),
    );
  };

  // Handle edit
  const handleEdit = (listing) => {
    setEditingListing(listing);
    setIsEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (editingListing) {
      setListings(
        listings.map((listing) =>
          listing.id === editingListing.id ? editingListing : listing,
        ),
      );
      setIsEditDialogOpen(false);
      setEditingListing(null);
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setListings(listings.filter((listing) => listing.id !== id));
  };

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter the admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {authError && (
                  <p className="text-sm text-red-500">{authError}</p>
                )}
              </div>
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admin dashboard if authenticated
  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LocalHelp Admin Dashboard</h1>
        <p className="text-gray-500">
          Manage service listings and moderate content
        </p>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search listings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Tutoring">Tutoring</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Tech Help">Tech Help</SelectItem>
              <SelectItem value="Moving">Moving</SelectItem>
              <SelectItem value="Pet Sitting">Pet Sitting</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Listings ({filteredListings.length})</CardTitle>
          <CardDescription>Review and manage service listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">
                        {listing.title}
                      </TableCell>
                      <TableCell>{listing.category}</TableCell>
                      <TableCell>{listing.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            listing.status === "approved"
                              ? "default"
                              : listing.status === "rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{listing.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approve Listing</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to approve "
                                  {listing.title}"?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusChange(listing.id, "approved")
                                  }
                                >
                                  Yes, Approve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Listing</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to reject "
                                  {listing.title}"?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusChange(listing.id, "rejected")
                                  }
                                >
                                  Yes, Reject
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(listing)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Listing
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {listing.title}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(listing.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No listings found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingListing && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Listing</DialogTitle>
              <DialogDescription>
                Make changes to the service listing below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={editingListing.title}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={editingListing.category}
                  onValueChange={(value) =>
                    setEditingListing({ ...editingListing, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tutoring">Tutoring</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Tech Help">Tech Help</SelectItem>
                    <SelectItem value="Moving">Moving</SelectItem>
                    <SelectItem value="Pet Sitting">Pet Sitting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  value={editingListing.location}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={editingListing.description}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="availability" className="text-sm font-medium">
                  Availability
                </label>
                <Input
                  id="availability"
                  value={editingListing.availability}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      availability: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="contact" className="text-sm font-medium">
                  Contact
                </label>
                <Input
                  id="contact"
                  value={editingListing.contact}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      contact: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={editingListing.status}
                  onValueChange={(value) =>
                    setEditingListing({ ...editingListing, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPage;
