import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Globe,
  FileText,
  Calendar,
  Database,
  Download,
  Zap,
  Shield,
  Camera,
} from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out Track It",
      features: [
        "3 websites tracked",
        "Daily summaries",
        "7-day log retention",
        "Basic search",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
      variant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "For serious learners and developers",
      features: [
        "15+ sites tracked",
        "Daily & weekly insights",
        "30-day log retention",
        "Advanced search & filters",
        "Markdown export",
        "Priority support",
        "Custom categories",
      ],
      cta: "Start Pro Trial",
      popular: true,
      variant: "hero" as const,
    },
    {
      name: "Premium",
      price: "$24",
      period: "per month",
      description: "For teams and power users",
      features: [
        "Unlimited sites tracked",
        "Real-time notifications",
        "Unlimited retention",
        "AI-powered insights",
        "Notion sync integration",
        "Screenshot OCR",
        "Team collaboration",
        "Custom integrations",
        "24/7 priority support",
      ],
      cta: "Start Premium",
      popular: false,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as your learning journey grows. All plans
            include our privacy-first approach.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-0 shadow-soft ${plan.popular ? "shadow-large scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary">
                  <Star className="mr-1 h-3 w-3" />
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button variant={plan.variant} className="w-full" asChild>
                  <Link to="/auth">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Track Your Learning
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Website Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor learning across dev sites, documentation, and tutorials.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">AI Summaries</h3>
              <p className="text-sm text-muted-foreground">
                Get structured, searchable reports of everything you learn.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Smart Search</h3>
              <p className="text-sm text-muted-foreground">
                Find any concept you've learned instantly with powerful search.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                You control what's tracked. All data encrypted and secure.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">
                  How does the Chrome extension work?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our extension runs quietly in the background, tracking the
                  pages you visit on developer sites. It captures content with
                  your permission and sends it to our AI for processing into
                  daily summaries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">
                  Is my data private and secure?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely. You control which sites are tracked, all data is
                  encrypted, and we follow strict privacy policies. Your
                  learning data belongs to you and can be exported or deleted at
                  any time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I cancel or change my plan anytime?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade, downgrade, or cancel your subscription
                  at any time. There are no long-term commitments or
                  cancellation fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">
            Ready to start tracking your learning?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers who never lose track of what they've
            learned.
          </p>
          <Button size="lg" variant="hero" asChild>
            <Link to="/auth">Start Free Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
