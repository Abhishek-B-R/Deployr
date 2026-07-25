import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import LenisProvider from "@/components/lenis-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const logo =
  "https://raw.githubusercontent.com/Abhishek-B-R/Deployr/main/core/public/logo.jpeg";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.deployr.abhishekbr.com"),
  title: "Deployr - Deploy Your Projects with Ease",
  description:
    "Deploy your applications effortlessly with Deployr. A powerful Vercel clone that simplifies deployment workflows, supports multiple frameworks, and provides real-time build logs. Get your projects live in minutes.",
  openGraph: {
    type: "website",
    url: "https://www.deployr.abhishekbr.com/",
    title: "Deployr - Deploy Your Projects with Ease",
    description:
      "Deploy your applications effortlessly with Deployr. A powerful Vercel clone that simplifies deployment workflows, supports multiple frameworks, and provides real-time build logs. Get your projects live in minutes.",
    images: [
      {
        url: "https://www.deployr.abhishekbr.com/imgs/Landing.png",
        width: 1200,
        height: 630,
        alt: "Deployr - Deploy Your Projects with Ease",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@abhi__br",
    creator: "@abhi__br",
    title: "Deployr - Deploy Your Projects with Ease",
    description:
      "Deploy your applications effortlessly with Deployr. A powerful Vercel clone that simplifies deployment workflows, supports multiple frameworks, and provides real-time build logs. Get your projects live in minutes.",
    images: ["https://www.deployr.abhishekbr.com/imgs/Landing.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href={logo} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            {children}
            <Analytics />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
