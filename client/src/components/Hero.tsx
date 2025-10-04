import { Button } from "@/components/ui/button";
import { Calendar, Users, ChefHat } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_catering_spread_image_8e888324.png";

export function Hero() {
  return (
    <div className="relative">
      <div className="relative aspect-[21/9] md:aspect-[21/9] lg:aspect-[21/9] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Professional catering spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Simplify Your Catering Business
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Publish daily menus, manage orders, and streamline your catering operations all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground border border-primary-border"
                  data-testid="button-get-started"
                >
                  <ChefHat className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="backdrop-blur-sm bg-white/10 border-white/30 text-white hover:bg-white/20"
                  data-testid="button-view-demo"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-card-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Easy Menu Publishing</h3>
                <p className="text-sm text-muted-foreground">Schedule menus for specific dates</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Customer Management</h3>
                <p className="text-sm text-muted-foreground">Track orders and preferences</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Order Tracking</h3>
                <p className="text-sm text-muted-foreground">Real-time order summaries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
