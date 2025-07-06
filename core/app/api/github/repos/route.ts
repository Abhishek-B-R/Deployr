import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = await request.nextUrl.searchParams;
    const page = await searchParams.get("page") || "1";
    const per_page = await searchParams.get("per_page") || "30";
    const sort = await searchParams.get("sort") || "updated";

    const url = `https://api.github.com/user/repos?page=${page}&per_page=${per_page}&sort=${sort}&type=all`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Deployr-App",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter out repos already deployed
    const undeployedRepos = [];

    for (const repo of data) {
      const repoUrl = `https://github.com/${repo.full_name}`;
      const found = await prisma.project.findFirst({
        where: { repo_url: repoUrl },
      });
      if (!found) {
        undeployedRepos.push(repo);
      }
    }

    return NextResponse.json(undeployedRepos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
