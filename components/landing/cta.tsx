"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BadgeCheckIcon, CheckIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CTASection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "relative isolate overflow-hidden rounded-3xl border border-border bg-background px-6 py-16 text-center shadow-2xl sm:px-16 md:py-24",
            // Add a subtle glass effect if you have a busy background behind this section
            "after:absolute after:inset-0 after:-z-10 after:bg-background/80 after:backdrop-blur-sm"
          )}
        >
          {/* --- Background Effects --- */}

          {/* 1. The Grid with a Radial Mask for depth */}
          <div
            className="absolute inset-0 -z-20 h-full w-full opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              maskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 70%)",
            }}
          />

          {/* 2. Top Spotlight / Glow Source */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[80px]"
          />

          {/* 3. Subtle accent glow at bottom right */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 -z-10 h-[300px] w-[300px] translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-[60px]"
          />

          {/* --- Content --- */}
          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm"
            >
              <Sparkles className="mr-2 h-3 w-3" />
              Limited time offer
            </motion.div>

            <h2 className="text-balance text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
              Ready to <span className="text-primary">revolutionize</span> your
              workflow?
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground">
              Join thousands of forward-thinking teams who have switched to
              Revo. Experience the speed of thought.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 min-w-40 px-8 text-base"
              >
                <Link href="/workspace">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-w-40 border-border bg-background px-8 text-base hover:bg-muted/50"
              >
                <Link href="/">Contact</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-3 pt-6">
              <BadgeCheckIcon className="size-4 text-primary" />
              <span className="text-sm">No credit card required</span>  
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
