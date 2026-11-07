import { NextResponse } from 'next/server';

export type EnhanceMode = 'grammar' | 'action' | 'star' | 'metrics' | 'executive' | 'concise';

export async function POST(req: Request) {
  try {
    const { text, mode = 'grammar', role = '' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const enhanced = enhanceResumeText(text.trim(), mode as EnhanceMode, role);

    return NextResponse.json({
      success: true,
      original: text,
      enhanced: enhanced.result,
      changes: enhanced.changes,
      mode,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Enhancement failed' }, { status: 500 });
  }
}

function enhanceResumeText(
  text: string,
  mode: EnhanceMode,
  role: string
): { result: string; changes: string[] } {
  const clean = text.replace(/^[•\-\*]\s*/, '').trim();

  // Grammar & Flow enhancement
  if (mode === 'grammar') {
    let result = clean;
    const changes: string[] = [];

    // Common corrections
    if (/\bresponsable\b/i.test(result)) {
      result = result.replace(/\bresponsable\b/gi, 'responsible');
      changes.push('Corrected spelling of "responsible"');
    }
    if (/\bworked on\b/i.test(result)) {
      result = result.replace(/\bworked on\b/gi, 'Architected and implemented');
      changes.push('Replaced passive "worked on" with active "Architected and implemented"');
    }
    if (/\bhelped with\b/i.test(result)) {
      result = result.replace(/\bhelped with\b/gi, 'Spearheaded');
      changes.push('Replaced weak phrase "helped with" with "Spearheaded"');
    }
    if (/\bi\s+/i.test(result)) {
      result = result.replace(/\bi\s+/gi, '');
      changes.push('Removed first-person pronouns for professional resume style');
    }

    // Capitalize first letter and ensure ending period
    result = result.charAt(0).toUpperCase() + result.slice(1);
    if (!result.endsWith('.')) result += '.';

    if (changes.length === 0) {
      changes.push('Polished phrasing, sentence rhythm, and grammatical consistency');
      result = `Successfully ${result.charAt(0).toLowerCase() + result.slice(1)}`;
    }

    return { result, changes };
  }

  // Action Verb & Power Opener
  if (mode === 'action') {
    const powerVerbs = [
      'Spearheaded',
      'Architected',
      'Orchestrated',
      'Engineered',
      'Accelerated',
      'Transformed',
      'Pioneered',
      'Championed',
    ];
    const pickedVerb = powerVerbs[Math.floor(Math.random() * powerVerbs.length)];

    let body = clean
      .replace(/^(led|built|made|did|helped|worked|managed|handled)\s+/i, '')
      .trim();
    body = body.charAt(0).toLowerCase() + body.slice(1);

    const result = `${pickedVerb} ${body}${body.endsWith('.') ? '' : '.'}`;
    return {
      result,
      changes: [
        `Replaced introductory verb with decisive executive action verb: "${pickedVerb}"`,
        'Enhanced assertive professional tone',
      ],
    };
  }

  // STAR Method (Situation, Task, Action, Result)
  if (mode === 'star') {
    const cleanedText = clean.replace(/\.$/, '');
    const result = `Spearheaded ${cleanedText}, partnering cross-functionally across engineering and product to achieve 35% improvement in cycle efficiency and zero post-launch regression.`;
    return {
      result,
      changes: [
        'Structured into clear Situation/Action/Result format',
        'Added cross-functional collaboration and quantifiable outcome metric (+35%)',
      ],
    };
  }

  // Quantifiable Metrics
  if (mode === 'metrics') {
    let result = clean.replace(/\.$/, '');
    const metricsOptions = [
      ', resulting in a 42% reduction in system latency and $180K annual infrastructure savings.',
      ', driving 28% increase in team velocity while supporting 2.4M monthly active requests.',
      ', improving conversion funnel efficiency by 34% across 12 enterprise accounts.',
      ', eliminating 95% of manual operational interventions and shortening release time by 3.5x.',
    ];
    const metric = metricsOptions[Math.floor(Math.random() * metricsOptions.length)];
    result = `${result}${metric}`;

    return {
      result,
      changes: [
        'Injected ATS-favored quantifiable metrics and measurable business outcomes',
        'Strengthened executive accountability framing',
      ],
    };
  }

  // Executive Tone
  if (mode === 'executive') {
    let result = clean.replace(/\.$/, '');
    result = `Directed strategic initiative to ${result.charAt(0).toLowerCase() + result.slice(1)}, establishing governance standards and delivering 99.9% operational reliability.`;
    return {
      result,
      changes: [
        'Shifted framing from individual contributor task to strategic business leadership',
        'Incorporated governance and enterprise reliability metrics',
      ],
    };
  }

  // Concise
  if (mode === 'concise') {
    const trimmed = clean
      .replace(/\b(in order to|with the goal of|responsible for)\b/gi, 'to')
      .replace(/\b(a very|really|actually|basically)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      result: `${trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}${trimmed.endsWith('.') ? '' : '.'}`,
      changes: ['Eliminated fluff words and tightened syntax for faster ATS readability'],
    };
  }

  return { result: clean, changes: ['Standardized punctuation and formatting'] };
}
