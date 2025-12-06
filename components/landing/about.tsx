"use client";

import { motion } from "motion/react";
import { Users, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, standard in shadcn

const features = [
  {
    title: "Built for Speed",
    description:
      "Optimized rendering ensures 60fps interactions even with thousands of nodes.",
    icon: <Zap className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
    // Custom background pattern for this specific card
    pattern: (
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,transparent_1px,var(--color-border)_1px),linear-gradient(to_bottom,transparent_1px,var(--color-border)_1px)] bg-size:[24px_24px] opacity-[0.03] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
    ),
  },
  {
    title: "Secure by Default",
    description: "Enterprise-grade encryption for all your data.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    pattern: (
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
    ),
  },
  {
    title: "Team Centric",
    description: "Real-time cursors, comments, and seamless branching.",
    icon: <Users className="h-6 w-6 text-primary" />,
    className: "md:col-span-3",
    pattern: (
      <>
        <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_0%_0%,var(--color-primary)_0%,transparent_10%)] opacity-20" />
        <div className="absolute right-0 bottom-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_100%_100%,var(--color-primary)_0%,transparent_10%)] opacity-20" />
      </>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      {/* --- Section Background Pattern --- */}
      <div className="absolute inset-0 z-0">
        {/* Dot Pattern */}
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] background-size:[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        {/* Subtle Gradient Spotlights */}
        <div className="absolute left-0 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 md:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Why teams choose Revo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground md:mx-auto md:max-w-2xl"
          >
            We stripped away the complexity to focus on what matters: pure,
            unadulterated performance and collaboration.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={cn(
                "group relative overflow-hidden rounded-3xl border bg-card p-8 transition-all border-primary/20 shadow-lg",
                feature.className
              )}
            >
              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Internal Card Decoration (Pattern) */}
              {feature.pattern}

              {/* Hover Glow Effect */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity duration-500 opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
