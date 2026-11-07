'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/lib/resume-store';
import { GoogleAuthModal } from '@/components/google-auth-modal';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Lock,
  Database,
  FileText,
  Zap,
} from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  featureName?: string;
  pageTitle?: string;
}

export function AuthGuard({ children, featureName, pageTitle }: AuthGuardProps) {
  const displayTitle = featureName || pageTitle || 'Protected Page';
  const { user } = useResumeStore();
  const [modalOpen, setModalOpen] = useState(false);

  // If user is authenticated with Google, allow access
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated, render Google Login Wall
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-md">
            R
          </div>
          <span className="font-display font-extrabold text-base tracking-tight text-foreground">
            ResuFlow <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-primary font-mono ml-1 border border-border">AI</span>
          </span>
        </Link>

        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Auth Guard Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          {/* Lock Icon with Google Logo */}
          <div className="mx-auto relative w-16 h-16 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white shadow-xs">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-foreground">
              Sign In with Google Required
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To access <span className="font-semibold text-foreground">{displayTitle}</span>, save your resumes, and run ATS scans, please authenticate with your Google account.
            </p>
          </div>

          {/* Pricing Highlight Pill */}
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-xs text-accent space-y-1">
            <div className="font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              First Resume Download is 100% Free!
            </div>
            <p className="text-[11px] text-muted-foreground">
              After first download: only ₹19 for 3 full days of unlimited AI services & job matching.
            </p>
          </div>

          {/* Google Sign In CTA */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              onClick={() => setModalOpen(true)}
              className="w-full h-11 text-xs font-bold gap-2 shadow-md"
            >
              <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google to Continue
            </Button>

            <Link href="/" className="block">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                Return to Landing Page
              </Button>
            </Link>
          </div>

          {/* Secure Cloud footer badge */}
          <div className="pt-2 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-end encrypted with Neon PostgreSQL</span>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        ResuFlow AI • Google OAuth Protected Routes
      </footer>

      <GoogleAuthModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
