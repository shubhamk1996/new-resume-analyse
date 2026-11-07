/**
 * Site-wide configuration
 * Centralized place for app constants and settings
 */
export const siteConfig = {
  name: "ResuFlow AI - Next-Gen Resume Studio, ATS Diagnostic & 72h Job Radar",
  description: "A comprehensive Enhancv-style fullstack AI resume platform with drag-and-drop section building, custom fields, PDF upload & parsing, real-time ATS scoring, AI grammar/impact enhancement, and real-time job matching from the last 72 hours, backed by Neon DB and Google Auth.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
  creator: "Your Name",
};

export type SiteConfig = typeof siteConfig;
