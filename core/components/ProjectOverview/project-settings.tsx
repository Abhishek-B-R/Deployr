"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NeoButton, NeoCard } from "@/components/neo-ui";
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertTriangle,
  Settings,
  Globe,
  Plus,
  X,
  Lock,
  Circle,
  LoaderCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NavBar from "../NavBar";
import Footer from "../Footer";

const projectUpdateSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  private: z.boolean(),
  buildCommand: z.string().min(1),
  installCommand: z.string().min(1),
  outputDirectory: z.string().min(1),
  framework: z.string().min(1),
  rootDirectory: z.string().min(1),
  envVars: z.array(
    z.object({ key: z.string().min(1), value: z.string().min(1) })
  ),
});

type ProjectUpdateForm = z.infer<typeof projectUpdateSchema>;

interface ProjectSettingsProps {
  project: {
    id: string;
    name: string;
    slug: string;
    private: boolean;
    status: string;
    repo_url: string;
    branch: string;
    buildCommand: string;
    installCommand: string;
    outputDirectory: string;
    framework: string;
    rootDirectory: string;
    envVars: Array<{ id?: string; key: string; value: string }>;
  };
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProjectUpdateForm>({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      name: project.name,
      slug: project.slug,
      private: project.private,
      buildCommand: project.buildCommand || "npm run build",
      installCommand: project.installCommand || "npm install",
      outputDirectory: project.outputDirectory || "out",
      framework: project.framework || "nextjs",
      rootDirectory: project.rootDirectory || "./",
      envVars: project.envVars.map((env) => ({
        key: env.key,
        value: env.value,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "envVars",
  });

  const onSubmit = async (values: ProjectUpdateForm) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      toast({
        title: "Project updated",
        description: "Your project settings have been updated successfully.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem updating your project settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      });
      router.push("/projects");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting your project.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation("");
    }
  };

  const isDeleteConfirmationValid = deleteConfirmation === project.name;

  return (
    <div className="mx-auto space-y-12 text-black mt-30">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase flex items-center gap-2 md:gap-3">
          <div className="bg-neo-black text-white p-1.5 md:p-2 border-2 border-white shadow-neo-sm shrink-0">
            <Settings className="w-4 h-4 md:w-6 md:h-6" />
          </div>
          <span className="truncate">Project Configuration</span>
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <NeoCard className="p-0 overflow-visible">
          <div className="bg-neo-yellow border-b-4 border-neo-black p-4 md:p-5 flex items-center justify-between gap-3">
            <span className="font-bold font-mono text-xs md:text-sm uppercase truncate">
              General Settings
            </span>
            <div className="flex gap-2 shrink-0">
              <div className="w-3 h-3 bg-black rounded-full" />
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
          </div>

          <div className="p-5 md:p-9 space-y-7 md:space-y-9">
            <div className="space-y-3">
              <label className="font-bold text-sm uppercase">
                Project Name
              </label>
              <input
                {...form.register("name")}
                className="w-full h-12 px-5 border-4 border-neo-black font-bold font-mono focus:outline-none focus:shadow-neo transition-all"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-neo-red font-bold mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="font-bold text-sm uppercase">
                Project Slug
              </label>
              <div className="flex flex-col sm:flex-row">
                <span className="h-12 flex items-center px-3 sm:px-4 bg-gray-100 border-4 border-b-0 sm:border-b-4 sm:border-r-0 border-neo-black font-mono text-xs font-bold text-gray-500 whitespace-nowrap">
                  https://
                </span>
                <input
                  {...form.register("slug")}
                  className="flex-1 h-12 px-5 border-4 border-t-0 sm:border-t-4 border-neo-black font-bold font-mono focus:outline-none focus:ring-4 focus:ring-neo-blue/20"
                />
                <span className="h-12 flex items-center px-3 sm:px-4 bg-gray-100 border-4 border-t-0 sm:border-t-4 sm:border-l-0 border-neo-black font-mono text-xs font-bold text-gray-500 whitespace-nowrap">
                  .deployr.live
                </span>
              </div>
              {form.formState.errors.slug && (
                <p className="text-sm text-neo-red font-bold mt-1">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
          </div>
        </NeoCard>

        <NeoCard className="p-0 overflow-visible">
          <div className="bg-neo-blue text-white border-b-4 border-neo-black p-4 md:p-5 flex items-center justify-between">
            <span className="font-bold font-mono text-xs md:text-sm uppercase truncate">
              Build Configuration
            </span>
          </div>

          <div className="p-5 md:p-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
              <div className="space-y-3">
                <label className="font-bold text-xs uppercase text-gray-500">
                  Build Command
                </label>
                <input
                  {...form.register("buildCommand")}
                  className="w-full p-4 border-2 border-neo-black font-mono text-sm"
                />
                {form.formState.errors.buildCommand && (
                  <p className="text-sm text-neo-red font-bold mt-1">
                    {form.formState.errors.buildCommand.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="font-bold text-xs uppercase text-gray-500">
                  Output Directory
                </label>
                <input
                  {...form.register("outputDirectory")}
                  className="w-full p-4 border-2 border-neo-black font-mono text-sm"
                />
                {form.formState.errors.outputDirectory && (
                  <p className="text-sm text-neo-red font-bold mt-1">
                    {form.formState.errors.outputDirectory.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="font-bold text-xs uppercase text-gray-500">
                  Install Command
                </label>
                <input
                  {...form.register("installCommand")}
                  className="w-full p-4 border-2 border-neo-black font-mono text-sm"
                />
                {form.formState.errors.installCommand && (
                  <p className="text-sm text-neo-red font-bold mt-1">
                    {form.formState.errors.installCommand.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="font-bold text-xs uppercase text-gray-500">
                  Root Directory
                </label>
                <input
                  {...form.register("rootDirectory")}
                  className="w-full p-4 border-2 border-neo-black font-mono text-sm"
                />
                {form.formState.errors.rootDirectory && (
                  <p className="text-sm text-neo-red font-bold mt-1">
                    {form.formState.errors.rootDirectory.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </NeoCard>

        <NeoCard className="p-0 overflow-visible">
          <div className="bg-neo-pink border-b-4 border-neo-black p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="font-bold font-mono text-xs md:text-sm uppercase">
              Environment Variables
            </span>
            <button
              type="button"
              onClick={() => append({ key: "", value: "" })}
              className="bg-neo-green border-2 border-neo-black px-4 py-2.5 text-xs font-bold hover:shadow-neo-sm active:translate-y-1 transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto"
            >
              + ADD NEW
            </button>
          </div>

          <div className="p-5 md:p-9 space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
              >
                <div className="font-mono text-xs font-bold text-gray-400 sm:w-8 sm:text-center flex items-center">
                  #{index + 1}
                </div>
                <input
                  {...form.register(`envVars.${index}.key` as const)}
                  placeholder="KEY"
                  className="flex-1 min-w-0 p-3 border-2 border-neo-black font-mono text-sm uppercase placeholder:text-gray-300"
                />
                <input
                  {...form.register(`envVars.${index}.value` as const)}
                  placeholder="VALUE"
                  type="password"
                  className="flex-1 min-w-0 p-3 border-2 border-neo-black font-mono text-sm placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-3 border-2 border-neo-black hover:bg-neo-pink hover:text-white transition-colors cursor-pointer shrink-0 sm:w-auto w-full"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            ))}
            {fields.length === 0 && (
              <div className="text-center text-gray-400 italic py-6">
                No environment variables set.
              </div>
            )}
          </div>
        </NeoCard>

        <div className="flex justify-end pt-6">
          <NeoButton
            type="submit"
            variant="primary"
            size="default"
            disabled={isLoading}
            className="w-full md:w-auto cursor-pointer"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </NeoButton>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="mt-14 space-y-6">
        <NeoCard className="p-0 overflow-visible border-4 border-black">
          <div className="bg-red-500 border-b-4 border-neo-black p-4 md:p-5 flex items-center gap-3">
            <div className="bg-white text-neo-red p-2 border-4 border-neo-black shadow-neo-sm shrink-0">
              <AlertTriangle
                className="w-5 h-5 md:w-6 md:h-6"
                strokeWidth={3}
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white">
                Danger Zone
              </h3>
              <p className="font-bold text-xs sm:text-sm text-red-100">
                Irreversible actions. Proceed with caution.
              </p>
            </div>
          </div>

          <div className="p-5 md:p-8">
            <NeoCard className="bg-red-50 border-4 border-red-300 p-5 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6">
                <div className="flex-1">
                  <h4 className="font-black uppercase text-lg md:text-xl text-red-900 mb-2">
                    Delete Project
                  </h4>
                  <p className="text-sm md:text-base font-medium text-red-700">
                    Permanently remove this project and all its deployments.
                    This action cannot be undone.
                  </p>
                </div>
                <NeoButton
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="bg-white border-4 border-neo-red text-neo-red hover:bg-neo-red hover:text-white hover:border-red-700 w-full md:w-auto font-black uppercase px-6 py-3 cursor-pointer"
                >
                  Delete Project
                </NeoButton>
              </div>
            </NeoCard>
          </div>
        </NeoCard>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-neo-black shadow-neo-lg max-w-md w-full my-auto">
            <div className="bg-red-500 border-b-4 border-neo-black p-3 md:p-4 flex items-center gap-2 md:gap-3">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white shrink-0" />
              <h3 className="font-black text-white uppercase text-base md:text-lg">
                Delete Project
              </h3>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <p className="font-bold text-sm md:text-base text-gray-700">
                This action <span className="text-neo-red">CANNOT</span> be
                undone. This will permanently delete the{" "}
                <span className="font-black text-black wrap-break-words">
                  {project.name}
                </span>{" "}
                project, deployments, and remove all associated data.
              </p>
              <p className="font-bold text-xs md:text-sm text-gray-600">
                Please type{" "}
                <span className="font-black text-black wrap-break-words">
                  {project.name}
                </span>{" "}
                to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={project.name}
                className="w-full p-3 border-4 border-neo-black font-mono font-bold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-red-500/20"
              />
            </div>
            <div className="p-4 md:p-6 border-t-4 border-neo-black flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 py-3 border-2 border-neo-black font-bold uppercase hover:bg-gray-100 transition-colors cursor-pointer text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={deleteProject}
                disabled={!isDeleteConfirmationValid || isDeleting}
                className="flex-1 py-3 bg-neo-red text-white border-2 border-neo-black font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors cursor-pointer text-sm md:text-base"
              >
                {isDeleting ? (
                  <>
                    <LoaderCircle className="w-4 h-4 inline mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer className="absolute" />
    </div>
  );
}
