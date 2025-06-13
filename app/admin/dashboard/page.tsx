"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Clock, Gift, DollarSign, Calendar } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { apiRequest } from "@/lib/http"
import { set } from "date-fns"

// Mock data - in real app, this would come from your database
// const dashboardStats = {
//   totalGuests: 156,
//   approvedGuests: 142,
//   pendingGuests: 14,
//   totalPledged: 15420,
//   giftItems: 45,
//   checkedIn: 0,
// }

const recentActivity = [
  { id: 1, action: "New registration", guest: "Sarah Johnson", time: "2 minutes ago", type: "registration" },
  { id: 2, action: "Guest approved", guest: "Mike Chen", time: "15 minutes ago", type: "approval" },
  { id: 3, action: "Gift selected", guest: "Emma Wilson", time: "1 hour ago", type: "gift" },
  { id: 4, action: "Money contribution", guest: "David Brown", time: "2 hours ago", type: "money" },
]

export default function AdminDashboard() {

  const [dashboardStats, setDashboardStats] = useState({
    totalGuests: 0,
    approvedGuests: 0,
    pendingGuests: 0,
    totalPledged: 0,
    giftItems: 0,
    checkedIn: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        // Fetch dashboard stats
        const res = await apiRequest('http://localhost:4000/api/admin/dashboard', { method: "GET" });
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        const dashboardStats = await res.json();
        console.log('Dashboard Stats:', dashboardStats);
        setDashboardStats(dashboardStats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // setLoading(false);
      }
    };
  
    fetchData();
  }, []);


  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your wedding.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{dashboardStats.totalGuests}</div>
              <p className="text-xs text-muted-foreground">Registered for the event</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Guests</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardStats.totalApproved}</div>
              <p className="text-xs text-muted-foreground">Ready to attend</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{dashboardStats.totalPending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Money Pledged</CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
               ₦{dashboardStats.totalMoneyPledged && dashboardStats.totalMoneyPledged.toLocaleString() }
              </div>
              <p className="text-xs text-muted-foreground">Money contributions</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-tertiary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gift Items</CardTitle>
              <Gift className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">{dashboardStats.totalGifts}</div>
              <p className="text-xs text-muted-foreground">Items selected</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">0</div>
              <p className="text-xs text-muted-foreground">At the venue</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-primary">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your wedding management system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "registration"
                          ? "bg-blue-500"
                          : activity.type === "approval"
                            ? "bg-green-500"
                            : activity.type === "gift"
                              ? "bg-purple-500"
                              : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.guest}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 border rounded-lg hover:bg-secondary/10 cursor-pointer transition-colors">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Manage Guests</h3>
                <p className="text-sm text-muted-foreground">View and approve registrations</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-secondary/10 cursor-pointer transition-colors">
                <Gift className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Gift Registry</h3>
                <p className="text-sm text-muted-foreground">Manage gift selections</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-secondary/10 cursor-pointer transition-colors">
                <UserCheck className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Send Invites</h3>
                <p className="text-sm text-muted-foreground">Send QR codes to approved guests</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-secondary/10 cursor-pointer transition-colors">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Event Details</h3>
                <p className="text-sm text-muted-foreground">Update event information</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
