"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  Github,
  GitBranch,
  Clock,
  Eye,
  ExternalLink,
  Settings,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw,
  Rocket,
  LayoutGrid,
  List,
  Activity,
  Calendar
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { getTimeAgo } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Project {
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
  framework?: string;
}

interface ProjectsListProps {
  projects: Project[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const statusConfig: any = {
  PENDING: {
    color: "bg-neo-yellow",
    textColor: "text-black",
    icon: Clock,
    label: "QUEUED",
    border: "border-neo-black"
  },
  BUILDING: {
    color: "bg-neo-blue",
    textColor: "text-white",
    icon: RefreshCw,
    label: "BUILDING",
    border: "border-neo-black",
    animate: "animate-spin"
  },
  BUILD_SUCCESS: {
    color: "bg-neo-green",
    textColor: "text-black",
    icon: CheckCircle,
    label: "LIVE",
    border: "border-neo-black"
  },
  BUILD_FAILED: {
    color: "bg-neo-pink",
    textColor: "text-black",
    icon: XCircle,
    label: "FAILED",
    border: "border-neo-black"
  },
};

const frameworkIcons: any = {
  nextjs: "N",
  react: "R",
  vue: "V",
  static: "S",
  vite: "⚡️",
  default: "?"
};

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.repo_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "live" && project.status === "BUILD_SUCCESS") ||
      (statusFilter === "failed" && project.status === "BUILD_FAILED") ||
      (statusFilter === "building" && project.status === "BUILDING");
    return matchesSearch && matchesStatus;
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col bg-neo-bg">
      <NavBar />

