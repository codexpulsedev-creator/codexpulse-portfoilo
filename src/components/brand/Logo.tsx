import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/codexpulse-logo.png"
      alt="CodeXPulse logo"
      className={cn("h-9 w-auto object-contain", className)}
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
      <LogoMark className={showWordmark ? "h-9" : "h-10 sm:h-11"} />
      {showWordmark && (
        <span className="sr-only font-display text-lg font-semibold tracking-tight">
          Code<span className="text-primary">X</span>Pulse
        </span>
      )}
    </span>
  );
}
