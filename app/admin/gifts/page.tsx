"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Gift, Plus, Search, Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AdminLayout from "@/components/admin-layout"
import { apiRequest } from "@/lib/http"

// Mock data - in a real app, this would come from your database
// const giftItems = [
//   { id: 1, name: "Toaster", description: "Kitchen appliance for toasting bread", pickedCount: 5 },
//   { id: 2, name: "Blender", description: "Kitchen blender for smoothies and cooking", pickedCount: 3 },
//   { id: 3, name: "Dinner Set", description: "Complete dinner set for 6 people", pickedCount: 8 },
//   { id: 4, name: "Bed Sheets", description: "Premium cotton bed sheet set", pickedCount: 2 },
//   { id: 5, name: "Coffee Maker", description: "Automatic coffee brewing machine", pickedCount: 6 },
//   { id: 6, name: "Microwave", description: "Kitchen microwave oven", pickedCount: 4 },
//   { id: 7, name: "Iron", description: "Steam iron for clothes", pickedCount: 1 },
//   { id: 8, name: "Vacuum Cleaner", description: "Home vacuum cleaning system", pickedCount: 2 },
//   // Add more mock items for pagination demo
//   ...Array.from({ length: 15 }, (_, i) => ({
//     id: i + 9,
//     name: `Gift Item ${i + 9}`,
//     description: `Description for gift item ${i + 9}`,
//     pickedCount: Math.floor(Math.random() * 10),
//   })),
// ]

// Mock data for guests who selected gifts
const giftSelections = {
  1: [
    { guestId: "mf25001", name: "Sarah Johnson" },
    { guestId: "mf25003", name: "Emma Wilson" },
    { guestId: "mf25007", name: "Robert Davis" },
    { guestId: "mf25009", name: "Olivia Martinez" },
    { guestId: "mf25012", name: "William Thompson" },
  ],
  2: [
    { guestId: "mf25002", name: "Mike Chen" },
    { guestId: "mf25008", name: "Sophia Lee" },
    { guestId: "mf25015", name: "James Wilson" },
  ],
  // ... other gift selections
}

// Mock money contributions data (without status)
// const moneyContributions = [
//   { id: 1, guestName: "Mike Chen", guestId: "mf25002", amount: 200 },
//   { id: 2, guestName: "David Brown", guestId: "mf25004", amount: 150 },
//   { id: 3, guestName: "Jennifer Smith", guestId: "mf25008", amount: 300 },
//   { id: 4, guestName: "Robert Johnson", guestId: "mf25010", amount: 100 },
//   { id: 5, guestName: "Anonymous", guestId: "anonymous001", amount: 100 },
//   // Add more mock contributions
//   ...Array.from({ length: 10 }, (_, i) => ({
//     id: i + 6,
//     guestName: `Contributor ${i + 6}`,
//     guestId: `mf250${String(i + 20).padStart(2, "0")}`,
//     amount: (i + 1) * 75,
//   })),
// ]

const ITEMS_PER_PAGE = 10

