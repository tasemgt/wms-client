"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, QrCode, ArrowLeft, Calendar, MapPin, Palette, UserCheck, Loader2, Users, Clock } from "lucide-react"
import { QRCodeSVG } from 'qrcode.react';
import Link from "next/link"
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Mock event details
const eventDetails = {
  name: "Mike & Faith",
  date: "Saturday, July 12th, 2025",
  time: "2:00PM",
  venue: "Event Hall, Top Rank Hotels Galaxy Utako, Abuja",
  address: "Plot 245 Pow Mafemi Off Solomon Lar Way, Utako, Abuja, Nigeria",
  colors: ["#673147", "#C8A2C8", "#818589"],
  dresscode: "Color coded Asoebi requested",
}


const GuestQRCode = ({ profileUrl }: { profileUrl: string}) => {
  return (
    <div className="relative w-64 h-64">
      <QRCodeSVG
        value={profileUrl}
        size={256}
        level="H"
        includeMargin
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white p-2 rounded">
          <Heart className="h-12 w-12 text-primary fill-primary" />
        </div>
      </div>
    </div>
    // <div className="w-64 h-64 bg-white p-4 flex items-center justify-center">
    //   <QRCodeSVG
    //     value={profileUrl}           // guest.profileUrl passed here
    //     size={240}                   // size of the QR code
    //     bgColor="#FFFFFF"
    //     fgColor="#673147"
    //     level="H"            // Error correction level
    //     imageSettings={{
    //       src: "/logo.png",   // Path to the image
    //       x: undefined,       // Auto center horizontally
    //       y: undefined,       // Auto center vertically
    //       height: 40,         // Image height
    //       width: 40,          // Image width
    //       excavate: true      // Clears the background behind the image
    //     }}
    //     style={{ borderRadius: "12px" }} // Optional styling
    //     includeMargin={true}
    //   />
    // </div>
  );
};



