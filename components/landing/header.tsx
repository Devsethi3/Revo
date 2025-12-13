"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import LogoIcon from "../general/LogoIcon";
import { ThemeToggle } from "../ui/theme-toggle";
import { RippleEffect } from "../ui/ripple-effect";

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
  { name: "CTA", href: "#cta" },
  { name: "How it works", href: "#how-it-works" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { getUser, isLoading } = useKindeBrowserClient();
  const user = getUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <LogoIcon />

              <div className="flex items-center gap-2">
                <div className="md:hidden block">
                  <ThemeToggle />
                </div>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-4 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-4 -rotate-180 scale-0 opacity-0 duration-200" />
                </Button>
              </div>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:block hidden">
                <ThemeToggle />
              </div>

              {isLoading ? null : (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  {user ? (
                    <>
                      <Link href="/workspace" className={buttonVariants()}>
                        <span>Dashboard</span>
                      </Link>
                      <LogoutLink
                        className={buttonVariants({ variant: "outline" })}
                      >
                        <span>Log Out</span>
                      </LogoutLink>
                    </>
                  ) : (
                    <>
                      <LoginLink
                        className={buttonVariants({
                          variant: "outline",
                          className: cn(isScrolled && "lg:hidden"),
                        })}
                      >
                        Login
                      </LoginLink>
                      <RegisterLink
                        className={buttonVariants({
                          variant: "default",
                          className: cn(isScrolled && "lg:hidden"),
                        })}
                        authUrlParams={{
                          is_create_org: "true",
                          org_name: "My Workspace",
                          pricing_table_key: "organization_plans",
                        }}
                      >
                        Register
                      </RegisterLink>
                      <RippleEffect>
                        <Button
                          asChild
                          className={cn(
                            isScrolled ? "lg:inline-flex" : "hidden"
                          )}
                        >
                          <Link href="/">
                            <span>Get Started</span>
                          </Link>
                        </Button>
                      </RippleEffect>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
