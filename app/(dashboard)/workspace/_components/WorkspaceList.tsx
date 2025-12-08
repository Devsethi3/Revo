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
  // Deep Coffee Brown
  "bg-[#4B342A] hover:bg-[#3E2B23] text-white",

  // Toasted Caramel
  "bg-[#C58B45] hover:bg-[#B07A3C] text-white",

  // Dark Amber / Caffeine Yellow
  "bg-[#DFAF37] hover:bg-[#C49B30] text-black",

  // Matcha Deep Green
  "bg-[#446644] hover:bg-[#3A563A] text-white",

  // Burgundy Roast
  "bg-[#6C2E3A] hover:bg-[#5B2631] text-white",

  // Deep Slate Mocha
  "bg-[#4A4F4D] hover:bg-[#3E4240] text-white",

  // NEW: Hazelnut Cream (soft warm beige)
  "bg-[#D9C3A3] hover:bg-[#C7B095] text-black",

  // NEW: Burnt Sienna Roast (warm deep orange-red)
  "bg-[#B55A3A] hover:bg-[#9E4D32] text-white",
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
