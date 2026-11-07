export type TemplateId = 'modern-compact' | 'executive-grid' | 'minimal-tech' | 'creative-slate';

export type ResumeColor = 'cobalt' | 'emerald' | 'slate' | 'crimson' | 'amber' | 'violet';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillItem {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  bullets: string[];
  techStack: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CustomFieldItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
  tags?: string[];
}

export type SectionType = 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  items: any[];
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  avatarUrl?: string;
}

export interface ATSBreakdown {
  score: number;
  formattingScore: number;
  keywordsScore: number;
  impactScore: number;
  completenessScore: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  matchedKeywords: string[];
  actionVerbCount: number;
  metricCount: number;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  targetRole?: string;
  themeColor: ResumeColor;
  templateId: TemplateId;
  fontFamily: 'sans' | 'display' | 'serif' | 'mono';
  fontSize: 'compact' | 'normal' | 'spacious';
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  atsDiagnostic?: ATSBreakdown;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote' | 'Part-time';
  salary?: string;
  postedHoursAgo: number;
  postedAt: string;
  url: string;
  source: string;
  description: string;
  requiredSkills: string[];
  matchScore?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
  matchReason?: string;
}
