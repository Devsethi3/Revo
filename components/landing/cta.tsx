"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-border bg-background px-6 py-16 text-center shadow-2xl sm:px-16 md:py-24"
        >
          {/* Background Gradient Mesh inside the card */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] -translate-x-[30%] -translate-y-[30%] rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] translate-x-[30%] translate-y-[30%] rounded-full bg-accent/10 blur-[80px]" />

          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
              Ready to revolutionize your workflow?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Join thousands of forward-thinking teams who have switched to Revo.
              Start your 14-day free trial today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 min-w-[160px] rounded-full text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105"
              >
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-w-[160px] rounded-full border-border text-base hover:bg-muted/50"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}