interface EnvironmentBannerProps {
  replName?: string;
  branchName?: string;
  repoName?: string;
}

export function EnvironmentBanner({ 
  replName = "CaterCalendar",
  branchName = "main", 
  repoName = "workspace" 
}: EnvironmentBannerProps) {
  return (
    <div 
      className="mb-8 p-6 bg-primary/10 border-2 border-primary rounded-lg" 
      data-testid="environment-banner"
      role="status"
      aria-label="Environment information"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-primary" data-testid="env-repl-name">
          {replName}
        </h2>
        <div className="text-xl md:text-2xl font-semibold">
          <span className="text-foreground">Repository: </span>
          <span className="text-primary" data-testid="env-repo-name">{repoName}</span>
        </div>
        <div className="text-xl md:text-2xl font-semibold">
          <span className="text-foreground">Branch: </span>
          <span className="text-primary" data-testid="env-branch-name">{branchName}</span>
        </div>
      </div>
    </div>
  );
}
