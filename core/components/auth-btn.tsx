'use client'

import { motion } from 'framer-motion'
import { Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

interface AuthButtonProps {
  session: {
    status: string
    data: {
      user?: {
        name?: string | null
        email?: string | null
        image?: string | null
      }
    } | null
  },
  className?:string
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function AuthButton({ session,className }: AuthButtonProps) {
  const router = useRouter()

  if (session.status === 'authenticated' && session.data?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="relative h-10 w-10 rounded-full border-3 border-neo-black shadow-neo-sm hover:shadow-neo transition-all cursor-pointer bg-white"
          >
            <Avatar className="h-full w-full">
              <AvatarImage
                src={session.data.user.image || ''}
                alt={session.data.user.name || ''}
                className="object-cover"
              />
              <AvatarFallback className="bg-neo-yellow text-neo-black font-bold">
                {getInitials(
                  session.data.user.name ||
                    session.data.user.email ||
                    'U'
                )}
              </AvatarFallback>
            </Avatar>
          </motion.button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent
          className="w-64 border-3 border-neo-black shadow-neo-lg bg-white p-0 mt-2"
          align="end"
          sideOffset={8}
        >
          {/* User Info Section */}
          <div className="flex items-center gap-3 p-4 border-b-3 border-neo-black">
            <Avatar className="h-12 w-12 border-2 border-neo-black">
              <AvatarImage
                src={session.data.user.image || ''}
                alt={session.data.user.name || ''}
              />
              <AvatarFallback className="bg-neo-blue text-black font-bold">
                {getInitials(
                  session.data.user.name ||
                    session.data.user.email ||
                    'U'
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 overflow-hidden">
              {session.data.user.name && (
                <p className="font-bold text-sm truncate text-black">
                  {session.data.user.name}
                </p>
              )}
              {session.data.user.email && (
                <p className="text-xs text-gray-600 truncate">
                  {session.data.user.email}
                </p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-none hover:bg-neo-yellow border-2 border-transparent hover:border-neo-black font-medium mb-1"
            >
              <Link href="/settings" className="flex items-center px-3 py-2 text-black">
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-neo-black h-0.5 my-2" />

            <DropdownMenuItem
              className="cursor-pointer rounded-none hover:bg-red-100 border-2 border-transparent hover:border-neo-black font-medium text-red-600"
              onClick={() => signOut()}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Not authenticated - show Sign In button
  return (
    <motion.button
      whileTap={{ 
        x: 2, 
        y: 2,
        boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
      }}
      className={cn("bg-white text-neo-black font-bold px-6 py-2 border-3 border-neo-black shadow-neo hover:shadow-neo-sm transition-all cursor-pointer uppercase tracking-wider text-sm",className)}
      onClick={() => router.push('/signin')}
    >
      Sign In
    </motion.button>
  )
}