import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeSwitcher } from "@/components/theme-switcher";

/**
 * Shared site header — brand from siteConfig, nav links via children.
 * Used by the built-in pages (/pricing, /billing, …); reuse it on your own
 * pages for a consistent chrome, or customize it here for the whole app.
 */
export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-3">
          {children}
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
