import React from "react";
import { Zap, Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neo-black text-neo-white pt-24 pb-12 px-6 border-t-4 border-neo-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-neo-yellow p-1 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <Zap className="w-5 h-5 text-neo-black" fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              deployr.
            </span>
          </div>
          <p className="text-gray-400 max-w-md font-medium text-lg">
            The open-source deployment platform for the rest of us. Deploy
            static sites and frontend frameworks in seconds, not minutes.
            <br />
            <br />
            Built with ❤️ and too much coffee.
          </p>
        </div>

        {/* Simplified columns for a free tool */}
        <div>
          <h4 className="font-bold text-neo-green mb-6 text-lg uppercase tracking-wider border-b-2 border-neo-green inline-block">
            Platform
          </h4>
          <ul className="space-y-3 font-medium text-gray-300">
            <li>
              <a
                href="#howitworks"
                className="hover:text-neo-yellow hover:translate-x-1 inline-block transition-all"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href="#frameworks-supported"
                className="hover:text-neo-yellow hover:translate-x-1 inline-block transition-all"
              >
                Supported Frameworks
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-neo-pink mb-6 text-lg uppercase tracking-wider border-b-2 border-neo-pink inline-block">
            Community
          </h4>
          <ul className="space-y-3 font-medium text-gray-300">
            <li>
              <a
                href="https://github.com/Abhishek-B-R"
                className="hover:text-neo-yellow hover:translate-x-1 inline-block transition-all"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/abhishekbr01"
                className="hover:text-neo-yellow hover:translate-x-1 inline-block transition-all"
              >
                Discord
              </a>
            </li>
            <li>
              <a
                href="https://x.com/abhi__br"
                className="hover:text-neo-yellow hover:translate-x-1 inline-block transition-all"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t-2 border-gray-800 pt-8 gap-6">
        <p className="text-gray-500 font-mono text-sm">
          © 2024 Deployr OSS. MIT License.
        </p>
        <div className="flex gap-4">
          <div
            onClick={() => {
              window.open(
                "https://github.com/Abhishek-B-R",
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="p-3 bg-white text-black border-2 border-black hover:bg-neo-yellow hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] cursor-pointer transition-all"
          >
            <Github size={20} />
          </div>
          <div 
            onClick={() => {
              window.open(
                "https://x.com/abhi__br",
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="p-3 bg-white text-black border-2 border-black hover:bg-neo-blue hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] cursor-pointer transition-all">
            <Twitter size={20} />
          </div>
        </div>
      </div>
    </footer>
  );
}
