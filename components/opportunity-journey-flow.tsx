"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, Rocket, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { OpportunityIntent, OpportunityJourney, OpportunityPriority } from "@/types/opportunity-journey";
import { createOpportunityJourney } from "@/types/opportunity-journey";
import "./opportunity-journey-flow.css";

type JourneyFlowProps = {
  opportunity: { id: number; title: string } | null;
  initialIntent?: OpportunityIntent | null;
  onClose: () => void;
  onComplete: (journey: OpportunityJourney) => void;
};

const intents: { value: OpportunityIntent; icon: typeof Rocket; title: string; copy: string }[] = [
  { value: "apply", icon: Rocket, title: "Quero me candidatar", copy: "Vou me organizar para dar esse próximo passo." },
  { value: "follow", icon: Eye, title: "Só quero acompanhar", copy: "Quero manter esta oportunidade por perto." },
];

const priorities: { value: OpportunityPriority; stars: string; title: string }[] = [
  { value: "high", stars: "★★★", title: "Muito importante" },
  { value: "medium", stars: "★★", title: "Importante" },
  { value: "low", stars: "★", title: "Talvez" },
];

export function OpportunityJourneyFlow({ opportunity, initialIntent = null, onClose, onComplete }: JourneyFlowProps) {
  const [intent, setIntent] = useState<OpportunityIntent | null>(initialIntent);

  useEffect(() => {
    if (opportunity) setIntent(initialIntent);
  }, [initialIntent, opportunity]);

  const close = () => {
    setIntent(null);
    onClose();
  };

  const chooseIntent = (value: OpportunityIntent) => {
    if (!opportunity) return;
    if (value === "apply") {
      setIntent(value);
      return;
    }
    onComplete(createOpportunityJourney({ opportunityId: opportunity.id, intent: value }));
    close();
  };

  const choosePriority = (priority: OpportunityPriority) => {
    if (!opportunity || !intent) return;
    onComplete(createOpportunityJourney({ opportunityId: opportunity.id, intent, priority }));
    close();
  };

  return <AnimatePresence>{opportunity && <motion.div className="opportunity-journey-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.currentTarget === event.target && close()}>
    <motion.section className="opportunity-journey-flow" role="dialog" aria-modal="true" aria-labelledby="journey-flow-title" initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} transition={{ duration: .18 }}>
      <button className="opportunity-journey-close" type="button" onClick={close} aria-label="Fechar"><X size={18} /></button>
      <AnimatePresence mode="wait" initial={false}>
        {!intent ? <motion.div key="intent" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
          <span className="opportunity-journey-kicker">Sua jornada</span>
          <h2 id="journey-flow-title">O que você pretende fazer com esta oportunidade?</h2>
          <p className="opportunity-journey-opportunity">{opportunity.title}</p>
          <div className="opportunity-journey-options">
            {intents.map(({ value, icon: Icon, title, copy }) => <button type="button" onClick={() => chooseIntent(value)} key={value}><span className="opportunity-journey-icon"><Icon size={19} /></span><span><strong>{title}</strong><small>{copy}</small></span></button>)}
          </div>
        </motion.div> : <motion.div key="priority" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
          <span className="opportunity-journey-kicker">Sua jornada · 2 de 2</span>
          <h2 id="journey-flow-title">Quão importante ela é para você?</h2>
          <p className="opportunity-journey-opportunity">Isso ajuda a organizar seus próximos passos.</p>
          <div className="opportunity-priority-options">
            {priorities.map(({ value, stars, title }) => <button type="button" onClick={() => choosePriority(value)} key={value}><span>{stars}</span><strong>{title}</strong></button>)}
          </div>
        </motion.div>}
      </AnimatePresence>
    </motion.section>
  </motion.div>}</AnimatePresence>;
}
