// Environment configuration for different deployments
// Update these values when forking for DEV, Beta, UAT, or PROD environments

export const ENV_CONFIG = {
  replName: import.meta.env.VITE_REPL_NAME || "CaterCalendar",
  branchName: import.meta.env.VITE_BRANCH_NAME || "StagingCC",
  repoName: import.meta.env.VITE_REPO_NAME || "venuyeluri/workspace",
} as const;
