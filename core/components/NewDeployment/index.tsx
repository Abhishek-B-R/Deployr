import { Suspense } from "react";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions" // Mocked for this view
import RepositoryList from "@/components/NewDeployment/repository-list";
import { NeoButton, NeoCard } from "@/components/NewDeployment/neo-ui";
import { Github, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import ModelRender from "@/components/NewDeployment/ModelRender";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default async function AddNew() {
  // Mock session for visual purposes since we can't run the server logic here
  const session = await getServerSession();

  return (
    <div className="min-h-screen w-full bg-neo-bg font-sans selection:bg-neo-yellow selection:text-black">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="w-full max-w-full mx-auto px-4 md:px-6 pt-20 sm:pt-24 md:pt-28 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative mb-16 text-center">
            <div className="inline-block relative">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-black leading-tight">
                LET'S BUILD
                <br />
                <span
                  className="text-transparent text-3xl sm:text-5xl md:text-7xl"
                  style={{ WebkitTextStroke: "2px #1A1A1A" }}
                >
                  SOMETHING NEW
                </span>
              </h1>
            </div>
            <div className="w-24 h-2 bg-neo-black mx-auto mb-6"></div>
            <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
              Import a repository to deploy your frontend. <br />
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* Left Column: Import Section */}
            <div className="space-y-6 w-full relative z-10">
              <div className="absolute left-0 lg:-left-4 top-0 lg:-top-4 w-full h-full bg-black/5 border-2 border-black/10 -z-10 pointer-events-none"></div>

              {session ? (
                <Suspense fallback={<RepositoryListSkeleton />}>
                  <RepositoryList />
                </Suspense>
              ) : (
                <NeoCard className="w-full text-center py-12">
                  <div className="w-16 h-16 bg-neo-black text-white mx-auto mb-6 border-2 border-black shadow-neo-sm">
                    <Github className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-black mb-4 uppercase">
                    Access Required
                  </h2>
                  <p className="font-medium text-gray-600 mb-8 max-w-md mx-auto">
                    Connect your GitHub account to access your repositories and
                    start deploying.
                  </p>
                  <Link href="/api/auth/signin?callbackUrl=/new">
                    <NeoButton className="w-full max-w-xs">
                      <Github className="w-5 h-5 mr-3" />
                      Continue with GitHub
                    </NeoButton>
                  </Link>
                </NeoCard>
              )}
            </div>

            {/* Right Column: 3D Preview */}
            <div className="relative hidden md:block">
              <ModelRender />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RepositoryListSkeleton() {
  return (
    <NeoCard className="w-full h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-neo-black border-t-neo-yellow rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold font-mono uppercase text-black">
          Loading Repos...
        </p>
      </div>
    </NeoCard>
  );
}
