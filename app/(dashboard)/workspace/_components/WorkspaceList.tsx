"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useSuspenseQuery } from "@tanstack/react-query";

const colorCombinations = [ 
  "bg-amber-600 hover:bg-amber-700 text-white", // Deep caffeine/golden
  "bg-orange-700 hover:bg-orange-800 text-white", // Rich burnt orange
  "bg-emerald-700 hover:bg-emerald-800 text-white", // Deep forest green
  "bg-teal-700 hover:bg-teal-800 text-white", // Deep teal
  "bg-indigo-700 hover:bg-indigo-800 text-white", // Rich indigo
  "bg-rose-700 hover:bg-rose-800 text-white", // Deep rose
  "bg-violet-700 hover:bg-violet-800 text-white", // Deep violet
  "bg-cyan-700 hover:bg-cyan-800 text-white", // Deep cyan
  "bg-lime-700 hover:bg-lime-800 text-white", // Deep lime
  "bg-fuchsia-700 hover:bg-fuchsia-800 text-white", // Deep fuchsia
];

const getWorkspaceColor = (id: string) => {
  const charSum = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const colorIndex = charSum % colorCombinations.length;
  return colorCombinations[colorIndex];
};

const WorkspaceList = () => {
  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
  return (
    <>
      <TooltipProvider>
        <div className="flex flex-col gap-2">
          {workspaces.map((workspace) => {
            const isActive = currentWorkspace.orgCode === workspace.id;
            return (
              <Tooltip key={workspace.id}>
                <TooltipTrigger asChild>
                  <LoginLink orgCode={workspace.id}>
                    <Button
                      size="icon"
                      className={cn(
                        "size-10",
                        getWorkspaceColor(workspace.id),
                        isActive ? "rounded-lg" : "rounded-xl hover:rounded-lg"
                      )}
                    >
                      <span className="text-xs font-semibold">
                        {workspace.avatar}
                      </span>
                    </Button>
                  </LoginLink>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {workspace.name} {isActive && "(Current)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </>
  );
};

export default WorkspaceList;
