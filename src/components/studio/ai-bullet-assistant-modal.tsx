'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Sparkles, Check, ArrowRight, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { EnhanceMode } from '@/app/api/ai/enhance/route';

interface AiBulletAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  onApply: (newText: string) => void;
  roleContext?: string;
}

export function AiBulletAssistantModal({
  open,
  onOpenChange,
  originalText,
  onApply,
  roleContext,
}: AiBulletAssistantModalProps) {
  const [mode, setMode] = useState<EnhanceMode>('grammar');
  const [loading, setLoading] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null);
  const [changesList, setChangesList] = useState<string[]>([]);

  const modes: { id: EnhanceMode; label: string; desc: string; icon: string }[] = [
    { id: 'grammar', label: 'Grammar & Flow', desc: 'Fix typos, grammar & professional wording', icon: '✍️' },
    { id: 'action', label: 'Power Action Verbs', desc: 'Transform passive verbs into decisive leadership verbs', icon: '⚡' },
    { id: 'star', label: 'STAR Method', desc: 'Situation, Task, Action, and measurable Result', icon: '🌟' },
    { id: 'metrics', label: 'Add Metrics & KPIs', desc: 'Inject ATS-friendly % and $ business metrics', icon: '📊' },
    { id: 'executive', label: 'Executive Tone', desc: 'Elevate into senior director/strategic phrasing', icon: '👑' },
    { id: 'concise', label: 'Short & Punchy', desc: 'Strip filler words for fast human & ATS scanning', icon: '✂️' },
  ];

  const handleEnhance = async (selectedMode: EnhanceMode = mode) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          mode: selectedMode,
          role: roleContext || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnhancedResult(data.enhanced);
        setChangesList(data.changes || []);
      } else {
        toast.error('AI improvement failed');
      }
    } catch (err: any) {
      toast.error('Error contacting AI engine');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (enhancedResult) {
      onApply(enhancedResult);
      toast.success('Applied AI enhancement to resume!');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6 bg-card border-border shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold font-display">
                Enhancv AI Content Assistant
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enhance bullet points and descriptions with industry-proven resume formulas.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Mode Selector Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2">
          {modes.map((m) => {
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  handleEnhance(m.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                    : 'border-border hover:border-border/80 bg-background/50 hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">{m.icon}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Comparison Views */}
        <div className="space-y-3 mt-2">
          {/* Original */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Current Text
              </span>
            </div>
            <p className="text-xs text-foreground leading-relaxed font-sans">{originalText || '(Empty bullet)'}</p>
          </div>

          {/* AI Enhanced Output */}
          <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/30 relative">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                AI Enhanced Version ({modes.find((m) => m.id === mode)?.label})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEnhance(mode)}
                disabled={loading}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>

            {loading ? (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Applying {modes.find((m) => m.id === mode)?.label}...</span>
              </div>
            ) : enhancedResult ? (
              <div>
                <p className="text-xs text-foreground leading-relaxed font-medium bg-background/80 p-2.5 rounded border border-border">
                  {enhancedResult}
                </p>

                {changesList.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-border/60">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                      Key Improvements:
                    </p>
                    <ul className="space-y-0.5">
                      {changesList.map((c, idx) => (
                        <li key={idx} className="text-[11px] text-accent flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-accent shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center">
                <Button size="sm" onClick={() => handleEnhance(mode)} className="gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate AI Version
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!enhancedResult || loading}
            className="gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply to Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
