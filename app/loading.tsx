import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with spinner */}
        <div className="relative">
          <div className="size-16 sm:size-20 rounded-2xl bg-muted/50 border flex items-center justify-center">
            <Image
              src="/logo-light.svg"
              alt="Revo"
              width={40}
              height={40}
              className="dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.svg"
              alt="Revo"
              width={40}
              height={40}
              className="hidden dark:block"
              priority
            />
          </div>
          
          {/* Spinner badge */}
          <div className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
            <div className="size-2.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  );
}