
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NeoButton, NeoCard, NeoBadge } from "@/components/neo-ui";
import {
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
  Check,
  X,
  Lock
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { useToast } from "@/hooks/use-toast";
import Footer from "../Footer";

// --- Types & Schemas ---

const userUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
});

type UserUpdateForm = z.infer<typeof userUpdateSchema>;

interface UserSettingsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    project: Array<{
      id: string;
      name: string;
      status: string;
      createdAt: Date;
      views?: number;
    }>;
  };
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
}

// --- Custom Components for this page ---

const BrutalistSwitch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onCheckedChange(!checked)}
    className={`w-16 h-8 border-4 border-neo-black relative transition-colors ${checked ? 'bg-neo-green' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-[-4px] bottom-[-4px] w-8 border-4 border-neo-black bg-white transition-transform duration-200 flex items-center justify-center ${checked ? 'translate-x-8' : 'translate-x-[-4px]'}`}>
      {checked ? <Check className="w-4 h-4" strokeWidth={4} /> : <X className="w-4 h-4" strokeWidth={4} />}
    </div>
  </button>
);

const SectionHeader = ({ icon: Icon, title, description, color = "bg-neo-black" }: any) => (
  <div className="flex items-start gap-4 mb-6 border-b-4 border-neo-black pb-4">
    <div className={`p-3 border-2 border-neo-black shadow-neo-sm ${color} text-white`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-black text-2xl uppercase tracking-tighter">{title}</h3>
      <p className="font-medium text-gray-500">{description}</p>
    </div>
  </div>
);

// --- Main Component ---

export function UserSettings({ user, session }: UserSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [deploymentNotifications, setDeploymentNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UserUpdateForm>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email,
    },
  });

  const onSubmit = async (values: UserUpdateForm) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "PROFILE UPDATED",
        description: "Your changes have been saved to the mainframe.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "ACCOUNT TERMINATED",
        description: "Goodbye, space cowboy.",
      });
      router.push("/api/auth/signout");
    } catch (error) {
        // error handling
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const deployedProjects = user.project.filter(
    (p) => p.status === "BUILD_SUCCESS"
  ).length;
  const totalProjects = user.project.length;
  const totalViews = user.project.reduce((acc, project) => acc + (project.views || 0), 0);

  return (
    <div className="min-h-screen bg-neo-bg text-neo-black font-sans pb-20">
      <main className="container mx-auto px-4 md:px-10 py-12 pt-32 max-w-7xl">
        
        {/* Header Title */}
        <div className="mb-12 flex items-end gap-4">
             <h1 className="text-6xl md:text-7xl font-black uppercase leading-[0.85]">
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #1A1A1A' }}>Settings</span>
             </h1>
             <div className="hidden md:block mb-2">
                 <div className="bg-neo-yellow px-3 py-1 border-2 border-neo-black font-bold font-mono text-sm shadow-neo-sm transform -rotate-2">
                     ID: {user.id.substring(0, 8)}
                 </div>
             </div>
        </div>

        <div className="space-y-12">
          {/* Profile Overview Card */}
          <NeoCard className="p-0 overflow-visible">
            <div className="bg-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neo-blue/10 rounded-bl-full -mr-16 -mt-16"></div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar */}
                    <div className="relative">
                         <div className="w-32 h-32 border-4 border-neo-black bg-gray-200 shadow-neo-lg overflow-hidden">
                            <img 
                                src={session.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                                alt="avatar" 
                                className="w-full h-full object-cover"
                            />
                         </div>
                         <div className="absolute -bottom-3 -right-3 bg-neo-green border-2 border-neo-black px-2 py-1 text-xs font-black uppercase shadow-sm">
                             Online
                         </div>
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left space-y-2 flex-1">
                        <h2 className="text-4xl font-black uppercase tracking-tight">{user.name || "Anonymous User"}</h2>
                        <p className="text-xl font-mono text-gray-500 font-bold bg-gray-100 inline-block px-2 border border-dashed border-gray-400">
                            {user.email}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t-4 border-dotted border-gray-300">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {formatDate(user.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <Globe className="w-4 h-4" />
                                <span>{user.project.length > 0 ? 'Active Developer' : 'New Developer'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-5 border-t-4 border-neo-black divide-y-4 md:divide-y-0 md:divide-x-4 divide-neo-black">
                <div className="p-6 bg-neo-yellow/20 flex items-center gap-4 group hover:bg-neo-yellow transition-colors">
                    <div className="p-3 bg-white border-2 border-neo-black shadow-neo-sm group-hover:shadow-none transition-all">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase text-gray-500">Total Projects</div>
                        <div className="text-2xl font-black">{totalProjects}</div>
                    </div>
                </div>
                <div className="p-6 bg-neo-green/20 flex items-center gap-4 group hover:bg-neo-green transition-colors">
                    <div className="p-3 bg-white border-2 border-neo-black shadow-neo-sm group-hover:shadow-none transition-all">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase text-gray-500">Deployments</div>
                        <div className="text-2xl font-black">{deployedProjects}</div>
                    </div>
                </div>
                <div className="p-6 bg-neo-pink/20 flex items-center gap-4 group hover:bg-neo-pink transition-colors">
                    <div className="p-3 bg-white border-2 border-neo-black shadow-neo-sm group-hover:shadow-none transition-all">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase text-gray-500">Total Views</div>
                        <div className="text-2xl font-black">{totalViews.toLocaleString()}</div>
                    </div>
                </div>
            </div>
          </NeoCard>

          {/* Edit Profile Form */}
          <NeoCard>
            <SectionHeader 
                icon={Settings} 
                title="Edit Profile" 
                description="Update your personal information." 
                color="bg-neo-blue"
            />
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="font-black text-sm uppercase">Full Name</label>
                        <input 
                            {...form.register("name")}
                            className="w-full h-12 px-4 border-4 border-neo-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                            placeholder="John Doe"
                        />
                        {form.formState.errors.name && (
                            <p className="text-red-600 font-bold text-sm">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="font-black text-sm uppercase flex items-center gap-2">
                            Email Address <Lock className="w-3 h-3 text-gray-400" />
                        </label>
                        <input 
                            {...form.register("email")}
                            disabled
                            className="w-full h-12 px-4 border-4 border-gray-300 text-gray-500 font-bold bg-gray-100 cursor-not-allowed"
                        />
                         <p className="text-xs font-bold text-gray-400">Email cannot be changed.</p>
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <NeoButton type="submit" disabled={isLoading} variant="primary">
                        {isLoading ? (
                            <>
                                <Save className="w-4 h-4 mr-2 animate-spin" /> SAVING...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" /> UPDATE PROFILE
                            </>
                        )}
                    </NeoButton>
                </div>
            </form>
          </NeoCard>

          {/* Connected Accounts */}
          <NeoCard>
             <SectionHeader 
                icon={Github} 
                title="Connections" 
                description="Manage your Git providers." 
                color="bg-neo-black"
            />
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-4 border-neo-black bg-white shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black">
                            <Github className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black uppercase">GitHub</h4>
                            <p className="text-sm font-medium text-gray-500">Connected as {session.user?.name}</p>
                        </div>
                    </div>
                    <NeoBadge color="green">CONNECTED</NeoBadge>
                </div>

                <div className="flex items-center justify-between p-4 border-4 border-gray-200 bg-gray-50 opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center border-2 border-gray-300">
                           <span className="font-black">Gi</span>
                        </div>
                        <div>
                            <h4 className="font-black uppercase text-gray-400">GitLab</h4>
                            <p className="text-sm font-medium text-gray-400">Not connected</p>
                        </div>
                    </div>
                    <NeoBadge className="bg-gray-200 text-gray-500 border-gray-400">SOON</NeoBadge>
                </div>
            </div>
          </NeoCard>

          {/* Notifications */}
          <NeoCard>
             <SectionHeader 
                icon={Bell} 
                title="Notifications" 
                description="Control your alert preferences." 
                color="bg-neo-yellow"
            />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors">
                    <div>
                        <h4 className="font-black text-lg">Email Notifications</h4>
                        <p className="text-sm font-medium text-gray-500">Receive weekly digests and updates.</p>
                    </div>
                    <BrutalistSwitch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="w-full h-0.5 bg-gray-200"></div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors">
                     <div>
                        <h4 className="font-black text-lg">Deployment Alerts</h4>
                        <p className="text-sm font-medium text-gray-500">Get notified when builds fail or succeed.</p>
                    </div>
                    <BrutalistSwitch checked={deploymentNotifications} onCheckedChange={setDeploymentNotifications} />
                </div>
                <div className="w-full h-0.5 bg-gray-200"></div>
                 <div className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors">
                     <div>
                        <h4 className="font-black text-lg">Security Alerts</h4>
                        <p className="text-sm font-medium text-gray-500">Important account security notifications.</p>
                    </div>
                    <BrutalistSwitch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
                </div>
            </div>
          </NeoCard>

          {/* Danger Zone */}
          <div className="mt-12 border-4 border-neo-black relative overflow-hidden bg-white">
            {/* Caution Tape Pattern */}
            <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#FACC15,#FACC15_10px,#000_10px,#000_20px)]"></div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#FACC15,#FACC15_10px,#000_10px,#000_20px)]"></div>
            
            <div className="p-8 py-12">
                <div className="flex items-start gap-4 mb-8">
                    <div className="bg-red-600 text-white p-3 border-4 border-neo-black shadow-neo-sm">
                        <AlertTriangle className="w-8 h-8" strokeWidth={3} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase text-red-600 tracking-tighter">Danger Zone</h3>
                        <p className="font-bold text-gray-600">Irreversible actions. Tread carefully.</p>
                    </div>
                </div>

                <div className="bg-red-50 border-4 border-red-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="font-black uppercase text-xl text-neo-black">Delete Account</h4>
                        <p className="font-medium text-gray-600 max-w-md">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <button 
                         onClick={() => setShowDeleteDialog(true)}
                         className="px-6 py-3 bg-white border-4 border-red-600 text-red-600 font-black uppercase shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>

       {/* Delete Confirmation Dialog */}
       {showDeleteDialog && (
        <div className="fixed inset-0 bg-neo-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-8 border-neo-black shadow-[16px_16px_0px_0px_rgba(255,0,0,1)] max-w-lg w-full relative">
            
            <button 
                onClick={() => setShowDeleteDialog(false)}
                className="absolute -top-6 -right-6 bg-neo-black text-white p-2 border-2 border-white hover:bg-red-600 transition-colors shadow-neo-sm"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="bg-red-600 border-b-4 border-neo-black p-6">
              <h3 className="font-black text-white uppercase text-3xl italic tracking-tighter">Terminate Account</h3>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="font-bold text-xl leading-relaxed">
                Are you absolutely sure? This will wipe <span className="bg-neo-yellow px-2 border-2 border-black">{user.email}</span> off the map.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Type "DELETE" to confirm</label>
                <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    className="w-full p-4 border-4 border-neo-black font-mono font-bold text-lg focus:outline-none focus:ring-4 focus:ring-red-600/30"
                    autoFocus
                />
              </div>
            </div>

            <div className="p-6 border-t-4 border-neo-black bg-gray-50 flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 py-4 border-4 border-gray-300 text-gray-500 font-black uppercase hover:border-neo-black hover:text-neo-black hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleteConfirmation !== "DELETE" || isDeleting}
                className="flex-1 py-4 bg-neo-black text-white border-4 border-neo-black font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 hover:border-red-600 transition-colors"
              >
                {isDeleting ? "Goodbye..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer className="absolute mt-20"/>
    </div>
  );
}
