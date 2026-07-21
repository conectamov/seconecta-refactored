/**
 * A student's relationship with an opportunity. This is deliberately separate
 * from opportunity catalog data so it can later be persisted and surfaced in
 * Minha Jornada without changing the catalog model.
 */
export type JourneyModelId = "application" | "competition" | "event";

export type OpportunityIntent = "apply" | "follow" | "deciding";
export type OpportunityPriority = "high" | "medium" | "low";

export type JourneyStage =
  | "watching"
  | "interested"
  | "visitedOfficialPage"
  | "preparing"
  | "applied"
  | "waitingForResult"
  | "accepted"
  | "participating"
  | "rejected"
  | "completed"
  | "archived";

export type JourneyState = JourneyStage;

export type JourneyModel = {
  id: JourneyModelId;
  stages: readonly JourneyStage[];
  initialStageForIntent: Record<OpportunityIntent, JourneyStage>;
};

export const applicationJourneyModel: JourneyModel = {
  id: "application",
  stages: ["watching", "interested", "visitedOfficialPage", "preparing", "applied", "waitingForResult", "accepted", "participating", "rejected", "completed", "archived"],
  initialStageForIntent: {
    apply: "interested",
    follow: "watching",
    deciding: "interested",
  },
};

export type OpportunityJourney = {
  opportunityId: number;
  userId: string;
  modelId: JourneyModelId;
  intent: OpportunityIntent;
  saved: true;
  priority: OpportunityPriority;
  stage: JourneyStage;
  createdAt: string;
  updatedAt: string;
  officialPageVisitedAt?: string;
  /** Optional model-specific stage, e.g. "2ª fase" for an olympiad. */
  workflowStage?: {
    id: string;
    label: string;
    position?: number;
    total?: number;
  };
};

export type RecommendationFeedbackScore = -1 | 0 | 1;

export type RecommendationFeedback = {
  opportunityId: number;
  userId: string;
  feedbackScore: RecommendationFeedbackScore;
  timestamp: string;
};

export function createOpportunityJourney({
  opportunityId,
  intent,
  priority,
  userId = "local-student",
  model = applicationJourneyModel,
}: {
  opportunityId: number;
  intent: OpportunityIntent;
  priority?: OpportunityPriority;
  userId?: string;
  model?: JourneyModel;
}): OpportunityJourney {
  const timestamp = new Date().toISOString();
  return {
    opportunityId,
    userId,
    modelId: model.id,
    intent,
    saved: true,
    priority: priority ?? (intent === "follow" ? "low" : "high"),
    stage: model.initialStageForIntent[intent],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
