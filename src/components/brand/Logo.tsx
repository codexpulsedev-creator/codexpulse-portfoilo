import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/codexpulse-logo.png"
      alt="CodeXPulse logo"
      className={cn("h-12 w-auto object-contain sm:h-14", className)}
    />
  );
}

export function Logo({
  className,
  showWordmark = false,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <LogoMark className={showWordmark ? "h-12 sm:h-14" : "h-14 sm:h-16"} />
      {showWordmark && (
        <span className="sr-only font-display text-lg font-semibold tracking-tight">
          Code<span className="text-primary">X</span>Pulse
        </span>
      )}
    </span>
  );
}
