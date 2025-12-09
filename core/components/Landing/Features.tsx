import { useRef } from "react";
import { Zap, Globe, Brain, Monitor, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Features() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Zap,
      title: "One-Click Deploy",
      description:
        "Push to main. We handle the rest. From local to global in seconds.",
      bg: "bg-neo-blue",
      offset: "translate-y-0",
    },
    {
      icon: Globe,
      title: "Instant Previews",
      description:
        "Every commit gets a unique URL. Share with your team instantly.",
      bg: "bg-neo-green",
      offset: "lg:translate-y-12",
    },
    {
      icon: Brain,
      title: "Framework Aware",
      description:
        "Zero config. We automatically detect Next.js, Vue, Astro, and more.",
      bg: "bg-neo-pink",
      offset: "translate-y-0",
    },
    {
      icon: Monitor,
      title: "Live Build Logs",
      description:
        "Real-time streaming logs. Fix build errors before you blink.",
      bg: "bg-neo-yellow",
      offset: "lg:translate-y-12",
    },
  ];

  return (
    <section
      ref={ref}
      id="features"
      className="py-24 bg-white relative border-b-4 border-neo-black overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block bg-neo-black text-white px-4 py-1 text-sm font-bold mb-4 transform -rotate-1 shadow-neo-sm">
            DEVELOPER-FIRST WORKFLOW
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[0.9] tracking-tight">
            BUILT TO SHIP <br />
            <span className="bg-neo-yellow px-2 mt-1 border-2 border-black inline-block transform rotate-2 shadow-neo-sm">
              REAL PROJECTS
            </span>
          </h2>

          <p className="text-xl font-medium text-gray-600">
            Optimized for fast builds and smooth deployments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative ${feature.offset}`}
            >
              <div
                className={`h-full bg-neo-bg border-4 border-neo-black p-6 shadow-neo-lg group-hover:shadow-none group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-200 flex flex-col items-start`}
              >
                {/* Icon Box */}
                <div
                  className={`w-16 h-16 ${feature.bg} border-4 border-neo-black flex items-center justify-center mb-6 shadow-neo-sm group-hover:rotate-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className="w-8 h-8 text-black"
                    strokeWidth={2.5}
                  />
                </div>

                <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {feature.description}
                </p>

                {/* Corner Decoration */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-black rounded-none"></div>
                  <div className="w-1.5 h-1.5 bg-black rounded-none"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            className="bg-neo-black text-white text-lg font-bold px-12 py-4 border-4 border-transparent hover:bg-white hover:text-black hover:border-neo-black hover:shadow-neo transition-all duration-200 uppercase tracking-widest"
            onClick={() => {
              router.push("/demo.mp4");
            }}
          >
            WATCH DEMO
          </button>
        </div>
      </div>
    </section>
  );
}
