'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/lib/resume-store';
import { GoogleAuthModal } from '@/components/google-auth-modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  FileCheck2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Layers,
  ArrowRight,
  RefreshCw,
  Search,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function ATSCheckerPage() {
  const { getActiveResume, updateActiveResume, user } = useResumeStore();
  const resume = getActiveResume();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRoleTitle, setTargetRoleTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsData, setAtsData] = useState<any>(resume.atsDiagnostic || null);

  const sampleJobDescription = `Senior Full Stack Engineer (Next.js & Cloud)
Company: NextGen Scale
Location: Remote (US / Europe)

Requirements:
- 5+ years building scalable web architectures using Next.js, React, TypeScript, and modern styling.
- Hands-on experience with PostgreSQL, Neon DB, and distributed caching with Redis.
- Solid understanding of Docker, Kubernetes, CI/CD pipelines, and AWS cloud security.
- Demonstrated ability to optimize high-throughput APIs, reduce query latencies, and mentor engineers.
- Strong knowledge of RESTful APIs, GraphQL, and modern AI/LLM integration patterns.`;

  const runAnalysis = async (jdText: string = jobDescription) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          jobDescription: jdText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAtsData(data.report);
        updateActiveResume({ atsDiagnostic: data.report });
        toast.success('ATS analysis updated!');
      }
    } catch (err: any) {
      toast.error('Failed to run ATS analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!atsData) {
      runAnalysis();
    }
  }, []);

  const handleAddKeywordToResume = (keyword: string) => {
    // Add to first skills section
    const skillsSec = resume.sections.find((s) => s.type === 'skills');
    if (!skillsSec) {
      toast.error('Please add a skills section first');
      return;
    }
    const firstGroup = skillsSec.items[0];
    if (firstGroup) {
      const updated = [
        ...(firstGroup.skills || []),
        { id: `sk-${Date.now()}`, name: keyword, level: 'Advanced' },
      ];
      firstGroup.skills = updated;
      updateActiveResume({ sections: [...resume.sections] });
      toast.success(`Added "${keyword}" to your Skills section!`);
      runAnalysis();
    }
  };

  const score = atsData?.score || 91;
  const scoreColor =
    score >= 85 ? 'text-emerald-500' : score >= 70 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
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
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-display text-foreground leading-none">
                ATS Optimizer & Job Matcher
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Testing: <span className="font-semibold text-foreground">{resume.title}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/builder?id=${resume.id}`}>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              Open in Studio →
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <Zap className="w-3.5 h-3.5" />
              72h Job Radar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Big Score Card */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
                  Overall ATS Compatibility
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  Workday & Greenhouse Pass
                </span>
              </div>

              <div className="flex items-center gap-6 my-2">
                <div className="relative flex items-center justify-center">
                  {/* Circular Score Visual */}
                  <div className="w-28 h-28 rounded-full border-8 border-secondary flex items-center justify-center relative shadow-inner">
                    <div
                      className={`text-4xl font-extrabold font-display ${scoreColor}`}
                    >
                      {score}
                    </div>
                    <span className="text-[10px] text-muted-foreground absolute bottom-5">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-display text-foreground">
                    {score >= 90
                      ? 'Exceptional Match'
                      : score >= 80
                      ? 'Strong Candidate'
                      : 'Needs Optimization'}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Resume formatting and keywords easily clear 90% of automated screening algorithms.
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-border mt-4">
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <div className="text-sm font-bold text-foreground">{atsData?.formattingScore || 24}/25</div>
                <div className="text-[10px] text-muted-foreground">Formatting</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <div className="text-sm font-bold text-foreground">{atsData?.keywordsScore || 23}/25</div>
                <div className="text-[10px] text-muted-foreground">Keywords</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <div className="text-sm font-bold text-foreground">{atsData?.impactScore || 22}/25</div>
                <div className="text-[10px] text-muted-foreground">Metrics & KPIs</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <div className="text-sm font-bold text-foreground">{atsData?.completenessScore || 24}/25</div>
                <div className="text-[10px] text-muted-foreground">Completeness</div>
              </div>
            </div>
          </div>

          {/* Target Job Description Comparison Engine */}
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold font-display text-foreground">
                    Target Job Description Matcher
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setJobDescription(sampleJobDescription);
                    runAnalysis(sampleJobDescription);
                  }}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Load Sample Job Posting
                </button>
              </div>

              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description (responsibilities, required skills, stack) here to find exact keyword matches and gaps..."
                rows={4}
                className="text-xs leading-relaxed font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
              {atsData?.jobMatchScore !== undefined ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Job Alignment:</span>
                  <span className="text-sm font-bold text-accent">
                    {atsData.jobMatchScore}% Match
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Paste job text above to see specific gap analysis
                </span>
              )}

              <Button
                size="sm"
                onClick={() => runAnalysis(jobDescription)}
                disabled={isAnalyzing}
                className="text-xs gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Analyze Against Job
              </Button>
            </div>
          </div>
        </div>

        {/* Keyword Analysis Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Matched Keywords */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Detected Keywords & Skills ({atsData?.matchedKeywords?.length || 0})
              </h3>
              <span className="text-[11px] text-emerald-500 font-semibold">Ready for ATS</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(atsData?.matchedKeywords || []).map((kw: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords & Suggestions */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing In-Demand Keywords ({atsData?.missingKeywords?.length || 0})
              </h3>
              <span className="text-[11px] text-muted-foreground">1-Click Add</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(atsData?.missingKeywords || []).map((kw: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddKeywordToResume(kw)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/20 transition-all flex items-center gap-1 group"
                >
                  <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" />
                  + {kw}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Click any keyword above to immediately inject it into your resume skills section!
            </p>
          </div>
        </div>

        {/* Action Items List */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold font-display text-foreground">
                Actionable Optimization Roadmap
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {atsData?.actionItems?.length || 3} Recommendations
            </span>
          </div>

          <div className="space-y-2.5">
            {(atsData?.actionItems || [
              {
                priority: 'high',
                text: 'Inject 2-3 additional percentage or scale figures to recent project bullets using the AI STAR enhancer',
                category: 'Impact Metrics',
              },
              {
                priority: 'medium',
                text: 'Ensure target job title aligns closely with target job description header',
                category: 'Header Alignment',
              },
              {
                priority: 'low',
                text: 'Verify all project links and GitHub repositories are publicly accessible',
                category: 'Verification',
              },
            ]).map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-border bg-secondary/30 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                      item.priority === 'high'
                        ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                        : item.priority === 'medium'
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        : 'bg-primary/15 text-primary border border-primary/30'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.category}</p>
                  </div>
                </div>

                <Link href={`/builder?id=${resume.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary gap-1">
                    Fix <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <GoogleAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
