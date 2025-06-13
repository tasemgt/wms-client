"use client"

import { useState, useRef, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scan, Camera, UserCheck, QrCode, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import BouncerLayout from "@/components/bouncer-layout"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { apiRequest } from "@/lib/http"
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ScannerPage() {
  // const searchParams = useSearchParams();
  // const guestId = searchParams.get('guestId')
  const [activeTab, setActiveTab] = useState("manual")
  const [isScanning, setIsScanning] = useState(false)
  const [scannedGuest, setScannedGuest] = useState<any>(null)
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false)
  const [manualGuestId, setManualGuestId] = useState("")
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const [queryParams, setQueryParams] = useState({});
  const [guestId, setGuestId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchGuestData = async (manualGuestId?: string | null) => {
    if (!guestId && !manualGuestId) return;
    const searchKey = manualGuestId || guestId;
    try {
      const response = await fetch(`${apiUrl}/guests/${searchKey}`);
      if (!response.ok) {
        throw new Error("Guest not found");
      }
      const data = await response.json();
      console.log("Fetched guest data:", data);
      setScannedGuest(data.guest);
      setIsGuestDialogOpen(true);
      setManualGuestId("")
    } catch (error) {
      console.error("Error fetching guest data:", error);
      toast({
        title: "Guest Not Found",
        description: "Please check the ID and try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Simulate scanning a QR code
  const simulateScan = () => {
    // setIsScanning(true)

    // // Simulate a delay for scanning
    // setTimeout(() => {
    //   setIsScanning(false)
    //   setScannedGuest(mockGuest)
    //   setIsGuestDialogOpen(true)
    // }, 2000)
  }

  // Handle manual guest ID lookup
  const handleManualLookup = (guestIdFromForm: string) => {
    fetchGuestData(guestIdFromForm);
  }

  // Handle guest check-in with loading states and toast
  const handleCheckIn = async (guestId: string, fromModal = true) => {
    const loadingKey = `checkin-${guestId}`
    setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

    try {
      const res = await apiRequest(`${apiUrl}/bouncer/grant-access/${guestId}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to check in guest")
      }

      if (res.status === 200) {
        toast({
          title: "Check-in Successful",
          description: `${scannedGuest.name} has been successfully checked in!`,
          duration: 5000,
        })
        
        if (fromModal) {
          setIsGuestDialogOpen(false)
        }
        
        // Update the scanned guest state to reflect the check-in
        setScannedGuest(prev => ({
          ...prev,
          checkedIn: true,
          hasAccessGranted: true
        }))
        
      } else {
        throw new Error("Check-in failed")
      }
    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: "There was an error checking in the guest. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  useEffect(() => {
    // Logs scanned guest ID from URL parameters

    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlParams);
      setQueryParams(params);
      setGuestId(params.guestId);
      console.log("Query Params:", params);
      fetchGuestData();
      if (!guestId) return;
      apiRequest(`${apiUrl}/bouncer/log`, {
          method: "POST",
          body: JSON.stringify({ guestId })
        }).then((res) => {
          if (res.ok) {
            console.log("Logged:", guestId);
          } else {
            console.error("Failed to Log", guestId);
          }
        }
      ).catch((error) => {
        console.error("Error logging guest:", error);
      });
    }

  }, [guestId]) // Note: Guest ID is fetched from URL parameters

  // Prevent hydration mismatch
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <BouncerLayout>
      <div className="space-y-6">
        <Toaster />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link href="/bouncer/dashboard" className="inline-flex items-center text-primary hover:underline mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-primary">QR Code Scanner</h1>
            <p className="text-muted-foreground">Scan guest QR codes to verify and check in</p>
          </div>
        </div>

        {/* Scanner Interface */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Guest Verification</CardTitle>
            <CardDescription>Scan QR codes or enter guest ID manually</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera" disabled={true}>
                  <Camera className="h-4 w-4 mr-2" />
                  Camera Scanner
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <QrCode className="h-4 w-4 mr-2" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>
              <TabsContent value="camera" className="space-y-4">
                <div className="relative border-2 border-dashed rounded-lg overflow-hidden aspect-video">

                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>

                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-primary rounded-lg relative">
                      <div className="absolute inset-0 border-2 border-transparent">
                        <div
                          className={`absolute top-0 left-0 w-full h-1 bg-primary ${isScanning ? "animate-scan" : ""}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={simulateScan} disabled={isScanning} className="w-full max-w-xs">
                    {isScanning ? (
                      <>
                        <Scan className="h-4 w-4 mr-2 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        Start Scanning
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="guestId" className="text-sm font-medium">
                    Guest ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="guestId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter guest ID (e.g., mf25002)"
                      value={manualGuestId}
                      onChange={(e) => setManualGuestId(e.target.value)}
                    />
                    <Button onClick={() => handleManualLookup(manualGuestId.trim())} disabled={!manualGuestId.trim()}>
                      Lookup
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Enter the guest ID from their invitation or QR code</p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">How to find the Guest ID:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mt-0.5">
                        1
                      </div>
                      <span>Ask the guest for their invitation or QR code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mt-0.5">
                        2
                      </div>
                      <span>The Guest ID is in the format "mf" followed by 5 digits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mt-0.5">
                        3
                      </div>
                      <span>Enter the ID exactly as shown on their invitation</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Scanner Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Position the QR Code</p>
                  <p className="text-sm text-muted-foreground">
                    Ask the guest to hold their QR code within the scanning frame
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Verify Guest Identity</p>
                  <p className="text-sm text-muted-foreground">
                    Check that the name and details match the person presenting the QR code
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Confirm Group Members</p>
                  <p className="text-sm text-muted-foreground">
                    For group registrations, verify all members are present as listed
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Complete Check-in</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Check In Guest" to record their attendance and grant entry
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Details Dialog */}
        {scannedGuest && (
          <Dialog open={isGuestDialogOpen} onOpenChange={setIsGuestDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary">Guest Verification</DialogTitle>
                <DialogDescription>Verify guest details before granting entry</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                { scannedGuest.status === "Approved" ? (
                  <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-500">Approved</Badge>
                      <p className="text-green-700 font-medium">Valid Invitation</p>
                    </div>
                    <p className="text-sm text-green-600">This guest has been approved to attend the event</p>
                  </div>
                ) : (
                  <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500">Not Approved</Badge>
                      <p className="text-red-700 font-medium">Invalid Invitation</p>
                    </div>
                    <p className="text-sm text-red-600">This guest does not have a valid invitation</p>
                  </div>
                )}
                {/* <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50" >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500">Approved</Badge>
                    <p className="text-green-700 font-medium">Valid Invitation</p>
                  </div>
                  <p className="text-sm text-green-600">This guest has been approved to attend the event</p>
                </div> */}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guest ID</p>
                    <p className="font-medium">{scannedGuest.guestId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Check-in Status</p>
                    <div>
                      {scannedGuest.hasAccessGranted || scannedGuest.checkedIn ? (
                        <Badge className="bg-blue-500">Checked In</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                          Not Checked In
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="font-medium">{scannedGuest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guest Type</p>
                    <div className="capitalize flex items-center">
                      {scannedGuest.guestType}
                      {scannedGuest.guestType === "group" && (
                        <Badge variant="outline" className="ml-2">
                          {scannedGuest.groupMembers.length + 1} people
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {scannedGuest.guestType === "group" && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Group Members</p>
                    <div className="bg-secondary/10 p-3 rounded-md">
                      <ul className="space-y-1">
                        {scannedGuest.groupMembers.map((member: string, index: number) => (
                          <li key={index} className="text-sm">
                            • {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {!(scannedGuest.status === 'Approved') ? (
                  <Button disabled className="bg-green-600">
                    Check In Guest
                  </Button>) 
                  :!(scannedGuest.hasAccessGranted)? (
                    <Button 
                      onClick={() => handleCheckIn(scannedGuest.guestId)} 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={loadingStates[`checkin-${scannedGuest.guestId}`]}
                    >
                      {loadingStates[`checkin-${scannedGuest.guestId}`] ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4 mr-2" />
                      )}
                      Check In Guest
                    </Button>)  
                 :(
                  <Button disabled className="bg-blue-600">
                    Already Checked In
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsGuestDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </BouncerLayout>
  )
}