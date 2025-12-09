import React, { useRef } from "react";
import { Github, GitBranch, Rocket } from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Github,
      number: "01",
      title: "Connect Repo",
      description:
        "Link your GitHub account via OAuth",
      color: "bg-neo-blue",
      rotate: "-rotate-2",
    },
    {
      icon: GitBranch,
      number: "02",
      title: "Auto-Build",
      description: "We detect your framework and configure the build settings.",
      color: "bg-neo-yellow",
      rotate: "rotate-2",
    },
    {
      icon: Rocket,
      number: "03",
      title: "Deploy & Share",
      description: "Get a live, secure HTTPS  URL instantly.",
      color: "bg-neo-pink",
      rotate: "-rotate-1",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-24 bg-neo-bg relative overflow-hidden border-b-4 border-neo-black"
      id="howitworks"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black mb-4">HOW IT WORKS</h2>
          <div className="w-24 h-2 bg-neo-black mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-4 bg-black -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative z-10"
            >
              <div
                className={`bg-white border-4 border-neo-black p-8 shadow-neo-lg text-center transform ${step.rotate} hover:rotate-0 transition-transform duration-300`}
              >
                <div
                  className={`w-16 h-16 ${step.color} border-4 border-neo-black rounded-full flex items-center justify-center mx-auto mb-6 relative -mt-16`}
                >
                  <step.icon className="w-8 h-8 text-black" />
                </div>

                <span className="block text-6xl font-black text-gray-200 absolute top-4 right-4 z-0 opacity-50 select-none">
                  {step.number}
                </span>

                <h3 className="text-2xl font-bold mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="font-medium text-gray-600 relative z-10">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
