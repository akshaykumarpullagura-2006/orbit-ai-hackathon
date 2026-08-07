import type { ResultRecord } from '@/types';

export interface ValidationCheckResults {
  schemaCompleteness: boolean;
  riskAlignment: boolean;
  actionabilityCount: boolean;
  responseToneStandards: boolean;
  confidenceThreshold: boolean;
  score: number;
  status: 'PASSED_STANDARDIZED' | 'NEEDS_REVIEW';
  summary: string;
}

/**
 * Orbit AI Secret Weapon: Validation Engine.
 * Checks, validates, and standardizes every generated output before reaching the user.
 * Ensures consistency across every workflow.
 */
export function validateAndStandardizeDeliverable(result: ResultRecord): {
  validatedResult: ResultRecord;
  validationDetails: ValidationCheckResults;
} {
  const schemaCompleteness = Boolean(result.title && result.summary && result.generatedReply);
  const riskAlignment = ['Severe', 'Elevated', 'Moderate', 'Low'].includes(result.riskLevel);
  const actionabilityCount = result.suggestedActions.length >= 2;
  
  const lowerReply = result.generatedReply.toLowerCase();
  const responseToneStandards =
    result.generatedReply.length > 30 &&
    (lowerReply.includes('regards') ||
      lowerReply.includes('team') ||
      lowerReply.includes('sincerely') ||
      lowerReply.includes('orbit'));
      
  const confidenceThreshold = result.confidence >= 70;

  const checks = [schemaCompleteness, riskAlignment, actionabilityCount, responseToneStandards, confidenceThreshold];
  const passedCount = checks.filter(Boolean).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const status = score >= 80 ? 'PASSED_STANDARDIZED' : 'NEEDS_REVIEW';

  // Standardize actions: capitalize first letter and ensure ending period
  const standardizedActions = result.suggestedActions.map((action) => {
    let clean = action.trim();
    if (!clean.endsWith('.')) clean += '.';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  });

  const validatedResult: ResultRecord = {
    ...result,
    suggestedActions: standardizedActions,
    businessImpact: result.businessImpact.startsWith('[Validated]')
      ? result.businessImpact
      : `[Validated Output Score: ${score}%] ${result.businessImpact}`,
  };

  const validationDetails: ValidationCheckResults = {
    schemaCompleteness,
    riskAlignment,
    actionabilityCount,
    responseToneStandards,
    confidenceThreshold,
    score,
    status,
    summary: `Validation Engine: Output passed ${passedCount}/5 enterprise validation checks (${score}% consistency score).`,
  };

  return { validatedResult, validationDetails };
}
