import { useRef, useState, useEffect } from "react";
import { Shield, Globe, Cpu, Settings } from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function AdditionalFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Typing effect for the terminal
  const [text, setText] = useState("");
  const fullText = "> git push origin main";
  
  useEffect(() => {
    if (isInView) {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section ref={ref} className="py-24 bg-neo-bg relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             animate={isInView ? { opacity: 1, x: 0 } : {}}
             transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-neo-pink border-2 border-black px-3 py-1 font-bold text-xs mb-6 shadow-neo-sm">
                UNDER THE HOOD
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              A complete pipeline <br />
              <span className="bg-neo-blue px-2 text-white border-2 border-black shadow-neo inline-block transform -rotate-1 mt-2">in a single box</span>.
            </h2>
            <p className="text-lg font-medium text-gray-700 mb-8 border-l-4 border-neo-yellow pl-4">
              We handle the complex infrastructure. You just push code. 
              It’s like having a DevOps team in your pocket, but free.
            </p>

<div className="grid gap-4">
  <div className="bg-white p-4 border-2 border-black shadow-neo-sm flex items-start gap-4">
    <div className="bg-neo-green p-2 border border-black">
      <Shield size={20}/>
    </div>
    <div>
      <h4 className="font-bold">Automatic SSL</h4>
      <p className="text-sm text-gray-600">
        Every deployment gets HTTPS automatically with zero setup.
      </p>
    </div>
  </div>

  <div className="bg-white p-4 border-2 border-black shadow-neo-sm flex items-start gap-4">
    <div className="bg-neo-blue p-2 border border-black">
      <Globe size={20}/>
    </div>
    <div>
      <h4 className="font-bold">Fast Global Delivery</h4>
      <p className="text-sm text-gray-600">
        Deployed assets are served through a reliable CDN for quick worldwide access.
      </p>
    </div>
  </div>

  <div className="bg-white p-4 border-2 border-black shadow-neo-sm flex items-start gap-4">
    <div className="bg-neo-yellow p-2 border border-black">
      <Settings size={20}/>
    </div>
    <div>
      <h4 className="font-bold">Environment Variables</h4>
      <p className="text-sm text-gray-600">
        Secure, encrypted configuration for all your builds.
      </p>
    </div>
  </div>
</div>

          </motion.div>

          {/* Right Content - Retro Window UI */}
          <motion.div
             initial={{ opacity: 0, x: 50 }}
             animate={isInView ? { opacity: 1, x: 0 } : {}}
             transition={{ duration: 0.8 }}
             className="relative"
          >
            {/* The Window Frame */}
            <div className="bg-[#1a1a1a] border-4 border-neo-black shadow-neo-lg rounded-none overflow-hidden text-white font-mono text-sm">
                {/* Window Header */}
                <div className="bg-[#333] border-b-2 border-[#555] p-2 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="font-bold opacity-50">user@deployr:~</div>
                    <div className="w-4"></div>
                </div>

                {/* Window Body */}
                <div className="p-6 min-h-[300px] flex flex-col">
                    <div className="mb-4 text-green-400 font-bold">
                        {text}<span className="animate-pulse">_</span>
                    </div>

                    {text.length === fullText.length && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-1"
                        >
                            <div className="text-white">Enumerating objects: 15, done.</div>
                            <div className="text-white">Counting objects: 100% (15/15), done.</div>
                            <div className="text-white">Compressing objects: 100% (12/12), done.</div>
                            <div className="text-gray-400 mt-2">remote: Resolving deltas: 100% (3/3), done.</div>
                            <div className="text-neo-yellow mt-2">remote: Building project...</div>
                            <div className="text-neo-yellow">remote: Detected Vite app</div>
                            <div className="text-neo-green mt-3 font-bold">remote: Deployment complete! 🚀</div>
                            <div className="text-white mt-1">
                                To https://github.com/user/project.git
                                <br/>
                                <span className="text-gray-400">   9283a..b312  main -{'>'} main</span>
                            </div>
                            
                            <div className="mt-4 p-2 border border-gray-700 bg-gray-900 rounded text-neo-blue">
                                https://project-v2.deployr.live
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
            
            {/* Decorative element behind */}
            <div className="absolute -z-10 top-4 -right-4 w-full h-full bg-neo-green border-4 border-black pattern-dots"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}