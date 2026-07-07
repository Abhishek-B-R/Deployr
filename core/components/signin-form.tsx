"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import {
  Github,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { NeoButton, NeoCard } from "@/components/neo-ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const demoPassword = "trial_approved";

  const handleCopyDemoPassword = async () => {
    await navigator.clipboard.writeText(demoPassword);
    setIsPasswordCopied(true);
    window.setTimeout(() => setIsPasswordCopied(false), 2500);
    toast({
      title: "Password copied",
      description: "The demo access password is ready to paste.",
    });
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    setError("");

    try {
      await signIn("github", {
        callbackUrl,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to authenticate with GitHub");
      toast({
        title: "GitHub Authentication Failed",
        description:
          "There was an error connecting to GitHub. Please try again.",
        variant: "destructive",
      });
      setIsGithubLoading(false);
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("❌ Access Denied – Wrong password");
        toast({
          title: "Authentication Failed",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
      } else if (res?.ok) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully authenticated.",
        });
        router.push(callbackUrl);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NeoCard className="bg-white p-8 relative overflow-visible transform hover:rotate-0 transition-transform duration-300">
      {/* Decorative Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neo-yellow px-4 py-1 border-2 border-neo-black shadow-sm transform -rotate-2 z-20">
        <span className="font-black text-xs uppercase tracking-widest">
          Auth Required
        </span>
      </div>

      <div className="space-y-6 mt-4">
        {/* GitHub Button */}
        <button
          onClick={handleGithubLogin}
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
            <span className="bg-white px-2 text-gray-400 font-bold tracking-widest">
              Or continue with
            </span>
          </div>
        </div>

        <div className="p-3 bg-neo-blue/20 border-4 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide">
              Interviewer demo access
            </p>
            <p className="mt-1 text-sm font-bold">
              Password to bypass auth:{" "}
              <span className="font-mono bg-yellow-400 p-[2]">{demoPassword}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyDemoPassword}
            className="shrink-0 border-2 border-neo-black bg-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            aria-label="Copy demo password"
          >
            {isPasswordCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-500 ml-1">
              Password
            </label>
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
            className="w-full h-12 mt-4 text-base text-black hover:bg-yellow-400 hover:text-white"
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
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline decoration-2 decoration-neo-yellow text-black font-bold"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline decoration-2 decoration-neo-yellow text-black font-bold"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </NeoCard>
  );
}
