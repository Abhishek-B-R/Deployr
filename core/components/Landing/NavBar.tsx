"use client";

import { ChevronDown, GithubIcon, Rocket } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

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
                {session.status === "authenticated" ?  
                (<>
                    <Button size="sm" onClick={()=>router.push("/dashboard")}>
                    Dashboard
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm">
                                Add New... <ChevronDown/>    
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild onClick={()=>router.push("/new")}>
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                    Project
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild onClick={()=>{
                                window.open('https://github.com/new', '_blank', 'noopener,noreferrer');
                            }}>
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                    Repository
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>):
                (<>
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                    Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                    How it Works
                    </Link>
                </>)}
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
            </nav>
            </div>
        </header>
    )
};