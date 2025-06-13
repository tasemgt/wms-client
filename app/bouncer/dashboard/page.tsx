"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scan, UserCheck, QrCode, Clock } from "lucide-react"
import Link from "next/link"
import BouncerLayout from "@/components/bouncer-layout"
import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/http"
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Mock data - in real app, this would come from your database
// const bouncerStats = {
//   totalScanned: 0,
//   guestsAllowed: 0,
//   sessionStartTime: new Date().toLocaleTimeString(),
// }

const recentScans = [
  // This would be populated as guests are scanned
]

export default function BouncerDashboard() {

  const [bouncerStats, setBouncerStats] = useState({
    totalScanned: 0,
    guestsAllowed: 0});


  useEffect(() => {
  const fetchStats = async () => {
    console.log('Fetching bouncer stats...');
    try {
      // Fetch bouncer stats from the API
      const res = await apiRequest(`${apiUrl}/bouncer/stats`, {method: "GET"})
      if (!res.ok) throw new Error('Failed to fetch bouncer stats');
      const bouncerStatsData = await res.json();
      setBouncerStats(bouncerStatsData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setLoading(false);
    }
  };

  fetchStats();
}, []);



  return (
    <BouncerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Bouncer Dashboard</h1>
          <p className="text-gray-600">Welcome! Ready to scan guest QR codes and manage entry.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Scanned</CardTitle>
              <Scan className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{bouncerStats.totalScanned}</div>
              <p className="text-xs text-gray-600">QR codes scanned today</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Guests Allowed</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{bouncerStats.guestsAllowed}</div>
              <p className="text-xs text-gray-600">Granted entry</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Session Started</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-600">{bouncerStats.sessionStartTime}</div>
              <p className="text-xs text-gray-600">Current session</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Scan guest QR codes to verify their invitation status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link href="/bouncer/scanner">
                <Scan className="mr-2 h-5 w-5" />
                Start Scanning
              </Link>
            </Button>
          </CardContent>
        </Card> */}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Recent Scans</CardTitle>
            <CardDescription>Latest guest verifications and entry approvals</CardDescription>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <div className="text-center py-8">
                <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No scans yet today</p>
                <p className="text-sm text-gray-500">Start scanning guest QR codes to see activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentScans.map((scan: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium text-gray-700">{scan.guestName}</p>
                        <p className="text-sm text-gray-600">{scan.guestId}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {scan.time}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-gray-700">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-gray-600">Click "Start Scanning" to open the QR code scanner</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-gray-600">Point your camera at the guest's QR code</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-gray-600">Verify the guest's identity and details</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-gray-600">Grant access if everything checks out</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BouncerLayout>
  )
}
