"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NeoCard, NeoButton, NeoBadge } from "@/components/neo-ui";
import {
  Globe,
  Github,
  GitBranch,
  Clock,
  Eye,
  ExternalLink,
  Settings,
  RefreshCw,
  Activity,
  Zap,
  Shield,
  Copy,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  Server,
  BarChart3,
  Check,
} from "lucide-react";
import { ProjectLogs } from "@/components/ProjectOverview/project-logs";
import { ProjectSettings } from "@/components/ProjectOverview/project-settings";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getTimeAgo } from "@/lib/utils";

interface ProjectOverviewProps {
  project: {
    id: string;
    name: string;
    repo_name: string | null;
    repo_url: string | null;
    branch: string | null;
    slug: string;
    status: string;
    logs: string | null;
    createdAt: Date;
    updatedAt: Date;
    views: number;
    size: number | null;
    private: boolean;
    envVars: Array<{ key: string; value: string }>;
    user: {
      name: string | null;
      email: string;
    };
  };
}

const statusConfig: any = {
  PENDING: { color: "bg-neo-yellow text-black", icon: Clock, label: "QUEUED" },
  BUILDING: {
    color: "bg-neo-blue text-white",
    icon: RefreshCw,
    animate: "animate-spin",
    label: "BUILDING",
  },
  BUILD_SUCCESS: {
    color: "bg-neo-green text-black",
    icon: CheckCircle,
    label: "LIVE",
  },
  BUILD_FAILED: {
    color: "bg-neo-pink text-black",
    icon: XCircle,
    label: "FAILED",
  },
};

