"use client"

// TODO: Implement env vars update and also updates of build,root and out dirs from here
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Save, Trash2, AlertTriangle, Settings, Globe, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const projectUpdateSchema = z.object({
  name: z.string().min(1, "Project name is required").max(50, "Project name must be less than 50 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  private: z.boolean(),
  buildCommand: z.string().min(1, "Build command is required"),
  installCommand: z.string().min(1, "Install command is required"),
  outputDirectory: z.string().min(1, "Output directory is required"),
  framework: z.string().min(1, "Framework is required"),
  rootDirectory: z.string().min(1, "Root directory is required"),
  envVars: z.array(
    z.object({
      key: z.string().min(1, "Environment variable key is required"),
      value: z.string().min(1, "Environment variable value is required"),
    }),
  ),
})

type ProjectUpdateForm = z.infer<typeof projectUpdateSchema>

interface ProjectSettingsProps {
  project: {
    id: string
    name: string
    slug: string
    private: boolean
    status: string
    repo_url: string
    branch: string
    buildCommand: string
    installCommand: string
    outputDirectory: string
    framework: string
    rootDirectory: string
    envVars: Array<{ id: string; key: string; value: string }>
  }
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<ProjectUpdateForm>({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      name: project.name,
      slug: project.slug,
      private: project.private,
      buildCommand: project.buildCommand,
      installCommand: project.installCommand,
      outputDirectory: project.outputDirectory,
      framework: project.framework,
      rootDirectory: project.rootDirectory,
      envVars: project.envVars.map((env) => ({ key: env.key, value: env.value })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "envVars",
  })

  const onSubmit = async (values: ProjectUpdateForm) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update project")
      }

      toast({
        title: "Project updated",
        description: "Your project settings have been updated successfully.",
      })
      setShowUpdateDialog(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem updating your project settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateClick = () => {
    setShowUpdateDialog(true)
  }

  const deleteProject = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      })
      router.push("/projects")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting your project.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeleteConfirmation("")
    }
  }

  const addEnvVar = () => {
    append({ key: "", value: "" })
  }

  const isDeleteConfirmationValid = deleteConfirmation === project.name

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex justify-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${project.id}/overview`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Project
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <h1 className="text-xl font-semibold">Project Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Project Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>{project.name}</span>
              </CardTitle>
              <CardDescription>Manage your project&apos;s configuration and deployment settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current URL</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{project.slug}.deployr.app</code>
                </div>
                <Badge variant={project.status === "BUILD_SUCCESS" ? "default" : "secondary"}>{project.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Settings Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateClick)} className="space-y-8">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Update your project&apos;s basic information and configuration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Project" {...field} />
                        </FormControl>
                        <FormDescription>This is your project&apos;s display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Slug</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                              https://
                            </div>
                            <Input className="rounded-l-none" placeholder="my-project" {...field} />
                            <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                              .deployr.app
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          The unique identifier for your project&apos;s URL. Only lowercase letters, numbers, and
                          hyphens are allowed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="private"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Private Project</FormLabel>
                          <FormDescription>
                            Make your project private and only accessible to you. This will hide it from public
                            listings.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Build & Deploy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Build & Deploy Settings</CardTitle>
                  <CardDescription>Configure how your project is built and deployed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="rootDirectory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Root Directory</FormLabel>
                        <FormControl>
                          <Input placeholder="./" {...field} />
                        </FormControl>
                        <FormDescription>
                          The directory within your repository where your project is located.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buildCommand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Build Command</FormLabel>
                        <FormControl>
                          <Input placeholder="npm run build" {...field} />
                        </FormControl>
                        <FormDescription>The command used to build your project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="installCommand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Install Command</FormLabel>
                        <FormControl>
                          <Input placeholder="npm install" {...field} />
                        </FormControl>
                        <FormDescription>The command used to install dependencies.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="outputDirectory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Output Directory</FormLabel>
                        <FormControl>
                          <Input placeholder="dist" {...field} />
                        </FormControl>
                        <FormDescription>The directory where your built project files are located.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Environment Variables */}
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>
                    Manage environment variables for your project. Changes require a new deployment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start">
                        <FormField
                          control={form.control}
                          name={`envVars.${index}.key`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="VARIABLE_NAME" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`envVars.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="variable_value" type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          className="shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    {fields.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">No environment variables configured</p>
                      </div>
                    )}

                    <Button type="button" variant="outline" onClick={addEnvVar} className="w-full bg-transparent">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Environment Variable
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Update Button */}
              <div className="flex justify-end">
                <Button type="button" onClick={handleUpdateClick}>
                  <Save className="w-4 h-4 mr-2" />
                  Update Settings
                </Button>
              </div>
            </form>
          </Form>

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
                    <h4 className="font-medium">Delete Project</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this project and all of its data. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Update Confirmation Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Project Settings</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the settings for &quot;{project.name}&quot;? This will apply the changes
              immediately and may trigger a new deployment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              No, Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Yes, Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - GitHub Style */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Delete Project</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-3">
              This action <strong>cannot</strong> be undone. This will permanently delete the{" "}
              <strong>{project.name}</strong> project, deployments, and remove all associated data. Please type{" "}
              <strong>{project.name}</strong> to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder={project.name}
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false)
                setDeleteConfirmation("")
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteProject}
              disabled={!isDeleteConfirmationValid || isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Trash2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />I understand the consequences, delete this project
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
