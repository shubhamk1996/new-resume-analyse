'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { ResumeSection, SkillLevel } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X, Sparkles, Tag, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface SkillsEditorProps {
  section: ResumeSection;
}

export function SkillsEditor({ section }: SkillsEditorProps) {
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  const groups = section.items || [];

  const [newSkillName, setNewSkillName] = useState<Record<string, string>>({});
  const [newSkillLevel, setNewSkillLevel] = useState<Record<string, SkillLevel>>({});

  const popularSuggestions = [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'PostgreSQL / Neon',
    'Tailwind CSS',
    'Node.js',
    'Docker',
    'AWS Cloud',
    'REST & GraphQL',
    'CI/CD Pipelines',
    'System Design',
    'Prompt Engineering / RAG',
  ];

  const handleAddSkill = (groupId: string) => {
    const name = newSkillName[groupId]?.trim();
    if (!name) return;

    const group = groups.find((g: any) => g.id === groupId);
    if (!group) return;

    const level = newSkillLevel[groupId] || 'Advanced';
    const updatedSkills = [
      ...(group.skills || []),
      { id: `sk-${Date.now()}`, name, level },
    ];

    updateSectionItem(section.id, groupId, { ...group, skills: updatedSkills });
    setNewSkillName((prev) => ({ ...prev, [groupId]: '' }));
  };

  const handleRemoveSkill = (groupId: string, skillId: string) => {
    const group = groups.find((g: any) => g.id === groupId);
    if (!group) return;
    const updatedSkills = (group.skills || []).filter((s: any) => s.id !== skillId);
    updateSectionItem(section.id, groupId, { ...group, skills: updatedSkills });
  };

  const handleUpdateCategory = (groupId: string, category: string) => {
    const group = groups.find((g: any) => g.id === groupId);
    if (!group) return;
    updateSectionItem(section.id, groupId, { ...group, category });
  };

  const handleAddSuggested = (groupId: string, skillName: string) => {
    const group = groups.find((g: any) => g.id === groupId);
    if (!group) return;
    if (group.skills?.some((s: any) => s.name.toLowerCase() === skillName.toLowerCase())) {
      toast.info('Skill already added');
      return;
    }
    const updatedSkills = [
      ...(group.skills || []),
      { id: `sk-${Date.now()}`, name: skillName, level: 'Advanced' as SkillLevel },
    ];
    updateSectionItem(section.id, groupId, { ...group, skills: updatedSkills });
  };

  return (
    <div className="space-y-4">
      {groups.map((grp: any, gIdx: number) => (
        <div key={grp.id} className="border border-border rounded-xl bg-card p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Layers className="w-4 h-4 text-primary shrink-0" />
              <Input
                value={grp.category || ''}
                onChange={(e) => handleUpdateCategory(grp.id, e.target.value)}
                placeholder="Category (e.g. Frontend, Backend, Tools)"
                className="h-8 text-xs font-bold font-display"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSectionItem(section.id, grp.id)}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Skill Pills */}
          <div className="flex flex-wrap gap-1.5 min-h-[36px]">
            {(grp.skills || []).map((skill: any) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-secondary border border-border text-foreground group"
              >
                <span className="font-semibold">{skill.name}</span>
                <span className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.2 rounded border border-border/50">
                  {skill.level}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(grp.id, skill.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(grp.skills || []).length === 0 && (
              <p className="text-xs text-muted-foreground italic py-1">No skills in this category yet.</p>
            )}
          </div>

          {/* Add Skill Row */}
          <div className="flex items-center gap-2 pt-1">
            <Input
              value={newSkillName[grp.id] || ''}
              onChange={(e) => setNewSkillName((prev) => ({ ...prev, [grp.id]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(grp.id);
                }
              }}
              placeholder="Add skill (press Enter)..."
              className="h-8 text-xs flex-1"
            />
            <select
              value={newSkillLevel[grp.id] || 'Advanced'}
              onChange={(e) =>
                setNewSkillLevel((prev) => ({
                  ...prev,
                  [grp.id]: e.target.value as SkillLevel,
                }))
              }
              className="h-8 text-xs rounded-md border border-border bg-background px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <Button
              type="button"
              size="sm"
              onClick={() => handleAddSkill(grp.id)}
              className="h-8 px-3 text-xs gap-1"
            >
              <Plus className="w-3 h-3" />
              Add
            </Button>
          </div>

          {/* Quick Suggestions for first group */}
          {gIdx === 0 && (
            <div className="pt-2 border-t border-border/40">
              <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3 h-3 text-accent" />
                Suggested In-Demand Tech:
              </span>
              <div className="flex flex-wrap gap-1">
                {popularSuggestions.slice(0, 8).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddSuggested(grp.id, sug)}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-border/70 bg-background hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => addSectionItem(section.id)}
        className="w-full border-dashed border-primary/40 hover:border-primary text-xs font-semibold gap-1.5 h-9"
      >
        <Plus className="w-3.5 h-3.5 text-primary" />
        Add Skill Category
      </Button>
    </div>
  );
}
