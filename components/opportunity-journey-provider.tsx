"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { OpportunityJourneyFlow } from "@/components/opportunity-journey-flow";
import { OpportunityParticipationConfirmation } from "@/components/opportunity-participation-confirmation";
import { useAuthentication } from "@/components/auth/authentication-provider";
import { createRecommendationFeedback, markOfficialPageVisited, saveJourneyOpportunity } from "@/services/opportunity-journey-service";
import type { JourneyStage, OpportunityIntent, OpportunityJourney, OpportunityPriority, RecommendationFeedback, RecommendationFeedbackScore } from "@/types/opportunity-journey";

const JOURNEYS_STORAGE_KEY = "seconecta:opportunity-journeys";
const FEEDBACK_STORAGE_KEY = "seconecta:recommendation-feedback";

function readLocalCollection<T>(key: string): T[] {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T[] : [];
  } catch {
    return [];
  }
}

export type JourneyOpportunityRef = { id: number; title: string; officialUrl?: string };

type OpportunityJourneyContextValue = {
  journeys: OpportunityJourney[];
  recommendationFeedback: RecommendationFeedback[];
  getJourney: (opportunityId: number) => OpportunityJourney | undefined;
  startJourney: (opportunity: JourneyOpportunityRef, intent?: OpportunityIntent) => void;
  participate: (opportunity: JourneyOpportunityRef) => void;
  followOpportunity: (opportunity: JourneyOpportunityRef) => void;
  visitOfficialPage: (opportunity: JourneyOpportunityRef) => void;
  updateJourneyStage: (opportunityId: number, stage: JourneyStage) => void;
  removeJourney: (opportunityId: number) => void;
  requestRecommendationFeedback: (opportunity: JourneyOpportunityRef) => void;
  updateRecommendationFeedback: (opportunityId: number, score: RecommendationFeedbackScore) => void;
};

const OpportunityJourneyContext = createContext<OpportunityJourneyContextValue | null>(null);

function FeedbackPrompt({ opportunity, onSelect, onClose }: { opportunity: JourneyOpportunityRef | null; onSelect: (score: RecommendationFeedbackScore) => void; onClose: () => void }) {
  return <AnimatePresence>{opportunity && <motion.section className="journey-feedback-prompt" role="dialog" aria-label="Feedback sobre recomendação" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
    <button className="absolute right-3 top-3 border-0 bg-transparent p-1 text-[#7a8580]" type="button" onClick={onClose} aria-label="Fechar"><X size={14} /></button>
    <p>Ela combina com o que você procura?</p><span>Sua resposta melhora as próximas recomendações.</span>
    <div className="journey-feedback-actions"><button type="button" onClick={() => onSelect(1)}>Muito</button><button type="button" onClick={() => onSelect(0)}>Um pouco</button><button type="button" onClick={() => onSelect(-1)}>Não</button></div>
  </motion.section>}</AnimatePresence>;
}

