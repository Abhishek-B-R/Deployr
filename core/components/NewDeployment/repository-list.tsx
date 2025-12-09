/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import {
  NeoButton,
  NeoCard,
  NeoBadge,
} from "@/components/NewDeployment/neo-ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  ChevronDown,
  Star,
  Lock,
  Globe,
  ExternalLink,
  GitBranch,
  Search,
  ArrowRight,
} from "lucide-react";
import type { Repository } from "@/lib/types";
import { getTimeAgo, getLanguageColor } from "@/lib/utils";
import { useRouter } from "next/navigation";

function RepositoryListInsider() {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("updated");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchRepositories = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort: sortBy,
        per_page: "30",
      });

      const response = await fetch(`/api/github/repos?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRepositories(data);
      }
    } catch (err) {
      console.error("Error fetching repos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, sortBy]);

  const handleImport = (repo: Repository) => {
    router.push(`/new/import?repo=${repo.full_name}`);
  };

  if (!session) {
    return (
      <NeoCard className="p-8 text-center bg-white border-4 border-neo-black h-full">
        <p className="mb-2 text-neo-black font-bold">
          Please sign in to view your repositories
        </p>
        <p className="mb-4 text-gray-600 font-medium">
          Or your GitHub token expired. Try re-logging in.
        </p>
        <NeoButton onClick={() => router.push("/api/auth/signin")}>
          Sign in with GitHub
        </NeoButton>
      </NeoCard>
    );
  }

  const filtered = repositories.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <NeoCard className="w-full max-w-full bg-white p-0 border-4 border-neo-black rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-neo-black text-white px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-3 border-b-4 border-neo-black">
        <div className="flex items-center gap-3">
          <div className="bg-neo-yellow text-black p-1 border border-white">
            <GitBranch size={18} />
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
            Select Repository
          </h2>
        </div>

        <NeoButton
          variant="ghost"
          size="icon"
          onClick={fetchRepositories}
          disabled={loading}
          className="text-white border-white hover:bg-white hover:text-black transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </NeoButton>
      </div>

      {/* Search + Filters */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4 border-b-2 border-dashed border-gray-300">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-neo-black focus:outline-none focus:shadow-neo-sm font-medium text-neo-black placeholder:text-gray-500 text-sm sm:text-base"
          />
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between sm:justify-center px-3 py-2 border-2 border-neo-black bg-white shadow-neo-sm text-xs sm:text-sm font-bold text-neo-black hover:shadow-neo transition-all w-full sm:w-auto">
              <div className="flex items-center">
                <img
                  src={session.user?.image || ""}
                  alt={session.user?.name || ""}
                  className="w-5 h-5 rounded-full mr-2 border border-black"
                />
                <span className="text-neo-black truncate max-w-[120px] sm:max-w-none">
                  {session.user?.name}
                </span>
              </div>
              <ChevronDown className="ml-2 w-4 h-4 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-2 border-neo-black shadow-neo">
            <DropdownMenuItem className="font-medium text-neo-black">
              <img
                src={session.user?.image || ""}
                alt={session.user?.name || ""}
                className="w-4 h-4 rounded-full mr-2 border border-black"
              />
              {session.user?.name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between sm:justify-center px-3 py-2 border-2 border-neo-black bg-white shadow-neo-sm text-xs sm:text-sm font-bold text-neo-black hover:shadow-neo transition-all w-full sm:w-auto">
              <span className="text-neo-black">Sort: {sortBy}</span>
              <ChevronDown className="ml-2 w-4 h-4 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-2 border-neo-black shadow-neo">
            <DropdownMenuItem
              onClick={() => setSortBy("updated")}
              className="font-medium text-neo-black cursor-pointer"
            >
              Recently Updated
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("created")}
              className="font-medium text-neo-black cursor-pointer"
            >
              Recently Created
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("pushed")}
              className="font-medium text-neo-black cursor-pointer"
            >
              Recently Pushed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("full_name")}
              className="font-medium text-neo-black cursor-pointer"
            >
              Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Repository List with Custom Scrollbar */}
      <div
        className="px-3 sm:px-6 pb-5 sm:pb-6 max-h-[65vh] sm:h-[500px] overflow-y-auto space-y-3 sm:space-y-4 neo-scrollbar"
        data-lenis-prevent
      >
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 border-2 border-dashed border-gray-300 animate-pulse"
              ></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-6 text-gray-600 font-medium">
            No repositories found
          </p>
        ) : (
          filtered.map((repo) => (
            <div
              key={repo.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-2 border-neo-black hover:bg-neo-blue/5 hover:shadow-neo-sm transition-all duration-200 bg-white"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Language Color Dot */}
                <div className="shrink-0 mt-1">
                  <div
                    className="w-4 h-4 border-2 border-black"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                </div>

                {/* Repo Main */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      className="font-bold text-lg hover:underline truncate text-black hover:text-neo-blue"
                    >
                      {repo.name}
                    </a>

                    <NeoBadge
                      color={repo.private ? "pink" : "green"}
                      className="text-[10px] py-0 px-1.5 h-auto"
                    >
                      {repo.private ? "Private" : "Public"}
                    </NeoBadge>

                    {repo.private ? (
                      <Lock size={12} className="text-gray-600" />
                    ) : (
                      <Globe size={12} className="text-gray-600" />
                    )}

                    <ExternalLink size={12} className="text-gray-600" />
                  </div>

                  {repo.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-md font-medium">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-bold text-gray-500 mt-2 font-mono uppercase">
                    <span>{getTimeAgo(repo.updated_at)}</span>

                    <span>•</span>

                    <span>{repo.language || "Unknown"}</span>

                    {repo.stargazers_count > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-black">
                          <Star className="w-3 h-3 fill-neo-yellow text-black" />
                          {repo.stargazers_count}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <NeoButton
                onClick={() => handleImport(repo)}
                size="sm"
                className="mt-4 sm:mt-0 shrink-0 w-full sm:w-auto ml-0 sm:ml-4"
              >
                Import <ArrowRight className="w-4 h-4 ml-2" />
              </NeoButton>
            </div>
          ))
        )}
      </div>
    </NeoCard>
  );
}

export default function RepositoryList() {
  return (
    <SessionProvider>
      <RepositoryListInsider />
    </SessionProvider>
  );
}
