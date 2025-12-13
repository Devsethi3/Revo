"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  AnimationStart,
  AnimationVariant,
  createAnimation,
} from "@/components/theme/theme-animations";

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant;
  start?: AnimationStart;
  showLabel?: boolean;
  url?: string;
}

export function ThemeToggle({
  variant = "circle-blur",
  start = "top-left",
  showLabel = false,
  url = "",
}: ThemeToggleAnimationProps) {
  const { theme, setTheme } = useTheme();
  const styleId = "theme-transition-styles";

  const updateStyles = React.useCallback((css: string) => {
    if (typeof window === "undefined") return;

    let style = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = css;
  }, []);

  const toggleTheme = () => {
    const animation = createAnimation(variant, start, url);

    updateStyles(animation.css);

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      name="Theme Toggle Button"
    >
      <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme Toggle</span>

      {showLabel && (
        <>
          <span className="hidden group-hover:block border rounded-full px-2 absolute -top-10">
            variant = {variant}
          </span>
          <span className="hidden group-hover:block border rounded-full px-2 absolute -bottom-10">
            start = {start}
          </span>
        </>
      )}
    </Button>
  );
}