export default function GiftsPage() {
const [searchTerm, setSearchTerm] = useState("")
const [currentPage, setCurrentPage] = useState(1)
const [contributionsPage, setContributionsPage] = useState(1)
const [isAddGiftDialogOpen, setIsAddGiftDialogOpen] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
const [newGift, setNewGift] = useState({
  name: "",
  description: "",
})
const [giftItems, setGiftItems] = useState([]);
const [moneyContributions, setMoneyContributions] = useState([]);
const [loading, setLoading] = useState(true);


const fetchGifts = async () => {
  const giftRes = await fetch('http://localhost:4000/api/giftitem');
  if (!giftRes.ok) throw new Error('Failed to fetch gift items');
  const giftData = await giftRes.json();
  setGiftItems(giftData.reverse());
}

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch gift items
      const giftRes = await fetch('http://localhost:4000/api/giftitem');
      if (!giftRes.ok) throw new Error('Failed to fetch gift items');
      const giftData = await giftRes.json();
      setGiftItems(giftData.reverse());

      // Fetch money contributions
      const contributionRes = await apiRequest('http://localhost:4000/api/guests/contributions', { method: "GET" });
      if (!contributionRes.ok) throw new Error('Failed to fetch contributions');
      const contributionData = await contributionRes.json();
      setMoneyContributions(contributionData.reverse());

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Filter and paginate gift items
  const filteredGiftItems = giftItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalGiftPages = Math.ceil(filteredGiftItems.length / ITEMS_PER_PAGE)
  const startGiftIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endGiftIndex = startGiftIndex + ITEMS_PER_PAGE
  const currentGiftItems = filteredGiftItems.slice(startGiftIndex, endGiftIndex)
  
  // console.log("=== GIFT ITEMS ===", currentGiftItems);

  // Paginate money contributions
  const totalContributionPages = Math.ceil(moneyContributions.length / ITEMS_PER_PAGE)
  const startContributionIndex = (contributionsPage - 1) * ITEMS_PER_PAGE
  const endContributionIndex = startContributionIndex + ITEMS_PER_PAGE
  const currentContributions = moneyContributions.slice(startContributionIndex, endContributionIndex)

  // Reset to first page when search changes
  useState(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleAddGift = async () => {
    if (!newGift.name.trim() || !newGift.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and description fields.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: newGift.name.trim(),
        description: newGift.description.trim()
      }
      // Log the payload to console
      console.log("=== ADD GIFT ITEM PAYLOAD ===")
      console.log(JSON.stringify(payload, null, 2))
      console.log("=== END PAYLOAD ===")

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      
      const res = await apiRequest("http://localhost:4000/api/giftitem", {
      method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to add gift item")
      }
      const data = await res.json()
      fetchGifts(); // Refetch data to update gift items
      if(res.status === 201) {
        toast({
          title: "Gift Item Added",
          description: `"${newGift.name}" has been successfully added to the gift registry.`,
          duration: 5000,
        })

        // Reset form and close modal
        setNewGift({ name: "", description: "" })
        setIsAddGiftDialogOpen(false)
        
      }
      else {
        throw new Error("Failed to add gift item")
      }

      // In a real app, you would refetch the gift items or update the state
    } catch (error) {
      console.error("Add gift item error:", error)
      toast({
        title: "Failed to Add Gift Item",
        description: "There was an error adding the gift item. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Toaster />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Gift Registry</h1>
            <p className="text-muted-foreground">Manage gift items and view selections</p>
          </div>
          <Dialog open={isAddGiftDialogOpen} onOpenChange={setIsAddGiftDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Gift Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary">Add New Gift Item</DialogTitle>
                <DialogDescription>Add a new item to the wedding gift registry</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="gift-name">Gift Name *</Label>
                  <Input
                    id="gift-name"
                    value={newGift.name}
                    onChange={(e) => setNewGift((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter gift name (e.g., Coffee Maker)"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gift-description">Description *</Label>
                  <Textarea
                    id="gift-description"
                    value={newGift.description}
                    onChange={(e) => setNewGift((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter a brief description of the gift item"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">{newGift.description.length}/500 characters</p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewGift({ name: "", description: "" })
                    setIsAddGiftDialogOpen(false)
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddGift} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Gift Item"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gift Items</CardTitle>
              <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{giftItems.length}</div>
              <p className="text-xs text-muted-foreground">Items in registry</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Selections</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {giftItems.reduce((acc, item) => acc + item.pickedCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Items selected by guests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
              <Gift className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {
                  giftItems.length > 0 && giftItems.reduce((prev, current) => (prev.pickedCount > current.pickedCount ? prev : current))
                    .name
                }
              </div>
              <p className="text-xs text-muted-foreground">Most frequently selected item</p>
            </CardContent>
          </Card>
        </div>

        {/* Gift Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Gift Items</CardTitle>
            <CardDescription>
              Showing {startGiftIndex + 1}-{Math.min(endGiftIndex, filteredGiftItems.length)} of{" "}
              {filteredGiftItems.length} gift items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search gift items..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Times Selected</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGiftItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No gift items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentGiftItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Badge variant="outline" className="cursor-pointer hover:bg-secondary/10">
                                {item.pickedCount} selections
                              </Badge>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-primary">Guests Who Selected {item.name}</DialogTitle>
                                <DialogDescription>
                                  {item.pickedCount} {item.pickedCount === 1 ? "guest has" : "guests have"} selected
                                  this item
                                </DialogDescription>
                              </DialogHeader>
                              <div className="max-h-72 overflow-y-auto">
                                {giftSelections[item._id as keyof typeof giftSelections]?.map((guest, index) => (
                                  <div key={index} className="p-3 border-b last:border-b-0">
                                    <p className="font-medium">{guest.name}</p>
                                    <p className="text-sm text-muted-foreground">{guest.guestId}</p>
                                  </div>
                                )) || (
                                  <div className="p-4 text-center text-muted-foreground">
                                    {item.pickedCount} {item.pickedCount === 1 ? "guest has" : "guests have"} selected this item yet
                                  </div>
                                )}
                              </div>
                              {/* <DialogFooter>
                                <Button variant="outline">Close</Button>
                              </DialogFooter> */}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Gift Items Pagination */}
            {totalGiftPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalGiftPages}
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
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalGiftPages))}
                    disabled={currentPage === totalGiftPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Money Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Money Contributions</CardTitle>
            <CardDescription>
              Showing {startContributionIndex + 1}-{Math.min(endContributionIndex, moneyContributions.length)} of{" "}
              {moneyContributions.length} contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Guest ID</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentContributions.map((contribution) => (
                    <TableRow key={contribution.id}>
                      <TableCell className="font-medium">{contribution.guestName}</TableCell>
                      <TableCell>{contribution.guestId}</TableCell>
                      <TableCell>₦{contribution.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-bold">
                      Total Contributions
                    </TableCell>
                    <TableCell className="font-bold">
                      ₦{moneyContributions.reduce((total, contrib) => total + contrib.amount, 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Money Contributions Pagination */}
            {totalContributionPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Page {contributionsPage} of {totalContributionPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setContributionsPage((prev) => Math.max(prev - 1, 1))}
                    disabled={contributionsPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setContributionsPage((prev) => Math.min(prev + 1, totalContributionPages))}
                    disabled={contributionsPage === totalContributionPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
