"use client";

import { GithubIcon, Rocket } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
    const session = useSession();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Deployr
                </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
                <ThemeToggle />
                <Button className="cursor-pointer bg-white dark:bg-black text-black dark:text-white hover:bg-gray-300" onClick={() => {
                    window.open('https://www.github.com/Abhishek-B-R/Deployr', '_blank', 'noopener,noreferrer');
                    }
                }>
                    <GithubIcon/>
                </Button>
                {session.status==="authenticated" ? 
                    <Button variant="outline" size="sm" onClick={() => signOut()}>
                        Sign Out
                    </Button>
                :
                    <Button variant="outline" size="sm" onClick={() => signIn('github')}>
                        Sign In
                    </Button>
                }
                <Button size="sm" onClick={()=>router.push("/dashboard")}>Get Started</Button>
            </nav>
            <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <Button size="sm">Get Started</Button>
            </div>
            </div>
        </header>
    )
};