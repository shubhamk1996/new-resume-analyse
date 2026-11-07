'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { ResumeSection, SectionType } from '@/types/resume';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PersonalInfoEditor } from './personal-info-editor';
import { ExperienceEditor } from './experience-editor';
import { SkillsEditor } from './skills-editor';
import { EducationEditor } from './education-editor';
import { ProjectsEditor } from './projects-editor';
import { CustomSectionEditor } from './custom-section-editor';
import {
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Layers,
  GraduationCap,
  Code2,
  Award,
  Sparkles,
} from 'lucide-react';

export function SectionManager() {
  const {
    getActiveResume,
    moveSection,
    addSection,
    deleteSection,
    toggleSectionVisibility,
  } = useResumeStore();

  const resume = getActiveResume();
  const sections = resume.sections || [];

  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({
    [sections[0]?.id]: true,
  });

  const toggleExpand = (secId: string) => {
    setExpandedSectionIds((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case 'experience':
        return <Briefcase className="w-4 h-4 text-primary" />;
      case 'skills':
        return <Layers className="w-4 h-4 text-accent" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'projects':
        return <Code2 className="w-4 h-4 text-sky-500" />;
      case 'certifications':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  const renderSectionEditor = (section: ResumeSection) => {
    switch (section.type) {
      case 'experience':
        return <ExperienceEditor section={section} />;
      case 'skills':
        return <SkillsEditor section={section} />;
      case 'education':
        return <EducationEditor section={section} />;
      case 'projects':
        return <ProjectsEditor section={section} />;
      default:
        return <CustomSectionEditor section={section} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Permanent Personal Info Header */}
      <PersonalInfoEditor />

      {/* 2. Drag-and-Drop & Reorderable Sections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
              Dynamic Resume Sections ({sections.length})
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Reorder, hide, or customize fields matching your target role
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" />
                Add Section
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => addSection('experience')} className="gap-2 text-xs">
                <Briefcase className="w-4 h-4 text-primary" />
                Work Experience
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addSection('skills')} className="gap-2 text-xs">
                <Layers className="w-4 h-4 text-accent" />
                Skills & Tech Stack
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addSection('education')} className="gap-2 text-xs">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                Education & Degree
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addSection('projects')} className="gap-2 text-xs">
                <Code2 className="w-4 h-4 text-sky-500" />
                Projects & Portfolio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addSection('custom', 'Certifications')} className="gap-2 text-xs">
                <Award className="w-4 h-4 text-amber-500" />
                Certifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addSection('custom', 'Custom Field Section')} className="gap-2 text-xs font-medium text-accent">
                <Sparkles className="w-4 h-4 text-accent" />
                + Create Custom Section...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {sections.map((sec, idx) => {
          const isExpanded = !!expandedSectionIds[sec.id];
          const itemCount = sec.items?.length || 0;

          return (
            <div
              key={sec.id}
              className={`border rounded-xl transition-all ${
                sec.visible
                  ? 'border-border bg-card shadow-xs'
                  : 'border-border/50 bg-muted/20 opacity-60'
              }`}
            >
              {/* Section Header Controls */}
              <div className="p-3 flex items-center justify-between border-b border-border/40 select-none">
                <div className="flex items-center gap-2">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, idx - 1)}
                      title="Move section up"
                      className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-20"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, idx + 1)}
                      title="Move section down"
                      className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-20"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div
                    onClick={() => toggleExpand(sec.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="p-1.5 rounded-md bg-secondary/80">
                      {getSectionIcon(sec.type)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground">
                        {sec.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">
                        ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Toggle Visibility */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={sec.visible ? 'Hide from resume' : 'Show on resume'}
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    {sec.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />
                    )}
                  </Button>

                  {/* Delete Section */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Delete section"
                    onClick={() => deleteSection(sec.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>

                  {/* Expand/Collapse */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(sec.id)}
                    className="h-7 w-7 text-muted-foreground"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Section Body */}
              {isExpanded && <div className="p-3.5">{renderSectionEditor(sec)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
