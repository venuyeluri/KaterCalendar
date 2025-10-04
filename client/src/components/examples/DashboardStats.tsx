import { DashboardStats } from "../DashboardStats";

export default function DashboardStatsExample() {
  return (
    <div className="p-6">
      <DashboardStats
        totalOrders={48}
        totalRevenue={1247.52}
        totalItems={156}
        upcomingMenus={5}
      />
    </div>
  );
}
