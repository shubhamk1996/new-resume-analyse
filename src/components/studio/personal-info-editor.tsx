'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AiBulletAssistantModal } from './ai-bullet-assistant-modal';
import { Sparkles, User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export function PersonalInfoEditor() {
  const { getActiveResume, updateActiveResume } = useResumeStore();
  const resume = getActiveResume();
  const info = resume.personalInfo;

  const [aiModalOpen, setAiModalOpen] = useState(false);

  const updateInfo = (field: keyof typeof info, value: string) => {
    updateActiveResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-foreground">Personal Information</h3>
            <p className="text-[11px] text-muted-foreground">Header details, contact info & executive summary</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">Full Name</label>
          <Input
            value={info.fullName}
            onChange={(e) => updateInfo('fullName', e.target.value)}
            placeholder="e.g. Alex Vance"
            className="h-9 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">Target Professional Title</label>
          <Input
            value={info.title}
            onChange={(e) => updateInfo('title', e.target.value)}
            placeholder="e.g. Senior Full Stack & AI Architect"
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <Mail className="w-3 h-3 text-muted-foreground" />
            Email
          </label>
          <Input
            value={info.email}
            onChange={(e) => updateInfo('email', e.target.value)}
            placeholder="alex@gmail.com"
            className="h-9 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <Phone className="w-3 h-3 text-muted-foreground" />
            Phone
          </label>
          <Input
            value={info.phone}
            onChange={(e) => updateInfo('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="h-9 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            Location
          </label>
          <Input
            value={info.location}
            onChange={(e) => updateInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <Globe className="w-3 h-3 text-muted-foreground" />
            Portfolio / Website
          </label>
          <Input
            value={info.website}
            onChange={(e) => updateInfo('website', e.target.value)}
            placeholder="https://myportfolio.dev"
            className="h-9 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <Linkedin className="w-3 h-3 text-muted-foreground" />
            LinkedIn Profile
          </label>
          <Input
            value={info.linkedin}
            onChange={(e) => updateInfo('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="h-9 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <Github className="w-3 h-3 text-muted-foreground" />
            GitHub Profile
          </label>
          <Input
            value={info.github}
            onChange={(e) => updateInfo('github', e.target.value)}
            placeholder="https://github.com/username"
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-foreground">
            Professional Summary
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAiModalOpen(true)}
            className="h-6 text-[11px] text-accent hover:text-accent font-semibold gap-1 px-2"
          >
            <Sparkles className="w-3 h-3" />
            AI Polish Summary
          </Button>
        </div>
        <Textarea
          value={info.summary}
          onChange={(e) => updateInfo('summary', e.target.value)}
          placeholder="Brief 2-4 sentence summary of your career achievements, core strengths, and what you bring to the role..."
          rows={3}
          className="text-xs leading-relaxed"
        />
      </div>

      {aiModalOpen && (
        <AiBulletAssistantModal
          open={aiModalOpen}
          onOpenChange={setAiModalOpen}
          originalText={info.summary}
          roleContext={info.title}
          onApply={(improved) => updateInfo('summary', improved)}
        />
      )}
    </div>
  );
}
