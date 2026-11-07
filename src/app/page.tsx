'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/lib/resume-store';
import { GoogleAuthModal } from '@/components/google-auth-modal';
import { NeonConfigModal } from '@/components/neon-config-modal';
import { ResumeUploadDialog } from '@/components/resume-upload-dialog';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck2,
  Briefcase,
  Layers,
  Database,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Move,
  Edit3,
  Flame,
  Check,
  Star,
  ChevronRight,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { resumes, createResume, user } = useResumeStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [neonModalOpen, setNeonModalOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTemplateTab, setActiveTemplateTab] = useState<'modern' | 'executive' | 'minimal' | 'creative'>('modern');

  const handleStartBuilding = () => {
    if (resumes.length > 0) {
      router.push(`/builder?id=${resumes[0].id}`);
    } else {
      const newId = createResume('My Professional Resume');
      router.push(`/builder?id=${newId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-foreground">
              ResuFlow <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-primary font-mono ml-1 border border-border">AI PRO</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/builder" className="hover:text-foreground transition-colors">
              Enhancv Studio
            </Link>
            <Link href="/ats" className="hover:text-foreground transition-colors">
              ATS Checker
            </Link>
            <Link href="/jobs" className="hover:text-foreground transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              72h Job Radar
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors text-primary font-bold">
              Pricing (₹19 Pass)
            </Link>
          </nav>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setNeonModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Neon DB Online</span>
          </button>

          <ThemeSwitcher />

          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="h-8 text-xs font-semibold gap-1.5">
                Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="h-8 text-xs font-semibold shadow-xs"
            >
              Sign In with Google
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-secondary border border-border text-foreground shadow-xs">
                <span className="text-accent font-black">★ Enhancv Reimagined</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Drag & Drop • ATS Engine • 72h Jobs</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-foreground leading-[1.08]">
                Build resumes that pass{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-emerald-500 bg-clip-text text-transparent">
                  ATS bots
                </span>{' '}
                & land 72h jobs.
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Experience the next evolution of resume building: drag-and-drop custom sections, instant PDF upload with AI extraction, live ATS score diagnostics (0-100), and an AI job radar matching you with verified tech roles posted in the last 72 hours.
              </p>

              {/* Primary Call-to-actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={handleStartBuilding}
                  className="h-11 px-6 text-sm font-bold gap-2 shadow-lg shadow-primary/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Resume Studio
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setUploadDialogOpen(true)}
                  className="h-11 px-5 text-sm font-semibold gap-2 border-border hover:bg-secondary/70"
                >
                  <UploadCloud className="w-4 h-4 text-primary" />
                  Upload & AI Parse Resume
                </Button>

                <Link href="/jobs">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-11 px-4 text-sm font-semibold gap-2 text-accent hover:text-accent"
                  >
                    <Zap className="w-4 h-4" />
                    72h Job Radar →
                  </Button>
                </Link>
              </div>

              {/* Trust & Proof points */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80">
                <div>
                  <div className="text-2xl font-black font-display text-primary">94%</div>
                  <div className="text-xs text-muted-foreground mt-0.5">ATS Pass Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-display text-accent">&lt; 72h</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Fresh Job Radar</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-display text-emerald-500">100%</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Neon DB Synced</div>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Interactive Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl border border-border bg-card shadow-2xl p-5 space-y-4 relative z-10 overflow-hidden">
                {/* Header of mockup */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold font-display text-foreground">
                      Enhancv Studio Engine
                    </span>
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    ATS 94 / 100
                  </div>
                </div>

                {/* Mockup Resume Canvas Preview */}
                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Alex Vance</h4>
                      <p className="text-xs text-primary font-semibold">Lead Full Stack & AI Architect</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                    </div>
                  </div>

                  {/* Drag Handle Mockup 1 */}
                  <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Move className="w-3 h-3 text-muted-foreground" />
                        Work Experience • Veloce AI
                      </span>
                      <span className="text-[10px] font-bold text-accent bg-accent/15 px-1.5 py-0.5 rounded">
                        AI STAR Checked ✓
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pl-4">
                      Architected low-latency Next.js platform handling 4.5M monthly users, cutting inference costs by 42%.
                    </p>
                  </div>

                  {/* Drag Handle Mockup 2: Skills with custom tags */}
                  <div className="p-2.5 rounded-lg border border-border bg-card space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Move className="w-3 h-3 text-muted-foreground" />
                        Skills & Competencies
                      </span>
                      <span className="text-[10px] text-primary font-semibold cursor-pointer">
                        + Add Custom Field
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground font-medium">Next.js 16</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground font-medium">PostgreSQL / Neon</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground font-medium">TypeScript</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground font-medium">ATS Optimization</span>
                    </div>
                  </div>
                </div>

                {/* 72h Job Match Alert Strip */}
                <div className="p-3 rounded-xl border border-accent/30 bg-accent/10 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-accent" />
                      Live Match (3h ago):
                    </span>
                    <p className="text-[11px] text-muted-foreground">Staff AI Platform Engineer @ Vercel</p>
                  </div>
                  <Link href="/jobs" className="text-xs font-bold text-accent hover:underline flex items-center">
                    98% Fit →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 md:py-24 bg-card/40 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Engineered For Modern Job Seekers
            </h2>
            <h3 className="text-3xl font-bold font-display tracking-tight text-foreground">
              Everything Enhancv Has — Plus AI Job Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              ResuFlow AI bridges the gap between crafting an aesthetically flawless resume and landing interviews within 72 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-primary/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Move className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors">
                1. Drag-and-Drop Enhancv Studio
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add, edit, delete, and reorder any section on the fly. Create dynamic custom fields like "Publications", "Awards", "Patents", or "Languages" with zero formatting headaches.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display text-foreground group-hover:text-accent transition-colors">
                2. AI Resume Upload & Parsing
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload your existing PDF, DOCX, or text resume. Our intelligent parser maps your work history, skills taxonomy, and education into ready-to-edit interactive fields.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-emerald-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display text-foreground group-hover:text-emerald-500 transition-colors">
                3. AI Grammar & STAR Bullet Enhancer
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transform passive bullets into executive achievements. Apply the STAR method (Situation, Task, Action, Result) and inject quantifiable metrics (% and $) with one click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-emerald-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display text-foreground group-hover:text-emerald-500 transition-colors">
                4. 0-100 ATS Scanner & Job Matcher
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste any target job description from LinkedIn or Indeed to calculate a detailed keyword match percentage, spot missing terms, and get an automated fix roadmap.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display text-foreground group-hover:text-accent transition-colors">
                5. Latest 72h AI Job Radar
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Live aggregator tracking verified engineering and tech positions posted within the last 72 hours. Automatically scored and prioritized for your resume profile.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-primary/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors">
                6. Neon DB Cloud & Google Login
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                One-click Google authentication with zero password hassle. Your resumes and job match reports automatically persist in serverless Neon PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Templates Preview Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-accent font-mono">
                Pixel-Perfect Presentation
              </h2>
              <h3 className="text-3xl font-bold font-display tracking-tight text-foreground mt-1">
                4 Premium Enhancv-Style Layouts
              </h3>
            </div>

            {/* Layout tabs */}
            <div className="flex rounded-lg bg-secondary p-1 gap-1">
              {[
                { id: 'modern', label: 'Modern Compact' },
                { id: 'executive', label: 'Executive Grid' },
                { id: 'minimal', label: 'Minimalist Tech' },
                { id: 'creative', label: 'Creative Slate' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTemplateTab(tab.id as any)}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
                    activeTemplateTab === tab.id
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Card Showing Template Preview */}
          <div className="p-8 rounded-2xl border border-border bg-card shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <span className="text-xs font-bold text-primary font-mono uppercase">
                {activeTemplateTab === 'modern'
                  ? 'Layout 1: Enhancv Iconic'
                  : activeTemplateTab === 'executive'
                  ? 'Layout 2: Executive Authority'
                  : activeTemplateTab === 'minimal'
                  ? 'Layout 3: Pure Tech Focus'
                  : 'Layout 4: Creative Sidebar'}
              </span>
              <h4 className="text-2xl font-bold font-display text-foreground">
                {activeTemplateTab === 'modern' && 'Balanced Two-Column with High ATS Density'}
                {activeTemplateTab === 'executive' && 'Deep Top Header with Chronological Timeline'}
                {activeTemplateTab === 'minimal' && 'Monospaced GitHub-Style Developer Aesthetic'}
                {activeTemplateTab === 'creative' && 'High-Contrast Slate Sidebar with Skill Meters'}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeTemplateTab === 'modern' &&
                  'The standard in modern Silicon Valley tech resumes. Compact margins allow fitting 5+ years of senior experience onto a single pristine page.'}
                {activeTemplateTab === 'executive' &&
                  'Ideal for VP, Director, and Staff architect candidates wanting to emphasize team leadership, governance, and business revenue impact.'}
                {activeTemplateTab === 'minimal' &&
                  'Engineered for maximum readability with ATS parsers like Workday, Greenhouse, Lever, and Taleo with zero parsing friction.'}
                {activeTemplateTab === 'creative' &&
                  'Features a dedicated sidebar for contact details, technical stack badges, and education, leaving the main canvas for high-impact achievements.'}
              </p>
              <div className="pt-2">
                <Button size="sm" onClick={handleStartBuilding} className="gap-1.5 font-bold">
                  Customize This Template in Studio →
                </Button>
              </div>
            </div>

            <div className="md:col-span-7 bg-background border border-border rounded-xl p-6 shadow-inner space-y-3 font-sans">
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <h5 className="font-bold text-sm text-foreground">Jordan Mercer</h5>
                  <p className="text-xs text-primary font-medium">Principal Cloud Architect</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">contact@mercer.dev</span>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Key Experience
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Staff Infrastructure Engineer</span>
                    <span className="text-muted-foreground text-[10px]">2022 - Present</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    • Directed migration of 140 microservices to Neon serverless DB, lowering p99 latency by 38%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-10 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xs">
              R
            </div>
            <span className="font-semibold text-foreground">ResuFlow AI</span>
            <span>• Fullstack Enhancv-Style Resume Builder & 72h Job Matcher</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setNeonModalOpen(true)}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Database className="w-3 h-3 text-emerald-500" />
              Neon PostgreSQL
            </button>
            <Link href="/ats" className="hover:text-foreground transition-colors">
              ATS Diagnostics
            </Link>
            <Link href="/jobs" className="hover:text-foreground transition-colors">
              72h Jobs
            </Link>
          </div>
        </div>
      </footer>

      <GoogleAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <NeonConfigModal open={neonModalOpen} onOpenChange={setNeonModalOpen} />
      <ResumeUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  );
}
