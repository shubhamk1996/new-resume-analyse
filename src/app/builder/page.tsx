'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useResumeStore } from '@/lib/resume-store';
import { SectionManager } from '@/components/studio/section-manager';
import { StyleToolbar } from '@/components/studio/style-toolbar';
import { ResumeCanvas } from '@/components/studio/resume-canvas';
import { GoogleAuthModal } from '@/components/google-auth-modal';
import { ResumeUploadDialog } from '@/components/resume-upload-dialog';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  UploadCloud,
  FileCheck2,
  Briefcase,
  Share2,
  ChevronRight,
  Eye,
  Sliders,
  PenTool,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromQuery = searchParams.get('id');

  const {
    getActiveResume,
    setActiveResumeId,
    updateActiveResume,
    user,
  } = useResumeStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (idFromQuery) {
      setActiveResumeId(idFromQuery);
    }
  }, [idFromQuery, setActiveResumeId]);

  const resume = getActiveResume();
  const atsScore = resume?.atsDiagnostic?.score || 91;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Studio Top Navigation Bar */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Editable Resume Title */}
          <div className="flex items-center gap-2 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <Input
                  value={resume.title}
                  onChange={(e) => updateActiveResume({ title: e.target.value })}
                  className="h-7 text-xs font-bold w-44 sm:w-64"
                  autoFocus
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-emerald-500"
                  onClick={() => setIsEditingTitle(false)}
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer group flex items-center gap-1.5 truncate"
                title="Click to rename"
              >
                <span className="text-xs sm:text-sm font-bold font-display text-foreground group-hover:text-primary transition-colors truncate">
                  {resume.title}
                </span>
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 hidden sm:inline">
                  (edit)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center / Right Control Cluster */}
        <div className="flex items-center gap-2">
          {/* Mobile View Toggle */}
          <div className="flex sm:hidden rounded-lg bg-secondary p-0.5 border border-border">
            <button
              onClick={() => setMobileTab('editor')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${
                mobileTab === 'editor' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${
                mobileTab === 'preview' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ATS Score Pill link */}
          <Link
            href="/ats"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors shadow-xs"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>ATS {atsScore}%</span>
            <span className="text-[10px] hidden md:inline opacity-80">Diagnostics →</span>
          </Link>

          {/* 72h Job Radar Link */}
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-colors hidden sm:flex"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>72h Jobs</span>
          </Link>

          {/* Upload Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
            className="h-8 text-xs gap-1 hidden md:flex"
          >
            <UploadCloud className="w-3.5 h-3.5 text-primary" />
            Upload / Replace
          </Button>

          {/* User Avatar */}
          {user ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-primary/50 transition-colors"
              title={user.name}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            </button>
          ) : (
            <Button
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="h-8 text-xs font-semibold"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Builder Controls & Sections (Desktop always visible, Mobile tab-based) */}
        <div
          className={`w-full md:w-[48%] lg:w-[44%] xl:w-[42%] flex flex-col border-r border-border bg-background overflow-y-auto ${
            mobileTab === 'editor' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <div className="p-3 sm:p-5 space-y-4 max-w-2xl mx-auto w-full">
            {/* Style & Theme customizer */}
            <StyleToolbar />

            {/* Enhancv Section Manager */}
            <SectionManager />
          </div>
        </div>

        {/* Right Side: Live Interactive Resume Canvas (Desktop sticky scroll, Mobile tab-based) */}
        <div
          className={`w-full md:w-[52%] lg:w-[56%] xl:w-[58%] flex flex-col bg-muted/30 overflow-hidden ${
            mobileTab === 'preview' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <ResumeCanvas />
        </div>
      </div>

      {/* Modals */}
      <GoogleAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <ResumeUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-muted-foreground">Loading Resume Studio...</div>}>
      <AuthGuard featureName="Enhancv-Style Resume Studio">
        <BuilderContent />
      </AuthGuard>
    </Suspense>
  );
}
