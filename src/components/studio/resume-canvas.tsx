'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { Resume, ResumeSection } from '@/types/resume';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Award,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResumeCanvas() {
  const { getActiveResume } = useResumeStore();
  const resume = getActiveResume();
  const [zoom, setZoom] = useState<number>(100);

  const colorMap = {
    cobalt: {
      primary: '#2563eb',
      text: '#1d4ed8',
      bgLight: '#eff6ff',
      border: '#bfdbfe',
      gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    },
    emerald: {
      primary: '#059669',
      text: '#047857',
      bgLight: '#ecfdf5',
      border: '#a7f3d0',
      gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    },
    slate: {
      primary: '#334155',
      text: '#1e293b',
      bgLight: '#f1f5f9',
      border: '#cbd5e1',
      gradient: 'linear-gradient(135deg, #0f172a, #475569)',
    },
    crimson: {
      primary: '#e11d48',
      text: '#be123c',
      bgLight: '#fff1f2',
      border: '#fecdd3',
      gradient: 'linear-gradient(135deg, #9f1239, #f43f5e)',
    },
    amber: {
      primary: '#d97706',
      text: '#b45309',
      bgLight: '#fffbeb',
      border: '#fde68a',
      gradient: 'linear-gradient(135deg, #92400e, #f59e0b)',
    },
    violet: {
      primary: '#7c3aed',
      text: '#6d28d9',
      bgLight: '#f5f3ff',
      border: '#ddd6fe',
      gradient: 'linear-gradient(135deg, #5b21b6, #8b5cf6)',
    },
  };

  const theme = colorMap[resume.themeColor] || colorMap.cobalt;

  const fontClass =
    resume.fontFamily === 'display'
      ? 'font-display'
      : resume.fontFamily === 'serif'
      ? 'font-serif'
      : resume.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const spacingClasses =
    resume.fontSize === 'compact'
      ? { py: 'py-2', gap: 'gap-2.5', textBase: 'text-[11px]', textLg: 'text-sm' }
      : resume.fontSize === 'spacious'
      ? { py: 'py-4', gap: 'gap-5', textBase: 'text-xs', textLg: 'text-base' }
      : { py: 'py-3', gap: 'gap-3.5', textBase: 'text-[11.5px]', textLg: 'text-[15px]' };

  const info = resume.personalInfo;
  const sections = resume.sections.filter((s) => s.visible);

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Top Bar with Zoom Controls */}
      <div className="flex items-center justify-between p-2.5 bg-card border-b border-border text-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            A4 Live Paper Preview
          </span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            • {resume.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.max(65, z - 10))}
            className="h-7 w-7"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] font-mono text-muted-foreground w-12 text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.min(130, z + 10))}
            className="h-7 w-7"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(100)}
            className="h-7 w-7 text-xs"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Container with Sheet Canvas */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-muted/40 print:p-0 print:bg-white print:overflow-visible">
        <div
          id="resume-printable-sheet"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
          className={`bg-white text-slate-900 shadow-2xl rounded-sm print:shadow-none print:m-0 print:w-full print:rounded-none relative ${fontClass}`}
        >
          {/* Render layout based on templateId */}
          {resume.templateId === 'executive-grid' ? (
            <ExecutiveGridLayout
              info={info}
              sections={sections}
              theme={theme}
              spacing={spacingClasses}
            />
          ) : resume.templateId === 'creative-slate' ? (
            <CreativeSlateLayout
              info={info}
              sections={sections}
              theme={theme}
              spacing={spacingClasses}
            />
          ) : resume.templateId === 'minimal-tech' ? (
            <MinimalTechLayout
              info={info}
              sections={sections}
              theme={theme}
              spacing={spacingClasses}
            />
          ) : (
            <ModernCompactLayout
              info={info}
              sections={sections}
              theme={theme}
              spacing={spacingClasses}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEMPLATE 1: Modern Compact (Enhancv Signature Style)
// -------------------------------------------------------------
function ModernCompactLayout({ info, sections, theme, spacing }: any) {
  return (
    <div className="p-8 sm:p-10 flex flex-col min-h-full">
      {/* Top Header */}
      <div className="pb-5 border-b-2" style={{ borderColor: theme.primary }}>
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: '#0f172a' }}
            >
              {info.fullName || 'Candidate Name'}
            </h1>
            <p
              className="text-sm sm:text-base font-semibold mt-1"
              style={{ color: theme.primary }}
            >
              {info.title || 'Professional Title'}
            </p>
          </div>
          {info.avatarUrl && (
            <img
              src={info.avatarUrl}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2"
              style={{ borderColor: theme.primary }}
            />
          )}
        </div>

        {/* Contact Badges */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11px] text-slate-600">
          {info.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {info.email}
            </span>
          )}
          {info.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {info.phone}
            </span>
          )}
          {info.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {info.location}
            </span>
          )}
          {info.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              {info.linkedin.replace('https://', '')}
            </span>
          )}
          {info.github && (
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              {info.github.replace('https://', '')}
            </span>
          )}
        </div>

        {info.summary && (
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-600 text-justify">
            {info.summary}
          </p>
        )}
      </div>

      {/* Main Sections */}
      <div className={`mt-5 flex flex-col ${spacing.gap}`}>
        {sections.map((section: ResumeSection) => (
          <div key={section.id} className="space-y-2">
            {/* Section Header */}
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <h2
                className="text-xs sm:text-[13px] font-bold uppercase tracking-wider"
                style={{ color: theme.primary }}
              >
                {section.title}
              </h2>
            </div>

            {/* Section Content */}
            <SectionItemsRenderer section={section} theme={theme} spacing={spacing} />
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEMPLATE 2: Executive Grid (Bold Colored Top Banner + 2 Columns)
// -------------------------------------------------------------
function ExecutiveGridLayout({ info, sections, theme, spacing }: any) {
  const mainSections = sections.filter((s: any) => s.type === 'experience' || s.type === 'projects');
  const sideSections = sections.filter((s: any) => s.type !== 'experience' && s.type !== 'projects');

  return (
    <div className="flex flex-col min-h-full">
      {/* Banner */}
      <div
        className="p-8 text-white"
        style={{ background: theme.gradient }}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {info.fullName || 'Candidate Name'}
        </h1>
        <p className="text-sm sm:text-base font-medium opacity-90 mt-1">
          {info.title || 'Executive Leadership'}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11px] opacity-85">
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>• {info.phone}</span>}
          {info.location && <span>• {info.location}</span>}
          {info.linkedin && <span>• {info.linkedin.replace('https://', '')}</span>}
        </div>

        {info.summary && (
          <p className="mt-3 text-[11px] leading-relaxed opacity-95">
            {info.summary}
          </p>
        )}
      </div>

      {/* 2-Column Body */}
      <div className="p-8 grid grid-cols-12 gap-6 flex-1">
        {/* Left Column (Main Experience & Projects) */}
        <div className="col-span-8 space-y-4">
          {mainSections.map((sec: any) => (
            <div key={sec.id} className="space-y-2">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                {sec.title}
              </h2>
              <SectionItemsRenderer section={sec} theme={theme} spacing={spacing} />
            </div>
          ))}
        </div>

        {/* Right Column (Skills, Education, Certifications) */}
        <div className="col-span-4 space-y-4 pl-3 border-l border-slate-200">
          {sideSections.map((sec: any) => (
            <div key={sec.id} className="space-y-2">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                style={{ color: theme.primary }}
              >
                {sec.title}
              </h2>
              <SectionItemsRenderer section={sec} theme={theme} spacing={spacing} isSidebar />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEMPLATE 3: Minimalist Tech (Clean Monospaced Header & Tech Badges)
// -------------------------------------------------------------
function MinimalTechLayout({ info, sections, theme, spacing }: any) {
  return (
    <div className="p-8 sm:p-10 flex flex-col min-h-full">
      <div className="flex justify-between items-baseline border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {info.fullName}
          </h1>
          <p className="text-xs font-mono font-bold mt-0.5" style={{ color: theme.primary }}>
            $ {info.title}
          </p>
        </div>
        <div className="text-right text-[11px] font-mono text-slate-600 space-y-0.5">
          <div>{info.email} • {info.phone}</div>
          <div>{info.location}</div>
          {info.github && <div>{info.github}</div>}
        </div>
      </div>

      {info.summary && (
        <div className="my-3 p-3 bg-slate-50 border-l-2 text-[11px] text-slate-700 leading-relaxed font-sans" style={{ borderColor: theme.primary }}>
          {info.summary}
        </div>
      )}

      <div className={`mt-3 flex flex-col ${spacing.gap}`}>
        {sections.map((section: ResumeSection) => (
          <div key={section.id} className="space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800 flex items-center gap-2">
              <span style={{ color: theme.primary }}>#</span> {section.title}
            </h2>
            <SectionItemsRenderer section={section} theme={theme} spacing={spacing} />
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEMPLATE 4: Creative Slate (Vertical Left Sidebar with Color Accent)
// -------------------------------------------------------------
function CreativeSlateLayout({ info, sections, theme, spacing }: any) {
  const sideSections = sections.filter((s: any) => s.type === 'skills' || s.type === 'education');
  const mainSections = sections.filter((s: any) => s.type !== 'skills' && s.type !== 'education');

  return (
    <div className="grid grid-cols-12 min-h-full">
      {/* Left Sidebar */}
      <div className="col-span-4 p-6 bg-slate-900 text-slate-100 flex flex-col justify-between">
        <div className="space-y-5">
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl text-white mb-3"
              style={{ background: theme.primary }}
            >
              {info.fullName?.[0] || 'R'}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">{info.fullName}</h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">{info.title}</p>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300 pt-2 border-t border-slate-700">
            {info.email && <div className="truncate">{info.email}</div>}
            {info.phone && <div>{info.phone}</div>}
            {info.location && <div>{info.location}</div>}
            {info.linkedin && <div className="truncate">{info.linkedin.replace('https://', '')}</div>}
          </div>

          {sideSections.map((sec: any) => (
            <div key={sec.id} className="space-y-2 pt-2 border-t border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {sec.title}
              </h3>
              <SectionItemsRenderer section={sec} theme={theme} spacing={spacing} isDarkSidebar />
            </div>
          ))}
        </div>

        <div className="pt-4 text-[9px] text-slate-400 uppercase tracking-widest">
          Verified ATS Standard
        </div>
      </div>

      {/* Right Main Pane */}
      <div className="col-span-8 p-8 space-y-5">
        {info.summary && (
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
              Professional Profile
            </h2>
            <p className="text-[11.5px] leading-relaxed text-slate-700">
              {info.summary}
            </p>
          </div>
        )}

        {mainSections.map((sec: any) => (
          <div key={sec.id} className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: theme.primary }}>
              {sec.title}
            </h2>
            <SectionItemsRenderer section={sec} theme={theme} spacing={spacing} />
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Universal Section Items Renderer
// -------------------------------------------------------------
function SectionItemsRenderer({ section, theme, spacing, isSidebar, isDarkSidebar }: any) {
  const items = section.items || [];

  if (section.type === 'experience') {
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-bold text-slate-900">{item.role}</h3>
              <span className="text-[10px] text-slate-500 font-medium">
                {item.startDate} — {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-600">
              <span className="font-semibold" style={{ color: theme.primary }}>
                {item.company}
              </span>
              <span className="text-slate-400 text-[10px]">{item.location}</span>
            </div>

            {item.bullets && item.bullets.length > 0 && (
              <ul className="list-disc list-outside pl-3.5 space-y-1 mt-1 text-[11px] text-slate-700 leading-relaxed">
                {item.bullets.map((b: string, idx: number) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="space-y-2">
        {items.map((grp: any) => (
          <div key={grp.id} className="space-y-1">
            {grp.category && (
              <p className={`text-[11px] font-bold ${isDarkSidebar ? 'text-slate-200' : 'text-slate-800'}`}>
                {grp.category}:
              </p>
            )}
            <div className="flex flex-wrap gap-1">
              {(grp.skills || []).map((skill: any) => (
                <span
                  key={skill.id}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    isDarkSidebar
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'education') {
    return (
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="space-y-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className={`text-xs font-bold ${isDarkSidebar ? 'text-white' : 'text-slate-900'}`}>
                {item.degree}
              </h3>
              <span className={`text-[10px] ${isDarkSidebar ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.startDate} — {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            <p className="text-[11px] font-medium" style={{ color: theme.primary }}>
              {item.institution} {item.location ? `• ${item.location}` : ''}
            </p>
            {item.gpa && (
              <p className={`text-[10px] ${isDarkSidebar ? 'text-slate-300' : 'text-slate-600'}`}>
                GPA: {item.gpa}
              </p>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <ul className={`list-disc list-outside pl-3 space-y-0.5 text-[10px] ${isDarkSidebar ? 'text-slate-300' : 'text-slate-600'}`}>
                {item.highlights.map((h: string, hIdx: number) => (
                  <li key={hIdx}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    return (
      <div className="space-y-2.5">
        {items.map((item: any) => (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {item.title}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </h3>
              {item.subtitle && (
                <span className="text-[10px] text-slate-500 italic">{item.subtitle}</span>
              )}
            </div>
            {item.bullets && (
              <ul className="list-disc list-outside pl-3.5 space-y-1 text-[11px] text-slate-700 leading-relaxed">
                {item.bullets.map((b: string, idx: number) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            )}
            {item.techStack && item.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.techStack.map((tech: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Custom sections
  return (
    <div className="space-y-2">
      {items.map((item: any) => (
        <div key={item.id} className="space-y-0.5">
          <div className="flex justify-between items-baseline">
            <h3 className={`text-xs font-bold ${isDarkSidebar ? 'text-white' : 'text-slate-900'}`}>
              {item.title}
            </h3>
            {item.date && (
              <span className={`text-[10px] ${isDarkSidebar ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.date}
              </span>
            )}
          </div>
          {item.subtitle && (
            <p className="text-[11px] font-medium" style={{ color: theme.primary }}>
              {item.subtitle}
            </p>
          )}
          {item.description && (
            <p className={`text-[11px] ${isDarkSidebar ? 'text-slate-300' : 'text-slate-700'}`}>
              {item.description}
            </p>
          )}
          {item.bullets && item.bullets.length > 0 && (
            <ul className={`list-disc list-outside pl-3 space-y-0.5 text-[10px] ${isDarkSidebar ? 'text-slate-300' : 'text-slate-700'}`}>
              {item.bullets.map((b: string, bIdx: number) => (
                <li key={bIdx}>{b}</li>
              ))}
            </ul>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags.map((t: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
