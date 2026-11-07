'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { ResumeSection, ProjectItem } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AiBulletAssistantModal } from './ai-bullet-assistant-modal';
import { Code2, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Link as LinkIcon, Tag } from 'lucide-react';

interface ProjectsEditorProps {
  section: ResumeSection;
}

export function ProjectsEditor({ section }: ProjectsEditorProps) {
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  const items = (section.items as ProjectItem[]) || [];

  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);
  const [techInput, setTechInput] = useState<Record<string, string>>({});
  const [aiModal, setAiModal] = useState<{
    open: boolean;
    itemId: string;
    bulletIndex: number;
    text: string;
    title: string;
  }>({
    open: false,
    itemId: '',
    bulletIndex: -1,
    text: '',
    title: '',
  });

  const handleUpdate = (itemId: string, patch: Partial<ProjectItem>) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    updateSectionItem(section.id, itemId, { ...item, ...patch });
  };

  const handleAddBullet = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const bullets = [...(item.bullets || []), 'Engineered scalable solution delivering high performance.'];
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

  const handleAddTech = (itemId: string) => {
    const val = techInput[itemId]?.trim();
    if (!val) return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const techStack = [...(item.techStack || []), val];
    handleUpdate(itemId, { techStack });
    setTechInput((prev) => ({ ...prev, [itemId]: '' }));
  };

  const handleRemoveTech = (itemId: string, techName: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const techStack = (item.techStack || []).filter((t) => t !== techName);
    handleUpdate(itemId, { techStack });
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isExpanded = expandedId === item.id;

        return (
          <div key={item.id} className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
            <div
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="p-3 bg-secondary/30 hover:bg-secondary/50 cursor-pointer flex items-center justify-between border-b border-border/50"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  {index + 1}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-foreground">
                    {item.title || 'Project Name'}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs text-muted-foreground ml-1.5 hidden sm:inline">
                      — {item.subtitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
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

            {isExpanded && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      Project Title
                    </label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdate(item.id, { title: e.target.value })}
                      placeholder="e.g. ResuFlow Studio"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1">
                      <LinkIcon className="w-3 h-3 text-muted-foreground" />
                      Project URL / GitHub Link
                    </label>
                    <Input
                      value={item.link || ''}
                      onChange={(e) => handleUpdate(item.id, { link: e.target.value })}
                      placeholder="https://github.com/..."
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Short Subtitle or Role
                  </label>
                  <Input
                    value={item.subtitle || ''}
                    onChange={(e) => handleUpdate(item.id, { subtitle: e.target.value })}
                    placeholder="e.g. Next.js 16 Real-Time Resume Optimizer"
                    className="h-8 text-xs"
                  />
                </div>

                {/* Tech Stack Tags */}
                <div>
                  <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1.5">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    Technologies Used
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(item.techStack || []).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-secondary border border-border text-foreground"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(item.id, tech)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={techInput[item.id] || ''}
                      onChange={(e) => setTechInput((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech(item.id);
                        }
                      }}
                      placeholder="Add tech (e.g. Next.js, Redis)..."
                      className="h-7 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddTech(item.id)}
                      className="h-7 px-2 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Bullets */}
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Key Highlights ({item.bullets?.length || 0})
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBullet(item.id)}
                      className="h-6 text-[11px] gap-1"
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
                        placeholder="Highlight or metric..."
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
                              title: item.title,
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
        Add Project
      </Button>

      {aiModal.open && (
        <AiBulletAssistantModal
          open={aiModal.open}
          onOpenChange={(open) => setAiModal((prev) => ({ ...prev, open }))}
          originalText={aiModal.text}
          roleContext={aiModal.title}
          onApply={(improved) => {
            handleUpdateBullet(aiModal.itemId, aiModal.bulletIndex, improved);
          }}
        />
      )}
    </div>
  );
}
