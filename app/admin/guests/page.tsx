"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { UserCheck, Send, Search, Users, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { Label } from "@/components/ui/label"
import { apiRequest } from "@/lib/http"

// Mock data - in a real app, this would come from your database
let mockGuests = [
  {
    id: 1,
    guestId: "mf25001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1234567890",
    attendingStatus: "yes",
    guestType: "single",
    approvalStatus: "approved",
    giftPreference: "yes",
    giftType: "gift",
    checkedIn: false,
    isAnonymous: false,
    dateRegistered: "2024-05-15T10:30:00Z",
    dateApproved: "2024-05-15T14:20:00Z",
    approvedBy: "Wedding Admin",
    grantedAccess: true,
    grantedAccessBy: "Wedding Admin",
    grantedAccessAt: "2024-05-15T14:20:00Z",
    createdAt: "2024-05-15T10:30:00Z",
    selectedGifts: [
      { id: 1, name: "Toaster", description: "Kitchen appliance for toasting bread" },
      { id: 3, name: "Dinner Set", description: "Complete dinner set for 6 people" },
    ],
  },
  {
    id: 2,
    guestId: "mf25002",
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1987654321",
    attendingStatus: "yes",
    guestType: "group",
    approvalStatus: "approved",
    giftPreference: "yes",
    giftType: "money",
    moneyContribution: 200,
    checkedIn: false,
    isAnonymous: false,
    dateRegistered: "2024-05-15T11:45:00Z",
    dateApproved: "2024-05-15T16:10:00Z",
    approvedBy: "Event Coordinator",
    grantedAccess: true,
    grantedAccessBy: "Event Coordinator",
    grantedAccessAt: "2024-05-15T16:10:00Z",
    createdAt: "2024-05-15T11:45:00Z",
    groupMembers: ["Lisa Chen", "David Chen"],
    selectedGifts: [],
  },
  {
    id: 3,
    guestId: "mf25003",
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1122334455",
    attendingStatus: "maybe",
    guestType: "single",
    approvalStatus: "pending",
    giftPreference: "yes",
    giftType: "gift",
    checkedIn: false,
    isAnonymous: false,
    dateRegistered: "2024-05-16T09:15:00Z",
    dateApproved: null,
    approvedBy: null,
    grantedAccess: false,
    grantedAccessBy: null,
    grantedAccessAt: null,
    createdAt: "2024-05-16T09:15:00Z",
    selectedGifts: [
      { id: 2, name: "Blender", description: "Kitchen blender for smoothies and cooking" },
      { id: 5, name: "Coffee Maker", description: "Automatic coffee brewing machine" },
    ],
  },
  {
    id: 4,
    guestId: "mf25004",
    name: "David Brown",
    email: "david@example.com",
    phone: "+1555666777",
    attendingStatus: "yes",
    guestType: "group",
    approvalStatus: "pending",
    giftPreference: "yes",
    giftType: "money",
    moneyContribution: 150,
    checkedIn: false,
    isAnonymous: false,
    dateRegistered: "2024-05-16T14:20:00Z",
    dateApproved: null,
    approvedBy: null,
    grantedAccess: false,
    grantedAccessBy: null,
    grantedAccessAt: null,
    createdAt: "2024-05-16T14:20:00Z",
    groupMembers: ["Jennifer Brown", "Michael Brown", "Sophia Brown"],
    selectedGifts: [],
  },
  {
    id: 5,
    guestId: "mf25005",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    phone: "+1777888999",
    attendingStatus: "no",
    guestType: "single",
    approvalStatus: "approved",
    giftPreference: "no",
    checkedIn: false,
    isAnonymous: false,
    dateRegistered: "2024-05-17T08:45:00Z",
    dateApproved: "2024-05-17T10:30:00Z",
    approvedBy: "Wedding Admin",
    grantedAccess: false,
    grantedAccessBy: null,
    grantedAccessAt: null,
    createdAt: "2024-05-17T08:45:00Z",
    selectedGifts: [],
  },
  {
    id: 6,
    guestId: "anonymous001",
    name: "Anonymous",
    email: null,
    phone: null,
    attendingStatus: "no",
    guestType: "single",
    approvalStatus: "approved",
    giftPreference: "yes",
    giftType: "money",
    moneyContribution: 100,
    checkedIn: false,
    isAnonymous: true,
    dateRegistered: "2024-05-17T12:15:00Z",
    dateApproved: "2024-05-17T12:20:00Z",
    approvedBy: "Wedding Admin",
    grantedAccess: false,
    grantedAccessBy: null,
    grantedAccessAt: null,
    createdAt: "2024-05-17T12:15:00Z",
    selectedGifts: [],
  },
  // Add more mock guests for pagination demo with the new fields
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 7,
    guestId: `mf250${String(i + 7).padStart(2, "0")}`,
    name: `Guest ${i + 7}`,
    email: `guest${i + 7}@example.com`,
    phone: `+155566677${i + 7}`,
    attendingStatus: ["yes", "maybe", "no"][i % 3] as "yes" | "maybe" | "no",
    guestType: ["single", "group"][i % 2] as "single" | "group",
    approvalStatus: ["approved", "pending"][i % 2] as "approved" | "pending",
    giftPreference: ["yes", "no"][i % 2] as "yes" | "no",
    giftType: ["gift", "money"][i % 2] as "gift" | "money",
    moneyContribution: i % 2 === 1 ? (i + 1) * 50 : undefined,
    checkedIn: false,
    isAnonymous: false,
    dateRegistered: "2024-05-17T08:45:00Z",
    dateApproved: i % 2 === 0 ? "2024-05-17T10:30:00Z" : null,
    approvedBy: i % 2 === 0 ? "Wedding Admin" : null,
    grantedAccess: i % 2 === 0,
    grantedAccessBy: i % 2 === 0 ? "Wedding Admin" : null,
    grantedAccessAt: i % 2 === 0 ? "2024-05-17T10:30:00Z" : null,
    createdAt: "2024-05-17T08:45:00Z",
    groupMembers: i % 2 === 1 ? [`Member ${i + 7}A`, `Member ${i + 7}B`] : undefined,
    selectedGifts:
      i % 2 === 0
        ? [{ id: (i % 3) + 1, name: `Gift Item ${(i % 3) + 1}`, description: `Description for gift ${(i % 3) + 1}` }]
        : [],
  })),
]

