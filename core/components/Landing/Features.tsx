import { Brain, Globe, Monitor, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export default function Features() {
    return (
        <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to deploy with confidence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make frontend deployment simple, fast, and reliable for developers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200 dark:hover:border-blue-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">One-Click Deploy</h3>
                <p className="text-muted-foreground text-sm">
                  From repository to live site in seconds. Zero configuration required for popular frameworks.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-200 dark:hover:border-green-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Preview Links</h3>
                <p className="text-muted-foreground text-sm">
                  Shareable preview URLs for every deployment and pull request. Perfect for client reviews.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-200 dark:hover:border-purple-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Build Detection</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically detects React, Vue, Angular, and other frameworks. Optimizes builds automatically.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-orange-200 dark:hover:border-orange-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Deployment Logs</h3>
                <p className="text-muted-foreground text-sm">
                  Real-time visibility into your deployment process with detailed build logs and error reporting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    )
};
