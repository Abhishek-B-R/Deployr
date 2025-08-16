/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertTriangle,
  Settings,
  User,
  Shield,
  Bell,
  Rocket,
  Github,
  Calendar,
  Globe,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "../theme-toggle"
import NavBar from "../NavBar"
import Footer from "../Footer"

const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
})

type UserUpdateForm = z.infer<typeof userUpdateSchema>

interface UserSettingsProps {
  user: {
    id: string
    name: string | null
    email: string
    createdAt: Date
    updatedAt: Date
    project: Array<{
      id: string
      name: string
      status: string
      createdAt: Date
    }>
  }
  session: {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export function UserSettings({ user, session }: UserSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [deploymentNotifications, setDeploymentNotifications] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<UserUpdateForm>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email,
    },
  })

  const onSubmit = async (values: UserUpdateForm) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAccount = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/user/account`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      })

      router.push("/api/auth/signout")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting your account.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  const deployedProjects = user.project.filter((p) => p.status === "BUILD_SUCCESS").length
  const totalProjects = user.project.length

  return (
    <div className="min-w-full min-h-screen md:pl-30 px-16 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <NavBar/>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={session.user?.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="text-lg">{getInitials(user.name || user.email || "U")}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Rocket className="w-4 h-4" />
                      <span>
                        {deployedProjects} of {totalProjects} projects live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Statistics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5 text-blue-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Total Projects</p>
                    <p className="text-2xl font-bold">{totalProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Live Deployments</p>
                    <p className="text-2xl font-bold">{deployedProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-gray-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Total Views</p>
                    <p className="text-2xl font-bold">
                      {user.project.reduce((acc, project) => acc + (project as any).views || 0, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>Update your personal information and account details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormDescription>This is your public display name.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} disabled />
                          </FormControl>
                          <FormDescription>Email cannot be changed after account creation.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Save className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>Connected Accounts</span>
              </CardTitle>
              <CardDescription>Manage your connected Git providers and integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5" />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">Connected as {session.user?.name || user.email}</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    G
                  </div>
                  <div>
                    <p className="font-medium">GitLab</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account and projects.
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Deployment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when your deployments succeed or fail.</p>
                </div>
                <Switch checked={deploymentNotifications} onCheckedChange={setDeploymentNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important security updates and account changes.</p>
                </div>
                <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>Manage your account security and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground">Manage your active login sessions.</p>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>Irreversible and destructive actions. Please proceed with caution.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all of your
                          data from our servers, including all projects and deployments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deleteAccount}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
