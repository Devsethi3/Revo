import Link from "next/link";
import LogoIcon from "../general/LogoIcon";

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background py-16 overflow-hidden">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <LogoIcon size="xl" />

          {/* Tagline with gradient text */}
          <p className="text-center text-sm max-w-md bg-linear-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent font-medium">
            The collaborative workspace for high-performance teams. Designed in
            Delhi.
          </p>

          {/* Decorative divider */}
          <div className="w-24 h-px bg-linear-to-r from-transparent via-border to-transparent" />

          {/* Copyright and credits */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Revo Inc. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made by{" "}
              <Link
                href="https://x.com/imsethidev"
                target="_blank"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Dev
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
