"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Mail, MessageCircle, Monitor, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { onboardingService } from "@/services/onboarding-service";
import type { EducationLevel, Experience, OnboardingProfile, PreferredChannel, PrimaryGoal } from "@/types/onboarding";
import { OPPORTUNITY_TYPES, THEMES, type OpportunityType, type Theme } from "@/types/taxonomy";
import "./journey-onboarding.css";

type JourneyOnboardingContextValue = {
  profile: OnboardingProfile | null;
  startOnboarding: () => void;
  updateProfile: (profile: OnboardingProfile) => void;
};

export const JourneyOnboardingContext = createContext<JourneyOnboardingContextValue | null>(null);

const educationOptions: { value: EducationLevel; icon: string }[] = [
  { value: "Ensino Fundamental II", icon: "📘" },
  { value: "Ensino Médio", icon: "🎓" },
  { value: "Universidade", icon: "🏛" },
  { value: "Outro", icon: "🌎" },
];

const previousExperiences: { value: Experience; icon: string; title: string }[] = [
  { value: "OLYMPIADS", icon: "🏆", title: "Olimpíadas Científicas" },
  { value: "RESEARCH", icon: "🔬", title: "Pesquisa Científica" },
  { value: "PROGRAMMING_PROJECTS", icon: "💻", title: "Projetos de Programação" },
  { value: "HACKATHONS", icon: "🚀", title: "Hackathons" },
  { value: "INTERNSHIPS", icon: "🏢", title: "Estágios" },
  { value: "STUDY_ABROAD", icon: "🌎", title: "Intercâmbios" },
  { value: "COURSES", icon: "🎓", title: "Cursos ou Bootcamps" },
  { value: "VOLUNTEERING", icon: "❤️", title: "Voluntariado" },
  { value: "ENTREPRENEURSHIP", icon: "💼", title: "Empreendedorismo" },
  { value: "NONE", icon: "📖", title: "Nenhuma das anteriores" },
];

const primaryGoals: { value: PrimaryGoal; icon: string; title: string; description: string }[] = [
  { value: "STUDY_ABROAD", icon: "🌎", title: "Estudar no exterior", description: "Intercâmbios, bolsas, universidades e programas internacionais." },
  { value: "OLYMPIADS", icon: "🏆", title: "Evoluir em olimpíadas científicas", description: "Competições acadêmicas, preparação e desafios." },
  { value: "RESEARCH", icon: "🔬", title: "Fazer pesquisa científica", description: "Projetos, iniciação científica, feiras e laboratórios." },
  { value: "TECHNOLOGY", icon: "💻", title: "Desenvolver projetos e tecnologia", description: "Programação, IA, desenvolvimento de software e projetos." },
  { value: "CAREER", icon: "🚀", title: "Desenvolver minha carreira", description: "Estágios, experiências profissionais e crescimento acadêmico." },
  { value: "EXPLORING", icon: "🧭", title: "Ainda estou explorando possibilidades", description: "Quero conhecer diferentes oportunidades antes de decidir um caminho." },
];

const channels: { value: PreferredChannel; icon: typeof MessageCircle; title: string; copy: string; recommended?: boolean }[] = [
  { value: "WhatsApp", icon: MessageCircle, title: "WhatsApp", copy: "Recomendações personalizadas, lembretes de prazo e atualizações importantes.", recommended: true },
  { value: "Site", icon: Monitor, title: "Apenas pelo site", copy: "Explore oportunidades quando quiser, no seu ritmo." },
  { value: "E-mail", icon: Mail, title: "E-mail", copy: "Receba uma seleção semanal de descobertas." },
];

