import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Database, GitBranch, Server } from "lucide-react";

interface EnvInfo {
  replSlug: string;
  replOwner: string;
  gitBranch: string;
  databaseUrl: string;
}

export function EnvironmentInfo() {
  const { data: envInfo, isLoading } = useQuery<EnvInfo>({
    queryKey: ["/api/env-info"],
  });

  if (isLoading || !envInfo) {
    return null;
  }

  return (
    <Card className="border-2" style={{
      borderColor: 'hsl(0 70% 40%)',
      backgroundColor: 'hsl(0 50% 15%)',
    }}>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b" style={{
          borderColor: 'hsl(0 70% 30%)',
        }}>
          <Server className="h-5 w-5" style={{ color: 'hsl(0 70% 70%)' }} />
          <h3 className="font-semibold text-lg" style={{ color: 'hsl(0 70% 90%)' }}>
            Environment Details
          </h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Server className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(0 60% 60%)' }} />
            <div className="flex-1 min-w-0">
              <div className="font-medium" style={{ color: 'hsl(0 70% 80%)' }}>Repl Name</div>
              <div className="font-mono text-xs break-all" style={{ color: 'hsl(0 50% 70%)' }} data-testid="text-repl-name">
                {envInfo.replOwner}/{envInfo.replSlug}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <GitBranch className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(0 60% 60%)' }} />
            <div className="flex-1 min-w-0">
              <div className="font-medium" style={{ color: 'hsl(0 70% 80%)' }}>Git Branch</div>
              <div className="font-mono text-xs break-all" style={{ color: 'hsl(0 50% 70%)' }} data-testid="text-git-branch">
                {envInfo.gitBranch || 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Database className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(0 60% 60%)' }} />
            <div className="flex-1 min-w-0">
              <div className="font-medium" style={{ color: 'hsl(0 70% 80%)' }}>Database</div>
              <div className="font-mono text-xs break-all" style={{ color: 'hsl(0 50% 70%)' }} data-testid="text-database-url">
                {envInfo.databaseUrl ? envInfo.databaseUrl.replace(/:[^:@]+@/, ':****@') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
