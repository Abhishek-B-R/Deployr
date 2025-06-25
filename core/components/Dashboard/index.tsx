import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import RepositoryList from "./repository-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Rocket } from "lucide-react"
import Link from "next/link"
import ModelRender from "./template-showcase"

export default async function AddNew() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <span className="text-white font-bold text-sm"><Rocket/></span>
            </div>
            <span className="text-xl font-bold">Deployr</span>
          </Link>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-2">
                <img src={session.user?.image || ""} alt={session.user?.name || ""} className="w-8 h-8 rounded-full" />
                <span className="text-sm">{session.user?.name}</span>
              </div>
            ) : (
              <Button asChild>
                <Link href="/api/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Let&apos;s build something new.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To deploy a new Project, import an existing Git Repository.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-20 ">
            {/* Import Repository Section */}
            <div className="space-y-6">
              {session ? (
                <Suspense fallback={<RepositoryListSkeleton />}>
                  <RepositoryList />
                </Suspense>
              ) : (
                <Card className="w-full">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-semibold mb-4">Import Git Repository</h2>
                    <p className="text-muted-foreground mb-6">
                      Select a Git provider to import an existing project from a Git Repository.
                    </p>
                    <div className="space-y-3">
                      <Button asChild className="w-full justify-start" variant="outline">
                        <Link href="/api/auth/signin?callbackUrl=/new">
                          <Github className="w-5 h-5 mr-3" />
                          Continue with GitHub
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Templates Section */}
            <div className="">
              <ModelRender />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function RepositoryListSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
