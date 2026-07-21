"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import "./opportunity-journey-flow.css";

type ParticipationConfirmationProps = {
  opportunity: { title: string } | null;
  onContinue: () => void;
  onClose: () => void;
};

export function OpportunityParticipationConfirmation({ opportunity, onContinue, onClose }: ParticipationConfirmationProps) {
  return <AnimatePresence>{opportunity && <motion.div className="opportunity-journey-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
    <motion.section className="opportunity-participation-confirmation" role="dialog" aria-modal="true" aria-labelledby="participation-confirmation-title" initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} transition={{ duration: .18 }}>
      <button className="opportunity-journey-close" type="button" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
      <span className="opportunity-journey-kicker">Sua jornada</span>
      <h2 id="participation-confirmation-title">Você quer participar desta oportunidade.</h2>
      <p className="opportunity-journey-opportunity">{opportunity.title}</p>
      <p className="opportunity-participation-copy">Ela foi adicionada à sua Jornada para que possamos ajudar você a acompanhar prazos e preparação.</p>
      <div className="opportunity-participation-actions"><button type="button" className="opportunity-participation-primary" onClick={onContinue}>Continuar para inscrição <ArrowUpRight size={17} /></button><button type="button" className="opportunity-participation-secondary" onClick={onClose}>Agora não</button></div>
    </motion.section>
  </motion.div>}</AnimatePresence>;
}
