"use client";

import { motion } from "motion/react";
import { Users, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Built for Speed",
    description:
      "Optimized rendering ensures 60fps interactions even with thousands of nodes.",
    icon: <Zap className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
  },
  {
    title: "Secure by Default",
    description: "Enterprise-grade encryption for all your data.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
  },
  {
    title: "Team Centric",
    description: "Real-time cursors, comments, and seamless branching.",
    icon: <Users className="h-6 w-6 text-primary" />,
    className: "md:col-span-3",
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
    <section id="about" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
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
              className={`relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-colors hover:bg-muted/20 ${feature.className}`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>

              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-linear-to-br from-primary/5 to-transparent blur-2xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
