import { ArrowRight, CheckCircle, Play, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function Hero({isVisible}: { isVisible: boolean }) {
    return (
        <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Deploy frontend projects in seconds
            </Badge>
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Deploy Your Frontend
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Projects Easily
              </span>
            </h1>
            <p
              className={`mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Streamline your frontend deployment process with zero configuration. From repository to live site in
              seconds.
            </p>
            <div
              className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Button size="lg" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Free tier available
              </div>
            </div>
          </div>
        </div>
      </section>
    )
};
