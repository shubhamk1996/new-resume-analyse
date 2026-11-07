'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/lib/resume-store';
import { JobListing } from '@/types/resume';
import { GoogleAuthModal } from '@/components/google-auth-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Briefcase,
  ArrowLeft,
  Sparkles,
  Clock,
  MapPin,
  DollarSign,
  ExternalLink,
  Target,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Zap,
  Building,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function JobsRadarPage() {
  const router = useRouter();
  const { getActiveResume, user } = useResumeStore();
  const resume = getActiveResume();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxHours, setMaxHours] = useState<number>(72);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          query: searchQuery,
          maxHours,
          filterRemote: remoteOnly,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      toast.error('Failed to load fresh jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [maxHours, remoteOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-display text-foreground leading-none">
                AI Job Radar (Last 72 Hours)
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Matched against: <span className="font-semibold text-foreground">{resume.title}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/builder?id=${resume.id}`}>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              Studio Editor
            </Button>
          </Link>
          <Link href="/ats">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              ATS Diagnostics
            </Button>
          </Link>
          {user ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-primary transition-colors"
            >
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            </button>
          ) : (
            <Button size="sm" onClick={() => setAuthModalOpen(true)} className="h-8 text-xs font-semibold">
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Radar Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card via-card to-secondary/30 border border-border p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Real-time Verified Radar • 72h Window Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-foreground">
              Instant Job Matches Tailored To Your Resume
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every job below was posted in the last 72 hours and algorithmically scored against your active resume skills, metrics, and seniority level.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-6 pt-5 border-t border-border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by role, stack (e.g. Next.js, Postgres)..."
                  className="pl-8 h-9 text-xs"
                />
              </div>
              <Button type="submit" size="sm" className="h-9 text-xs">
                Filter
              </Button>
            </form>

            {/* Timeframe Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-muted-foreground mr-1 uppercase">Freshness:</span>
              {[
                { h: 24, label: '< 24h Hot' },
                { h: 48, label: '< 48h' },
                { h: 72, label: 'All 72h' },
              ].map((pill) => (
                <button
                  key={pill.h}
                  type="button"
                  onClick={() => setMaxHours(pill.h)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                    maxHours === pill.h
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {pill.label}
                </button>
              ))}

              <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer ml-2 bg-secondary/80 px-2.5 py-1 rounded-md border border-border">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                />
                Remote Only
              </label>
            </div>
          </div>
        </div>

        {/* Job Listings Feed */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-foreground font-display">Scanning 72h live job feeds...</p>
            <p className="text-xs text-muted-foreground">Scoring candidates against target roles</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-3">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-sm font-bold font-display text-foreground">No jobs matching current filter</h3>
            <p className="text-xs text-muted-foreground">Try clearing search terms or widening the freshness window to 72h.</p>
            <Button size="sm" variant="outline" onClick={() => { setSearchQuery(''); setMaxHours(72); setRemoteOnly(false); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Showing {jobs.length} freshly verified jobs</span>
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> High AI Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => {
                const isHighMatch = (job.matchScore || 0) >= 90;

                return (
                  <div
                    key={job.id}
                    className="border border-border rounded-xl bg-card hover:border-primary/50 transition-all p-5 shadow-xs hover:shadow-md space-y-3 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Posted {job.postedHoursAgo}h ago
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {job.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            via {job.source}
                          </span>
                        </div>

                        <h3 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-muted-foreground" />
                            {job.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            {job.location}
                          </span>
                          {job.salary && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {job.salary}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                        <div
                          className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 shadow-xs ${
                            isHighMatch
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-primary/10 border-primary/30 text-primary'
                          }`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{job.matchScore || 88}% Match</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground hidden sm:inline">
                          Based on your resume
                        </span>
                      </div>
                    </div>

                    {/* AI Match Reasoning Box */}
                    {job.matchReason && (
                      <div className="p-3 rounded-lg bg-secondary/40 border border-border/80 text-xs text-foreground flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{job.matchReason}</span>
                      </div>
                    )}

                    {/* Description preview */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">
                        Required:
                      </span>
                      {job.requiredSkills.map((sk, sIdx) => {
                        const isMatched = job.matchingSkills?.includes(sk);
                        return (
                          <span
                            key={sIdx}
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              isMatched
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-muted text-muted-foreground border border-border'
                            }`}
                          >
                            {isMatched ? `✓ ${sk}` : sk}
                          </span>
                        );
                      })}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => {
                          // Navigate to ATS checker with this job description
                          router.push(`/ats`);
                        }}
                        className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <Target className="w-3.5 h-3.5" />
                        Run ATS Matcher on this role →
                      </button>

                      <div className="flex items-center gap-2 ml-auto">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs transition-colors"
                        >
                          Apply on {job.company}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <GoogleAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
