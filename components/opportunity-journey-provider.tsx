"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { OpportunityJourneyFlow } from "@/components/opportunity-journey-flow";
import type { OpportunityIntent, OpportunityJourney } from "@/types/opportunity-journey";
import { createOpportunityJourney } from "@/types/opportunity-journey";

export type JourneyOpportunityRef = { id: number; title: string };

type OpportunityJourneyContextValue = {
  journeys: OpportunityJourney[];
  getJourney: (opportunityId: number) => OpportunityJourney | undefined;
  startJourney: (opportunity: JourneyOpportunityRef, intent?: OpportunityIntent) => void;
  followOpportunity: (opportunity: JourneyOpportunityRef) => void;
  removeJourney: (opportunityId: number) => void;
};

const OpportunityJourneyContext = createContext<OpportunityJourneyContextValue | null>(null);

export function OpportunityJourneyProvider({ children }: { children: React.ReactNode }) {
  const [journeys, setJourneys] = useState<OpportunityJourney[]>([]);
  const [activeOpportunity, setActiveOpportunity] = useState<JourneyOpportunityRef | null>(null);
  const [initialIntent, setInitialIntent] = useState<OpportunityIntent | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const addJourney = (journey: OpportunityJourney) => {
    setJourneys((current) => current.some((item) => item.opportunityId === journey.opportunityId) ? current : [...current, journey]);
    setFeedback("Adicionada à sua jornada.");
  };

  const value = useMemo<OpportunityJourneyContextValue>(() => ({
    journeys,
    getJourney: (opportunityId) => journeys.find((journey) => journey.opportunityId === opportunityId),
    startJourney: (opportunity, intent) => {
      if (journeys.some((journey) => journey.opportunityId === opportunity.id)) return;
      setInitialIntent(intent ?? null);
      setActiveOpportunity(opportunity);
    },
    followOpportunity: (opportunity) => {
      if (journeys.some((journey) => journey.opportunityId === opportunity.id)) return;
      addJourney(createOpportunityJourney({ opportunityId: opportunity.id, intent: "follow" }));
    },
    removeJourney: (opportunityId) => {
      setJourneys((current) => current.filter((journey) => journey.opportunityId !== opportunityId));
      setFeedback("Removido da sua jornada.");
    },
  }), [journeys]);

  return <OpportunityJourneyContext.Provider value={value}>
    {children}
    <OpportunityJourneyFlow opportunity={activeOpportunity} initialIntent={initialIntent} onClose={() => setActiveOpportunity(null)} onComplete={addJourney} />
    <AnimatePresence>{feedback && <motion.div className="journey-success-feedback" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><Check size={16} /> {feedback}</motion.div>}</AnimatePresence>
  </OpportunityJourneyContext.Provider>;
}

export function useOpportunityJourney() {
  const context = useContext(OpportunityJourneyContext);
  if (!context) throw new Error("useOpportunityJourney must be used inside OpportunityJourneyProvider.");
  return context;
}
