"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Github,
  GitBranch,
  Folder,
  Rocket,
  CheckCircle,
  Circle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  X,
} from "lucide-react"
import type { FrameworkConfig } from "@/lib/framework-detection"
import { frameworks } from "@/lib/framework-detection"
import DeployConfigSkeleton from "./deploy-config-skeleton"

interface RepoDetails {
  repository: {
    id: number
    name: string
    full_name: string
    description: string
    html_url: string
    default_branch: string
    private: boolean
  }
  branches: Array<{ name: string; sha: string }>
  framework: FrameworkConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packageJson: any
}

export function DeployConfig() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const repo = searchParams.get("repo")

  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [projectName, setProjectName] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [rootDirectory, setRootDirectory] = useState("./")
  const [buildCommand, setBuildCommand] = useState("")
  const [outputDirectory, setOutputDirectory] = useState("")
  const [installCommand, setInstallCommand] = useState("")
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>([])
  const [advancedSettings, setAdvancedSettings] = useState(false)

  // Add framework selection state
  const [selectedFramework, setSelectedFramework] = useState<string>("")

  // Next.js validation state
  const [showNextjsValidation, setShowNextjsValidation] = useState(false)
  const [nextjsValidationConfirmed, setNextjsValidationConfirmed] = useState<boolean | null>(null)

  // Update the useEffect to set the selected framework
  useEffect(() => {
    if (!repo || !session) return

    const [owner, name] = repo.split("/")
    if (!owner || !name) return

    fetchRepoDetails(owner, name)
  }, [repo, session])

  // Update fetchRepoDetails to set the selected framework
  const fetchRepoDetails = async (owner: string, name: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/github/repo/${owner}/${name}`)

      if (!response.ok) {
        throw new Error("Failed to fetch repository details")
      }

      const data = await response.json()
      setRepoDetails(data)

      // Set default values
      setProjectName(data.repository.name)
      setSelectedBranch(data.repository.default_branch)
      setSelectedFramework(data.framework.slug)
      setBuildCommand(data.framework.buildCommand)
      setOutputDirectory(data.framework.outputDirectory)
      setInstallCommand(data.framework.installCommand)

      // Show Next.js validation if framework is Next.js
      if (data.framework.slug === "nextjs") {
        setShowNextjsValidation(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Add framework change handler
  const handleFrameworkChange = (frameworkSlug: string) => {
    setSelectedFramework(frameworkSlug)
    const framework = Object.values(frameworks).find((f) => f.slug === frameworkSlug)
    if (framework) {
      setBuildCommand(framework.buildCommand)
      setOutputDirectory(framework.outputDirectory)
      setInstallCommand(framework.installCommand)
    }

    // Show/hide Next.js validation based on selection
    if (frameworkSlug === "nextjs") {
      setShowNextjsValidation(true)
      setNextjsValidationConfirmed(null) // Reset confirmation
    } else {
      setShowNextjsValidation(false)
      setNextjsValidationConfirmed(null)
    }
  }

  const handleNextjsValidation = (confirmed: boolean) => {
    setNextjsValidationConfirmed(confirmed)
    if (!confirmed) {
      // If user says no, they can still proceed but with warning
      setShowNextjsValidation(false)
    }
  }

  const dismissNextjsValidation = () => {
    setShowNextjsValidation(false)
    setNextjsValidationConfirmed(true)
  }

  // Update the handleDeploy function to use selectedFramework
  const handleDeploy = async () => {
    if (!repoDetails) return

    // Check Next.js validation if framework is Next.js and not confirmed
    if (selectedFramework === "nextjs" && nextjsValidationConfirmed === null) {
      setShowNextjsValidation(true)
      return
    }

    setDeploying(true)
    setError(null)

    try {
      const deploymentData = {
        repository: repoDetails.repository.full_name,
        branch: selectedBranch,
        projectName,
        rootDirectory,
        buildCommand,
        outputDirectory,
        installCommand,
        envVars: envVars.filter((env) => env.key && env.value),
        framework: selectedFramework,
        isNextjs: selectedFramework === "nextjs"
      }

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deploymentData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Deployment failed")
      }

      // Redirect to deployment status page with project ID
      router.push(`/deployments/${result.project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed")
      console.error("Deployment error:", err)
    } finally {
      setDeploying(false)
    }
  }

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }])
  }

  const updateEnvVar = (index: number, field: "key" | "value", value: string) => {
    const updated = [...envVars]
    updated[index][field] = value
    setEnvVars(updated)
  }

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index))
  }

  if (loading) {
    return <DeployConfigSkeleton />
  }

  if (error || !repoDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground">{error || "Failed to load repository details"}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">Import Repository</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-primary fill-primary" />
          <span className="text-sm font-medium">Configure Project</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Deploy</span>
        </div>
      </div>

      {/* Next.js Validation Bar */}
      {showNextjsValidation && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Next.js Framework Selected</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                    You have selected Next.js as your framework. But we support Next.js Frontend part only. So make sure
                    you don&apos;t have any pure JS or TS files in your App or Pages router. If yes, do wait till the next version of Deployr arrives.
                    We expect you to have only jsx or tsx files in your App/Pages router. 
                    Also make sure your{" "}
                    <code className="bg-orange-200 dark:bg-orange-900 px-1 py-0.5 rounded text-xs">
                      next.config.ts/next.config.js
                    </code>{" "}
                    has{" "}
                    <code className="bg-orange-200 dark:bg-orange-900 px-1 py-0.5 rounded text-xs">
                      output: &apos;export&apos;
                    </code>{" "}
                    in it.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Do you understand and confirm these requirements?
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNextjsValidation(true)}
                      className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-100 dark:border-green-700"
                    >
                      Yes, I understand
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNextjsValidation(false)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-100 dark:border-red-700"
                    >
                      No, I&apos;ll wait
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={dismissNextjsValidation}
                className="h-6 w-6 text-orange-500 hover:text-orange-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show warning if user selected "No" */}
      {nextjsValidationConfirmed === false && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Deployment Not Recommended</h4>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Since you don&apos;t meet the Next.js requirements, we recommend waiting for the next version of Deployr or
                  choosing a different framework.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Repository Info Sidebar */}
        <div className="space-y-6">
          {/* Framework Detection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Framework Preset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{frameworks[selectedFramework]?.logo || "❓"}</div>
                <div>
                  <div className="font-medium">{frameworks[selectedFramework]?.name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">
                    {frameworks[selectedFramework]?.description || "Unknown framework"}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Badge variant="secondary">
                  {repoDetails.framework.slug === selectedFramework ? "Auto-detected" : "Manual"}
                </Badge>
                {selectedFramework === "nextjs" && nextjsValidationConfirmed === true && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Validated
                  </Badge>
                )}
                {selectedFramework === "nextjs" && nextjsValidationConfirmed === false && (
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    Not Ready
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Repository</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <a
                  href={repoDetails.repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline flex items-center"
                >
                  {repoDetails.repository.full_name}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              {repoDetails.repository.description && (
                <p className="text-sm text-muted-foreground">{repoDetails.repository.description}</p>
              )}
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">{selectedBranch}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4" />
                <span className="text-sm">{rootDirectory}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Configure Project</CardTitle>
              <CardDescription>
                Your project will be deployed with the following configuration. You can customize these settings before
                deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="my-awesome-project"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {repoDetails.branches.map((branch) => (
                        <SelectItem key={branch.name} value={branch.name}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="root-directory">Root Directory</Label>
                  <Input
                    id="root-directory"
                    value={rootDirectory}
                    onChange={(e) => setRootDirectory(e.target.value)}
                    placeholder="./"
                  />
                  <p className="text-xs text-muted-foreground">
                    The directory within your project, in case it is not in the root. Leave as &quot;./&quot; if unsure.
                  </p>
                </div>
              </div>

              {/* Add framework selection dropdown in the configuration form after the root directory field */}
              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                <Select value={selectedFramework} onValueChange={handleFrameworkChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(frameworks).map((framework) => (
                      <SelectItem key={framework.slug} value={framework.slug}>
                        <div className="flex items-center space-x-2">
                          <span>{framework.logo}</span>
                          <span>{framework.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the framework that best matches your project. This will set optimal build settings.
                </p>
              </div>

              <Separator />

              {/* Build Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Build and Output Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how your project should be built and deployed.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="advanced-settings" checked={advancedSettings} onCheckedChange={setAdvancedSettings} />
                    <Label htmlFor="advanced-settings" className="text-sm">
                      Override
                    </Label>
                  </div>
                </div>

                {advancedSettings && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="build-command">Build Command</Label>
                      <Input
                        id="build-command"
                        value={buildCommand}
                        onChange={(e) => setBuildCommand(e.target.value)}
                        placeholder="npm run build"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="output-directory">Output Directory</Label>
                      <Input
                        id="output-directory"
                        value={outputDirectory}
                        onChange={(e) => setOutputDirectory(e.target.value)}
                        placeholder="dist"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="install-command">Install Command</Label>
                      <Input
                        id="install-command"
                        value={installCommand}
                        onChange={(e) => setInstallCommand(e.target.value)}
                        placeholder="npm install"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Environment Variables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Environment Variables</h3>
                    <p className="text-sm text-muted-foreground">Add environment variables for your deployment.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addEnvVar}>
                    Add Variable
                  </Button>
                </div>

                {envVars.length > 0 && (
                  <div className="space-y-3">
                    {envVars.map((env, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="KEY"
                          value={env.key}
                          onChange={(e) => updateEnvVar(index, "key", e.target.value)}
                        />
                        <Input
                          placeholder="value"
                          value={env.value}
                          onChange={(e) => updateEnvVar(index, "value", e.target.value)}
                        />
                        <Button variant="outline" size="icon" onClick={() => removeEnvVar(index)}>
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>

            <div className="px-6 py-4 bg-muted/50 rounded-b-lg">
              <Button
                onClick={handleDeploy}
                disabled={
                  deploying || !projectName || (selectedFramework === "nextjs" && !nextjsValidationConfirmed)
                }
                className="w-full"
                size="lg"
              >
                {deploying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy
                    {selectedFramework === "nextjs" && nextjsValidationConfirmed === false && " (Not Recommended)"}
                  </>
                )}
              </Button>
              {selectedFramework === "nextjs" && nextjsValidationConfirmed === false && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Deployment is not recommended until Next.js requirements are met
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
