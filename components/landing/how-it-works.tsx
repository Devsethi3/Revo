"use client";

import { motion } from "motion/react";
import {
  Users,
  Hash,
  MessageSquare,
  Check,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Create your workspace",
    description:
      "Set up your team's home in seconds. Give it a name and you're ready to go.",
    icon: Sparkles,
    visual: "workspace",
  },
  {
    step: "02",
    title: "Invite your team",
    description:
      "Share a simple invite link or add members by email. They'll be onboarded instantly.",
    icon: Users,
    visual: "invite",
  },
  {
    step: "03",
    title: "Organize with channels",
    description:
      "Create channels for projects, teams, or topics. Keep conversations focused and searchable.",
    icon: Hash,
    visual: "channels",
  },
  {
    step: "04",
    title: "Start collaborating",
    description:
      "Send messages, react with emoji, reply in threads. Your team is now connected.",
    icon: MessageSquare,
    visual: "collaborate",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// Visual components for each step
const WorkspaceVisual = () => (
  <div className="rounded-xl border border-border bg-background p-4">
    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
        R
      </div>
      <div>
        <div className="h-2.5 w-24 rounded-full bg-foreground/80" />
        <div className="mt-1.5 h-2 w-16 rounded-full bg-muted-foreground/40" />
      </div>
    </div>
    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
      <Check className="h-4 w-4 text-primary" />
      <span className="text-sm text-primary">Workspace created!</span>
    </div>
  </div>
);

const InviteVisual = () => (
  <div className="rounded-xl border border-border bg-background p-4">
    <div className="mb-3 flex -space-x-2">
      {["S", "A", "J", "M", "+"].map((letter, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border-2 border-background text-sm font-medium",
            i === 4
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {letter}
        </motion.div>
      ))}
    </div>
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2">
      <span className="flex-1 truncate text-xs text-muted-foreground">
        revo.app/invite/abc123
      </span>
      <span className="text-xs font-medium text-primary">Copy</span>
    </div>
  </div>
);

const ChannelsVisual = () => (
  <div className="rounded-xl border border-border bg-background p-4">
    <div className="space-y-2">
      {[
        { name: "general", active: true },
        { name: "engineering", active: false },
        { name: "design", active: false },
      ].map((channel, i) => (
        <motion.div
          key={channel.name}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
            channel.active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground"
          )}
        >
          <Hash className="h-4 w-4" />
          <span>{channel.name}</span>
        </motion.div>
      ))}
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 px-3 py-2 text-sm text-muted-foreground">
        <span className="text-lg leading-none">+</span>
        <span>Add channel</span>
      </div>
    </div>
  </div>
);

const CollaborateVisual = () => (
  <div className="rounded-xl border border-border bg-background p-4">
    <div className="mb-3 flex items-start gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
        S
      </div>
      <div className="rounded-lg rounded-tl-none bg-muted px-3 py-2">
        <p className="text-sm text-foreground">Shipped the new feature! 🚀</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {["👍", "🎉", "🚀"].map((emoji, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
          className="flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-sm"
        >
          <span>{emoji}</span>
          <span className="text-xs text-muted-foreground">{i + 1}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const StepVisual = ({ type }: { type: string }) => {
  switch (type) {
    case "workspace":
      return <WorkspaceVisual />;
    case "invite":
      return <InviteVisual />;
    case "channels":
      return <ChannelsVisual />;
    case "collaborate":
      return <CollaborateVisual />;
    default:
      return null;
  }
};

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 md:py-32" id="how-it-works">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-medium uppercase tracking-wider text-primary"
          >
            Getting Started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Up and running in minutes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-muted-foreground"
          >
            No complex setup. No lengthy onboarding. Just create, invite, and
            start collaborating.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Connecting Line - Desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-transparent via-border to-transparent md:block" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Step Number - Center (Desktop) */}
                  <div className="absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 md:block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground shadow-sm">
                      {step.step}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "grid items-center gap-8 md:grid-cols-2 md:gap-16",
                      isEven ? "md:text-right" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Content */}
                    <div
                      className={cn(
                        "order-2",
                        isEven ? "md:order-1 md:pr-16" : "md:order-2 md:pl-16"
                      )}
                    >
                      {/* Mobile Step Number */}
                      <div className="mb-4 flex items-center gap-3 md:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground">
                          {step.step}
                        </div>
                        <div className="h-px flex-1 bg-border" />
                      </div>

                      <div
                        className={cn(
                          "mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3",
                          isEven ? "md:ml-auto" : ""
                        )}
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    {/* Visual */}
                    <div
                      className={cn(
                        "order-1",
                        isEven ? "md:order-2 md:pl-16" : "md:order-1 md:pr-16"
                      )}
                    >
                      <div className="mx-auto max-w-xs">
                        <StepVisual type={step.visual} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
