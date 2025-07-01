"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, X, Gift, CreditCard, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { apiRequest } from "../../lib/http"
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    attending: "",
    guestType: "",
    groupMembers: [""],
    name: "",
    email: "",
    countryCode: "+234", // Default to Nigeria
    phone: "",
    giftPreference: "",
    giftType: "",
    selectedGifts: [] as number[],
    moneyAmount: "",
    goodwillMessage: "",
    isAnonymous: false,
  })

  const [giftItems, setGiftItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${apiUrl}/giftitem`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setGiftItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching gift items:', error);
        setLoading(false);
      });
  }, []);



  const addGroupMember = () => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: [...prev.groupMembers, ""],
    }))
  }

  const removeGroupMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.filter((_, i) => i !== index),
    }))
  }

  const updateGroupMember = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.map((member, i) => (i === index ? value : member)),
    }))
  }

  const toggleGiftSelection = (giftId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedGifts: prev.selectedGifts.includes(giftId)
        ? prev.selectedGifts.filter((id) => id !== giftId)
        : [...prev.selectedGifts, giftId],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {

      // Build the payload object
      const payload = {
        name: formData.name,
        email: formData.email || null,
        phone:`${formData.countryCode}${formData.phone[0] === "0" ? formData.phone.slice(1) : formData.phone}`, // Ensure no leading zero
        attendingStatus: formData.attending, // "yes", "maybe", "no"
        guestType: formData.guestType || "single", // "single", "group"
        groupMembers: formData.guestType === "group" ? formData.groupMembers.filter((member) => member.trim() !== "") : [],
        giftSelected: formData.giftPreference === "yes", // true or false
        giftType: formData.giftType || null, // "gift", "money"
        giftItems: formData.giftType === "gift" ? formData.selectedGifts : [], // array of gift IDs
        moneyAmount: formData.giftType === "money" ? Number.parseFloat(formData.moneyAmount) || 0 : 0, // amount in NGN
        message: formData.goodwillMessage || null
      }

      // Log the payload to console
      console.log("=== RSVP SUBMISSION PAYLOAD ===")
      console.log(JSON.stringify(payload, null, 2))
      console.log("=== END PAYLOAD ===")

      // // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      const res = await apiRequest(`${apiUrl}/guests/register`, {
        method: "POST",
          body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to send RSVP")
      }
      // const data = await res.json()
      if(res.status === 201) {   
        // Show success toast
        toast({
          title: "Registration Successful!",
          description:
            formData.attending === "no"
              ? "Thank you for your response and gift selection."
              : "We look forward to seeing you at our wedding!",
          duration: 5000,
        });
        setTimeout(() => window.location.href = "/", 2000) // Redirect to home after 2 seconds;
      }
      
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Unsuccessful",
        description: "There was an error submitting your rsvp. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToStep2 = formData.attending && (formData.attending === "no" || formData.guestType)
  const canProceedToStep3 = formData.name && formData.phone

  if (formData.attending === "no") {
    // If we're on step 3 (gift selection), show the gift options
    if (step === 3) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Toaster />
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <Heart className="h-12 w-12 text-primary fill-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-primary">Gift Options</h1>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-primary font-semibold">Your Details</span>
                <span className="text-sm text-primary font-semibold">Gift Options</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Gift Preferences</CardTitle>
                <CardDescription>Thank you for thinking of us even though you can't attend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">Would you like to give a gift?</Label>
                  <RadioGroup
                    value={formData.giftPreference}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, giftPreference: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="gift-yes" />
                      <Label htmlFor="gift-yes">Yes, I'd love to give a gift</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="gift-no" />
                      <Label htmlFor="gift-no">No, just my best wishes</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.giftPreference === "yes" && (
                  <>
                    <div>
                      <Label className="text-base font-semibold">Gift Type</Label>
                      <RadioGroup
                        value={formData.giftType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, giftType: value }))}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gift" id="physical-gift" />
                          <Label htmlFor="physical-gift">
                            <Gift className="inline mr-2 h-4 w-4" />
                            Physical Gift
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="money" id="money-gift" />
                          <Label htmlFor="money-gift">
                            <CreditCard className="inline mr-2 h-4 w-4" />
                            Money Contribution
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.giftType === "gift" && (
                      <div>
                        <Label className="text-base font-semibold">Select Gift Items</Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          You can select multiple items from our registry
                        </p>
                        <div className="grid gap-2 max-h-64 overflow-y-auto">
                          {giftItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary/10 cursor-pointer"
                              onClick={() => toggleGiftSelection(item._id)}
                            >
                              <Checkbox
                                checked={formData.selectedGifts.includes(item._id)}
                                onChange={() => toggleGiftSelection(item._id)}
                              />
                              <div className="flex-1">
                                <span className="font-medium">{item.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  picked {item.pickedCount} times
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.giftType === "money" && (
                      <div>
                        <Label htmlFor="amount">Contribution Amount</Label>
                        <div className="relative mt-2">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                          <Input
                            id="amount"
                            type="number"
                            value={formData.moneyAmount}
                            onChange={(e) => setFormData((prev) => ({ ...prev, moneyAmount: e.target.value }))}
                            placeholder="Enter amount"
                            className="pl-8"
                          />
                        </div>
                        <p>Kindly send your contribution to any of the accounts below</p>
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          <Card className="bg-secondary/10">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-primary mb-2">Account Details 1</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Bank:</strong> Globus Bank Nigeria
                                </p>
                                <p>
                                  <strong>Account Name:</strong> Ibrahim Faith
                                </p>
                                <p>
                                  <strong>Account Number:</strong> 3640011960
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-secondary/10">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-primary mb-2">Account Details 2</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Bank:</strong> GTBank Nigeria
                                </p>
                                <p>
                                  <strong>Account Name:</strong> Michael Tase
                                </p>
                                <p>
                                  <strong>Account Number:</strong> 0048171949
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Complete RSVP"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Step 2 for non-attending guests (details form)
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Toaster />
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <Heart className="h-12 w-12 text-primary fill-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary">We'll Miss You!</h1>
          </div>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground mb-6">
                  We're sorry you can't make it to our special day. We understand that life gets busy, and we appreciate
                  you taking the time to let us know.
                </p>

                {/* Step indicator */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-primary font-semibold">Your Details</span>
                    <span className="text-sm text-muted-foreground">Gift Options</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isAnonymous: checked as boolean,
                          name: checked ? "Anonymous" : "",
                          email: "",
                          countryCode: "+234",
                          phone: "00000000000",
                          guestType: "single"
                        }))
                      }
                    />
                    <Label htmlFor="anonymous" className="text-sm font-medium">
                      I prefer to remain anonymous
                    </Label>
                  </div>

                  {!formData.isAnonymous && (
                    <>
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <div className="flex gap-2">
                          <Select
                            value={formData.countryCode}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, countryCode: value }))}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+234">🇳🇬 +234</SelectItem>
                              <SelectItem value="+1">🇺🇸 +1</SelectItem>
                              <SelectItem value="+44">🇬🇧 +44</SelectItem>
                              <SelectItem value="+91">🇮🇳 +91</SelectItem>
                              <SelectItem value="+86">🇨🇳 +86</SelectItem>
                              <SelectItem value="+33">🇫🇷 +33</SelectItem>
                              <SelectItem value="+49">🇩🇪 +49</SelectItem>
                              <SelectItem value="+81">🇯🇵 +81</SelectItem>
                              <SelectItem value="+55">🇧🇷 +55</SelectItem>
                              <SelectItem value="+27">🇿🇦 +27</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter phone number"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">For event updates if provided</p>
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Goodwill Message (Optional)</Label>
                        <Textarea
                          id="message"
                          value={formData.goodwillMessage}
                          onChange={(e) => setFormData((prev) => ({ ...prev, goodwillMessage: e.target.value }))}
                          placeholder="Send your best wishes..."
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {formData.isAnonymous && (
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Your response will be recorded anonymously. You can still choose to give a gift if you'd like.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={() => setStep(3)} disabled={!formData.isAnonymous && !formData.name}>
                      Gift Options
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
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
        <Toaster />
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <Heart className="h-12 w-12 text-primary fill-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary">RSVP Registration</h1>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm ${step >= 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              Attendance
            </span>
            <span className={`text-sm ${step >= 2 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              Details
            </span>
            <span className={`text-sm ${step >= 3 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              Gifts
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">
              {step === 1 && "Will you be attending?"}
              {step === 2 && "Your Details"}
              {step === 3 && "Gift Preferences"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let us know if you can make it to our special day"}
              {step === 2 && "Please provide your contact information"}
              {step === 3 && "Help us prepare the perfect celebration"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label className="text-base font-semibold">Will you be attending this event?</Label>
                  <RadioGroup
                    value={formData.attending}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, attending: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes, I'll be there!</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="maybe" />
                      <Label htmlFor="maybe">Maybe, I'm not sure yet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No, I can't make it</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(formData.attending === "yes" || formData.attending === "maybe") && (
                  <div>
                    <Label className="text-base font-semibold">Are you attending as a single or group?</Label>
                    <Select
                      value={formData.guestType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, guestType: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select attendance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.guestType === "group" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Note:</strong> For group attendance, please ensure you have approval from the couple.
                      </p>
                    )}
                  </div>
                )}

                {formData.guestType === "group" && (
                  <div>
                    <Label className="text-base font-semibold">Group Member Names</Label>
                    <p className="text-sm text-muted-foreground mt-2">
                        <strong>Note:</strong> Only your other group member names. Please do not add your name here
                      </p>
                    <div className="space-y-2 mt-2">
                      {formData.groupMembers.map((member, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={member}
                            onChange={(e) => updateGroupMember(index, e.target.value)}
                            placeholder={`Member ${index + 1} name`}
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeGroupMember(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addGroupMember} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Member
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!canProceedToStep2}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, countryCode: value }))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+234">🇳🇬 +234</SelectItem>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          <SelectItem value="+91">🇮🇳 +91</SelectItem>
                          <SelectItem value="+86">🇨🇳 +86</SelectItem>
                          <SelectItem value="+33">🇫🇷 +33</SelectItem>
                          <SelectItem value="+49">🇩🇪 +49</SelectItem>
                          <SelectItem value="+81">🇯🇵 +81</SelectItem>
                          <SelectItem value="+55">🇧🇷 +55</SelectItem>
                          <SelectItem value="+27">🇿🇦 +27</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="flex-1"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">We need this to send your e-card link and other event updates</p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Goodwill Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.goodwillMessage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, goodwillMessage: e.target.value }))}
                      placeholder="Share your best wishes for the couple..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!canProceedToStep3}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label className="text-base font-semibold">Would you prefer to pick a gift for the couple here?</Label>
                  <RadioGroup
                    value={formData.giftPreference}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, giftPreference: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="gift-yes" />
                      <Label htmlFor="gift-yes">Yes, I'd love to</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="gift-no" />
                      <Label htmlFor="gift-no">No, I can do this off record</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.giftPreference === "yes" && (
                  <>
                    <div>
                      <Label className="text-base font-semibold">Gift Type</Label>
                      <RadioGroup
                        value={formData.giftType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, giftType: value }))}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gift" id="physical-gift" />
                          <Label htmlFor="physical-gift">
                            <Gift className="inline mr-2 h-4 w-4" />
                            Physical Gift
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="money" id="money-gift" />
                          <Label htmlFor="money-gift">
                            <CreditCard className="inline mr-2 h-4 w-4" />
                            Money Contribution
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.giftType === "gift" && (
                      <div>
                        <Label className="text-base font-semibold">Select Gift Items</Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          You can select multiple items from our registry
                        </p>
                        <div className="grid gap-2 max-h-64 overflow-y-auto">
                          {giftItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary/10 cursor-pointer"
                              onClick={() => toggleGiftSelection(item._id)}
                            >
                              <Checkbox
                                checked={formData.selectedGifts.includes(item._id)}
                                onChange={() => toggleGiftSelection(item._id)}
                              />
                              <div className="flex-1">
                                <span className="font-medium">{item.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  picked {item.pickedCount} times
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.giftType === "money" && (
                      <div>
                        <Label htmlFor="amount">Contribution Amount</Label>
                        <div className="relative mt-2">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                          <Input
                            id="amount"
                            type="number"
                            value={formData.moneyAmount}
                            onChange={(e) => setFormData((prev) => ({ ...prev, moneyAmount: e.target.value }))}
                            placeholder="Enter amount"
                            className="pl-8"
                          />
                        </div>
                        <br />
                        <p>Kindly send your contribution to any of the accounts below</p>
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          <Card className="bg-secondary/10">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-primary mb-2">Account Details 1</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Bank:</strong> Globus Bank Nigeria
                                </p>
                                <p>
                                  <strong>Account Name:</strong> Ibrahim Faith
                                </p>
                                <p>
                                  <strong>Account Number:</strong> 3640011960
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-secondary/10">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-primary mb-2">Account Details 2</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Bank:</strong> GTBank Nigeria
                                </p>
                                <p>
                                  <strong>Account Name:</strong> Michael Tase
                                </p>
                                <p>
                                  <strong>Account Number:</strong> 0048171949
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
