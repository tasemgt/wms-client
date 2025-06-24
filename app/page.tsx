"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Send, User, Gift, QrCode, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Licorice } from 'next/font/google'

const roboto = Licorice({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
})


import './styles.css'

export default function HomePage() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [guestId, setGuestId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleViewProfile = async () => {
    if (!guestId.trim()) {
      alert("Please enter your Guest ID")
      return
    }

    setIsLoading(true)

    // Simulate a brief loading state
    setTimeout(() => {
      setIsLoading(false)
      setIsProfileDialogOpen(false)
      router.push(`/profile/${guestId.trim()}`)
      setGuestId("") // Reset the input
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 home">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-2xl font-bold text-gray-700">#MIFA25</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Admin Area</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Heart className="h-16 w-16 text-primary fill-primary mx-auto mb-4" />
            <h2 className="text-4xl md:text-6xl font-bold text-gray-700 mb-4">Mike & Faith <br/> 
            <span className={roboto.className}>Invites You!</span></h2>
            <p className="text-xl text-gray-600 mb-8">
              Join us in celebrating our special day. Please confirm your attendance and help us make this celebration
              perfect.
            </p>
          </div>

          {/* Illustration placeholder */}
          <div className="mb-12 p-8 bg-secondary/10 rounded-2xl head-img-container">
             <img src="/illust/couple1.svg" alt="" className='head-img'/>
            {/* <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">Wedding Celebration</p>
                <p className="text-gray-600">A beautiful illustration would go here</p>
              </div>
            </div> */}
          </div>

          {/* How It Works Section - Moved here */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-700 mb-8">Simple steps to RSVP!</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <Send className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-gray-700">1. Send RSVP</CardTitle>
                  <CardDescription className="text-gray-600">
                    Fill out the RSVP form with your details and let us know if you're coming
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-gray-700">2. Choose Gift</CardTitle>
                  <CardDescription className="text-gray-600">
                    Select a gift from our registry or contribute to our future together
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <QrCode className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-gray-700">3. Invite E-Card - QR Code</CardTitle>
                  <CardDescription className="text-gray-600">
                    Access your invite e-card and QR code for easy check-in at the venue
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/register">
                <Send className="mr-2 h-5 w-5" />
                Send RSVP
              </Link>
            </Button>

            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <User className="mr-2 h-5 w-5" />
                  My E-card
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-primary">Access Your E-card</DialogTitle>
                  <DialogDescription>Enter your Guest ID to view your invitation details and QR code</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestId">Guest ID</Label>
                    <Input
                      id="guestId"
                      value={guestId}
                      onChange={(e) => setGuestId(e.target.value)}
                      placeholder="Enter your Guest ID (e.g., mf25002)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleViewProfile()
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Guest ID was provided in your invitation or WhatsApp message
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleViewProfile} disabled={isLoading || !guestId.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "View E-card"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-lg font-semibold">With</span>
            <Heart className="h-6 w-6 fill-white" />
            <span className="text-lg font-semibold">#MIFA25</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
