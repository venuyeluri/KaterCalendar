import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, efficient catering management in three easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-card-border rounded-xl p-8 hover-elevate">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">For Caterers</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <span className="text-muted-foreground">Create your menu items with photos and descriptions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <span className="text-muted-foreground">Publish menus for specific dates on the calendar</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <span className="text-muted-foreground">Track orders and prepare meals efficiently</span>
              </li>
            </ul>
            <Link href="/dashboard">
              <Button className="w-full" data-testid="button-caterer-dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-8 hover-elevate">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">For Customers</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <span className="text-muted-foreground">Browse available menu dates on the calendar</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <span className="text-muted-foreground">Select your favorite dishes and quantities</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <span className="text-muted-foreground">Place your order and enjoy delicious meals</span>
              </li>
            </ul>
            <Link href="/order">
              <Button className="w-full" data-testid="button-browse-menus">
                <Calendar className="mr-2 h-5 w-5" />
                Browse Menus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
