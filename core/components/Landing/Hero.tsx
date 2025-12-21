import { useRef } from "react";
import { ArrowRight, CreditCard, DollarSign, Github, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import FileSVG from "./SVG/FileSVG";
import GithubSVG from "./SVG/Github";
import JsSvg from "./SVG/JS";
import { useRouter } from "next/navigation";

export default function Hero({ isVisible }: { isVisible: boolean }) {
  const ref = useRef(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-32 pb-0 w-full flex flex-col items-center justify-center bg-neo-bg border-b-4 border-neo-black min-h-[90vh]"
    >
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* --- Floating Sticker: Arrow Box (Top Left) --- */}
      <motion.div
        className="absolute top-32 left-[5%] lg:left-[10%] hidden lg:block cursor-grab active:cursor-grabbing z-10"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1, rotate: 0 }}
      >
        <FileSVG />
      </motion.div>

      {/* --- Floating Sticker: Github Icon (Bottom Left) --- */}
      <motion.div
        className="absolute top-40 right-[5%] hidden lg:block cursor-grab active:cursor-grabbing z-10"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        animate={{ rotate: [0, -5, 5, 0], y: [0, 15, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        whileHover={{ scale: 1.1, rotate: 0 }}
      >
        <GithubSVG />
      </motion.div>

      {/* --- Floating Sticker: JS Icon (Bottom Right) --- */}
      <motion.div
        className="absolute bottom-40 right-[10%] hidden lg:block cursor-grab active:cursor-grabbing z-10"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        animate={{ rotate: [0, -5, 5, 0], y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1, rotate: 0 }}
      >
        <JsSvg />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          {/* Version Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-8 cursor-default"
          >
            <div className="bg-white border-2 border-neo-black px-4 py-1 shadow-neo flex items-center gap-2 font-mono font-bold text-sm transform -rotate-2">
              <span className="w-2 h-2 bg-neo-green rounded-full animate-pulse border border-black"></span>
              completely self-hostable
            </div>
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.85] text-neo-black mb-8 select-none">
            <span className="font-sans italic tracking-normal block mb-4">
              DEPLOY YOUR
            </span>
            <span className="relative inline-block mt-2 md:mt-4">
              <span className="relative z-10 text-neo-black">
                FRONTENDS EASILY
              </span>
              <span
                className="absolute top-1 left-1 md:top-2 md:left-2 -z-10 text-transparent w-full h-full"
                style={{ WebkitTextStroke: "2px #54A0FF" }}
              >
                FRONTENDS EASILY
              </span>
              <svg
                className="absolute -bottom-4 w-[110%] -left-[5%] h-6 text-neo-yellow z-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 15 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-10 text-xl md:text-2xl font-medium text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Deploy projects in seconds.
            <span className="bg-neo-yellow px-1 border border-black mx-1 font-bold shadow-sm">
              Zero config
            </span>
            , unlimited hobby projects, and pure adrenaline.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{
                x: 4,
                y: 4,
                boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-neo-yellow text-neo-black text-xl font-bold px-10 py-5 border-4 border-neo-black shadow-neo-lg transition-all"
              onClick={()=>router.push("/new")}
            >
              <span className="flex items-center gap-3 uppercase tracking-wider">
                Start Deploying
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{
                x: 4,
                y: 4,
                boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
              }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white text-neo-black text-xl font-bold px-10 py-5 border-4 border-neo-black shadow-neo-lg transition-all cursor-pointer"
              onClick={() => {
                window.open(
                  "https://www.github.com/Abhishek-B-R/Deployr",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <span className="flex items-center gap-3 uppercase tracking-wider">
                <Github className="w-6 h-6" />
                Star on GitHub
              </span>
            </motion.button>
          </div>

          {/* Trust Badges - FREE CONTEXT */}
          <div className="mt-20 pt-8 border-t-2 border-dashed border-gray-400 flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-bold opacity-100">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="bg-neo-black text-white p-1.5 border border-black group-hover:bg-neo-pink group-hover:text-black transition-colors">
                <DollarSign size={14} strokeWidth={3} />
              </div>
              <span className="uppercase tracking-wide">Always Free</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <div className="bg-neo-black text-white p-1.5 border border-black group-hover:bg-neo-blue group-hover:text-black transition-colors">
                <Github size={14} strokeWidth={3} />
              </div>
              <span className="uppercase tracking-wide">Open Source</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <div className="bg-neo-black text-white p-1.5 border border-black group-hover:bg-neo-yellow group-hover:text-black transition-colors">
                <CreditCard size={14} strokeWidth={3} />
              </div>
              <span className="uppercase tracking-wide">No Credit Card</span>
            </div>
          </div>
        </motion.div>
      </div>
      <div id="frameworks-supported" />

      {/* Marquee Ticker */}
      <div className="absolute bottom-0 left-0 w-full bg-neo-yellow border-t-4 border-neo-black py-3 overflow-hidden whitespace-nowrap z-20">
        <motion.div
          className="inline-block text-xl font-black uppercase tracking-widest"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <span className="mx-8">Deployed in Seconds</span> •
          <span className="mx-8">React</span> •<span className="mx-8">Vue</span>{" "}
          <span className="mx-8">Svelte</span> •
          <span className="mx-8">Angular</span> •
          <span className="mx-8">Vue</span> •
          <span className="mx-8">Static</span> •
          <span className="mx-8">Deployed in Seconds</span> •
          <span className="mx-8">React</span> •<span className="mx-8">Vue</span>{" "}
          <span className="mx-8">Svelte</span> •
          <span className="mx-8">Angular</span> •
          <span className="mx-8">Vue</span> •
          <span className="mx-8">Static</span> •
          <span className="mx-8">React</span> •<span className="mx-8">Vue</span>{" "}
          <span className="mx-8">Svelte</span> •
          <span className="mx-8">Angular</span> •
          <span className="mx-8">Vue</span> •
          <span className="mx-8">Static</span> •
        </motion.div>
      </div>
    </section>
  );
}
