"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatar } from "@/lib/get-avatar";
import { orpc } from "@/lib/orpc";
import {
  LogoutLink,
  PortalLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditCard, LogOut, User } from "lucide-react";
import Image from "next/image";

const UserNav = () => {
  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent hover:text-accent-foreground"
          >
            <Avatar>
              <Image
                src={getAvatar(user.picture, user.email!)}
                alt="User Image"
                className="object-cover"
                fill
                unoptimized
              />
              <AvatarFallback className="bg-linear-to-br from-emerald-700 via-emerald-800 to-indigo-700 font-semibold text-white">
                {user.given_name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="right"
          sideOffset={8}
          className="w-[200px]"
        >
          <DropdownMenuLabel className="font-normal flex items-center gap-2 px-1 text-left text-sm">
            <Avatar className="relative size-8 rounded-lg">
              <Image
                src={getAvatar(user.picture, user.email!)}
                alt="User Image"
                className="object-cover"
                fill
                unoptimized
              />
              <AvatarFallback className="bg-linear-to-br from-emerald-700 via-emerald-800 to-indigo-700 font-semibold text-white">
                {user.given_name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <p className="truncate text-sm font-medium">
                {user.given_name || "User"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <PortalLink>
                <User />
                Account
              </PortalLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <PortalLink>
                <CreditCard />
                Billing
              </PortalLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LogoutLink>
              <LogOut />
              Log Out
            </LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserNav;
