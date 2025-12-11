"use client";

import { useState } from "react";
import { Github, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { NeoButton, NeoCard } from "@/components/neo-ui";
import { useRouter } from "next/navigation";

// Mock Sign In for Preview
const mockSignIn = async (provider: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock redirect
            window.location.href = "/projects"; 
            resolve(true);
        }, 1500);
    });
};

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    await mockSignIn("github");
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await mockSignIn("credentials");
  };

  return (
    <NeoCard className="bg-white p-8 relative overflow-visible transform hover:rotate-0 transition-transform duration-300">
        
      {/* Decorative Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neo-yellow px-4 py-1 border-2 border-neo-black shadow-sm transform -rotate-2 z-20">
        <span className="font-black text-xs uppercase tracking-widest">Auth Required</span>
      </div>

      <div className="space-y-6 mt-4">
        {/* GitHub Button */}
        <button
          onClick={handleGithubSignIn}
          disabled={isLoading}
          className="w-full bg-neo-black text-white h-14 font-bold text-lg border-4 border-neo-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
        >
          <Github className="w-6 h-6" />
          <span>Continue with GitHub</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-500 ml-1">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-12 pl-12 pr-4 border-4 border-neo-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(84,160,255,1)] transition-all placeholder:text-gray-300"
                    required
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-500 ml-1">Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-12 pr-4 border-4 border-neo-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(84,160,255,1)] transition-all placeholder:text-gray-300"
                    required
                />
            </div>
          </div>

          <NeoButton 
            variant="primary" 
            className="w-full h-12 mt-4 text-base text-black hover:bg-blue-600 hover:text-white"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
                "AUTHENTICATING..."
            ) : (
                <>
                    Sign In <ArrowRight className="w-5 h-5 ml-2" />
                </>
            )}
          </NeoButton>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-3 bg-gray-50 border-2 border-dashed border-gray-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-gray-500">
            By clicking continue, you agree to our <a href="#" className="underline decoration-2 decoration-neo-yellow text-black font-bold">Terms of Service</a> and <a href="#" className="underline decoration-2 decoration-neo-yellow text-black font-bold">Privacy Policy</a>.
        </p>
      </div>
    </NeoCard>
  );
}
