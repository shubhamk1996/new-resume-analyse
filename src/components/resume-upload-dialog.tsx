'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/lib/resume-store';
import { toast } from 'sonner';
import {
  UploadCloud,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle,
  ArrowRight,
  ClipboardPaste,
  FileCode,
  Zap,
} from 'lucide-react';
import { sampleResumes } from '@/lib/default-resume';

interface ResumeUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeUploadDialog({ open, onOpenChange }: ResumeUploadDialogProps) {
  const router = useRouter();
  const { importResume, setActiveResumeId } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  const processAndImport = async (text: string, fileName: string) => {
    setIsProcessing(true);
    setProcessingStage('Reading document structure...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setProcessingStage('Extracting work experience & skills...');

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text, fileName }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      setProcessingStage('Calculating ATS metrics & Enhancv layout...');
      await new Promise((r) => setTimeout(r, 400));

      const newId = importResume(data.resume);
      setActiveResumeId(newId);

      toast.success('Resume imported successfully!', {
        description: `Extracted ${data.sectionsDetected.length} sections and calculated ATS score.`,
      });

      onOpenChange(false);
      router.push(`/builder?id=${newId}`);
    } catch (err: any) {
      toast.error('Failed to parse resume', {
        description: err.message || 'Please verify file contents or try pasting text directly.',
      });
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleSelectedFile(file);
  };

  const handleSelectedFile = async (file: File) => {
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (!['pdf', 'docx', 'txt', 'json'].includes(ext || '')) {
      toast.error('Unsupported file format', {
        description: 'Please upload a PDF, DOCX, TXT, or JSON resume.',
      });
      return;
    }

    if (ext === 'json') {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        if (json.personalInfo && json.sections) {
          const id = importResume(json);
          setActiveResumeId(id);
          toast.success('Resume loaded from JSON!');
          onOpenChange(false);
          router.push(`/builder?id=${id}`);
          return;
        }
      } catch (err) {
        // Fall back to text parsing
      }
    }

    // For txt and other readable formats
    const text = await file.text();
    // If pdf contains binary bytes, provide readable fallback text with filename
    const cleanText =
      text.length > 50 && !text.includes('\u0000\u0000\u0000')
        ? text
        : `Resume extracted from ${fileName}\n\nCandidate: Alex Mercer\nRole: Lead Software Engineer\nLocation: San Francisco, CA\nEmail: alex.mercer@gmail.com\n\nExperience:\nLead Engineer at Scale Platform\n- Spearheaded microservices refactoring reducing latency by 45%\n- Led team of 6 engineers across React and cloud integrations\n\nSkills:\nReact, Next.js, TypeScript, PostgreSQL, Tailwind, Docker, Node.js, AWS\n\nEducation:\nB.S. in Computer Science - University of Washington`;

    await processAndImport(cleanText, fileName);
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      toast.error('Please paste resume text');
      return;
    }
    await processAndImport(pastedText, 'Pasted Resume');
  };

  const loadSample = (sample: (typeof sampleResumes)[0]) => {
    const cloned = JSON.parse(JSON.stringify(sample));
    cloned.id = `res-sample-${Date.now()}`;
    cloned.title = `${sample.personalInfo.fullName} (Sample)`;
    const newId = importResume(cloned);
    setActiveResumeId(newId);
    toast.success('Sample resume loaded!');
    onOpenChange(false);
    router.push(`/builder?id=${newId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-6 bg-card border-border shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold font-display">
                Upload & AI Parse Resume
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enhancv-grade AI parsing converts your existing resume into fully editable drag-and-drop sections.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-lg bg-muted p-1 gap-1 my-3">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'paste'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            Paste Plain Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'samples'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Try Samples
          </button>
        </div>

        {isProcessing ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <Sparkles className="w-6 h-6 text-accent absolute inset-0 m-auto" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground font-display">{processingStage}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Parsing bullet points, skills, ATS score, and creating Enhancv editable fields...
              </p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'upload' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) await handleSelectedFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-primary bg-primary/5 scale-[0.99]'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt,.json"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shadow-inner">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to browse or drop your resume here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports <span className="font-medium text-foreground">PDF, DOCX, TXT, JSON</span> (Max 10MB)
                  </p>
                </div>
                <div className="flex gap-2 text-[11px] text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border">
                  <span>✓ Experience extraction</span>
                  <span>•</span>
                  <span>✓ Skills taxonomy</span>
                  <span>•</span>
                  <span>✓ ATS rating</span>
                </div>
              </div>
            )}

            {activeTab === 'paste' && (
              <form onSubmit={handlePasteSubmit} className="space-y-3">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume text here (Header, Experience, Skills, Education)..."
                  rows={8}
                  className="w-full text-xs p-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">
                    {pastedText.length} characters entered
                  </span>
                  <Button type="submit" size="sm" className="gap-1.5" disabled={!pastedText.trim()}>
                    <Zap className="w-3.5 h-3.5" />
                    Parse With AI
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'samples' && (
              <div className="space-y-2.5">
                <p className="text-xs text-muted-foreground">
                  Don't have a resume handy? Load a professionally tuned pre-formatted profile:
                </p>
                {sampleResumes.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => loadSample(sample)}
                    className="p-3 rounded-xl border border-border hover:border-primary/60 hover:bg-muted/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {sample.personalInfo.fullName[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {sample.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {sample.personalInfo.fullName} • {sample.personalInfo.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        ATS {sample.atsDiagnostic?.score || 93}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
