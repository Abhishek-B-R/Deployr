// app/api/deploy/route.ts
import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(req: NextRequest) {
  const { data } = await req.json()
  const repoURL = data.repoURL
  const email = data.email[0].emailAddress

  const buildScriptPath = path.join(process.cwd(), "scripts/docker-build.ts")

  const subprocess = spawn("ts-node", [buildScriptPath, repoURL, email], {
    stdio: "inherit",
    env: process.env,
  })

  // Optional: handle exit/failures
  subprocess.on("exit", (code) => {
    console.log(`🚀 Build script exited with code ${code}`)
  })

  return NextResponse.json(
    {
      message: "Build started",
      repo: repoURL,
    },
    { status: 202 }
  )
}
