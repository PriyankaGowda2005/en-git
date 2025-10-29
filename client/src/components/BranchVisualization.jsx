import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GitMerge, GitBranch, ChevronDown, ChevronRight } from "lucide-react";

const BRANCH_COLORS = [
  "#667eea",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function BranchVisualization({ branchGraph }) {
  if (!branchGraph || !branchGraph.commits || branchGraph.commits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branch Visualization
          </CardTitle>
          <CardDescription>Visual representation of commit history with branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <p>No commit data available for visualization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { commits, branches, defaultBranch } = branchGraph;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Branch Visualization
        </CardTitle>
        <CardDescription>
          Visual representation of commit history with branches ({commits.length} commits shown)
        </CardDescription>
        {branches.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {branches.slice(0, 8).map((branch, idx) => (
              <Badge
                key={branch}
                variant={branch === defaultBranch ? "default" : "outline"}
                className="text-xs"
                style={{
                  backgroundColor:
                    branch === defaultBranch ? BRANCH_COLORS[0] : undefined,
                  color: branch === defaultBranch ? "white" : undefined,
                }}
              >
                {branch}
              </Badge>
            ))}
            {branches.length > 8 && (
              <Badge variant="outline" className="text-xs">
                +{branches.length - 8} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <div className="min-w-full pb-4">
            <CommitGraph commits={commits} defaultBranch={defaultBranch} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommitGraph({ commits, defaultBranch }) {
  const [expandedCommits, setExpandedCommits] = useState(new Set());

  const toggleCommit = (commitId) => {
    setExpandedCommits((prev) => {
      const next = new Set(prev);
      if (next.has(commitId)) {
        next.delete(commitId);
      } else {
        next.add(commitId);
      }
      return next;
    });
  };

  // Build commit positions for visualization
  const commitPositions = buildCommitGraph(commits, defaultBranch);
  const maxPosition = Math.max(...commitPositions.map((c) => c.position), 0);

  return (
    <div className="relative" style={{ minHeight: `${(commits.length + 1) * 80}px` }}>
      {commitPositions.map((commitData, index) => {
        const commit = commitData.commit;
        const isExpanded = expandedCommits.has(commit.id);
        const branchColor = BRANCH_COLORS[commitData.position % BRANCH_COLORS.length];

        return (
          <div key={commit.id} className="relative mb-4">
            {/* Branch line */}
            <div className="flex items-start gap-4">
              {/* Vertical branch line */}
              <div
                className="flex-shrink-0 relative"
                style={{
                  width: `${(maxPosition + 1) * 200}px`,
                  minWidth: "200px",
                }}
              >
                {/* Horizontal line to commit */}
                <div
                  className="absolute top-6 border-t-2"
                  style={{
                    left: `${commitData.position * 200}px`,
                    width: "120px",
                    borderColor: branchColor,
                  }}
                />
                {/* Vertical line */}
                {index < commitPositions.length - 1 && (
                  <div
                    className="absolute top-6 bottom-0 border-l-2"
                    style={{
                      left: `${commitData.position * 200}px`,
                      borderColor: branchColor,
                      height: "80px",
                    }}
                  />
                )}
                {/* Commit circle */}
                <div
                  className="absolute top-0 w-4 h-4 rounded-full border-2 border-card"
                  style={{
                    left: `${commitData.position * 200 + 115}px`,
                    backgroundColor: commit.isMerge ? "#8b5cf6" : branchColor,
                    borderColor: commit.isMerge ? "#8b5cf6" : branchColor,
                    zIndex: 10,
                  }}
                />
              </div>

              {/* Commit info */}
              <div className="flex-1 min-w-0 bg-muted/50 rounded-lg p-3 hover:bg-muted/70 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => toggleCommit(commit.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <Badge variant="outline" className="font-mono text-xs">
                        {commit.id}
                      </Badge>
                      {commit.isMerge && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-xs"
                          style={{ borderColor: "#8b5cf6" }}
                        >
                          <GitMerge className="h-3 w-3" />
                          Merge
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: branchColor,
                          color: branchColor,
                        }}
                      >
                        {commit.branch}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{commit.message}</p>
                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {commit.author.avatar && (
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={commit.author.avatar} alt={commit.author.name} />
                              <AvatarFallback>
                                {commit.author.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span>{commit.author.name}</span>
                          <span>•</span>
                          <span>{commit.author.email}</span>
                        </div>
                        <div>
                          {new Date(commit.date).toLocaleString()}
                        </div>
                        {commit.parents.length > 0 && (
                          <div className="pt-1">
                            <span className="font-medium">Parents: </span>
                            <span className="font-mono text-xs">
                              {commit.parents.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {commit.author.name} • {new Date(commit.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildCommitGraph(commits, defaultBranch) {
  // Graph layout: track which branch each commit is on
  const positions = [];
  let currentPosition = 0;
  const commitMap = new Map();
  const branchStack = [0]; // Track branch positions

  // Build a map of commits by SHA (short and full)
  commits.forEach((commit) => {
    commitMap.set(commit.id, commit);
    commitMap.set(commit.sha, commit);
    // Also map by full parent SHAs if available
    if (commit.parentShas) {
      commit.parentShas.forEach((parentSha) => {
        const shortSha = parentSha.substring(0, 7);
        if (!commitMap.has(shortSha)) {
          // Find the parent commit in the commits array
          const parentCommit = commits.find((c) => c.sha === parentSha);
          if (parentCommit) {
            commitMap.set(shortSha, parentCommit);
          }
        }
      });
    }
  });

  // Assign positions to commits based on parent relationships
  commits.forEach((commit, index) => {
    // Check if this is a merge commit
    if (commit.isMerge && commit.parents && commit.parents.length > 1) {
      // Merge commit - return to main branch (position 0)
      currentPosition = 0;
      branchStack.length = 1;
      branchStack[0] = 0;
    } else if (index > 0) {
      // Check if this commit is a direct child of the previous commit
      const prevCommit = commits[index - 1];
      const isDirectChild = commit.parents && commit.parents.includes(prevCommit.id);
      
      if (!isDirectChild && commit.parents && commit.parents.length > 0) {
        // This commit's parent is not the previous commit - might be a branch
        // Find the parent commit to determine position
        const parentId = commit.parents[0];
        let parentCommit = commitMap.get(parentId);
        
        // If not found by short SHA, try to find by matching with parentShas
        if (!parentCommit && commit.parentShas && commit.parentShas.length > 0) {
          const fullParentSha = commit.parentShas[0];
          parentCommit = commits.find((c) => c.sha === fullParentSha || c.sha.substring(0, 7) === parentId);
        }
        
        if (parentCommit) {
          // Find position of parent in our positions array
          const parentIndex = positions.findIndex(p => p.commit.id === parentId);
          if (parentIndex !== -1) {
            // Branch from the parent's position
            currentPosition = positions[parentIndex].position + 1;
            if (!branchStack.includes(currentPosition)) {
              branchStack.push(currentPosition);
            }
          }
        }
      } else {
        // Continue on same branch
        // Check if we should shift position based on branching
        if (commit.parents && commit.parents.length === 1) {
          const parentId = commit.parents[0];
          const parentPos = positions.find(p => p.commit.id === parentId);
          if (parentPos && parentPos.position !== currentPosition) {
            currentPosition = parentPos.position;
          }
        }
      }
    }

    positions.push({
      commit,
      position: currentPosition,
    });

    // Update current position for next iteration (usually stays the same)
    if (commit.isMerge) {
      // After merge, stay on main branch
      currentPosition = 0;
    }
  });

  return positions;
}

