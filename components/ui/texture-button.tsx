"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariantsOuter = cva("", {
  variants: {
    variant: {
      primary:
        "w-full border border-[1px] dark:border-[2px] border-border bg-gradient-to-b from-primary/70 to-primary p-[1px] transition duration-300 ease-in-out",
      accent:
        "w-full border-[1px] dark:border-[2px] border-border bg-gradient-to-b from-accent/90 to-accent p-[1px] transition duration-300 ease-in-out",
      destructive:
        "w-full border-[1px] dark:border-[2px] border-border bg-gradient-to-b from-destructive/90 to-destructive p-[1px] transition duration-300 ease-in-out",
      secondary:
        "w-full border-[1px] dark:border-[2px] border-border bg-secondary/50 p-[1px] transition duration-300 ease-in-out",
      minimal:
        "group w-full border-[1px] dark:border-[2px] border-border bg-secondary/50 p-[1px] active:bg-secondary hover:bg-gradient-to-t hover:from-secondary/80 hover:to-background",
      icon: "group rounded-full border border-border bg-secondary/50 p-[1px] active:bg-secondary hover:bg-gradient-to-t hover:from-secondary/80 hover:to-background",
    },
    size: {
      sm: "rounded-[6px]",
      default: "rounded-[12px]",
      lg: "rounded-[12px]",
      icon: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
})

const innerDivVariants = cva(
  "w-full h-full flex items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        primary:
          "gap-2 bg-gradient-to-b from-primary/90 to-primary text-sm text-primary-foreground transition duration-300 ease-in-out hover:from-primary/80 hover:to-primary/90 active:bg-gradient-to-b active:from-primary active:to-primary",
        accent:
          "gap-2 bg-gradient-to-b from-accent to-accent text-sm text-accent-foreground transition duration-300 ease-in-out hover:from-accent/90 hover:to-accent/90 active:from-accent active:to-accent",
        destructive:
          "gap-2 bg-gradient-to-b from-destructive/90 to-destructive text-sm text-destructive-foreground transition duration-300 ease-in-out hover:from-destructive/80 hover:to-destructive/90 active:from-destructive active:to-destructive",
        secondary:
          "bg-gradient-to-b from-secondary to-secondary/80 text-sm text-secondary-foreground transition duration-300 ease-in-out hover:from-secondary/90 hover:to-secondary/70 active:from-secondary active:to-secondary/80",
        minimal:
          "bg-gradient-to-b from-background to-secondary/50 text-sm transition duration-300 ease-in-out group-hover:from-secondary/50 group-hover:to-secondary/60 group-active:from-secondary/60 group-active:to-secondary/90",
        icon: "bg-gradient-to-b from-background to-secondary/50 group-active:bg-secondary rounded-full",
      },
      size: {
        sm: "text-xs rounded-[4px] px-4 py-1",
        default: "text-sm rounded-[10px] px-4 py-2",
        lg: "text-base rounded-[10px] px-4 py-2",
        icon: "rounded-full p-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface UnifiedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "destructive"
    | "minimal"
    | "icon"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const TextureButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "default",
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariantsOuter({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <div className={cn(innerDivVariants({ variant, size }))}>
          {children}
        </div>
      </Comp>
    )
  }
)

TextureButton.displayName = "TextureButton"

export { TextureButton }