export default function GuestProfilePage({ params }: { params: { guestId: string } }) {
  const { guestId }:{ guestId: string} = use(params);
  const [guest, setGuest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQrCode, setShowQrCode] = useState(false)
  const [isBouncerView, setIsBouncerView] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const router = useRouter();

  // Simulate fetching guest data
  useEffect(() => {
    const fetchGuestData = async () => {
      setLoading(true)
      try {
        // Simulate API call delay
        const res = await fetch(`${apiUrl}/guests/${guestId}`)
        if (!res.ok) {
          if(res.status === 404) {
            setError("Guest not found. Please check the ID and try again.")
            return
          }
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        // console.log(data.guest);

        const foundGuest = data.guest;
        if (foundGuest) {
          setGuest(foundGuest)
          setError(null)
        } else {
          setError("Guest not found. Please check the ID and try again.")
        }
      } catch (err) {
        setError("An error occurred while fetching guest information.")
      } finally {
        setLoading(false)
      }
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'bouncer') {
        router.replace(`/bouncer/scanner?guestId=${guestId}`);
      }
    }
    // Else stay on this guest profile page (view-only)
    fetchGuestData()

    // Check if this is a bouncer view based on URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    setIsBouncerView(urlParams.get("view") === "bouncer")
  }, [guestId])

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

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsCheckingIn(false)
    alert(`${guest.name} has been successfully checked in!`)
    // In a real app, you would update the guest's check-in status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-primary">Loading guest information...</p>
        </div>
      </div>
    )
  }

  if (error) {
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
          </div>

          <Card className="border-2 border-red-200">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Bouncer View
  // if (isBouncerView) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-8">
  //       <div className="container mx-auto px-4 max-w-md">
  //         <div className="text-center mb-8">
  //           <Link href="/bouncer/dashboard" className="inline-flex items-center text-primary hover:underline mb-4">
  //             <ArrowLeft className="mr-2 h-4 w-4" />
  //             Back to Dashboard
  //           </Link>
  //           <Heart className="h-12 w-12 text-primary fill-primary mx-auto mb-4" />
  //           <h1 className="text-3xl font-bold text-primary">Guest Verification</h1>
  //           <p className="text-muted-foreground">Verify guest details before granting entry</p>
  //         </div>

  //         <Card className="border-2 border-primary/20 mb-6">
  //           <CardHeader>
  //             <div className="flex justify-between items-center">
  //               <CardTitle className="text-primary">Guest Information</CardTitle>
  //               {guest.checkedIn ? (
  //                 <Badge className="bg-blue-500">Already Checked In</Badge>
  //               ) : (
  //                 getStatusBadge(guest.approvalStatus)
  //               )}
  //             </div>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-4">
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div>
  //                   <p className="text-sm font-medium text-muted-foreground">Guest ID</p>
  //                   <p className="font-medium">{guest.guestId}</p>
  //                 </div>
  //                 <div>
  //                   <p className="text-sm font-medium text-muted-foreground">Name</p>
  //                   <p className="font-medium">{guest.name}</p>
  //                 </div>
  //                 <div>
  //                   <p className="text-sm font-medium text-muted-foreground">Guest Type</p>
  //                   <p className="font-medium capitalize">
  //                     {guest.guestType}
  //                     {guest.guestType === "group" && (
  //                       <span className="text-sm text-muted-foreground ml-2">
  //                         ({guest.groupMembers.length + 1} people)
  //                       </span>
  //                     )}
  //                   </p>
  //                 </div>
  //                 <div>
  //                   <p className="text-sm font-medium text-muted-foreground">Attending</p>
  //                   <p className="font-medium capitalize">{guest.attendingStatus}</p>
  //                 </div>
  //               </div>

  //               {guest.guestType === "group" && (
  //                 <div>
  //                   <p className="text-sm font-medium text-muted-foreground mb-2">Group Members</p>
  //                   <div className="bg-secondary/10 p-3 rounded-md space-y-2">
  //                     {/* Primary Guest - Bold and Separated */}
  //                     <div className="pb-2 border-b border-secondary/20">
  //                       <div className="flex items-center gap-2">
  //                         <Users className="h-4 w-4 text-primary" />
  //                         <span className="font-bold text-primary">{guest.name}</span>
  //                         <Badge variant="outline" className="text-xs">
  //                           Primary
  //                         </Badge>
  //                       </div>
  //                     </div>

  //                     {/* Additional Members */}
  //                     <div className="space-y-1">
  //                       <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
  //                         Additional Members
  //                       </p>
  //                       {guest.groupMembers.map((member: string, index: number) => (
  //                         <div key={index} className="flex items-center gap-2">
  //                           <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
  //                           <span className="text-sm">{member}</span>
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>
  //                 </div>
  //               )}

  //               <div className="pt-4">
  //                 {guest.approvalStatus === "approved" ? (
  //                   guest.checkedIn ? (
  //                     <Button disabled className="w-full bg-blue-600">
  //                       Already Checked In
  //                     </Button>
  //                   ) : (
  //                     <Button
  //                       onClick={handleCheckIn}
  //                       disabled={isCheckingIn}
  //                       className="w-full bg-green-600 hover:bg-green-700"
  //                     >
  //                       {isCheckingIn ? (
  //                         <>
  //                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                           Processing...
  //                         </>
  //                       ) : (
  //                         <>
  //                           <UserCheck className="mr-2 h-4 w-4" />
  //                           Check In Guest
  //                         </>
  //                       )}
  //                     </Button>
  //                   )
  //                 ) : (
  //                   <Button disabled className="w-full bg-yellow-500">
  //                     Not Approved Yet
  //                   </Button>
  //                 )}
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   )
  // }

  // Regular Guest View
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
          <br />
          <p className="text-xl text-muted-foreground">
            Dear <strong>{guest.name}</strong>
            {getGroupText(guest)}, we're delighted to have you join us!
          </p>
        </div>

        {/* Status Card */}
        <div className="flex flex-col items-center min-h-screen p-4">
      <style jsx>{`
        .barcode {
          left: 50%;
          box-shadow: 1px 0 0 1px #333, 5px 0 0 1px #333, 10px 0 0 1px #333, 11px 0 0 1px #333, 15px 0 0 1px #333, 18px 0 0 1px #333, 22px 0 0 1px #333, 23px 0 0 1px #333, 26px 0 0 1px #333, 30px 0 0 1px #333, 35px 0 0 1px #333, 37px 0 0 1px #333, 41px 0 0 1px #333, 44px 0 0 1px #333, 47px 0 0 1px #333, 51px 0 0 1px #333, 56px 0 0 1px #333, 59px 0 0 1px #333, 64px 0 0 1px #333, 68px 0 0 1px #333, 72px 0 0 1px #333, 74px 0 0 1px #333, 77px 0 0 1px #333, 81px 0 0 1px #333, 85px 0 0 1px #333, 88px 0 0 1px #333, 92px 0 0 1px #333, 95px 0 0 1px #333, 96px 0 0 1px #333, 97px 0 0 1px #333, 101px 0 0 1px #333, 105px 0 0 1px #333, 109px 0 0 1px #333, 110px 0 0 1px #333, 113px 0 0 1px #333, 116px 0 0 1px #333, 120px 0 0 1px #333, 123px 0 0 1px #333, 127px 0 0 1px #333, 130px 0 0 1px #333, 131px 0 0 1px #333, 134px 0 0 1px #333, 135px 0 0 1px #333, 138px 0 0 1px #333, 141px 0 0 1px #333, 144px 0 0 1px #333, 147px 0 0 1px #333, 148px 0 0 1px #333, 151px 0 0 1px #333, 155px 0 0 1px #333, 158px 0 0 1px #333, 162px 0 0 1px #333, 165px 0 0 1px #333, 168px 0 0 1px #333, 173px 0 0 1px #333, 176px 0 0 1px #333, 177px 0 0 1px #333, 180px 0 0 1px #333;
          display: inline-block;
          transform: translateX(-90px);
        }
      `}</style>
      
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white relative drop-shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-6 py-4" style={{background: 'linear-gradient(to right, rgb(103, 49, 71), rgb(83, 39, 57))'}}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 fill-current" />
                <span className="font-bold text-lg">Wedding Invitation</span>
              </div>
              {getStatusBadge(guest.status.toLowerCase())}
            </div>
          </div>

          <div className="p-6">
            {/* Status Description */}
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {guest.status === "Approved"
                  ? "Your invitation has been approved! We look forward to celebrating with you."
                  : "Your registration is being reviewed by the couple."}
              </p>
            </div>

            {/* Wedding Details Section */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2" style={{color: 'rgb(103, 49, 71)'}}>Mike & Faith's Wedding</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" style={{color: 'rgb(103, 49, 71)'}} />
                    <span>Saturday, July 12th, 2025</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" style={{color: 'rgb(103, 49, 71)'}} />
                    <span>2:00 PM</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border" style={{backgroundColor: 'rgba(103, 49, 71, 0.05)', borderColor: 'rgba(103, 49, 71, 0.2)'}}>
                <div className="flex items-start gap-2 text-left">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" style={{color: 'rgb(103, 49, 71)'}} />
                  <div className="text-sm">
                    <div className="font-semibold" style={{color: 'rgb(103, 49, 71)'}}>Event Hall, Top Rank Hotels Galaxy Utako</div>
                    <div className="text-gray-600 text-xs mt-1">
                      Plot 245 Pow Mafemi Off Solomon Lar Way, Utako, Abuja, Nigeria
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider with circles */}
            <div className="border-b border-dashed border-b-2 my-6 relative">
              <div className="absolute rounded-full w-5 h-5 -mt-2 -left-8 border-2 border-gray-200" style={{backgroundColor: 'rgba(103, 49, 71, 0.05)'}}></div>
              <div className="absolute rounded-full w-5 h-5 -mt-2 -right-8 border-2 border-gray-200" style={{backgroundColor: 'rgba(103, 49, 71, 0.05)'}}></div>
            </div>

            {/* Guest Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Guest ID</span>
                  <div className="font-semibold text-gray-800">{guest.guestId}</div>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-gray-500">Type</span>
                  <div className="font-semibold text-gray-800 capitalize">
                    {guest.guestType}
                    {guest.guestType === "group" && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({guest.groupMembers?.length + 1})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-500">Dress Code</span>
                  <div className="font-semibold text-gray-800 text-xs">Color coded Asoebi</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3" style={{justifyContent: 'center', margin: '1.5rem auto'}}>
                <Palette className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Colors of the day</p>
                  <div className="flex items-center gap-2 mb-1 mt-1">
                    {eventDetails.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

            {/* Group Members Section */}
            {guest.guestType === "group" && guest.groupMembers && (
              <>
                <div className="border-b border-dashed border-b-2 my-6 relative">
                  <div className="absolute rounded-full w-5 h-5 -mt-2 -left-8 border-2 border-gray-200" style={{backgroundColor: 'rgba(103, 49, 71, 0.05)'}}></div>
                  <div className="absolute rounded-full w-5 h-5 -mt-2 -right-8 border-2 border-gray-200" style={{backgroundColor: 'rgba(103, 49, 71, 0.05)'}}></div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h6 className="font-bold text-gray-800 mb-2">Invited Guests</h6>
                  </div>
                  
                  {/* Primary Guest */}
                  <div className="p-3 rounded-lg border" style={{backgroundColor: 'rgba(103, 49, 71, 0.05)', borderColor: 'rgba(103, 49, 71, 0.2)'}}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" style={{color: 'rgb(103, 49, 71)'}} />
                      <span className="font-bold text-base" style={{color: 'rgb(103, 49, 71)'}}>{ guest.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{backgroundColor: 'rgba(103, 49, 71, 0.2)', color: 'rgb(103, 49, 71)'}}>
                        Primary
                      </span>
                    </div>
                  </div>

                  {/* Additional Members */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Additional Guests ({guest.groupMembers.length})
                    </p>
                    <div className="space-y-2">
                      {guest.groupMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(103, 49, 71)'}}></div>
                          <span className="text-sm font-medium text-gray-700">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {guest.status === "Approved" && (
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
                          {/* QR Code */}
                          
                          <GuestQRCode profileUrl={guest.profileUrl} />

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

            {/* Barcode Section */}
            <div className="flex flex-col items-center justify-center text-sm mt-8 pt-6 border-t border-dashed border-gray-200">
              <h6 className="font-bold text-center text-gray-700 mb-3">Wedding Pass</h6>
              <div className="barcode h-14 w-0 inline-block relative"></div>
              <p className="text-xs text-gray-500 mt-2">Please present this invitation and QR at the venue</p>
            </div>
          </div>
        </div>
      </div>
    </div>

        {/* Event Details */}
        {/* <Card className="mb-6">
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
        </Card> */}

        {/* Gift Information */}
        {guest.giftSelected && (
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
                    You've pledged: <span className="font-bold">₦{guest.moneyAmount.toLocaleString()}</span>
                  </p>
                )}
                {guest.giftType === "gift" && guest.giftItems?.length > 0 && (
                  <div style={{backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "8px"}}>
                    <p className="mb-1">Selected items:</p>
                    <ul className="list-disc list-inside">
                      {guest.giftItems.map((gift: any) => (
                        <li key={gift._id}>{gift.name}</li>
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
              <p className="font-medium">With ❤️ Mike & Faith</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
