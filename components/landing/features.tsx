"use client";

import { motion } from "motion/react";
import { 
  Layout, 
  GitBranch, 
  MessageSquare, 
  Smartphone, 
  Globe, 
  Lock 
} from "lucide-react";

const featureList = [
  {
    icon: Layout,
    title: "Infinite Canvas",
    description: "A workspace that grows with your ideas. Never run out of space again.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Branch, merge, and rollback changes with git-like precision.",
  },
  {
    icon: MessageSquare,
    title: "Contextual Chat",
    description: "Discuss right on the element. No more vague 'move this left' comments.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Review and comment on designs from your phone, anywhere.",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Assets load instantly whether you are in New York or Tokyo.",
  },
  {
    icon: Lock,
    title: "SSO & Security",
    description: "Integrate with your existing identity provider seamlessly.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-base font-semibold text-primary">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to ship faster.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform provides a comprehensive suite of tools designed to 
            reduce friction in your workflow.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}