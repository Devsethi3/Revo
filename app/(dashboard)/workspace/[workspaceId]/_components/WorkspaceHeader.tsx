"use client";

import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

const WorkspaceHeader = () => {
  const {
    data: { currentWorkspace },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());
  return (
    <>
      <h1 className="font-semibold text-lg">{currentWorkspace.orgName}</h1>
    </>
  );
};

export default WorkspaceHeader;
