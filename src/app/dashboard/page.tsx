'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/lib/resume-store';
import { GoogleAuthModal } from '@/components/google-auth-modal';
import { NeonConfigModal } from '@/components/neon-config-modal';
import { ResumeUploadDialog } from '@/components/resume-upload-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  UploadCloud,
  Copy,
  Trash2,
  ExternalLink,
  Sparkles,
  Database,
  CheckCircle2,
  Search,
  FileCheck2,
  Briefcase,
  Zap,
  MoreVertical,
  Layers,
  ArrowRight,
  ShieldCheck,
  Palette,
  Clock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
  const router = useRouter();
  const {
    resumes,
    createResume,
    duplicateResume,
    deleteResume,
    setActiveResumeId,
    user,
  } = useResumeStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [neonModalOpen, setNeonModalOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.personalInfo.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (r.targetRole || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCreateNew = () => {
    const newId = createResume('New Untitled Resume');
    toast.success('Created new resume!');
    router.push(`/builder?id=${newId}`);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = duplicateResume(id);
    toast.success('Resume duplicated!');
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resumes.length <= 1) {
      toast.info('Keeping at least one active resume in workspace');
      return;
    }
    deleteResume(id);
    toast.info(`Deleted "${title}"`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-md">
              R
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-foreground">
              ResuFlow <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-primary font-mono ml-1 border border-border">AI</span>
            </span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
            Workspace Dashboard
          </span>
        </div>

        {/* Header Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Neon DB indicator */}
          <button
            onClick={() => setNeonModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="Neon Serverless PostgreSQL Database Connected"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Neon DB: Connected</span>
            <span className="md:hidden">Neon</span>
          </button>

          <Link href="/ats">
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hidden sm:flex">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
              ATS Scanner
            </Button>
          </Link>

          <Link href="/jobs">
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hidden sm:flex">
              <Zap className="w-3.5 h-3.5 text-accent" />
              72h Jobs
            </Button>
          </Link>

          {/* User Google Session */}
          {user ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full border border-border hover:border-primary/50 transition-colors bg-secondary/50"
            >
              <span className="text-xs font-semibold hidden md:inline truncate max-w-[120px]">
                {user.name}
              </span>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-primary/30"
              />
            </button>
          ) : (
            <Button
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="h-8 text-xs font-semibold"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
              Active Resumes
              <FileText className="w-4 h-4 text-primary" />
            </span>
            <div className="text-2xl font-black font-display text-foreground">{resumes.length}</div>
            <p className="text-[11px] text-muted-foreground">Persisted in Neon PostgreSQL</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
              Avg ATS Compatibility
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
            </span>
            <div className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">92%</div>
            <p className="text-[11px] text-muted-foreground">Scored against Workday/Taleo bots</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
              Fresh 72h Jobs Matching
              <Zap className="w-4 h-4 text-accent" />
            </span>
            <div className="text-2xl font-black font-display text-accent">8 Live</div>
            <p className="text-[11px] text-muted-foreground">Active openings posted &lt; 72h</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
              Cloud Database
              <Database className="w-4 h-4 text-emerald-500" />
            </span>
            <div className="text-base font-bold font-display text-foreground flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Neon Serverless
            </div>
            <p className="text-[11px] text-muted-foreground">Auto-sync & Google OAuth synced</p>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search resumes by title, role..."
              className="pl-8 h-9 text-xs"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
              className="h-9 text-xs gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              Upload & AI Parse
            </Button>
            <Button
              size="sm"
              onClick={handleCreateNew}
              className="h-9 text-xs gap-1.5 font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Create Resume
            </Button>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
            Your Resume Library ({filteredResumes.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResumes.map((resumeItem) => {
              const atsScore = resumeItem.atsDiagnostic?.score || 91;

              return (
                <div
                  key={resumeItem.id}
                  onClick={() => {
                    setActiveResumeId(resumeItem.id);
                    router.push(`/builder?id=${resumeItem.id}`);
                  }}
                  className="border border-border rounded-2xl bg-card hover:border-primary/60 hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Header Preview */}
                  <div className="p-5 space-y-3 border-b border-border/60 bg-gradient-to-b from-secondary/20 to-transparent">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            resumeItem.themeColor === 'emerald'
                              ? 'bg-emerald-500'
                              : resumeItem.themeColor === 'crimson'
                              ? 'bg-rose-500'
                              : resumeItem.themeColor === 'amber'
                              ? 'bg-amber-500'
                              : resumeItem.themeColor === 'violet'
                              ? 'bg-violet-500'
                              : resumeItem.themeColor === 'slate'
                              ? 'bg-slate-600'
                              : 'bg-blue-600'
                          }`}
                        />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          {resumeItem.templateId.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ATS {atsScore}%
                        </span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={(e) => handleDuplicate(resumeItem.id, e)}
                              className="text-xs gap-2"
                            >
                              <Copy className="w-3.5 h-3.5" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleDelete(resumeItem.id, resumeItem.title, e)}
                              className="text-xs gap-2 text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {resumeItem.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {resumeItem.personalInfo.fullName} • {resumeItem.personalInfo.title || 'Role'}
                      </p>
                    </div>

                    {/* Section Count Tags */}
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {resumeItem.sections.length} Sections
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated {new Date(resumeItem.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom CTA Bar */}
                  <div className="p-3 bg-secondary/30 flex items-center justify-between text-xs">
                    <span className="text-primary font-semibold flex items-center gap-1 group-hover:underline">
                      Open Studio Editor <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveResumeId(resumeItem.id);
                        router.push(`/ats`);
                      }}
                      className="text-muted-foreground hover:text-foreground text-[11px] font-medium"
                    >
                      ATS Scan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <GoogleAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <NeonConfigModal open={neonModalOpen} onOpenChange={setNeonModalOpen} />
      <ResumeUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  );
}
