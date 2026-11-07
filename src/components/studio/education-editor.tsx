'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { ResumeSection, EducationItem } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp, MapPin, Calendar } from 'lucide-react';

interface EducationEditorProps {
  section: ResumeSection;
}

export function EducationEditor({ section }: EducationEditorProps) {
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  const items = (section.items as EducationItem[]) || [];

  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const handleUpdate = (itemId: string, patch: Partial<EducationItem>) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    updateSectionItem(section.id, itemId, { ...item, ...patch });
  };

  const handleAddHighlight = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const highlights = [...(item.highlights || []), 'Dean\'s Honor List or Academic achievement'];
    handleUpdate(itemId, { highlights });
  };

  const handleUpdateHighlight = (itemId: string, index: number, val: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const highlights = [...item.highlights];
    highlights[index] = val;
    handleUpdate(itemId, { highlights });
  };

  const handleDeleteHighlight = (itemId: string, index: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const highlights = item.highlights.filter((_, idx) => idx !== index);
    handleUpdate(itemId, { highlights });
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id}
            className="border border-border rounded-xl bg-card overflow-hidden shadow-xs"
          >
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
                    {item.degree || 'Degree Program'}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    • {item.institution || 'University'}
                  </span>
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
                      Degree / Qualification
                    </label>
                    <Input
                      value={item.degree}
                      onChange={(e) => handleUpdate(item.id, { degree: e.target.value })}
                      placeholder="e.g. B.S. in Computer Science"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      University or School Name
                    </label>
                    <Input
                      value={item.institution}
                      onChange={(e) => handleUpdate(item.id, { institution: e.target.value })}
                      placeholder="e.g. UC Berkeley"
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
                      placeholder="e.g. Berkeley, CA"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      Dates Attended
                    </label>
                    <Input
                      value={item.startDate ? `${item.startDate} - ${item.endDate || 'Present'}` : ''}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        handleUpdate(item.id, {
                          startDate: parts[0]?.trim() || '',
                          endDate: parts[1]?.trim() || '',
                        });
                      }}
                      placeholder="2018 - 2022"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      GPA / Honors (Optional)
                    </label>
                    <Input
                      value={item.gpa || ''}
                      onChange={(e) => handleUpdate(item.id, { gpa: e.target.value })}
                      placeholder="e.g. 3.9 / 4.0"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                {/* Academic Highlights */}
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-foreground">
                      Highlights & Activities
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddHighlight(item.id)}
                      className="h-6 text-[11px] gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Highlight
                    </Button>
                  </div>
                  {item.highlights?.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <Input
                        value={hl}
                        onChange={(e) => handleUpdateHighlight(item.id, hIdx, e.target.value)}
                        placeholder="Academic award, capstone project, or scholarship..."
                        className="h-7 text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteHighlight(item.id, hIdx)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
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
        Add Education Entry
      </Button>
    </div>
  );
}