      <main className="flex-1 container mx-auto px-4 md:px-10 py-12 pt-32 max-w-screen-2xl">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-6xl md:text-7xl font-black text-neo-black mb-2 uppercase leading-none tracking-tighter">
              Dashboard
            </h1>
            <p className="text-xl font-bold text-gray-500 font-mono">
              {projects.length} PROJECTS DEPLOYED
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", x: 4, y: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/new")}
            className="bg-neo-black text-white px-6 py-4 text-lg font-bold uppercase tracking-wider border-4 border-neo-black shadow-neo-lg flex items-center gap-3 transition-all cursor-pointer"
          >
            <Plus strokeWidth={4} className="w-5 h-5" />
            New Project
          </motion.button>
        </div>

        {/* Toolbar */}
        <div className="bg-white border-4 border-neo-black p-4 shadow-neo-sm mb-12 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={3} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH PROJECTS..." 
              className="w-full h-12 pl-12 pr-4 border-2 border-neo-black bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 font-bold font-mono text-lg transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'live', 'building', 'failed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 border-2 border-neo-black font-bold uppercase text-sm whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === filter 
                    ? "bg-neo-black text-white shadow-none translate-y-[2px] translate-x-[2px]" 
                    : "bg-white text-neo-black shadow-neo-sm hover:-translate-y-1 hover:shadow-neo"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="hidden md:flex border-2 border-neo-black bg-white">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 hover:bg-neo-yellow transition-colors ${viewMode === "grid" ? "bg-neo-yellow" : ""}`}
            >
              <LayoutGrid className="w-5 h-5 text-black" />
            </button>
            <div className="w-[2px] bg-neo-black"></div>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 hover:bg-neo-yellow transition-colors ${viewMode === "list" ? "bg-neo-yellow" : ""}`}
            >
              <List className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredProjects.length === 0 ? (
          <div className="border-4 border-dashed border-gray-400 p-12 text-center rounded-none flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
              <Rocket className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-3xl font-black text-gray-400 mb-2 uppercase">
              {projects.length === 0 ? "No Projects Yet" : "No Projects Found"}
            </h3>
            <p className="text-gray-500 font-medium mb-8">
              {projects.length === 0 
                ? "Get started by deploying your first project" 
                : "Try clearing your filters or create a new project."}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-neo-pink font-bold underline hover:text-black"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
            <AnimatePresence>
              {filteredProjects.map((project) => {
                const status = statusConfig[project.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;
                const fw = project.framework || "default";
                const deploymentUrl = `https://${project.slug}.deployr.live`;

                if (viewMode === "list") {
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      onClick={() => router.push(`/projects/${project.id}/overview`)}
                      className="bg-white border-4 border-neo-black p-4 shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-6 group"
                    >
                      <div className={`w-12 h-12 border-2 border-neo-black flex items-center justify-center text-xl font-black shadow-sm ${project.status === 'BUILD_SUCCESS' ? 'bg-neo-green' : 'bg-white'}`}>
                        {frameworkIcons[fw] || "?"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-xl group-hover:underline decoration-4 decoration-neo-yellow">{project.name}</h3>
                        <div className="flex gap-2 text-sm font-mono text-gray-500">
                          <span>{project.repo_name}</span>
                          <span>•</span>
                          <span>{project.branch}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 border-2 border-neo-black font-bold font-mono text-xs uppercase flex items-center gap-2 ${status.color} ${status.textColor}`}>
                        <StatusIcon className={`w-3 h-3 ${status.animate || ""}`} />
                        {status.label}
                      </div>
                      <ChevronRight className="w-6 h-6 text-neo-black" />
                    </motion.div>
                  );
                }

                // Grid View
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -4 }}
                    onClick={() => router.push(`/projects/${project.id}/overview`)}
                    className="group relative bg-white border-4 border-neo-black shadow-neo-lg hover:shadow-neo transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b-4 border-neo-black bg-gray-50 flex justify-between items-start relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white border-2 border-neo-black flex items-center justify-center font-black shadow-neo-sm">
                            {frameworkIcons[fw] || "?"}
                          </div>
                          <div>
                            <h3 className="font-black text-2xl leading-none group-hover:text-neo-blue transition-colors truncate max-w-[180px]">
                              {project.name}
                            </h3>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-gray-500 bg-white px-2 py-1 border-2 border-black shadow-sm">
                          <Github className="w-3 h-3" />
                          {project.repo_name}
                        </div>
                      </div>
                      
                      <div className="relative z-10 flex flex-col gap-2 items-end">
                        <div className={`w-3 h-3 rounded-full border-2 border-black ${status.color === 'bg-neo-green' ? 'bg-neo-green animate-pulse' : status.color === 'bg-neo-pink' ? 'bg-neo-pink' : 'bg-gray-300'}`}></div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neo-yellow border-3 border-black hover:border-black">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-2 border-neo-black text-black bg-white shadow-neo">
                            <DropdownMenuItem 
                              className={`cursor-pointer font-medium hover:${status.color}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/projects/${project.id}/overview`);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Project
                            </DropdownMenuItem>
                            {project.status === "BUILD_SUCCESS" && (
                              <DropdownMenuItem
                                className={`cursor-pointer font-medium hover:${status.color}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(deploymentUrl, "_blank");
                                }}
                              >
                                <Globe className="w-4 h-4 mr-2" />
                                Visit Site
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className={`cursor-pointer font-medium hover:${status.color}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/projects/${project.id}/settings`);
                              }}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {project.repo_url && (
                              <DropdownMenuItem
                                className={`cursor-pointer font-medium hover:${status.color}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.repo_url!, "_blank");
                                }}
                              >
                                <Github className="w-4 h-4 mr-2" />
                                View Source
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Decorative Pattern Background */}
                      <div className="absolute inset-0 opacity-5 pattern-dots pointer-events-none"></div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4 mb-6">
                        {/* Domain */}
                        <div className="flex justify-between items-center text-sm font-medium border-b-2 border-dashed border-gray-200 pb-2">
                          <span className="text-gray-500 uppercase tracking-wide text-xs font-bold">Domain</span>
                          <div className="flex items-center gap-1 hover:text-neo-blue cursor-pointer">
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{project.slug}.deployr.live</span>
                          </div>
                        </div>
                        
                        {/* Branch */}
                        <div className="flex justify-between items-center text-sm font-medium border-b-2 border-dashed border-gray-200 pb-2">
                          <span className="text-gray-500 uppercase tracking-wide text-xs font-bold">Branch</span>
                          <div className="flex items-center gap-1 font-mono text-xs bg-gray-100 px-1">
                            <GitBranch className="w-3 h-3" />
                            {project.branch}
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Eye className="w-3 h-3 text-gray-400" />
                              <span className="text-sm font-bold">{project.status !== "BUILD_SUCCESS" && project.views.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Views</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Activity className="w-3 h-3 text-gray-400" />
                              <span className="text-sm font-bold">{project.size ? formatBytes(project.size) : "—"}</span>
                            </div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Size</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-sm font-bold">{getTimeAgo(project.updatedAt)}</span>
                            </div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Updated</p>
                          </div>
                        </div>
                      </div>

                      <div className={`w-full py-3 border-2 font-black text-center text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-neo-sm ${status.color} ${status.textColor} ${status.border}`}>
                        <StatusIcon className={`w-4 h-4 ${status.animate || ""}`} strokeWidth={3} />
                        {status.label}
                      </div>
                    </div>

                    {/* Hover Action Overlay - Desktop */}
                    <div className="absolute inset-0 bg-neo-black/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                      <div className="bg-white border-4 border-neo-black px-6 py-3 font-black uppercase shadow-neo-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        View Dashboard
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// Helper for View Mode Toggle
function ChevronRight({className}: {className?: string}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
}