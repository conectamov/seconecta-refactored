import type { OpportunityIntent, OpportunityJourney, OpportunityPriority, RecommendationFeedback, RecommendationFeedbackScore } from "@/types/opportunity-journey";
import { createOpportunityJourney } from "@/types/opportunity-journey";

export const LOCAL_STUDENT_ID = "local-student";

export function saveJourneyOpportunity(opportunityId: number, intent: OpportunityIntent, priority?: OpportunityPriority) {
  return createOpportunityJourney({ opportunityId, intent, priority, userId: LOCAL_STUDENT_ID });
}

export function markOfficialPageVisited(journey: OpportunityJourney): OpportunityJourney {
  const timestamp = new Date().toISOString();
  return { ...journey, stage: "visitedOfficialPage", officialPageVisitedAt: timestamp, updatedAt: timestamp };
}

export function createRecommendationFeedback(opportunityId: number, feedbackScore: RecommendationFeedbackScore): RecommendationFeedback {
  return { opportunityId, userId: LOCAL_STUDENT_ID, feedbackScore, timestamp: new Date().toISOString() };
}
