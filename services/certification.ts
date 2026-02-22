import { MAIResult, CertificationResult } from '../types';

// Feature 7: AI-Ready Certification
// Requisitos Mínimos: Infra > 70, Agent > 60, MAI > 65

export const evaluateCertification = (maiResult: MAIResult): CertificationResult => {
    const reasons: string[] = [];

    if (maiResult.subScores.infrastructure <= 70) reasons.push('Infrastructure score must be > 70');
    if (maiResult.subScores.agentExecution <= 60) reasons.push('Agent Execution score must be > 60');
    if (maiResult.maiScore <= 65) reasons.push('Overall MAI Score must be > 65');

    const isEligible = reasons.length === 0;

    return {
        brand: maiResult.brand,
        isEligible,
        rejectionReasons: isEligible ? undefined : reasons,
        certifiedDate: isEligible ? new Date().toISOString() : undefined,
        badgeUrl: isEligible ? `https://somarush.com/badges/certified-${maiResult.brand.toLowerCase()}.svg` : undefined,
        publicJsonUrl: isEligible ? `https://somarush.com/api/v1/certification/${maiResult.brand.toLowerCase()}.json` : undefined,
    };
};
