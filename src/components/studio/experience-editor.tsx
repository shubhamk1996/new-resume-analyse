'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { ResumeSection, ExperienceItem } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AiBulletAssistantModal } from './ai-bullet-assistant-modal';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building,
  MapPin,
} from 'lucide-react';

interface ExperienceEditorProps {
  section: ResumeSection;
}

export function ExperienceEditor({ section }: ExperienceEditorProps) {
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  const items = (section.items as ExperienceItem[]) || [];

  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);
  const [aiModal, setAiModal] = useState<{
    open: boolean;
    itemId: string;
    bulletIndex: number;
    text: string;
    role: string;
  }>({
    open: false,
    itemId: '',
    bulletIndex: -1,
    text: '',
    role: '',
  });

  const handleUpdate = (itemId: string, patch: Partial<ExperienceItem>) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    updateSectionItem(section.id, itemId, { ...item, ...patch });
  };

  const handleAddBullet = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const bullets = [...(item.bullets || []), 'Achieved key objective with measurable business outcome.'];
    handleUpdate(itemId, { bullets });
  };

  const handleUpdateBullet = (itemId: string, index: number, val: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const bullets = [...item.bullets];
    bullets[index] = val;
    handleUpdate(itemId, { bullets });
  };

  const handleDeleteBullet = (itemId: string, index: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const bullets = item.bullets.filter((_, idx) => idx !== index);
    handleUpdate(itemId, { bullets });
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id}
            className="border border-border rounded-xl bg-card overflow-hidden shadow-xs transition-all"
          >
            {/* Header / Summary Bar */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="p-3 bg-secondary/30 hover:bg-secondary/50 cursor-pointer flex items-center justify-between border-b border-border/50"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  {index + 1}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-foreground truncate">
                    {item.role || 'New Role'}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-normal">
                    @ {item.company || 'Company'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  {item.startDate || 'Start'} — {item.current ? 'Present' : item.endDate || 'End'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSectionItem(section.id, item.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded Edit Form */}
            {isExpanded && (
              <div className="p-4 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      Job Title / Role
                    </label>
                    <Input
                      value={item.role}
                      onChange={(e) => handleUpdate(item.id, { role: e.target.value })}
                      placeholder="e.g. Lead Software Engineer"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Building className="w-3 h-3 text-muted-foreground" />
                      Company Name
                    </label>
                    <Input
                      value={item.company}
                      onChange={(e) => handleUpdate(item.id, { company: e.target.value })}
                      placeholder="e.g. Veloce Systems"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      Location
                    </label>
                    <Input
                      value={item.location}
                      onChange={(e) => handleUpdate(item.id, { location: e.target.value })}
                      placeholder="e.g. San Francisco, CA (Hybrid)"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      Start Date
                    </label>
                    <Input
                      value={item.startDate}
                      onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })}
                      placeholder="e.g. 2022-01 or Jan 2022"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-semibold text-foreground">End Date</label>
                      <label className="text-[10px] text-muted-foreground flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.current}
                          onChange={(e) => handleUpdate(item.id, { current: e.target.checked })}
                          className="rounded text-primary focus:ring-primary w-3 h-3"
                        />
                        Current
                      </label>
                    </div>
                    <Input
                      disabled={item.current}
                      value={item.current ? 'Present' : item.endDate}
                      onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                      placeholder="e.g. 2024-05"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                {/* Bullets List with AI assistant */}
                <div className="space-y-2 pt-1 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Accomplishments & STAR Bullets ({item.bullets?.length || 0})
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBullet(item.id)}
                      className="h-7 text-xs gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Bullet
                    </Button>
                  </div>

                  {item.bullets?.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5 group">
                      <span className="text-xs font-bold text-primary shrink-0 mt-2 select-none">
                        •
                      </span>
                      <textarea
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(item.id, bIdx, e.target.value)}
                        rows={2}
                        className="flex-1 text-xs p-2 rounded-md bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-none leading-relaxed"
                        placeholder="Action verb + context + measurable result..."
                      />
                      <div className="flex flex-col gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Enhance with AI"
                          onClick={() =>
                            setAiModal({
                              open: true,
                              itemId: item.id,
                              bulletIndex: bIdx,
                              text: bullet,
                              role: item.role,
                            })
                          }
                          className="h-7 w-7 text-accent hover:bg-accent/10"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Remove bullet"
                          onClick={() => handleDeleteBullet(item.id, bIdx)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => addSectionItem(section.id)}
        className="w-full border-dashed border-primary/40 hover:border-primary text-xs font-semibold gap-1.5 h-9"
      >
        <Plus className="w-3.5 h-3.5 text-primary" />
        Add Position / Experience
      </Button>

      {aiModal.open && (
        <AiBulletAssistantModal
          open={aiModal.open}
          onOpenChange={(open) => setAiModal((prev) => ({ ...prev, open }))}
          originalText={aiModal.text}
          roleContext={aiModal.role}
          onApply={(improved) => {
            handleUpdateBullet(aiModal.itemId, aiModal.bulletIndex, improved);
          }}
        />
      )}
    </div>
  );
}
