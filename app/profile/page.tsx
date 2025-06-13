"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, QrCode, ArrowLeft, Calendar, MapPin, Palette } from "lucide-react"
import Link from "next/link"

// Mock guest data - in a real app, this would come from your API based on authentication
const mockGuest = {
  id: 2,
  guestId: "mf25002",
  name: "Mike Chen",
  email: "mike@example.com",
  phone: "+1987654321",
  attendingStatus: "yes",
  guestType: "group",
  approvalStatus: "approved", // Change to "pending" to test different states
  giftPreference: "yes",
  giftType: "money",
  moneyContribution: 200,
  checkedIn: false,
  createdAt: "2024-05-15T11:45:00Z",
  groupMembers: ["Lisa Chen", "David Chen"],
  selectedGifts: [],
}

// Mock event details
const eventDetails = {
  name: "John & Jane's Wedding",
  date: "Saturday, June 15th, 2024",
  time: "4:00 PM",
  venue: "Grand Ballroom, Elegant Hotel",
  address: "123 Wedding Street, City",
  colors: ["#673147", "#C8A2C8", "#818589"],
  dresscode: "Formal attire requested",
}

export default function GuestProfilePage() {
  const [guestId, setGuestId] = useState("")
  const [guest, setGuest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)

  // For demo purposes, we'll use the mock guest data
  // In a real app, you would fetch the guest data based on authentication or guestId
  // useState(() => {
  //   setGuest(mockGuest)
  // }, [])

  const handleLookup = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (guestId.trim().toLowerCase() === mockGuest.guestId.toLowerCase()) {
        setGuest(mockGuest)
      } else {
        alert("Guest not found. Please check your ID and try again.")
      }
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending Approval</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getGroupText = (guest: any) => {
    if (guest.guestType === "single") return ""
    if (guest.groupMembers.length === 1) return " and your partner"
    return " and your friends"
  }

  if (!guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <Heart className="h-12 w-12 text-primary fill-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary">Guest Profile</h1>
            <p className="text-muted-foreground mb-8">Enter your Guest ID to view your invitation details</p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="guestId" className="block text-sm font-medium mb-1">
                    Guest ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="guestId"
                      value={guestId}
                      onChange={(e) => setGuestId(e.target.value)}
                      placeholder="Enter your Guest ID (e.g., mf25002)"
                    />
                    <Button onClick={handleLookup} disabled={isLoading || !guestId.trim()}>
                      {isLoading ? "Loading..." : "View"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Guest ID was provided in your invitation or WhatsApp message
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <Heart className="h-12 w-12 text-primary fill-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary">Welcome to Our Wedding</h1>
          <p className="text-xl text-muted-foreground">
            Dear {guest.name}
            {getGroupText(guest)}, we're delighted to have you join us!
          </p>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-primary/20 mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary">Invitation Status</CardTitle>
              {getStatusBadge(guest.approvalStatus)}
            </div>
            <CardDescription>
              {guest.approvalStatus === "approved"
                ? "Your invitation has been approved! We look forward to seeing you."
                : "Your registration is being reviewed by the couple."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Guest ID</p>
                  <p className="font-medium">{guest.guestId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Guest Type</p>
                  <p className="font-medium capitalize">
                    {guest.guestType}
                    {guest.guestType === "group" && (
                      <span className="text-sm text-muted-foreground ml-2">
                        ({guest.groupMembers.length + 1} people)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {guest.guestType === "group" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Group Members</p>
                  <div className="bg-secondary/10 p-3 rounded-md">
                    <ul className="list-disc list-inside">
                      <li className="font-medium">{guest.name} (Primary)</li>
                      {guest.groupMembers.map((member: string, index: number) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {guest.approvalStatus === "approved" && (
                <div className="flex justify-center pt-2">
                  <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <QrCode className="mr-2 h-5 w-5" />
                        Show QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-primary">Your Invitation QR Code</DialogTitle>
                        <DialogDescription>
                          Present this QR code at the venue entrance for quick check-in
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                          {/* Simulated QR Code */}
                          <div className="w-64 h-64 bg-[#FFFFFF] relative">
                            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                              {Array.from({ length: 100 }).map((_, i) => {
                                // Create a deterministic pattern based on the guest ID
                                const shouldFill =
                                  (i % 9 === 0 || i % 7 === 0 || i % 11 === 0) &&
                                  !(i % 10 === 0 || i % 10 === 9 || i < 10 || i > 89)
                                return (
                                  <div
                                    key={i}
                                    className={`${shouldFill ? "bg-black" : "bg-transparent"} border border-gray-100`}
                                  ></div>
                                )
                              })}
                              {/* QR Code position markers */}
                              <div className="absolute top-0 left-0 w-[30%] h-[30%] border-8 border-black rounded-lg bg-white"></div>
                              <div className="absolute top-0 right-0 w-[30%] h-[30%] border-8 border-black rounded-lg bg-white"></div>
                              <div className="absolute bottom-0 left-0 w-[30%] h-[30%] border-8 border-black rounded-lg bg-white"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white p-2 rounded">
                                  <Heart className="h-6 w-6 text-primary fill-primary" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-4">
                            <p className="font-bold">{guest.name}</p>
                            <p className="text-sm text-muted-foreground">{guest.guestId}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 text-center">
                          Save a screenshot of this QR code or keep this page open when arriving at the venue
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-primary">Event Details</CardTitle>
            <CardDescription>Important information about our wedding celebration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {eventDetails.date} at {eventDetails.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-muted-foreground">
                    {eventDetails.venue}
                    <br />
                    {eventDetails.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Palette className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Colors & Dress Code</p>
                  <div className="flex items-center gap-2 mb-1 mt-1">
                    {eventDetails.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-muted-foreground">{eventDetails.dresscode}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gift Information */}
        {guest.giftPreference === "yes" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-primary">Your Gift Selection</CardTitle>
              <CardDescription>Thank you for your generosity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  Gift Type: {guest.giftType === "money" ? "Money Contribution" : "Gift Items"}
                </p>
                {guest.giftType === "money" && (
                  <p>
                    You've pledged: <span className="font-bold">₦{guest.moneyAmount}</span>
                  </p>
                )}
                {guest.giftType === "gift" && guest.selectedGifts?.length > 0 && (
                  <div>
                    <p className="mb-1">Selected items:</p>
                    <ul className="list-disc list-inside">
                      {guest.selectedGifts.map((gift: any) => (
                        <li key={gift.id}>{gift.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Thank You</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center italic">
              "We're truly honored that you'll be part of our special day. Your presence will make our celebration
              complete. We look forward to creating beautiful memories together!"
            </p>
            <div className="text-center mt-4">
              <p className="font-medium">With love,</p>
              <p>John & Jane</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
