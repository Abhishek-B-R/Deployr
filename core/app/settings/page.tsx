import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/db";
import { UserSettings } from "@/components/Settings/user-settings";
import { UserSettingsSkeleton } from "@/components/Settings/user-settings-skeleton";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

async function getUserData(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      project: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  return user;
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const userData = await getUserData(session.user.email);

  if (!userData) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-cream dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <NavBar />
      <Suspense fallback={<UserSettingsSkeleton />}>
        <UserSettings user={userData} session={session} />
      </Suspense>
    </div>
  );
}
