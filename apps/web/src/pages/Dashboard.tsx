import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Share,
  Chrome,
  ExternalLink,
  Calendar,
  BarChart3,
  Clock,
  BookOpen,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [userName] = useState("Alex Chen");

  // Mock data
  const recentReports = [
    {
      id: 1,
      date: "Today",
      title: "React Performance Optimization",
      summary:
        "Learned about React.memo, useMemo, and useCallback optimizations",
      sites: ["react.dev", "web.dev", "stackoverflow.com"],
      readTime: "12 min",
    },
    {
      id: 2,
      date: "Yesterday",
      title: "TypeScript Advanced Types",
      summary:
        "Deep dive into conditional types, mapped types, and template literals",
      sites: ["typescriptlang.org", "github.com"],
      readTime: "18 min",
    },
    {
      id: 3,
      date: "Dec 29, 2024",
      title: "Next.js App Router",
      summary:
        "Understanding Server Components, layouts, and new routing paradigms",
      sites: ["nextjs.org", "vercel.com"],
      readTime: "25 min",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Hey {userName}, here's what you've learned recently.
          </h1>
          <p className="text-muted-foreground">
            Track your learning journey and never lose important insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">23 articles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Reading Time</p>
                  <p className="text-2xl font-bold">4.2 hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">12 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notes">My Notes</TabsTrigger>
            <TabsTrigger value="extension">Add Extension</TabsTrigger>
            <TabsTrigger value="plan">My Plan</TabsTrigger>
            <TabsTrigger value="insights" disabled>
              Insights
            </TabsTrigger>
          </TabsList>

          {/* My Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Learning Reports</h2>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>

            <div className="space-y-4">
              {recentReports.map((report) => (
                <Card
                  key={report.id}
                  className="border-0 shadow-soft hover:shadow-medium transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {report.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {report.date} • {report.readTime} read
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {report.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {report.sites.map((site) => (
                        <Badge
                          key={site}
                          variant="secondary"
                          className="text-xs"
                        >
                          {site}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Extension Tab */}
          <TabsContent value="extension" className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Chrome className="mr-2 h-5 w-5" />
                  Install Track It Extension
                </CardTitle>
                <CardDescription>
                  Track your learning across the web with our privacy-first
                  Chrome extension.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Step-by-step Setup:</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                        1
                      </span>
                      <div>
                        <p className="font-medium">Install the extension</p>
                        <p className="text-muted-foreground">
                          Click the button below to add Track It to Chrome
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Grant permissions</p>
                        <p className="text-muted-foreground">
                          Allow access to sites you want to track
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Start learning</p>
                        <p className="text-muted-foreground">
                          Browse dev sites normally - we'll handle the rest!
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="flex space-x-4">
                  <Button variant="hero" className="flex items-center">
                    <Chrome className="mr-2 h-4 w-4" />
                    Add to Chrome
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">View Demo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan" className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Current Plan: Free</CardTitle>
                <CardDescription>
                  You're on the free plan with basic tracking features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-sm text-muted-foreground">
                      Websites tracked
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">Daily</p>
                    <p className="text-sm text-muted-foreground">
                      Summary frequency
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">7 days</p>
                    <p className="text-sm text-muted-foreground">
                      Data retention
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="hero">Upgrade to Pro</Button>
                  <Button variant="outline">View All Plans</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab (Disabled) */}
          <TabsContent value="insights">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Insights Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  Advanced analytics and learning insights will be available in
                  a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
