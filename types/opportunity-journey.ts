/**
 * A student's relationship with an opportunity. This is deliberately separate
 * from opportunity catalog data so it can later be persisted and surfaced in
 * Minha Jornada without changing the catalog model.
 */
export type JourneyModelId = "application";

export type OpportunityIntent = "apply" | "follow" | "deciding";
export type OpportunityPriority = "high" | "medium" | "low";

export type ApplicationJourneyState =
  | "following"
  | "deciding"
  | "preparing"
  | "willApply"
  | "applied"
  | "resultReceived"
  | "completed";

export type JourneyState = ApplicationJourneyState;

export type JourneyModel = {
  id: JourneyModelId;
  states: readonly JourneyState[];
  initialStateForIntent: Record<OpportunityIntent, JourneyState>;
};

export const applicationJourneyModel: JourneyModel = {
  id: "application",
  states: ["following", "deciding", "preparing", "willApply", "applied", "resultReceived", "completed"],
  initialStateForIntent: {
    apply: "preparing",
    follow: "following",
    deciding: "deciding",
  },
};

export type OpportunityJourney = {
  opportunityId: number;
  modelId: JourneyModelId;
  intent: OpportunityIntent;
  state: JourneyState;
  priority?: OpportunityPriority;
  createdAt: string;
};

export function createOpportunityJourney({
  opportunityId,
  intent,
  priority,
  model = applicationJourneyModel,
}: {
  opportunityId: number;
  intent: OpportunityIntent;
  priority?: OpportunityPriority;
  model?: JourneyModel;
}): OpportunityJourney {
  return {
    opportunityId,
    modelId: model.id,
    intent,
    state: model.initialStateForIntent[intent],
    ...(intent === "apply" && priority ? { priority } : {}),
    createdAt: new Date().toISOString(),
  };
}
