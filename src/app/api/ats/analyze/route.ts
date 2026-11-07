import { NextResponse } from 'next/server';
import { Resume, ATSBreakdown } from '@/types/resume';

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json();

    if (!resume) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const report = calculateATSReport(resume as Resume, jobDescription || '');

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'ATS Analysis failed' }, { status: 500 });
  }
}

function calculateATSReport(resume: Resume, jobDescription: string): ATSBreakdown & {
  jobMatchScore?: number;
  jobMissingKeywords?: string[];
  jobMatchedKeywords?: string[];
  actionItems: { priority: 'high' | 'medium' | 'low'; text: string; category: string }[];
} {
  const fullResumeText = [
    resume.personalInfo.fullName,
    resume.personalInfo.title,
    resume.personalInfo.summary,
    ...resume.sections.flatMap((s) => [
      s.title,
      ...(s.items || []).flatMap((item: any) => [
        item.role || item.title || '',
        item.company || item.institution || item.subtitle || '',
        item.description || '',
        ...(item.bullets || []),
        ...(item.highlights || []),
        ...(item.techStack || []),
        ...(item.tags || []),
        ...(item.skills ? item.skills.map((sk: any) => sk.name) : []),
      ]),
    ]),
  ]
    .join(' ')
    .toLowerCase();

  // 1. Formatting Score (max 25 pts)
  let formattingScore = 20;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const actionItems: { priority: 'high' | 'medium' | 'low'; text: string; category: string }[] = [];

  // Check email
  if (resume.personalInfo.email && resume.personalInfo.email.includes('@')) {
    formattingScore += 2;
  } else {
    actionItems.push({
      priority: 'high',
      text: 'Add a valid contact email in personal details',
      category: 'Contact Info',
    });
  }

  // Check phone
  if (resume.personalInfo.phone && resume.personalInfo.phone.length > 7) {
    formattingScore += 1.5;
  }

  // Check location
  if (resume.personalInfo.location) {
    formattingScore += 1.5;
  }

  // 2. Content Impact & Metrics Score (max 25 pts)
  let impactScore = 14;
  const metricRegex = /(\b\d+%\b|\$\d+[\d,.]*(?:k|m|b)?\b|\b\d+x\b|\b\d+\+\s*(?:users|clients|teams|services|engineers|countries|members|hours|days|weeks|months|years)\b)/gi;
  const metricsMatched = fullResumeText.match(metricRegex) || [];
  const metricCount = metricsMatched.length;

  if (metricCount >= 8) {
    impactScore = 25;
    strengths.push(`Rich quantifiable metrics detected (${metricCount} data points including % and $ outcomes).`);
  } else if (metricCount >= 4) {
    impactScore = 20;
    strengths.push(`Good presence of measurable results (${metricCount} metrics).`);
    improvements.push('Add 2-3 additional percentage or scale figures to recent project bullets.');
  } else {
    impactScore = 15;
    improvements.push('Under-quantified: Add specific metrics, percentages (%), and monetary figures ($) to demonstrate scale.');
    actionItems.push({
      priority: 'high',
      text: 'Use the AI STAR bullet enhancer to inject % savings or scale metrics',
      category: 'Content Impact',
    });
  }

  // Action Verbs
  const powerVerbs = [
    'spearheaded', 'architected', 'orchestrated', 'engineered', 'accelerated',
    'transformed', 'pioneered', 'championed', 'designed', 'developed',
    'mentored', 'reduced', 'increased', 'optimized', 'delivered', 'launched'
  ];
  const detectedVerbs = powerVerbs.filter((v) => fullResumeText.includes(v));
  const actionVerbCount = detectedVerbs.length;

  if (actionVerbCount >= 8) {
    strengths.push(`Strong vocabulary with ${actionVerbCount} high-impact leadership action verbs.`);
  } else {
    actionItems.push({
      priority: 'medium',
      text: 'Replace passive phrases (like "worked on", "handled") with strong power verbs like "Spearheaded", "Architected"',
      category: 'Vocabulary',
    });
  }

  // 3. Completeness Score (max 25 pts)
  let completenessScore = 15;
  const hasExp = resume.sections.some((s) => s.type === 'experience' && s.items?.length > 0);
  const hasEdu = resume.sections.some((s) => s.type === 'education' && s.items?.length > 0);
  const hasSkills = resume.sections.some((s) => s.type === 'skills' && s.items?.length > 0);
  const hasSummary = !!resume.personalInfo.summary && resume.personalInfo.summary.length > 30;

  if (hasExp) completenessScore += 4;
  if (hasEdu) completenessScore += 2;
  if (hasSkills) completenessScore += 2;
  if (hasSummary) completenessScore += 2;

  // 4. Keywords Score (max 25 pts)
  const commonTechKeywords = [
    'react', 'next.js', 'typescript', 'javascript', 'postgresql', 'neon',
    'node.js', 'python', 'docker', 'kubernetes', 'aws', 'cloud', 'tailwind',
    'ci/cd', 'rest', 'graphql', 'redis', 'microservices', 'git', 'system design',
    'performance', 'scalability', 'agile', 'testing', 'security', 'rag', 'llm'
  ];

  const matchedKeywords = commonTechKeywords.filter((kw) => fullResumeText.includes(kw));
  const missingKeywords = commonTechKeywords.filter((kw) => !fullResumeText.includes(kw)).slice(0, 5);

  const keywordsScore = Math.min(25, Math.round((matchedKeywords.length / 12) * 25));

  // Overall Score (0 - 100)
  const totalScore = Math.min(100, formattingScore + impactScore + completenessScore + keywordsScore);

  // If a specific target Job Description was provided, analyze keyword matches against it
  let jobMatchScore = undefined;
  let jobMissingKeywords: string[] = [];
  let jobMatchedKeywords: string[] = [];

  if (jobDescription && jobDescription.trim().length > 30) {
    const jdClean = jobDescription.toLowerCase();
    const jdWords = jdClean
      .split(/[^a-zA-Z0-9#+.-]+/)
      .filter((w) => w.length >= 3 && !['and', 'the', 'for', 'with', 'you', 'are', 'will', 'that', 'this'].includes(w));

    // Common technical and role terms in JD
    const targetKeywords = Array.from(new Set(jdWords.filter((w) =>
      commonTechKeywords.includes(w) ||
      ['lead', 'senior', 'architecture', 'distributed', 'api', 'database', 'frontend', 'backend', 'fullstack', 'infrastructure', 'devops'].includes(w)
    )));

    jobMatchedKeywords = targetKeywords.filter((kw) => fullResumeText.includes(kw));
    jobMissingKeywords = targetKeywords.filter((kw) => !fullResumeText.includes(kw));

    if (targetKeywords.length > 0) {
      jobMatchScore = Math.round((jobMatchedKeywords.length / targetKeywords.length) * 100);
    } else {
      jobMatchScore = 85;
    }

    if (jobMissingKeywords.length > 0) {
      actionItems.unshift({
        priority: 'high',
        text: `Target Job requires "${jobMissingKeywords.slice(0, 3).join(', ')}" — add them into your Skills or Experience section`,
        category: 'Job Alignment',
      });
    }
  }

  return {
    score: totalScore,
    formattingScore,
    keywordsScore,
    impactScore,
    completenessScore,
    strengths,
    improvements,
    missingKeywords,
    matchedKeywords,
    actionVerbCount,
    metricCount,
    jobMatchScore,
    jobMissingKeywords,
    jobMatchedKeywords,
    actionItems,
  };
}
