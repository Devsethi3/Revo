import Link from "next/link";
import { ArrowRight, ArrowUpRightIcon, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "../kibo-ui/announcement";
import Image from "next/image";
import AboutSection from "./about";
import CTASection from "./cta";
import Footer from "./footer";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)" as const,
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)" as const,
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
        {/* Modern Gradient Mesh Background (Variable based) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <div className="absolute -top-[20%] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-[100%] bg-primary/5 blur-[80px]" />
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--color-background)_70%)]" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size:[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
        </div>

        <section className="relative z-10 pt-20 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            {/* Badge */}
            <div className="flex justify-center">
              <Announcement className="bg-muted/50 hover:bg-muted/80 border-border/40 transition-all">
                <AnnouncementTag className="bg-primary text-primary-foreground">
                  New
                </AnnouncementTag>
                <AnnouncementTitle className="text-muted-foreground">
                  Revo 2.0 is now public
                  <ArrowUpRightIcon
                    className="ml-1 shrink-0 opacity-70"
                    size={14}
                  />
                </AnnouncementTitle>
              </Announcement>
            </div>

            {/* Headline */}
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="mx-auto mt-8 max-w-4xl text-balance text-3xl font-bold tracking-tight text-foreground xl:text-6xl lg:text-5xl md:text-4xl"
            >
              Connect. Collaborate. Create with Revo
            </TextEffect>

            {/* Subheadline */}
            {/* Small Screen Version */}
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:hidden"
            >
              Revo brings your team together in real time. Chat, share files,
              and collaborate seamless.
            </TextEffect>

            {/* Large Screen Version */}
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-6 hidden max-w-[700px] text-balance text-lg text-muted-foreground md:block md:text-xl"
            >
              Revo brings your team together in real time. Chat, share files,
              and collaborate seamlessly in one unified workspace designed for
              speed.
            </TextEffect>

            {/* CTA Buttons */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Button asChild size="lg">
                <Link href="/workspace">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="#demo" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  Watch Demo
                </Link>
              </Button>
            </AnimatedGroup>

            {/* Dashboard Mockup Visualization */}

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="/demo-dark.png"
                    unoptimized
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="/demo-light.png"
                    unoptimized
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
      <AboutSection />
      <CTASection />
      <Footer />
    </>
  );
}
