"use client";

import { useState, useEffect } from "react";
import { NeoButton } from "@/components/neo-ui";
import {
  Folder,
  ChevronRight,
  Home,
  Loader2,
  X,
  FolderOpen,
  ArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";

interface FolderItem {
  name: string;
  path: string;
  type: "folder";
}

interface FolderApiResponse {
  folders: string[];
}

interface FolderBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPath: (path: string) => void;
  repoId: number;
  owner: string;
  repo: string;
  currentPath: string;
}

export function FolderBrowser({
  open,
  onOpenChange,
  onSelectPath,
  repoId,
  owner,
  repo,
  currentPath,
}: FolderBrowserProps) {
  const [pathSegments, setPathSegments] = useState<string[]>([]);
  const [allFolders, setAllFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>(currentPath);

  useEffect(() => {
    if (!open) return;

    const segments =
      currentPath === "./" ? [] : currentPath.split("/").filter(Boolean);

    setPathSegments(segments);
    setSelectedPath(currentPath);

    fetchAllFolders();
  }, [open, currentPath]);

  // ✔️ Restored — REAL folder fetching
  const fetchAllFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/repositories/${repoId}/folders?owner=${owner}&repo=${repo}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }

      const data: FolderApiResponse = await response.json();
      setAllFolders(data.folders || []);
    } catch (error) {
      console.error("Folder fetch failed", error);
      setAllFolders([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLevelFolders = (): FolderItem[] => {
    const currentPathStr =
      pathSegments.length === 0 ? "" : `/${pathSegments.join("/")}`;

    const childFolders = new Set<string>();

    allFolders.forEach((folderPath) => {
      if (folderPath === "/") return;

      const cleanPath = folderPath.startsWith("/")
        ? folderPath.slice(1)
        : folderPath;

      if (currentPathStr === "") {
        const firstSegment = cleanPath.split("/")[0];
        if (firstSegment && !cleanPath.includes("/", 1)) {
          childFolders.add(firstSegment);
        }
      } else {
        const currentClean = currentPathStr.slice(1);
        if (cleanPath.startsWith(currentClean + "/")) {
          const remaining = cleanPath.slice(currentClean.length + 1);
          const next = remaining.split("/")[0];
          if (next && !remaining.includes("/", next.length)) {
            childFolders.add(next);
          }
        }
      }
    });

    return Array.from(childFolders)
      .map((name) => ({
        name,
        path:
          pathSegments.length === 0
            ? name
            : `${pathSegments.join("/")}/${name}`,
        type: "folder" as const,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const navigateToFolder = (folderPath: string) => {
    const newSegments = folderPath.split("/").filter(Boolean);
    setPathSegments(newSegments);
    setSelectedPath(folderPath || "./");
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setPathSegments([]);
      setSelectedPath("./");
    } else {
      const newSegments = pathSegments.slice(0, index + 1);
      const newPath = newSegments.join("/");
      setPathSegments(newSegments);
      setSelectedPath(newPath || "./");
    }
  };

  const handleSubmit = () => {
    onSelectPath(selectedPath);
    onOpenChange(false);
  };

  const displayPath = selectedPath === "./" ? "./ (root)" : selectedPath;
  const currentFolders = getCurrentLevelFolders();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-neo-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Window */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-neo-bg border-4 border-neo-black shadow-neo-lg max-h-[85vh] flex flex-col"
      >
        {/* Title Bar */}
        <div className="h-10 border-b-4 border-neo-black bg-white flex items-center justify-between px-3">
          <div className="font-mono font-bold text-sm tracking-tighter bg-neo-blue text-white px-2 border-2 border-black">
            DIR_EXPLORER.EXE
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-6 h-6 bg-neo-pink border-2 border-black flex items-center justify-center"
          >
            <X size={14} strokeWidth={4} className="text-white" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col space-y-4 overflow-hidden">

          {/* Breadcrumb */}
          <div className="bg-white border-2 border-neo-black p-2 flex items-center space-x-2">
            <button
              onClick={() => navigateToBreadcrumb(-1)}
              className="p-1 hover:bg-gray-100 border border-transparent hover:border-black"
            >
              <Home className="w-5 h-5" />
            </button>

            <div className="h-6 w-[2px] bg-neo-black"></div>

            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
              {pathSegments.length === 0 && (
                <span className="font-mono font-bold text-gray-500 px-2">
                  root
                </span>
              )}
              {pathSegments.map((segment, index) => (
                <div key={index} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <button
                    onClick={() => navigateToBreadcrumb(index)}
                    className="px-2 py-0.5 hover:bg-neo-yellow font-bold font-mono text-sm"
                  >
                    {segment}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Folder list */}
          <div className="flex-1 bg-white border-4 border-neo-black shadow-inner overflow-hidden flex flex-col">
            <div className="bg-neo-black text-white px-4 py-1 text-xs font-mono border-b-4 border-neo-black flex justify-between">
              <span>CONTENTS</span>
              <span>{currentFolders.length} ITEMS</span>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {loading ? (
                <LoadingState />
              ) : currentFolders.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {pathSegments.length > 0 && (
                    <ParentButton onClick={() =>
                      navigateToBreadcrumb(pathSegments.length - 2)
                    } />
                  )}

                  {currentFolders.map((folder) => (
                    <FolderRow
                      key={folder.path}
                      folder={folder}
                      onClick={() => navigateToFolder(folder.path)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="text-xs font-mono font-bold text-gray-500">
              SELECTED:{" "}
              <span className="text-neo-black bg-white px-1 border border-black">
                {displayPath}
              </span>
            </div>
            <div className="flex gap-2">
              <NeoButton variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </NeoButton>
              <NeoButton variant="primary" size="sm" onClick={handleSubmit}>
                Select Folder
              </NeoButton>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <Loader2 className="w-8 h-8 animate-spin text-neo-black mb-2" />
      <span className="font-mono text-xs font-bold">LOADING...</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
      <FolderOpen className="w-12 h-12 mb-2 opacity-50" />
      <span className="font-mono text-xs font-bold">EMPTY DIRECTORY</span>
    </div>
  );
}

function FolderRow({
  folder,
  onClick,
}: {
  folder: FolderItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-neo-blue/10 border border-transparent hover:border-black text-left group"
    >
      <div className="w-8 h-8 bg-neo-yellow border-2 border-black flex items-center justify-center group-hover:bg-neo-pink">
        <Folder className="w-4 h-4" />
      </div>
      <span className="font-bold font-mono flex-1">{folder.name}</span>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black" />
    </button>
  );
}

function ParentButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 border border-transparent hover:border-black text-left group"
    >
      <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center group-hover:bg-neo-yellow">
        <ArrowUp className="w-4 h-4" />
      </div>
      <span className="font-bold font-mono">.. (Parent)</span>
    </button>
  );
}
