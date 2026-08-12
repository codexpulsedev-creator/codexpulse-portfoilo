import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="CodeXPulse logo"
      className={cn("h-9 w-9", className)}
    >
      <defs>
        <linearGradient id="cx-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.11 228)" />
          <stop offset="100%" stopColor="oklch(0.62 0.17 250)" />
        </linearGradient>
      </defs>
      <path
        d="M24 3 42 13.5v21L24 45 6 34.5v-21z"
        fill="none"
        stroke="url(#cx-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 24h6l3.5-7 5 14 3.5-7h6"
        fill="none"
        stroke="url(#cx-grad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Code<span className="text-primary">X</span>Pulse
        </span>
      )}
    </span>
  );
}
