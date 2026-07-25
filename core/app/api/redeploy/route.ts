import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/db";

type BodyData = {
  repository: string;
  branch: string;
  projectName: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { repository, branch, projectName }: BodyData = body;

    // Validate required fields
    if (!repository || !branch || !projectName) {
      return NextResponse.json(
        { error: "Missing required fields: repository, branch, projectName" },
        { status: 400 },
      );
    }

    // Create project in database using your schema
    const project = await prisma.project.findFirst({
      where: {
        name: projectName,
        user: { email: session.user.email },
      },
    });

    if (!project || !project.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Prepare data for backend
    const backendPayload = {
      id: project.id,
      repository,
      branch,
      session,
    };

    // Send to your backend
    try {
      // const backendResponse = await fetch("http://localhost:8080/deploy", {
      const backendResponse = await fetch(
        "https://api.deployr.abhishekbr.dev/deploy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.INTERNAL_SECRET ?? "",
          },
          body: JSON.stringify(backendPayload),
        },
      );

      if (!backendResponse.ok) {
        // Update project status to failed if backend call fails
        await prisma.project.update({
          where: { id: project.id },
          data: {
            status: "BUILD_FAILED", // Using your enum value
            logs: `Backend deployment failed: ${backendResponse.status} ${backendResponse.statusText}`,
          },
        });

        const errorText = await backendResponse.text();
        console.error("Backend deploy error response:", errorText);
        throw new Error(`Backend deployment failed: ${backendResponse.status}`);
      }

      const backendResult = await backendResponse.json();

      // Update project with any additional info from backend
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: "BUILDING", // Using your enum value
          logs: "Deployment started successfully",
        },
      });

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          name: project.name,
          slug: project.slug,
          status: project.status,
        },
        backendResponse: backendResult,
      });
    } catch (backendError) {
      console.error("Backend deployment error:", backendError);

      // Update project status to failed
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: "BUILD_FAILED", // Using your enum value
          logs: `Backend deployment error: ${backendError instanceof Error ? backendError.message : "Unknown error"}`,
        },
      });

      return NextResponse.json(
        {
          error: "Deployment failed",
          details:
            backendError instanceof Error
              ? backendError.message
              : "Unknown error",
          project: {
            id: project.id,
            name: project.name,
            slug: project.slug,
            status: "BUILD_FAILED",
          },
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Deployment error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
