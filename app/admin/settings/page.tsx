"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Bell, Palette, User, Lock, Save, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AdminLayout from "@/components/admin-layout"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    weddingDate: "2024-06-15",
    weddingTime: "16:00",
    venueName: "Grand Ballroom, Elegant Hotel",
    venueAddress: "123 Wedding Street, City",
    contactEmail: "contact@wedding.com",
    contactPhone: "+1234567890",
    maxGuests: "200",
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    guestApprovalAlerts: true,
    newRegistrationAlerts: true,
    systemUpdates: false,
  })

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#673147",
    secondaryColor: "#C8A2C8",
    tertiaryColor: "#818589",
    welcomeMessage: "Welcome to our wedding! We're excited to celebrate with you.",
    footerText: "Thank you for being part of our special day.",
  })

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    name: "Wedding Admin",
    email: "admin@wedding.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Build payload based on active tab
      let payload = {}

      switch (activeTab) {
        case "general":
          payload = { type: "general", settings: generalSettings }
          break
        case "notifications":
          payload = { type: "notifications", settings: notificationSettings }
          break
        case "appearance":
          payload = { type: "appearance", settings: appearanceSettings }
          break
        case "account":
          // Validate password fields if they're filled
          if (accountSettings.newPassword || accountSettings.confirmPassword || accountSettings.currentPassword) {
            if (!accountSettings.currentPassword) {
              toast({
                title: "Validation Error",
                description: "Current password is required to change password",
                variant: "destructive",
              })
              setIsSaving(false)
              return
            }

            if (accountSettings.newPassword !== accountSettings.confirmPassword) {
              toast({
                title: "Validation Error",
                description: "New password and confirmation do not match",
                variant: "destructive",
              })
              setIsSaving(false)
              return
            }

            if (accountSettings.newPassword.length < 8) {
              toast({
                title: "Validation Error",
                description: "New password must be at least 8 characters long",
                variant: "destructive",
              })
              setIsSaving(false)
              return
            }
          }

          payload = {
            type: "account",
            settings: {
              name: accountSettings.name,
              email: accountSettings.email,
              passwordChanged: Boolean(accountSettings.newPassword),
            },
          }
          break
      }

      // Log the payload
      console.log("=== SETTINGS UPDATE PAYLOAD ===")
      console.log(JSON.stringify(payload, null, 2))
      console.log("=== END PAYLOAD ===")

      // Show success message
      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully saved.",
      })

      // Reset password fields
      if (activeTab === "account") {
        setAccountSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
      }
    } catch (error) {
      console.error("Settings update error:", error)
      toast({
        title: "Update Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Toaster />

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="text-muted-foreground">Manage your wedding and system settings</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Wedding Details
                </CardTitle>
                <CardDescription>Configure the basic details about your wedding event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate">Wedding Date</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={generalSettings.weddingDate}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, weddingDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weddingTime">Wedding Time</Label>
                    <Input
                      id="weddingTime"
                      type="time"
                      value={generalSettings.weddingTime}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, weddingTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venueName">Venue Name</Label>
                  <Input
                    id="venueName"
                    value={generalSettings.venueName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, venueName: e.target.value })}
                    placeholder="Enter venue name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venueAddress">Venue Address</Label>
                  <Textarea
                    id="venueAddress"
                    value={generalSettings.venueAddress}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, venueAddress: e.target.value })}
                    placeholder="Enter venue address"
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      placeholder="Enter contact email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                      placeholder="Enter contact phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxGuests">Maximum Number of Guests</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    value={generalSettings.maxGuests}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, maxGuests: e.target.value })}
                    placeholder="Enter maximum number of guests"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Settings
                </CardTitle>
                <CardDescription>Configure map and location settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mapLink">Google Maps Link (Optional)</Label>
                  <Input id="mapLink" placeholder="Enter Google Maps link to your venue" />
                  <p className="text-sm text-muted-foreground">This link will be shown to guests for directions</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="showMap" />
                  <Label htmlFor="showMap">Show map on guest profile page</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="guestApprovalAlerts">Guest Approval Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when guests need approval</p>
                    </div>
                    <Switch
                      id="guestApprovalAlerts"
                      checked={notificationSettings.guestApprovalAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, guestApprovalAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newRegistrationAlerts">New Registration Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new guests register</p>
                    </div>
                    <Switch
                      id="newRegistrationAlerts"
                      checked={notificationSettings.newRegistrationAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, newRegistrationAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemUpdates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Theme & Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of your wedding site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) =>
                          setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })
                        }
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) =>
                          setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tertiaryColor">Tertiary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tertiaryColor"
                        type="color"
                        value={appearanceSettings.tertiaryColor}
                        onChange={(e) =>
                          setAppearanceSettings({ ...appearanceSettings, tertiaryColor: e.target.value })
                        }
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={appearanceSettings.tertiaryColor}
                        onChange={(e) =>
                          setAppearanceSettings({ ...appearanceSettings, tertiaryColor: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-secondary/10">
                  <div className="flex gap-2 mb-2">
                    {[
                      appearanceSettings.primaryColor,
                      appearanceSettings.secondaryColor,
                      appearanceSettings.tertiaryColor,
                    ].map((color, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Preview of your selected color scheme</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={appearanceSettings.welcomeMessage}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, welcomeMessage: e.target.value })}
                    placeholder="Enter welcome message for guests"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input
                    id="footerText"
                    value={appearanceSettings.footerText}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, footerText: e.target.value })}
                    placeholder="Enter footer text"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your account details and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={accountSettings.name}
                      onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-primary" />
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={accountSettings.currentPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={accountSettings.newPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={accountSettings.confirmPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
