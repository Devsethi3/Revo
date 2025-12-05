import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoIconProps {
  size?: "sm" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { image: 24, text: "text-base" },
  lg: { image: 30, text: "text-xl" },
  xl: { image: 40, text: "text-2xl" },
};

const LogoIcon = ({ size = "lg", className }: LogoIconProps) => {
  const { image, text } = sizeMap[size];

  return (
    <Link
      href="/"
      aria-label="home"
      className={cn(
        "flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80",
        className
      )}
    >
      {/* Light mode logo */}
      <Image
        src="/logo-light.svg"
        alt="Revo logo"
        width={image}
        height={image}
        className="dark:hidden"
        priority
      />

      {/* Dark mode logo */}
      <Image
        src="/logo-dark.svg"
        alt="Revo logo"
        width={image}
        height={image}
        className="hidden dark:block"
        priority
      />

      <span className={cn("font-semibold hover:underline", text)}>Revo</span>
    </Link>
  );
};

export default LogoIcon;
