'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/lib/resume-store';
import { toast } from 'sonner';
import { Database, CheckCircle2, AlertCircle, Loader2, Sparkles, Server } from 'lucide-react';

interface NeonConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NeonConfigModal({ open, onOpenChange }: NeonConfigModalProps) {
  const { user, setNeonDbConfig } = useResumeStore();
  const [connectionString, setConnectionString] = useState(
    user?.neonDbUrl || 'postgresql://resuflow_admin:p_secret_neon_2026@ep-cool-cloud-781291.us-east-2.aws.neon.tech/neondb?sslmode=require'
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/neon/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString }),
      });
      const data = await res.json();

      if (data.success) {
        setTestResult({ success: true, message: data.message });
        await setNeonDbConfig(connectionString);
        toast.success('Connected to Neon Database successfully!');
      } else {
        setTestResult({ success: false, message: data.error || 'Connection verification failed' });
        toast.error('Neon connection failed');
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Network error' });
      toast.error('Network error testing connection');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 bg-card border-border shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold font-display">
                Neon PostgreSQL Cloud Database
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Serverless PostgreSQL storage engine for real-time resume persistence.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Status Badge */}
          <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">Neon Serverless Engine: Online</p>
                <p className="text-[11px] text-muted-foreground">Auto-scaling pooled connections with SSL</p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              Ready
            </span>
          </div>

          <form onSubmit={handleTestAndSave} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Neon Connection String (Direct or Pooled)
              </label>
              <Input
                type="text"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                placeholder="postgresql://user:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require"
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Tip: Default pre-configured cloud endpoint is active. You can paste your own custom Neon DB credentials if desired.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button type="submit" size="sm" disabled={testing} className="gap-1.5">
                {testing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5" />
                    Save & Test Connection
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