export function JourneyOnboarding({ open, onClose, onComplete }: { open: boolean; onClose: () => void; onComplete: (profile: OnboardingProfile) => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);
  const [selectedExperiences, setSelectedExperiences] = useState<Experience[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [selectedOpportunityTypes, setSelectedOpportunityTypes] = useState<OpportunityType[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | null>(null);
  const [preferredChannel, setPreferredChannel] = useState<PreferredChannel | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setEducationLevel(null);
    setSelectedExperiences([]);
    setSelectedThemes([]);
    setSelectedOpportunityTypes([]);
    setPrimaryGoal(null);
    setPreferredChannel(null);
    setIsPreparing(false);
  }, [open]);

  const toggleTheme = (theme: Theme) => setSelectedThemes((current) => current.includes(theme) ? current.filter((item) => item !== theme) : [...current, theme]);
  const toggleOpportunityType = (type: OpportunityType) => setSelectedOpportunityTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);
  const toggleExperience = (experience: Experience) => setSelectedExperiences((current) => {
    if (experience === "NONE") return current.includes("NONE") ? [] : ["NONE"];
    const withoutNone = current.filter((item) => item !== "NONE");
    return withoutNone.includes(experience) ? withoutNone.filter((item) => item !== experience) : [...withoutNone, experience];
  });
  const next = () => setStep((current) => current + 1);
  const complete = (channel: PreferredChannel) => {
    if (!educationLevel || !selectedExperiences.length || !selectedThemes.length || !selectedOpportunityTypes.length || !primaryGoal) return;
    const profile = { educationLevel, previousExperiences: selectedExperiences, themes: selectedThemes, opportunityTypes: selectedOpportunityTypes, primaryGoal, preferredChannel: channel };
    onboardingService.save(profile);
    onComplete(profile);
    setPreferredChannel(channel);
    setIsPreparing(true);
    window.setTimeout(() => {
      onClose();
      router.push("/explorar");
    }, 1450);
  };

  const canContinue = step === 0 ? Boolean(educationLevel) : step === 1 ? selectedExperiences.length > 0 : step === 2 ? selectedThemes.length > 0 : step === 3 ? selectedOpportunityTypes.length > 0 : Boolean(primaryGoal);
  const title = ["Em que etapa da sua jornada você está?", "Você já participou de alguma destas experiências?", "Quais temas despertam seu interesse?", "Que tipo de oportunidade você procura?", "Qual é o seu principal objetivo agora?", "Como você prefere acompanhar sua jornada?"][step];
  const subtitle = ["Isso nos ajuda a recomendar oportunidades compatíveis com seu momento.", "Selecione todas as opções que fazem parte da sua trajetória até hoje.", "Escolha quantos temas desejar.", "Você pode escolher mais de um tipo.", "Escolha a opção que melhor representa o que você quer conquistar neste momento.", "Você poderá mudar essa preferência mais tarde."][step];

  return <AnimatePresence>{open && <motion.div className="journey-onboarding-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.section className="journey-onboarding" role="dialog" aria-modal="true" aria-label="Começar minha jornada" initial={{ opacity: 0, y: 20, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .99 }} transition={{ duration: .25 }}>
      {isPreparing ? <div className="journey-preparing"><motion.span className="journey-preparing-icon" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}><Sparkles size={23} /></motion.span><h2>Preparando suas recomendações...</h2><p>Estamos encontrando bons próximos passos para você.</p><div className="journey-skeletons"><i /><i /><i /></div></div> : <>
        <header className="journey-onboarding-head"><span className="journey-brand"><b>se</b>Conecta<i /></span><button className="journey-back" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ChevronLeft size={17} /> Voltar</button><span>{step + 1} de 6</span><button type="button" onClick={onClose} aria-label="Fechar onboarding"><X size={19} /></button></header>
        <div className="journey-progress"><motion.i initial={false} animate={{ width: `${((step + 1) / 6) * 100}%` }} /></div>
        <div className="journey-onboarding-content">
          <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .2 }}>
            <span className="journey-kicker">Sua jornada</span><h2>{title}</h2><p>{subtitle}</p>
            {step === 0 && <div className="journey-option-grid journey-option-grid--education">{educationOptions.map((option) => <button type="button" className={educationLevel === option.value ? "is-selected" : ""} onClick={() => setEducationLevel(option.value)} key={option.value}><span>{option.icon}</span><strong>{option.value}</strong><Check size={17} /></button>)}</div>}
            {step === 1 && <div className="journey-option-grid journey-option-grid--experiences">{previousExperiences.map((experience) => <motion.button type="button" className={selectedExperiences.includes(experience.value) ? "is-selected" : ""} onClick={() => toggleExperience(experience.value)} key={experience.value} whileTap={{ scale: .98 }}><span>{experience.icon}</span><strong>{experience.title}</strong><Check size={17} /></motion.button>)}</div>}
            {step === 2 && <div className="journey-interest-chips">{THEMES.map((theme) => <motion.button type="button" className={selectedThemes.includes(theme) ? "is-selected" : ""} onClick={() => toggleTheme(theme)} key={theme} whileTap={{ scale: .96 }}>{selectedThemes.includes(theme) && <Check size={14} />}{theme}</motion.button>)}</div>}
            {step === 3 && <div className="journey-interest-chips">{OPPORTUNITY_TYPES.map((type) => <motion.button type="button" className={selectedOpportunityTypes.includes(type) ? "is-selected" : ""} onClick={() => toggleOpportunityType(type)} key={type} whileTap={{ scale: .96 }}>{selectedOpportunityTypes.includes(type) && <Check size={14} />}{type}</motion.button>)}</div>}
            {step === 4 && <div className="journey-option-grid journey-option-grid--goals">{primaryGoals.map((goal) => <button type="button" className={primaryGoal === goal.value ? "is-selected" : ""} onClick={() => setPrimaryGoal(goal.value)} key={goal.value}><span className="journey-goal-icon">{goal.icon}</span><span className="journey-goal-copy"><strong>{goal.title}</strong><small>{goal.description}</small></span><Check size={17} /></button>)}</div>}
            {step === 5 && <div className="journey-channel-list">{channels.map(({ value, icon: Icon, title: channelTitle, copy, recommended }) => <button type="button" className={preferredChannel === value ? "is-selected" : ""} onClick={() => complete(value)} key={value}><span className="journey-channel-icon"><Icon size={20} /></span><span><strong>{channelTitle}{recommended && <em>Recomendado</em>}</strong><small>{copy}</small></span><Check size={18} /></button>)}</div>}
          </motion.div></AnimatePresence>
          {step < 5 && <button type="button" className="journey-next" disabled={!canContinue} onClick={next}>Continuar <ChevronRight size={18} /></button>}
        </div>
      </>}
    </motion.section>
  </motion.div>}</AnimatePresence>;
}

export function JourneyOnboardingProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setProfile(onboardingService.load()), []);

  const updateProfile = (nextProfile: OnboardingProfile) => {
    onboardingService.save(nextProfile);
    setProfile(nextProfile);
  };

  return <JourneyOnboardingContext.Provider value={{ profile, startOnboarding: () => setIsOpen(true), updateProfile }}>
    {children}
    <JourneyOnboarding open={isOpen} onClose={() => setIsOpen(false)} onComplete={setProfile} />
  </JourneyOnboardingContext.Provider>;
}
