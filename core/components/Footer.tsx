"use client";
import { LinkedinIcon, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-12 bg-white dark:bg-slate-900 text-black dark:text-white flex justify-center">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="flex items-center justify-center w-8 h-8 bg-linear-to-br from-blue-500 to-gray-600 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Deployr</span>
            <div className="md:hidden flex justify-center gap-3">
              <Medias />
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-slate-900">
            <div className="hidden md:flex md:justify-center gap-3">
              <Medias />
            </div>
            <span className="dark:text-white">Made with ❤️ for developers</span>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Deployr. A side project by Abhishek BR
          </p>
        </div>
      </div>
    </footer>
  );
}

function Medias() {
  return (
    <>
      <Button
        className="cursor-pointer bg-white  dark:bg-white text-black hover:bg-gray-300"
        onClick={() => {
          window.open(
            "https://www.linkedin.com/in/abhishek-b-r-b232ba2a2/",
            "_blank",
            "noopener,noreferrer"
          );
        }}
      >
        <LinkedinIcon />
      </Button>
      <Button
        className="cursor-pointer bg-white  dark:bg-white text-black hover:bg-gray-300"
        onClick={() => {
          window.open(
            "https://x.com/AbhiCodes01",
            "_blank",
            "noopener,noreferrer"
          );
        }}
      >
        <Image
          src="/x.svg"
          alt="X Logo"
          width={20}
          height={20}
          className="inline-block"
        />
      </Button>
    </>
  );
}