export function ProjectOverview({
  project: initialProject,
}: ProjectOverviewProps) {
  const [project, setProject] = useState(initialProject);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [redeploy, setRedeploy] = useState(false);

  const status = statusConfig[project.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;
  const deploymentUrl = `https://${project.slug}.deployr.abhishekbr.com`;
  const isLive = project.status === "BUILDING" || project.status === "PENDING";

  // Poll for status updates if building or pending
  useEffect(() => {
    if (project.status === "BUILDING" || project.status === "PENDING") {
      setActiveTab("deployments");
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/deployments/${project.id}`);
          if (response.ok) {
            const updated = await response.json();
            setProject(updated);

            if (
              updated.status === "BUILD_SUCCESS" ||
              updated.status === "BUILD_FAILED"
            ) {
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error("Failed to fetch project status:", error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [project.status, project.id]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleRedeploy = async () => {
    setRedeploy(true);
    try {
      const deploymentData = {
        repository:
          project.repo_url?.split("/")[3] +
          "/" +
          project.repo_url?.split("/")[4],
        branch: project.branch,
        projectName: project.name,
      };

      const response = await fetch("/api/redeploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deploymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Deployment failed");
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (err) {
      console.error("Deployment error:", err);
    } finally {
      setRedeploy(false);
      setActiveTab("deployments");
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg text-neo-black font-sans">
      <NavBar />

      <main className="container mx-auto px-4 md:px-10 py-12 pt-32 min-h-[90vh]">
        <div className="mx-auto space-y-12">
          {/* Status Banner */}
          {project.status === "BUILD_FAILED" && (
            <div className="border-4 border-red-500 bg-red-100 p-6 shadow-neo">
              <div className="flex items-center gap-4">
                <XCircle className="w-8 h-8 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-black text-red-900 uppercase text-lg">
                    Deployment Failed
                  </h4>
                  <p className="font-medium text-red-800">
                    There was an error deploying your project. Check the logs
                    below for details.
                  </p>
                </div>
                <NeoButton variant="outline" onClick={handleRedeploy}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Deployment
                </NeoButton>
              </div>
            </div>
          )}

          {project.status === "BUILDING" && (
            <div className="border-4 border-neo-blue bg-blue-100 p-6 shadow-neo">
              <div className="flex items-center gap-4">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <div>
                  <h4 className="font-black text-blue-900 uppercase text-lg">
                    Deployment in Progress
                  </h4>
                  <p className="font-medium text-blue-800">
                    Your project is currently being built and deployed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Bar: Title & Status */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-neo-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-widest border border-black">
                  Project
                </div>
                <div className="w-16 h-1 bg-neo-black"></div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase text-neo-black leading-[0.9]">
                {project.name}
              </h1>
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-gray-500 hover:text-neo-blue hover:underline decoration-4 decoration-neo-blue mt-2 inline-flex items-center gap-2"
              >
                {project.slug}.deployr.abhishekbr.com{" "}
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div
                className={`px-6 py-2 border-4 border-neo-black shadow-neo-sm font-black uppercase flex items-center gap-3 text-lg ${status.color}`}
              >
                <StatusIcon
                  className={`w-6 h-6 ${status.animate || ""}`}
                  strokeWidth={3}
                />
                {status.label}
              </div>
              <div className="flex gap-3">
                <NeoButton
                  size="sm"
                  variant="outline"
                  onClick={handleRedeploy}
                  disabled={project.status === "BUILDING" || redeploy}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${redeploy ? "animate-spin" : ""}`}
                  />
                  Redeploy
                </NeoButton>
                {project.status === "BUILD_SUCCESS" && (
                  <NeoButton
                    size="sm"
                    variant="primary"
                    onClick={() => window.open(deploymentUrl, "_blank")}
                  >
                    Visit Site
                  </NeoButton>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <NeoCard className="p-4 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="bg-neo-blue text-white p-3 border-2 border-neo-black shadow-neo-sm">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-gray-500">
                  Domain
                </div>
                <div className="font-bold truncate max-w-[80px] md:max-w-[200px]">
                  {project.slug}
                </div>
              </div>
            </NeoCard>
            <NeoCard className="p-4 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="bg-neo-green text-black p-3 border-2 border-neo-black shadow-neo-sm">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-gray-500">
                  Total Views
                </div>
                <div className="font-bold">
                  {project.views.toLocaleString()}
                </div>
              </div>
            </NeoCard>
            <NeoCard className="p-4 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="bg-neo-yellow text-black p-3 border-2 border-neo-black shadow-neo-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-gray-500">
                  Last Update
                </div>
                <div className="font-bold">{getTimeAgo(project.updatedAt)}</div>
              </div>
            </NeoCard>
            <NeoCard className="p-4 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="bg-neo-pink text-black p-3 border-2 border-neo-black shadow-neo-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-gray-500">
                  Build Size
                </div>
                <div className="font-bold">
                  {project.size ? formatBytes(project.size) : "Unknown"}
                </div>
              </div>
            </NeoCard>
          </div>

          {/* Main Navigation Tabs */}
          <div className="border-b-4 border-neo-black grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { id: "overview", icon: LayoutDashboard, label: "Overview" },
              { id: "deployments", icon: Server, label: "Deployments" },
              { id: "analytics", icon: BarChart3, label: "Analytics" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((tab, index) => {
              const isBottomRow = index >= 2;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 font-black uppercase text-sm border-t-4 border-x-4 border-neo-black transition-all relative top-[4px] ${
                    isBottomRow ? "border-b-4" : "md:border-b-4"
                  } ${
                    activeTab === tab.id
                      ? "bg-neo-black text-white"
                      : "bg-white text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  {tab.id === "deployments" && isLive && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Left Col */}
                <div className="space-y-8">
                  <NeoCard>
                    <div className="flex justify-between items-center mb-6 border-b-4 border-neo-black pb-4">
                      <h3 className="font-black text-xl uppercase flex items-center gap-2">
                        <Github className="w-5 h-5" /> Repository
                      </h3>
                      {project.repo_url && (
                        <NeoButton
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            window.open(project.repo_url!, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </NeoButton>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-bold uppercase text-gray-400 mb-1">
                          Source URL
                        </div>
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-bold hover:text-neo-blue underline break-all"
                          >
                            {project.repo_url.replace(
                              "https://github.com/",
                              "",
                            )}
                          </a>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-bold uppercase text-gray-400 mb-1">
                            Branch
                          </div>
                          <div className="inline-block items-center gap-2 font-mono font-bold bg-gray-100 p-2 border-2 border-black">
                            <GitBranch className="w-4 h-4" />{" "}
                            {project.branch || "main"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase text-gray-400 mb-1">
                            Project ID
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 border-2 border-black font-mono">
                              {project.id.slice(0, 8)}...
                            </code>
                            <button
                              onClick={() => copyToClipboard(project.id)}
                              className="p-1 hover:bg-neo-yellow border-2 border-black"
                            >
                              {copied ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NeoCard>

                  <NeoCard className="bg-neo-yellow/10">
                    <h3 className="font-black text-lg uppercase mb-4">
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <NeoButton
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(deploymentUrl)}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copied ? "Copied URL" : "Copy URL"}
                      </NeoButton>
                      <NeoButton
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="w-4 h-4 mr-2" /> Edit Settings
                      </NeoButton>
                    </div>
                  </NeoCard>
                </div>

                {/* Right Col */}
                <div className="space-y-8">
                  <NeoCard className="bg-neo-black text-white border-neo-black">
                    <div className="flex justify-between items-center mb-6 border-b-2 border-gray-700 pb-4">
                      <h3 className="font-black text-xl uppercase flex items-center gap-2">
                        <Shield className="w-5 h-5 text-neo-green" /> Deployment
                        Info
                      </h3>
                      <NeoBadge color={project.private ? "pink" : "green"}>
                        {project.private ? "PRIVATE" : "PUBLIC"}
                      </NeoBadge>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#222] border-2 border-gray-700 font-mono text-sm break-all">
                        <div className="text-xs text-gray-500 mb-1">
                          PRODUCTION_URL
                        </div>
                        <span className="text-neo-blue">{deploymentUrl}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#222] border-2 border-gray-700">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            STATUS
                          </div>
                          <span className="font-mono font-bold text-white">
                            {status.label}
                          </span>
                        </div>
                        <NeoBadge color="blue">{project.status}</NeoBadge>
                      </div>
                    </div>
                  </NeoCard>

                  {project.envVars.length > 0 && (
                    <NeoCard>
                      <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Env Variables
                      </h3>
                      <div className="space-y-2">
                        {project.envVars.map((env, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-2 bg-gray-50 border-2 border-black"
                          >
                            <code className="font-bold text-sm">{env.key}</code>
                            <span className="text-xs font-bold bg-neo-black text-white px-1">
                              ENCRYPTED
                            </span>
                          </div>
                        ))}
                      </div>
                    </NeoCard>
                  )}
                </div>
              </div>
            )}

            {activeTab === "deployments" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProjectLogs project={project} />
              </div>
            )}

            {activeTab === "analytics" && (
              <NeoCard className="min-h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-24 h-24 bg-neo-yellow border-4 border-neo-black rounded-full flex items-center justify-center mb-6 shadow-neo-lg">
                  <BarChart3 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black uppercase mb-2">
                  Data Processing
                </h2>
                <p className="text-xl font-medium text-gray-500 max-w-md">
                  Analytics engine is warming up. Detailed metrics will appear
                  here soon.
                </p>
              </NeoCard>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <NeoCard>
                  <h3 className="font-black text-xl uppercase mb-4">
                    Quick Settings
                  </h3>
                  <p className="text-gray-600 mb-6 font-medium">
                    Manage your project configuration and deployment settings.
                  </p>
                  <NeoButton
                    onClick={() =>
                      (window.location.href = `/projects/${project.id}/settings`)
                    }
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Open Project Settings
                  </NeoButton>
                </NeoCard>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
