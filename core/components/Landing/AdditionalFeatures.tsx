import { BarChart3, Shield, Users } from "lucide-react";
import { Badge } from "../ui/badge";

export default function AdditionalFeatures() {
    return (
    <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Advanced Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for modern frontend development</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">SSL & Security</h4>
                    <p className="text-muted-foreground text-sm">
                      Automatic SSL certificates and secure HTTPS for all your deployments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Performance Analytics</h4>
                    <p className="text-muted-foreground text-sm">
                      Track your site&apos;s performance and user engagement metrics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Team Collaboration</h4>
                    <p className="text-muted-foreground text-sm">
                      Invite team members and manage deployment permissions easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-2xl border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Deployment Dashboard</h3>
                    <Badge variant="secondary">Live</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">my-react-app</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">portfolio-site</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Building...</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">vue-dashboard</span>
                      </div>
                      <span className="text-sm text-muted-foreground">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
};
