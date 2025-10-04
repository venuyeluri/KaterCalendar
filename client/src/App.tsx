import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChefHat } from "lucide-react";
import HomePage from "@/pages/HomePage";
import CustomerOrderPage from "@/pages/CustomerOrderPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/order" component={CustomerOrderPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <Link href="/">
                    <a className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg" data-testid="link-home">
                      <ChefHat className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl">CaterCalendar</span>
                    </a>
                  </Link>

                  <nav className="hidden md:flex items-center gap-6">
                    <Link href="/order">
                      <a className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-order">
                        Browse Menus
                      </a>
                    </Link>
                    <Link href="/dashboard">
                      <a className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-dashboard">
                        Dashboard
                      </a>
                    </Link>
                  </nav>

                  <ThemeToggle />
                </div>
              </div>
            </header>

            <main className="flex-1">
              <Router />
            </main>

            <footer className="border-t border-border bg-card mt-24">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ChefHat className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl">CaterCalendar</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Simplifying catering operations for businesses and delighting customers with easy ordering.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <Link href="/order">
                          <a className="hover:text-primary transition-colors">Browse Menus</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/dashboard">
                          <a className="hover:text-primary transition-colors">Dashboard</a>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Contact</h3>
                    <p className="text-sm text-muted-foreground">
                      Questions? Reach out to us at<br />
                      <a href="mailto:hello@catercalendar.com" className="hover:text-primary transition-colors">
                        hello@catercalendar.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                  <p>© 2025 CaterCalendar. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
