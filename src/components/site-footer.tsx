import { siteConfig } from "@/config/site";

/** Shared site footer — brand + copyright from siteConfig. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
        <span>{siteConfig.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