export function OpportunityJourneyProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, openAuthentication } = useAuthentication();
  const [journeys, setJourneys] = useState<OpportunityJourney[]>([]);
  const [recommendationFeedback, setRecommendationFeedback] = useState<RecommendationFeedback[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [activeOpportunity, setActiveOpportunity] = useState<JourneyOpportunityRef | null>(null);
  const [initialIntent, setInitialIntent] = useState<OpportunityIntent | null>(null);
  const [participationOpportunity, setParticipationOpportunity] = useState<JourneyOpportunityRef | null>(null);
  const [feedbackOpportunity, setFeedbackOpportunity] = useState<JourneyOpportunityRef | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setJourneys(readLocalCollection<OpportunityJourney>(JOURNEYS_STORAGE_KEY));
    setRecommendationFeedback(readLocalCollection<RecommendationFeedback>(FEEDBACK_STORAGE_KEY));
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(JOURNEYS_STORAGE_KEY, JSON.stringify(journeys));
  }, [journeys, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(recommendationFeedback));
  }, [recommendationFeedback, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const saveOrUpdateJourney = (opportunity: JourneyOpportunityRef, intent: OpportunityIntent, priority: OpportunityPriority = intent === "follow" ? "low" : "high") => {
    setJourneys((current) => {
      const existing = current.find((item) => item.opportunityId === opportunity.id);
      if (!existing) return [...current, saveJourneyOpportunity(opportunity.id, intent, priority)];
      const timestamp = new Date().toISOString();
      return current.map((item) => item.opportunityId === opportunity.id ? { ...item, intent, priority, stage: intent === "follow" ? "watching" : "interested", updatedAt: timestamp } : item);
    });
  };

  const queueFeedback = (opportunity: JourneyOpportunityRef) => {
    if (!recommendationFeedback.some((item) => item.opportunityId === opportunity.id)) setFeedbackOpportunity(opportunity);
  };

  const continueWithPersistence = (action: () => void) => {
    if (isAuthenticated) action();
    else openAuthentication("saveOpportunity", action);
  };

  const value = useMemo<OpportunityJourneyContextValue>(() => ({
    journeys,
    recommendationFeedback,
    getJourney: (opportunityId) => journeys.find((journey) => journey.opportunityId === opportunityId),
    startJourney: (opportunity, intent) => {
      if (journeys.some((journey) => journey.opportunityId === opportunity.id)) return;
      continueWithPersistence(() => {
        setInitialIntent(intent ?? null);
        setActiveOpportunity(opportunity);
      });
    },
    participate: (opportunity) => {
      continueWithPersistence(() => {
        saveOrUpdateJourney(opportunity, "apply", "high");
        setParticipationOpportunity(opportunity);
      });
    },
    followOpportunity: (opportunity) => {
      continueWithPersistence(() => {
        saveOrUpdateJourney(opportunity, "follow", "low");
        setToast("Adicionada à sua jornada para acompanhar.");
        queueFeedback(opportunity);
      });
    },
    visitOfficialPage: (opportunity) => {
      setJourneys((current) => current.map((journey) => journey.opportunityId === opportunity.id ? markOfficialPageVisited(journey) : journey));
    },
    updateJourneyStage: (opportunityId, stage) => {
      setJourneys((current) => current.map((journey) => journey.opportunityId === opportunityId ? { ...journey, stage, updatedAt: new Date().toISOString() } : journey));
      const labels: Partial<Record<JourneyStage, string>> = { preparing: "Candidatura em andamento", participating: "Participando", waitingForResult: "Aguardando resultado", accepted: "Aprovado", rejected: "Não selecionado" };
      setToast(`Status atualizado: ${labels[stage] ?? "Jornada atualizada"}.`);
    },
    removeJourney: (opportunityId) => {
      setJourneys((current) => current.filter((journey) => journey.opportunityId !== opportunityId));
      setToast("Removido da sua jornada.");
    },
    requestRecommendationFeedback: queueFeedback,
    updateRecommendationFeedback: (opportunityId, score) => {
      setRecommendationFeedback((current) => [...current.filter((item) => item.opportunityId !== opportunityId), createRecommendationFeedback(opportunityId, score)]);
      setToast("Preferência atualizada. Suas próximas recomendações vão considerar isso.");
    },
  }), [isAuthenticated, journeys, recommendationFeedback, openAuthentication]);

  const addJourneyFromFlow = (journey: OpportunityJourney) => {
    setJourneys((current) => current.some((item) => item.opportunityId === journey.opportunityId) ? current : [...current, journey]);
    setToast("Adicionada à sua jornada.");
    if (activeOpportunity) queueFeedback(activeOpportunity);
  };

  const continueToOfficialPage = () => {
    const opportunity = participationOpportunity;
    if (!opportunity) return;
    setJourneys((current) => current.map((journey) => journey.opportunityId === opportunity.id ? markOfficialPageVisited(journey) : journey));
    if (opportunity.officialUrl) window.open(opportunity.officialUrl, "_blank", "noopener,noreferrer");
    setParticipationOpportunity(null);
    setToast("Página oficial aberta. Vamos acompanhar seus próximos passos.");
    queueFeedback(opportunity);
  };

  const closeParticipation = () => {
    if (participationOpportunity) queueFeedback(participationOpportunity);
    setParticipationOpportunity(null);
  };

  const recordFeedback = (score: RecommendationFeedbackScore) => {
    if (!feedbackOpportunity) return;
    setRecommendationFeedback((current) => [...current.filter((item) => item.opportunityId !== feedbackOpportunity.id), createRecommendationFeedback(feedbackOpportunity.id, score)]);
    setFeedbackOpportunity(null);
    setToast("Obrigado — vamos usar isso para melhorar suas recomendações.");
  };

  return <OpportunityJourneyContext.Provider value={value}>
    {children}
    <OpportunityJourneyFlow opportunity={activeOpportunity} initialIntent={initialIntent} onClose={() => setActiveOpportunity(null)} onComplete={addJourneyFromFlow} />
    <OpportunityParticipationConfirmation opportunity={participationOpportunity} onClose={closeParticipation} onContinue={continueToOfficialPage} />
    <FeedbackPrompt opportunity={feedbackOpportunity} onClose={() => setFeedbackOpportunity(null)} onSelect={recordFeedback} />
    <AnimatePresence>{toast && <motion.div className="journey-success-feedback" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><Check size={16} /> {toast}</motion.div>}</AnimatePresence>
  </OpportunityJourneyContext.Provider>;
}

export function useOpportunityJourney() {
  const context = useContext(OpportunityJourneyContext);
  if (!context) throw new Error("useOpportunityJourney must be used inside OpportunityJourneyProvider.");
  return context;
}
