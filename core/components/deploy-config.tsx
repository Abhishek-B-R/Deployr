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
} from "lucide-react"
import type { FrameworkConfig } from "@/lib/framework-detection"

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

  useEffect(() => {
    if (!repo || !session) return

    const [owner, name] = repo.split("/")
    if (!owner || !name) return

    fetchRepoDetails(owner, name)
  }, [repo, session])

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
      setBuildCommand(data.framework.buildCommand)
      setOutputDirectory(data.framework.outputDirectory)
      setInstallCommand(data.framework.installCommand)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async () => {
    if (!repoDetails) return

    setDeploying(true)
    try {
      // Here you would make the API call to start deployment
      const deploymentData = {
        repository: repoDetails.repository.full_name,
        branch: selectedBranch,
        projectName,
        rootDirectory,
        buildCommand,
        outputDirectory,
        installCommand,
        envVars: envVars.filter((env) => env.key && env.value),
        framework: repoDetails.framework.slug,
      }

      console.log("Starting deployment with:", deploymentData)

      // Simulate deployment API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to deployment overview
      router.push(`/deployments/building?project=${projectName}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed")
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Repository Info Sidebar */}
        <div className="space-y-6">
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

          {/* Framework Detection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Framework Preset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{repoDetails.framework.logo}</div>
                <div>
                  <div className="font-medium">{repoDetails.framework.name}</div>
                  <div className="text-sm text-muted-foreground">{repoDetails.framework.description}</div>
                </div>
              </div>
              <Badge variant="secondary" className="mt-3">
                Auto-detected
              </Badge>
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
              <Button onClick={handleDeploy} disabled={deploying || !projectName} className="w-full" size="lg">
                {deploying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
