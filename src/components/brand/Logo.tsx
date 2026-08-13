import { cn } from "@/lib/utils";

/**
 * Standalone logo mark (image only).
 * Default renders at a comfortable Navbar / Footer size.
 * Pass className to override for hero or larger contexts.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/codexpulse-logo.png"
      alt="CodeXPulse logo"
      className={cn("h-10 w-auto object-contain sm:h-12", className)}
    />
  );
}

/**
 * Full logo component with optional sr-only wordmark.
 * `size` presets: "nav" (default), "hero", "footer".
 */
export function Logo({
  className,
  showWordmark = false,
  size = "nav",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: "nav" | "hero" | "footer";
}) {
  const sizeClass = {
    nav: "h-10 sm:h-12",
    footer: "h-10 sm:h-12",
    hero: "h-16 sm:h-20",
  }[size];

  return (
    <span className={cn("inline-flex items-center", className)}>
      <LogoMark className={sizeClass} />
      {showWordmark && (
        <span className="sr-only font-display text-lg font-semibold tracking-tight">
          Code<span className="text-primary">X</span>Pulse
        </span>
      )}
    </span>
  );
}
