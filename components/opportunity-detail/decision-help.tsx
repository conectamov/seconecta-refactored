"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuthentication } from "@/components/auth/authentication-provider";

export type OpportunityDecisionContext = {
  opportunity: unknown;
  onboardingProfile: unknown;
  recommendationReasoning: unknown;
  savedOpportunities: unknown;
  journeyState: unknown;
};

type DecisionHelpProps = {
  questions: string[];
  context: OpportunityDecisionContext;
  onAsk: (question: string, context: OpportunityDecisionContext) => void;
};

export function DecisionHelp({ questions, context, onAsk }: DecisionHelpProps) {
  const { isAuthenticated, openAuthentication } = useAuthentication();
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);

  const ask = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const continueQuestion = () => {
      setQuestion(normalized);
      setSubmittedQuestion(normalized);
      onAsk(normalized, context);
    };
    if (isAuthenticated) continueQuestion();
    else openAuthentication("aiMemory", continueQuestion);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(question);
  };

  return <section className="border-t border-[#dfe5e1] bg-white py-16 md:py-20" aria-labelledby="decision-help-title">
    <div className="mx-auto grid w-[min(920px,calc(100%-48px))] gap-8 md:grid-cols-[.75fr_1.25fr] md:items-start">
      <div><span className="grid size-10 place-items-center rounded-2xl bg-[#eaf8f2] text-[#079272]"><Sparkles size={18} /></span><h2 id="decision-help-title" className="mt-5 text-[clamp(1.8rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-.045em] text-[#1c372c]">Precisa de ajuda para decidir?</h2><p className="mt-3 max-w-sm text-xs leading-6 text-[#69756f]">Pergunte considerando seu perfil, esta oportunidade e as outras que já fazem parte da sua jornada.</p></div>
      <div>
        <form onSubmit={submit} className="flex items-center rounded-[18px] border border-[#ccd8d2] bg-[#fafbf9] p-1.5 shadow-[0_10px_30px_rgba(28,54,43,.045)] focus-within:border-[#079272]/55 focus-within:ring-4 focus-within:ring-[#079272]/8">
          <label className="sr-only" htmlFor="opportunity-question">Pergunte sobre esta oportunidade</label>
          <input id="opportunity-question" value={question} onChange={(event) => setQuestion(event.target.value)} className="h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-xs text-[#1c372c] outline-none placeholder:text-[#929c97]" placeholder="Pergunte qualquer coisa sobre esta oportunidade..." />
          <button type="submit" className="grid size-10 shrink-0 place-items-center rounded-[13px] border-0 bg-[#079272] text-white transition-colors hover:bg-[#056e57]" aria-label="Enviar pergunta"><ArrowRight size={17} /></button>
        </form>
        {submittedQuestion && <p className="mt-2 text-[9px] text-[#738079]" aria-live="polite">Pergunta contextualizada para esta oportunidade.</p>}
        <div className="mt-6 grid gap-3">{questions.map((suggestion) => <button type="button" className="group flex w-fit items-start gap-2 border-0 bg-transparent p-0 text-left text-[11px] leading-5 text-[#52615a] transition-colors hover:text-[#079272]" onClick={() => ask(suggestion)} key={suggestion}><ArrowRight className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5" size={13} />{suggestion}</button>)}</div>
      </div>
    </div>
  </section>;
}
