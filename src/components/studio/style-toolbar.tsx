'use client';

import { useResumeStore } from '@/lib/resume-store';
import { ResumeColor, TemplateId } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Palette,
  Layout,
  Type,
  Printer,
  Download,
  Copy,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

export function StyleToolbar() {
  const { getActiveResume, updateActiveResume, duplicateResume } = useResumeStore();
  const resume = getActiveResume();

  const colors: { id: ResumeColor; label: string; hex: string; bgClass: string }[] = [
    { id: 'cobalt', label: 'Cobalt', hex: '#2563eb', bgClass: 'bg-blue-600' },
    { id: 'emerald', label: 'Emerald', hex: '#059669', bgClass: 'bg-emerald-600' },
    { id: 'slate', label: 'Slate', hex: '#334155', bgClass: 'bg-slate-700' },
    { id: 'crimson', label: 'Crimson', hex: '#e11d48', bgClass: 'bg-rose-600' },
    { id: 'amber', label: 'Amber', hex: '#d97706', bgClass: 'bg-amber-600' },
    { id: 'violet', label: 'Violet', hex: '#7c3aed', bgClass: 'bg-violet-600' },
  ];

  const templates: { id: TemplateId; label: string; desc: string }[] = [
    { id: 'modern-compact', label: 'Modern Compact', desc: 'Enhancv iconic high-density layout' },
    { id: 'executive-grid', label: 'Executive Grid', desc: 'Authoritative two-column timeline' },
    { id: 'minimal-tech', label: 'Minimalist Tech', desc: 'Clean, ATS-prioritized engineering style' },
    { id: 'creative-slate', label: 'Creative Slate', desc: 'Bold sidebar and accent highlights' },
  ];

  const fonts: { id: 'sans' | 'display' | 'serif' | 'mono'; label: string }[] = [
    { id: 'sans', label: 'Plus Jakarta Sans' },
    { id: 'display', label: 'Space Grotesk' },
    { id: 'serif', label: 'Source Serif' },
    { id: 'mono', label: 'JetBrains Mono' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Resume JSON exported successfully');
  };

  const handleDuplicate = () => {
    const newId = duplicateResume(resume.id);
    toast.success('Resume duplicated successfully');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xs space-y-3">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1 mr-1">
            <Layout className="w-3.5 h-3.5 text-primary" />
            Template:
          </span>
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => updateActiveResume({ templateId: tpl.id })}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap ${
                resume.templateId === tpl.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            title="Export JSON"
            className="h-8 text-xs gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            title="Duplicate"
            className="h-8 text-xs gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Download PDF / Print
          </Button>
        </div>
      </div>

      {/* Second Row: Theme Color, Font, and Spacing */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Theme Colors */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" />
            Accent:
          </span>
          <div className="flex items-center gap-1.5">
            {colors.map((c) => {
              const isSelected = resume.themeColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateActiveResume({ themeColor: c.id })}
                  title={c.label}
                  className={`w-6 h-6 rounded-full transition-transform ${c.bgClass} ${
                    isSelected
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110 shadow-xs'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
            Font:
          </span>
          <select
            value={resume.fontFamily || 'sans'}
            onChange={(e) => updateActiveResume({ fontFamily: e.target.value as any })}
            className="h-7 text-xs rounded-md border border-border bg-background px-2 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {fonts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Spacing Density */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase mr-1">
            Spacing:
          </span>
          {(['compact', 'normal', 'spacious'] as const).map((space) => (
            <button
              key={space}
              type="button"
              onClick={() => updateActiveResume({ fontSize: space })}
              className={`text-[11px] capitalize px-2 py-0.5 rounded transition-all ${
                resume.fontSize === space
                  ? 'bg-secondary font-bold text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {space}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
