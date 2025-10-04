import { Card } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, DollarSign, Calendar } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {trend && (
            <p className="text-xs text-chart-2 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface DashboardStatsProps {
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
  upcomingMenus: number;
}

export function DashboardStats({
  totalOrders,
  totalRevenue,
  totalItems,
  upcomingMenus,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatsCard
        title="Total Orders"
        value={totalOrders}
        icon={<ShoppingBag className="h-6 w-6 text-primary" />}
        trend="+12% from last week"
      />
      <StatsCard
        title="Revenue"
        value={`$${totalRevenue.toFixed(2)}`}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        trend="+8% from last week"
      />
      <StatsCard
        title="Total Items"
        value={totalItems}
        icon={<ShoppingBag className="h-6 w-6 text-primary" />}
      />
      <StatsCard
        title="Upcoming Menus"
        value={upcomingMenus}
        icon={<Calendar className="h-6 w-6 text-primary" />}
      />
    </div>
  );
}
