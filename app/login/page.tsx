"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Shield, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

// Sample user credentials for testing
// const sampleUsers = [
//   {
//     email: "admin@wedding.com",
//     password: "admin123",
//     role: "admin",
//     name: "Wedding Admin",
//   },
//   {
//     email: "bouncer@wedding.com",
//     password: "bouncer123",
//     role: "bouncer",
//     name: "Security Team",
//   },
// ]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)


  useEffect(() => {
      // Check if user is logged in and has admin role
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.role === "admin") {
          window.location.href = "/admin/dashboard"
        } else if (parsedUser.role === "bouncer") {
          window.location.href = "/bouncer/dashboard"
        } else {
          // Redirect to login if not an admin
          window.location.href = "/login"
        }
      } else {
        // Redirect to login if not logged in
        // window.location.href = "/login"
      }
    }, [])


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate login process
    // setTimeout(() => {
      // Check credentials against sample users
      // const user = sampleUsers.find((u) => u.email === email && u.password === password)

      try {
        const res = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          credentials: "include", // 👈 ensures cookie is set
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
        setIsLoading(false)
        
        if (!res.ok) throw new Error("Login failed")
          const data = await res.json()
          const user = data.user
          
          if (user) {
            // Store user info in localStorage (in a real app, you'd use proper session management)
            localStorage.setItem("user", JSON.stringify(user))
    
            // Redirect based on role
            if (user.role === "admin") {
              window.location.href = "/admin/dashboard"
            } else if (user.role === "bouncer") {
              window.location.href = "/bouncer/dashboard"
            }
          } else {
            setError("Invalid email or password. Please try again.")
          }
          
        }
        catch (err) {
          setIsLoading(false)
          setError("Invalid email or password. Please try again.")
      }
    // }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-700">System Login</h1>
          <p className="text-gray-600">Access the wedding management system</p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sample Credentials for Testing */}
        {/* <Card className="mt-6 bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Sample Login Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-gray-700">Admin Access:</p>
              <p className="text-gray-600">Email: admin@wedding.com</p>
              <p className="text-gray-600">Password: admin123</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700">Bouncer Access:</p>
              <p className="text-gray-600">Email: bouncer@wedding.com</p>
              <p className="text-gray-600">Password: bouncer123</p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
