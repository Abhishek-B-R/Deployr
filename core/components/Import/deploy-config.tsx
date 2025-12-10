"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { NeoButton, NeoCard, NeoBadge } from "@/components/neo-ui";
import {
  Github,
  GitBranch,
  Folder,
  Rocket,
  Check,
  AlertTriangle,
  X,
  RefreshCw,
  Settings,
} from "lucide-react";
import DeployConfigSkeleton from "./deploy-config-skeleton";
import { FolderBrowser } from "./folder-browser";
import { FrameworkConfig, frameworks } from "@/lib/framework-detection";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  default_branch: string;
  private: boolean;
}

interface Branch {
  name: string;
  sha: string;
}

interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

interface RepoDetails {
  repository: Repository;
  branches: Branch[];
  framework: FrameworkConfig;
  packageJson: PackageJson;
}

interface EnvVar {
  key: string;
  value: string;
}

interface DeploymentData {
  repository: string;
  branch: string;
  projectName: string;
  rootDirectory: string;
  buildCommand: string;
  outputDirectory: string;
  installCommand: string;
  envVars: EnvVar[];
  framework: string;
  isNextjs: boolean;
}

interface DeploymentResult {
  project: {
    id: string;
  };
}

export function DeployConfig() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const router = useRouter();
  const searchParams = useSearchParams();
  const repo = searchParams?.get("repo");

  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [rootDirectory, setRootDirectory] = useState("./");
  const [buildCommand, setBuildCommand] = useState("");
  const [outputDirectory, setOutputDirectory] = useState("");
  const [installCommand, setInstallCommand] = useState("");
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string>("");

  // Next.js validation
  const [showNextjsValidation, setShowNextjsValidation] = useState(false);
  const [nextjsValidationConfirmed, setNextjsValidationConfirmed] = useState<
    boolean | null
  >(null);

  const [showFolderBrowser, setShowFolderBrowser] = useState(false);
  const [detectingFramework, setDetectingFramework] = useState(false);

  useEffect(() => {
    if (!repo || !session) return;

    const [owner, name] = repo.split("/");
    if (!owner || !name) return;

    fetchRepoDetails(owner, name);
  }, [repo, session]);

  useEffect(() => {
    if (!repoDetails || !rootDirectory || rootDirectory === "./") return;

    const [owner, name] = repoDetails.repository.full_name.split("/");
    if (!owner || !name) return;

    detectFrameworkInDirectory(owner, name, rootDirectory);
  }, [rootDirectory, repoDetails]);

  const fetchRepoDetails = async (owner: string, name: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/github/repo/${owner}/${name}`);

      if (!response.ok) throw new Error("Failed to fetch repository details");

      const data: RepoDetails = await response.json();
      setRepoDetails(data);

      // Populate form defaults
      setProjectName(data.repository.name);
      setSelectedBranch(data.repository.default_branch);
      setSelectedFramework(data.framework.slug);
      setBuildCommand(data.framework.buildCommand);
      setOutputDirectory(data.framework.outputDirectory);
      setInstallCommand(data.framework.installCommand);

      if (data.framework.slug === "nextjs") setShowNextjsValidation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFrameworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frameworkSlug = e.target.value;
    setSelectedFramework(frameworkSlug);
    const framework = frameworks[frameworkSlug];
    if (framework) {
      setBuildCommand(framework.buildCommand);
      setOutputDirectory(framework.outputDirectory);
      setInstallCommand(framework.installCommand);
    }

    if (frameworkSlug === "nextjs") {
      setShowNextjsValidation(true);
      setNextjsValidationConfirmed(null);
    } else {
      setShowNextjsValidation(false);
      setNextjsValidationConfirmed(null);
    }
  };

  const detectFrameworkInDirectory = async (
    owner: string,
    name: string,
    directory: string
  ) => {
    try {
      setDetectingFramework(true);
      const response = await fetch(
        `/api/github/repo/${owner}/${name}/detect-framework?path=${encodeURIComponent(
          directory
        )}`
      );

      if (!response.ok) return;

      const frameworkData = await response.json();

      if (frameworkData.success && frameworkData.framework) {
        setSelectedFramework(frameworkData.framework.slug);
        setBuildCommand(frameworkData.framework.buildCommand);
        setOutputDirectory(frameworkData.framework.outputDirectory);
        setInstallCommand(frameworkData.framework.installCommand);

        if (frameworkData.framework.slug === "nextjs") {
          setShowNextjsValidation(true);
          setNextjsValidationConfirmed(null);
        } else {
          setShowNextjsValidation(false);
          setNextjsValidationConfirmed(null);
        }
      }
    } finally {
      setDetectingFramework(false);
    }
  };

  const handleDeploy = async () => {
    if (!repoDetails) return;

    // Check Next.js validation if framework is Next.js and not confirmed
    if (selectedFramework === "nextjs" && nextjsValidationConfirmed === null) {
      setShowNextjsValidation(true);
      return;
    }

    setDeploying(true);
    setError(null);

    try {
      const deploymentData: DeploymentData = {
        repository: repoDetails.repository.full_name,
        branch: selectedBranch,
        projectName,
        rootDirectory,
        buildCommand,
        outputDirectory,
        installCommand,
        envVars: envVars.filter((env) => env.key && env.value),
        framework: selectedFramework,
        isNextjs: selectedFramework === "nextjs",
      };

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deploymentData),
      });

      if (!response.ok) {
        throw new Error("Deployment failed");
      }

      const result: DeploymentResult = await response.json();

      router.push(`/projects/${result.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed");
      console.error("Deployment error:", err);
    } finally {
      setDeploying(false);
    }
  };

  if (loading) return <DeployConfigSkeleton />;

  if (error || !repoDetails) {
    return (
      <NeoCard className="p-12 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-red-500 border-4 border-neo-black mx-auto mb-6 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-black mb-4 uppercase">
          Something Went Wrong
        </h3>
        <p className="font-medium text-gray-600 mb-6">
          {error || "Failed to load repository details"}
        </p>
        <NeoButton onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </NeoButton>
      </NeoCard>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Next.js Validation Alert */}
      {showNextjsValidation && (
        <div className="border-neo-black shadow-neo-lg p-4 sm:p-6 relative border-4 bg-red-200 overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-neo-red border-r-4 border-neo-black"></div>
          <div className="absolute top-0 left-2 h-2 w-full bg-neo-red border-b-4 border-neo-black"></div>
          <div className="pl-6 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-500 border-2 border-neo-black p-1">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="font-black text-xl uppercase">
                  Next.js Detected
                </h4>
              </div>
              <button
                onClick={() => {
                  setNextjsValidationConfirmed(true);
                  setShowNextjsValidation(false);
                }}
                className="border-2 border-transparent hover:border-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-medium text-neo-black mb-6 leading-relaxed max-w-2xl">
              Deployr currently supports static exports for Next.js. We expect
              you to have only jsx or tsx files (no pure js or ts files like
              router.ts / router.js) in your{" "}
              <code className="bg-white border border-black px-1 font-mono text-sm">
                App/Pages
              </code>{" "}
              router. Ensure your{" "}
              <code className="bg-white border border-black px-1 font-mono text-sm">
                next.config.js
              </code>{" "}
              has
              <code className="bg-white border border-black px-1 font-mono text-sm ml-1">
                output: 'export'
              </code>
              .
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setNextjsValidationConfirmed(true);
                  setShowNextjsValidation(false);
                }}
                className="bg-neo-yellow border-2 border-neo-black px-4 py-2 font-bold shadow-neo-sm hover:translate-y-1 hover:shadow-none hover:translate-x-1 transition-all uppercase"
              >
                I Understand
              </button>
              <button
                onClick={() => router.back()}
                className="bg-white border-2 border-neo-black px-4 py-2 font-bold shadow-neo-sm hover:translate-y-1 hover:shadow-none hover:translate-x-1 transition-all text-red-600 uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show warning if user selected "No" */}
      {nextjsValidationConfirmed === false && (
        <div className="border-4 border-red-500 bg-red-100 p-6 shadow-neo">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-black text-red-900 uppercase">
                Deployment Not Recommended
              </h4>
              <p className="text-sm font-medium text-red-800">
                Since you don't meet the Next.js requirements, we recommend
                waiting for the next version of Deployr or choosing a different
                framework.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <NeoCard className="bg-neo-bg">
            <div className="mb-4 border-b-2 border-neo-black pb-2">
              <span className="font-black uppercase tracking-widest text-sm">
                Framework
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border-2 border-neo-black flex items-center justify-center font-black text-2xl shadow-neo-sm">
                {frameworks[selectedFramework]?.logo}
              </div>
              <div>
                <div className="font-bold text-lg leading-none mb-1">
                  {frameworks[selectedFramework]?.name}
                </div>
                <div className="text-xs font-mono bg-neo-green/50 inline-block px-1 border border-black">
                  {detectingFramework ? "DETECTING..." : "AUTO-DETECTED"}
                </div>
              </div>
            </div>
          </NeoCard>

          <NeoCard className="bg-white">
            <div className="mb-4 border-b-2 border-neo-black pb-2">
              <span className="font-black uppercase tracking-widest text-sm">
                Source
              </span>
            </div>
            <div className="space-y-3 font-medium text-sm">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <a
                  href={repoDetails.repository.html_url}
                  target="_blank"
                  className="hover:bg-neo-yellow hover:text-black transition-colors px-1 -ml-1 underline decoration-2"
                >
                  {repoDetails.repository.full_name}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span className="font-mono bg-gray-100 border border-gray-300 px-1">
                  {selectedBranch}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                <span>{rootDirectory}</span>
              </div>
            </div>
          </NeoCard>
        </div>

        {/* Configuration Form */}
        <div className="lg:col-span-2">
          <NeoCard className="p-0 overflow-visible">
            <div className="bg-neo-black text-white p-4 border-b-4 border-neo-black flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-wider">
                Configuration
              </h2>
              <Settings className="w-6 h-6" />
            </div>

            <div className="p-8 space-y-8">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="font-bold text-neo-black uppercase text-sm block">
                  Project Name
                </label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-12 px-4 border-4 border-neo-black focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 font-bold text-lg font-mono placeholder:text-gray-300 transition-all"
                  placeholder="my-project"
                />
              </div>

              {/* Branch Selection */}
              <div className="space-y-2">
                <label className="font-bold text-neo-black uppercase text-sm block">
                  Branch
                </label>
                <div className="relative">
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 border-4 border-neo-black appearance-none font-bold bg-white focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 cursor-pointer"
                  >
                    {repoDetails.branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="border-l-2 border-b-2 border-black w-3 h-3 -rotate-45 transform origin-center translate-y-[-2px]"></div>
                  </div>
                </div>
              </div>

              {/* Root Directory */}
              <div className="space-y-2">
                <label className="font-bold text-neo-black uppercase text-sm block">
                  Root Directory
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 h-12 flex items-center px-4 border-4 border-neo-black bg-gray-50 font-mono text-sm">
                    <Folder className="w-4 h-4 mr-2 text-gray-400" />
                    {rootDirectory}
                  </div>
                  <NeoButton
                    variant="outline"
                    onClick={() => setShowFolderBrowser(true)}
                  >
                    Change
                  </NeoButton>
                </div>
              </div>

              {/* Framework Selector */}
              <div className="space-y-2">
                <label className="font-bold text-neo-black uppercase text-sm block">
                  Framework Preset
                </label>
                <div className="relative">
                  <select
                    value={selectedFramework}
                    onChange={handleFrameworkChange}
                    className="w-full h-12 pl-4 pr-10 border-4 border-neo-black appearance-none font-bold bg-white focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 cursor-pointer"
                  >
                    {Object.values(frameworks).map((f) => (
                      <option key={f.slug} value={f.slug}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="border-l-2 border-b-2 border-black w-3 h-3 -rotate-45 transform origin-center translate-y-[-2px]"></div>
                  </div>
                </div>
              </div>

              {/* Advanced Toggle */}
              <div className="border-t-4 border-dashed border-gray-200 pt-6">
                <button
                  onClick={() => setAdvancedSettings(!advancedSettings)}
                  className="flex items-center gap-2 font-bold hover:text-neo-pink transition-colors group"
                >
                  <div
                    className={`w-4 h-4 border-2 border-black flex items-center justify-center transition-colors cursor-default ${
                      advancedSettings ? "bg-neo-black" : "bg-white"
                    }`}
                  >
                    {advancedSettings && (
                      <Check className="w-3 h-3 text-white" strokeWidth={4} />
                    )}
                  </div>
                  OVERRIDE BUILD SETTINGS
                </button>

                {advancedSettings && (
                  <div className="mt-6 space-y-4 p-6 bg-neo-yellow/10 border-4 border-neo-black relative">
                    <div className="absolute top-0 right-0 bg-neo-yellow text-xs font-bold px-2 py-1 border-l-4 border-b-4 border-neo-black">
                      ADVANCED MODE
                    </div>

                    <div className="space-y-2">
                      <label className="font-bold text-xs uppercase">
                        Build Command
                      </label>
                      <input
                        value={buildCommand}
                        onChange={(e) => setBuildCommand(e.target.value)}
                        className="w-full p-2 border-2 border-neo-black font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-bold text-xs uppercase">
                        Output Directory
                      </label>
                      <input
                        value={outputDirectory}
                        onChange={(e) => setOutputDirectory(e.target.value)}
                        className="w-full p-2 border-2 border-neo-black font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-bold text-xs uppercase">
                        Install Command
                      </label>
                      <input
                        value={installCommand}
                        onChange={(e) => setInstallCommand(e.target.value)}
                        className="w-full p-2 border-2 border-neo-black font-mono text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Environment Variables */}
              <div className="border-t-4 border-dashed border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold uppercase text-sm">
                    Environment Variables
                  </h3>
                  <button
                    onClick={() =>
                      setEnvVars([...envVars, { key: "", value: "" }])
                    }
                    className="text-xs font-bold bg-neo-black text-white px-2 py-1 hover:bg-neo-pink transition-colors"
                  >
                    + ADD NEW
                  </button>
                </div>

                <div className="space-y-3">
                  {envVars.map((env, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        placeholder="KEY"
                        value={env.key}
                        onChange={(e) => {
                          const n = [...envVars];
                          n[i].key = e.target.value;
                          setEnvVars(n);
                        }}
                        className="flex-1 p-2 border-2 border-neo-black font-mono text-sm uppercase"
                      />
                      <input
                        placeholder="VALUE"
                        value={env.value}
                        onChange={(e) => {
                          const n = [...envVars];
                          n[i].value = e.target.value;
                          setEnvVars(n);
                        }}
                        className="flex-1 p-2 border-2 border-neo-black font-mono text-sm"
                      />
                      <button
                        onClick={() =>
                          setEnvVars(envVars.filter((_, idx) => idx !== i))
                        }
                        className="p-2 border-2 border-neo-black hover:bg-red-500 hover:text-white font-bold"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  {envVars.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      No environment variables configured.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-8 bg-gray-50 border-t-4 border-neo-black">
              <NeoButton
                variant="primary"
                className="w-full h-16 text-xl tracking-widest"
                onClick={handleDeploy}
                disabled={
                  deploying ||
                  !projectName ||
                  (selectedFramework === "nextjs" &&
                    nextjsValidationConfirmed !== true)
                }
              >
                {deploying ? (
                  <>
                    <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                    DEPLOYING...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6 mr-3" />
                    DEPLOY PROJECT
                  </>
                )}
              </NeoButton>
              {selectedFramework === "nextjs" &&
                nextjsValidationConfirmed === false && (
                  <p className="text-xs text-center mt-3 font-bold text-red-600">
                    Deployment blocked until Next.js requirements are confirmed
                  </p>
                )}
            </div>
          </NeoCard>
        </div>
      </div>

      {repoDetails && (
        <FolderBrowser
          open={showFolderBrowser}
          onOpenChange={setShowFolderBrowser}
          onSelectPath={setRootDirectory}
          repoId={repoDetails.repository.id}
          owner={repoDetails.repository.full_name.split("/")[0]}
          repo={repoDetails.repository.full_name.split("/")[1]}
          currentPath={rootDirectory}
        />
      )}
    </div>
  );
}
