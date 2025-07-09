import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import RepositoryList from "./repository-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github } from "lucide-react"
import Link from "next/link"
import ModelRender from "./ModelRender"
import NavBar from "../NavBar"
import Footer from "../Footer"

export default async function AddNew() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen px-16 min-w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="container py-12 2xl:pl-40">
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
            <div className="space-y-6 w-[500px] xl:pr-10">
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
            <div className="radial-gradient(circle at center, #f3f4f6, #e5e7eb) border-2 dark:bg-[radial-gradient(circle_at_center,_#1e293b,_#0f172a)] rounded-xl shadow-inner max-h-[580px]">
              <ModelRender />
            </div>
          </div>
        </div>
      </main>
      <Footer/>
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
