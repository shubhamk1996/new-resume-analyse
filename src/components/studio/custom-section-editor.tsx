'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { ResumeSection, CustomFieldItem } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AiBulletAssistantModal } from './ai-bullet-assistant-modal';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Tag, Calendar, Edit3 } from 'lucide-react';

interface CustomSectionEditorProps {
  section: ResumeSection;
}

export function CustomSectionEditor({ section }: CustomSectionEditorProps) {
  const { addSectionItem, updateSectionItem, deleteSectionItem, updateSectionTitle } = useResumeStore();
  const items = (section.items as CustomFieldItem[]) || [];

  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);
  const [tagInput, setTagInput] = useState<Record<string, string>>({});
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

  const handleUpdate = (itemId: string, patch: Partial<CustomFieldItem>) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    updateSectionItem(section.id, itemId, { ...item, ...patch });
  };

  const handleAddBullet = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const bullets = [...(item.bullets || []), 'Important accomplishment or detail.'];
    handleUpdate(itemId, { bullets });
  };

  const handleUpdateBullet = (itemId: string, index: number, val: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const bullets = [...(item.bullets || [])];
    bullets[index] = val;
    handleUpdate(itemId, { bullets });
  };

  const handleDeleteBullet = (itemId: string, index: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const bullets = (item.bullets || []).filter((_, idx) => idx !== index);
    handleUpdate(itemId, { bullets });
  };

  const handleAddTag = (itemId: string) => {
    const val = tagInput[itemId]?.trim();
    if (!val) return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const tags = [...(item.tags || []), val];
    handleUpdate(itemId, { tags });
    setTagInput((prev) => ({ ...prev, [itemId]: '' }));
  };

  const handleRemoveTag = (itemId: string, tagName: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const tags = (item.tags || []).filter((t) => t !== tagName);
    handleUpdate(itemId, { tags });
  };

  return (
    <div className="space-y-3">
      {/* Section Title Editor */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/40 border border-border">
        <Edit3 className="w-3.5 h-3.5 text-primary shrink-0" />
        <label className="text-xs font-semibold text-muted-foreground shrink-0">
          Section Title:
        </label>
        <Input
          value={section.title}
          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
          placeholder="e.g. Certifications, Volunteering, Languages, Patents"
          className="h-7 text-xs font-bold"
        />
      </div>

      {items.map((item, index) => {
        const isExpanded = expandedId === item.id;

        return (
          <div key={item.id} className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
            <div
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="p-3 bg-secondary/30 hover:bg-secondary/50 cursor-pointer flex items-center justify-between border-b border-border/50"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center shrink-0 text-xs font-bold">
                  {index + 1}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-foreground">
                    {item.title || 'Custom Item'}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs text-muted-foreground ml-1.5 hidden sm:inline">
                      ({item.subtitle})
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
                      Item Title
                    </label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdate(item.id, { title: e.target.value })}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      Organization / Subtitle
                    </label>
                    <Input
                      value={item.subtitle || ''}
                      onChange={(e) => handleUpdate(item.id, { subtitle: e.target.value })}
                      placeholder="e.g. Amazon Web Services"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      Date / Period
                    </label>
                    <Input
                      value={item.date || ''}
                      onChange={(e) => handleUpdate(item.id, { date: e.target.value })}
                      placeholder="e.g. 2024 or Ongoing"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      Short Description (Optional)
                    </label>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
                      placeholder="e.g. Scored in top 5% percentile globally"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1.5">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    Keywords / Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(item.tags || []).map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-secondary border border-border text-foreground"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(item.id, t)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput[item.id] || ''}
                      onChange={(e) => setTagInput((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(item.id);
                        }
                      }}
                      placeholder="Add tag (e.g. Architecture, Honor)..."
                      className="h-7 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddTag(item.id)}
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
                      Bullet Details ({item.bullets?.length || 0})
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
                      <span className="text-xs font-bold text-accent shrink-0 mt-2 select-none">
                        •
                      </span>
                      <textarea
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(item.id, bIdx, e.target.value)}
                        rows={2}
                        className="flex-1 text-xs p-2 rounded-md bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-none leading-relaxed"
                        placeholder="Bullet details..."
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
                          <Trash2 className="w-3.5 h-3.5" />
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
        Add Item to {section.title}
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