const ITEMS_PER_PAGE = 10

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [attendanceFilter, setAttendanceFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})


  const fetchGuests = async () => {
  try {
    const res = await apiRequest("http://localhost:4000/api/guests", { method: "GET" });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    setGuests(data.reverse()); // Reverse the order to show latest guests first
  } catch (error) {
    console.error("Error fetching guests:", error);
  }
};

  useEffect(() => {
    fetchGuests();
  }, []);




  const filteredGuests = guests.filter((guest:any) => {
    // Filter by search term
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestId.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by approval status tab
    let matchesApprovalTab = true
    if (activeTab === "approved") matchesApprovalTab = guest.status === "Approved"
    if (activeTab === "pending") matchesApprovalTab = guest.status === "Pending"

    // Filter by attendance status
    let matchesAttendance = true
    if (attendanceFilter === "attending") matchesAttendance = guest.attendingStatus === "yes"
    if (attendanceFilter === "maybe") matchesAttendance = guest.attendingStatus === "maybe"
    if (attendanceFilter === "not-attending") matchesAttendance = guest.attendingStatus === "no"
    if (attendanceFilter === "anonymous") matchesAttendance = guest.isAnonymous === true

    return matchesSearch && matchesApprovalTab && matchesAttendance
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentGuests = filteredGuests.slice(startIndex, endIndex)

  // Reset to first page when search or filter changes
  useState(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  const handleViewGuest = (guest: any) => {
    setSelectedGuest(guest)
    setIsDialogOpen(true)
  }

  const handleViewGroup = (guest: any) => {
    setSelectedGuest(guest)
    setIsGroupDialogOpen(true)
  }

  const handleViewGifts = (guest: any) => {
    setSelectedGuest(guest)
    setIsGiftDialogOpen(true)
  }

  const handleApproveGuest = async (guestId: string, fromModal = false) => {
    const loadingKey = `approve-${guestId}`
    setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      const res = await apiRequest(`http://localhost:4000/api/admin/guests/${guestId}/approve`, {
      method: "POST",});

      if (!res.ok) {
        throw new Error("Failed to add gift item")
      }

      // Simulate success/failure (90% success rate)
      // const success = Math.random() > 0.1

      if (res.status === 200) {
        toast({
          title: "Guest Approved",
          description: `Guest ${guestId} has been successfully approved and will receive their QR code.`,
          duration: 5000,
        })
        if (fromModal) {
          setIsDialogOpen(false)
        }
        fetchGuests() // Refresh guest list after approval
      } else {
        throw new Error("Approval failed")
      }
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "There was an error approving the guest. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleResendInvite = async (guestId: string, fromModal = false) => {
    const loadingKey = `resend-${guestId}`
    setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate success/failure (95% success rate)
      const success = Math.random() > 0.05

      if (success) {
        toast({
          title: "Invite Resent",
          description: `QR code and invitation have been resent to guest ${guestId}.`,
          duration: 5000,
        })

        if (fromModal) {
          setIsDialogOpen(false)
        }
      } else {
        throw new Error("Resend failed")
      }
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "There was an error resending the invitation. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const getStatusBadge = (guest: any) => {
    if(guest.attendingStatus === "no") {
      return <Badge className="bg-gray-500">Not Attending</Badge>
    }
    switch (guest.status) {
      case "Approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getAttendingBadge = (status: string) => {
    switch (status) {
      case "yes":
        return <Badge className="bg-green-500">Yes</Badge>
      case "maybe":
        return <Badge className="bg-yellow-500">Maybe</Badge>
      case "no":
        return <Badge className="bg-red-500">No</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const renderGiftInfo = (guest: any) => {
    if (!guest.giftSelected) {
      return "None"
    }

    if (guest.giftType === "money") {
      return (
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/10">
          ₦{guest.moneyAmount?.toLocaleString()}
        </Badge>
      )
    }

    if (guest.giftType === "gift" && guest.giftItems?.length > 0) {
      return (
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-secondary/10"
          onClick={() => handleViewGifts(guest)}
        >
          {guest.giftItems.length} item{guest.giftItems.length !== 1 ? "s" : ""}
        </Badge>
      )
    }

    return "None"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Toaster />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Guest Management</h1>
            <p className="text-muted-foreground">View and manage all registered guests</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">
              <Users className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guests..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab} value={activeTab}>
              <TabsList>
                <TabsTrigger value="all">All Guests</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Attendance Filter */}
          <div className="flex flex-wrap gap-2">
            <Label className="text-sm font-medium">Filter by Attendance:</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={attendanceFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setAttendanceFilter("all")}
              >
                All
              </Button>
              <Button
                variant={attendanceFilter === "attending" ? "default" : "outline"}
                size="sm"
                onClick={() => setAttendanceFilter("attending")}
              >
                Attending
              </Button>
              <Button
                variant={attendanceFilter === "maybe" ? "default" : "outline"}
                size="sm"
                onClick={() => setAttendanceFilter("maybe")}
              >
                Maybe
              </Button>
              <Button
                variant={attendanceFilter === "not-attending" ? "default" : "outline"}
                size="sm"
                onClick={() => setAttendanceFilter("not-attending")}
              >
                Not Attending
              </Button>
              <Button
                variant={attendanceFilter === "anonymous" ? "default" : "outline"}
                size="sm"
                onClick={() => setAttendanceFilter("anonymous")}
              >
                Anonymous
              </Button>
            </div>
          </div>
        </div>

        {/* Guests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Guest List</CardTitle>
            <CardDescription>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredGuests.length)} of {filteredGuests.length} guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Attending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Registered</TableHead>
                    <TableHead>Gift(s)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGuests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No guests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentGuests.map((guest) => (
                      <TableRow key={guest._id}>
                        <TableCell className="font-medium">{guest.guestId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {guest.name}
                            {/* {guest.isAnonymous && (
                              <Badge variant="outline" className="text-xs">
                                Anonymous
                              </Badge>
                            )} */}
                          </div>
                        </TableCell>
                        <TableCell>
                          {guest.guestType === "group" ? (
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary/10"
                              onClick={() => handleViewGroup(guest)}
                            >
                              Group ({(guest.groupMembers?.length || 0) + 1})
                            </Badge>
                          ) : (
                            "Single"
                          )}
                        </TableCell>
                        <TableCell>{getAttendingBadge(guest.attendingStatus)}</TableCell>
                        <TableCell>{getStatusBadge(guest)}</TableCell>
                        <TableCell>{new Date(guest.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{renderGiftInfo(guest)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewGuest(guest)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {guest.status === "Pending" && !(guest.attendingStatus === "no") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600"
                                onClick= {() => {
                                  const confirmed = window.confirm("Are you sure you want to approve this guest?");
                                  if (confirmed) {
                                    handleApproveGuest(guest.guestId);
                                  }
                                }}
                                disabled={loadingStates[`approve-${guest.guestId}`]}
                              >
                                {loadingStates[`approve-${guest.guestId}`] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            {guest.status === "approved" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-600"
                                onClick={() => handleResendInvite(guest.guestId)}
                                disabled={loadingStates[`resend-${guest.guestId}`]}
                              >
                                {loadingStates[`resend-${guest.guestId}`] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guest Details Dialog */}
        {selectedGuest && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-primary">Guest Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="font-semibold text-primary mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Guest ID</p>
                      <p>{selectedGuest.guestId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div>{getStatusBadge(selectedGuest)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <div className="flex items-center gap-2">
                        <span>{selectedGuest.name}</span>
                        {/* {selectedGuest.isAnonymous && (
                          <Badge variant="outline" className="text-xs">
                            Anonymous
                          </Badge>
                        )} */}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Type</p>
                      <p className="capitalize">{selectedGuest.guestType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{selectedGuest.email || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p>{selectedGuest.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Attending</p>
                      <div>{getAttendingBadge(selectedGuest.attendingStatus)}</div>
                    </div>
                    {/* <div>
                      <p className="text-sm font-medium text-muted-foreground">Checked In</p>
                      <p>{selectedGuest.checkedIn ? "Yes" : "No"}</p>
                    </div> */}
                  </div>
                </div>

                {/* Registration & Approval Information */}
                <div>
                  <h4 className="font-semibold text-primary mb-3">Registration & Approval</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date Registered</p>
                      <p>{new Date(selectedGuest.createdAt).toLocaleDateString()}</p>
                    </div>
                    {/* <div>
                      <p className="text-sm font-medium text-muted-foreground">Date Approved</p>
                      <p>
                        {selectedGuest.dateApproved
                          ? new Date(selectedGuest.dateApproved).toLocaleDateString()
                          : "Not approved yet"}
                      </p>
                    </div> */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                      <p>{selectedGuest.approvedBy || "Not approved yet"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Granted Access</p>
                      <p>{selectedGuest.hasAccessGranted ? "Yes" : "No"}</p>
                    </div>
                    {selectedGuest.hasAccessGranted && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Granted Access By</p>
                          <p>{selectedGuest.accessGrantedBy || "Unknown"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Access Granted Date</p>
                          <p>
                            {selectedGuest.accessGrantedAt
                              ? new Date(selectedGuest.grantedAccessAt).toLocaleDateString()
                              : "Unknown"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Group Members Section */}
                {selectedGuest.guestType === "group" && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Group Members</h4>
                    <div className="bg-secondary/10 p-3 rounded-md">
                      <ul className="list-disc list-inside">
                        {selectedGuest.groupMembers?.map((member: string, index: number) => (
                          <li key={index}>{member}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Gift Information Section */}
                {selectedGuest.giftSelected && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Gift Information</h4>
                    <div className="bg-secondary/10 p-3 rounded-md">
                      <p>
                        <strong>Type:</strong>{" "}
                        {selectedGuest.giftType === "money" ? "Money Contribution" : "Gift Items"}
                      </p>
                      {selectedGuest.giftType === "money" && (
                        <p>
                          <strong>Amount:</strong> ₦{selectedGuest.moneyAmount?.toLocaleString()}
                        </p>
                      )}
                      {selectedGuest.giftType === "gift" && selectedGuest.giftItems?.length > 0 && (
                        <div className="mt-2">
                          <p>
                            <strong>Selected Gifts:</strong>
                          </p>
                          <ul className="list-disc list-inside mt-1">
                            {selectedGuest.giftItems.map((gift: any) => (
                              <li key={gift._id} className="text-sm">
                                {gift.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedGuest.approvalStatus === "pending" && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveGuest(selectedGuest.guestId, true)}
                    disabled={loadingStates[`approve-${selectedGuest.guestId}`]}
                  >
                    {loadingStates[`approve-${selectedGuest.guestId}`] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-2" />
                    )}
                    Approve Guest
                  </Button>
                )}
                {selectedGuest.approvalStatus === "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => handleResendInvite(selectedGuest.guestId, true)}
                    disabled={loadingStates[`resend-${selectedGuest.guestId}`]}
                  >
                    {loadingStates[`resend-${selectedGuest.guestId}`] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Resend Invite
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Group Members Dialog */}
        {selectedGuest && (
          <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary">Group Members</DialogTitle>
                <DialogDescription>People attending with {selectedGuest.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-secondary/10 p-4 rounded-md">
                  <p className="font-medium mb-2">Primary Guest:</p>
                  <p>{selectedGuest.name}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Additional Members:</p>
                  <ul className="space-y-2">
                    {selectedGuest.groupMembers?.map((member: string, index: number) => (
                      <li key={index} className="p-2 border rounded-md">
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Gift Items Dialog */}
        {selectedGuest && (
          <Dialog open={isGiftDialogOpen} onOpenChange={setIsGiftDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary">Selected Gifts</DialogTitle>
                <DialogDescription>Gift items selected by {selectedGuest.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedGuest.giftItems?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGuest.giftItems.map((gift: any) => (
                      <div key={gift._id} className="p-3 border rounded-md">
                        <h4 className="font-medium">{gift.name}</h4>
                        <p className="text-sm text-muted-foreground">{gift.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No gift items selected</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGiftDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}
