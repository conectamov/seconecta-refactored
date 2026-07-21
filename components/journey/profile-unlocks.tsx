"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BellRing, Camera, Check, ChevronDown, Clock3, Globe2, GraduationCap, Languages, MapPin, Sparkles, Target, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { JourneyProfileExtension, LanguageProficiency, ProfileStepId } from "@/types/journey-profile";
import type { OnboardingProfile } from "@/types/onboarding";

const STORAGE_KEY = "seconecta:journey-profile-extension";

export function loadJourneyProfileExtension() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const current = stored ? JSON.parse(stored) as JourneyProfileExtension : {};
    const legacyStored = window.localStorage.getItem("seconecta:journey-workspace-preferences");
    if (!legacyStored || current.weeklyAvailability) return current;
    const legacy = JSON.parse(legacyStored) as { weeklyMinutes?: number };
    return legacy.weeklyMinutes ? { ...current, weeklyAvailability: Math.max(2, Math.min(15, Math.round(legacy.weeklyMinutes / 60))) } : current;
  } catch {
    return {};
  }
}

type StepDefinition = {
  id: ProfileStepId;
  title: string;
  purpose: string;
  benefit: string;
  icon: typeof UserRound;
  optional?: boolean;
};

const steps: StepDefinition[] = [
  { id: "name", title: "Como podemos chamar você?", purpose: "Assim, cada orientação deixa de parecer genérica.", benefit: "Orientações mais pessoais", icon: UserRound },
  { id: "notifications", title: "Receber lembretes antes dos prazos?", purpose: "Você escolhe quando e por onde quer ser avisado.", benefit: "Lembretes de prazo ativados", icon: BellRing, optional: true },
  { id: "location", title: "Onde você está agora?", purpose: "Isso libera oportunidades locais e presenciais próximas.", benefit: "Oportunidades locais habilitadas", icon: MapPin, optional: true },
  { id: "school", title: "Onde você estuda?", purpose: "Ajuda a identificar bolsas e programas regionais compatíveis.", benefit: "Bolsas regionais mais precisas", icon: GraduationCap, optional: true },
  { id: "grade", title: "Qual é sua série ou ano de conclusão?", purpose: "Evitaremos oportunidades para as quais você ainda não é elegível.", benefit: "Filtros de elegibilidade melhorados", icon: GraduationCap },
  { id: "languages", title: "Quais idiomas você usa com conforto?", purpose: "Evitaremos recomendar oportunidades que você não conseguiria aproveitar.", benefit: "Filtros internacionais habilitados", icon: Languages },
  { id: "availability", title: "Quanto tempo cabe na sua semana?", purpose: "Isso ajuda a recomendar oportunidades que você consegue concluir de verdade.", benefit: "Planos de preparação mais realistas", icon: Clock3 },
  { id: "future", title: "O que você espera alcançar nos próximos anos?", purpose: "Uma resposta deixa o Coach mais alinhado às suas decisões.", benefit: "Coach mais personalizado", icon: Target },
  { id: "motivation", title: "O que você espera que mude com a seConecta?", purpose: "Essa resposta opcional ajuda o Coach a entender o que realmente importa para você.", benefit: "Orientação mais humana", icon: Sparkles, optional: true },
  { id: "picture", title: "Quer adicionar uma foto?", purpose: "Uma foto torna as interações na comunidade mais humanas.", benefit: "Perfil da comunidade atualizado", icon: Camera, optional: true },
];

const futurePlanOptions = ["Universidade no Brasil", "Universidade no exterior", "Pesquisa", "Olimpíadas", "Empreendedorismo", "Estágios", "Explorar carreiras", "Ainda não sei"];
const languageOptions = ["Português", "Inglês", "Espanhol", "Francês", "Outro"];
const proficiencies: LanguageProficiency[] = ["Básico", "Intermediário", "Avançado", "Fluente"];

function knownStepIds(profile: OnboardingProfile | null, extension: JourneyProfileExtension) {
  const known = new Set<ProfileStepId>(extension.skippedSteps ?? []);
  if (extension.firstName) known.add("name");
  if (extension.notificationChannel || profile?.preferredChannel) known.add("notifications");
  if (extension.city || extension.country) known.add("location");
  if (extension.institution) known.add("school");
  if (extension.gradeOrGraduation) known.add("grade");
  if (extension.languages?.length) known.add("languages");
  if (extension.weeklyAvailability) known.add("availability");
  if (extension.futurePlans?.length || profile?.primaryGoal) known.add("future");
  if (extension.motivation) known.add("motivation");
  if (extension.profilePictureDataUrl) known.add("picture");
  return known;
}

function StepShell({ step, onClose, children }: { step: StepDefinition; onClose: () => void; children: React.ReactNode }) {
  const Icon = step.icon;
  return <motion.section className="mt-3 rounded-[22px] border border-[#cfe0d8] bg-white p-5 shadow-[0_14px_38px_rgba(28,54,43,.08)] sm:p-6" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><header className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#e9f7f1] text-[#078166]"><Icon size={18} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-4"><div><span className="text-[8px] font-bold uppercase tracking-[.13em] text-[#078166]">Leva menos de 1 minuto</span><h2 className="mt-1 text-lg font-semibold tracking-[-.035em] text-[#17372b]">{step.title}</h2></div><button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-full text-[#75817b] hover:bg-[#f0f4f2]" aria-label="Fechar etapa"><X size={15} /></button></div><p className="mt-2 max-w-2xl text-[11px] leading-5 text-[#68756f]">{step.purpose}</p></div></header><div className="mt-5 sm:ml-14">{children}</div></motion.section>;
}

export function ProfileUnlocks({ profile, value, onChange }: { profile: OnboardingProfile | null; value: JourneyProfileExtension; onChange: (value: JourneyProfileExtension) => void }) {
  const [activeStep, setActiveStep] = useState<ProfileStepId | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(value.firstName ?? "");
  const [preferredName, setPreferredName] = useState(value.preferredName ?? "");
  const [notificationYes, setNotificationYes] = useState<boolean | null>(null);
  const [city, setCity] = useState(value.city ?? "");
  const [country, setCountry] = useState(value.country ?? "Brasil");
  const [institution, setInstitution] = useState(value.institution ?? "");
  const [grade, setGrade] = useState(value.gradeOrGraduation ?? "");
  const [languages, setLanguages] = useState<Record<string, LanguageProficiency>>(Object.fromEntries((value.languages ?? []).map((item) => [item.language, item.proficiency])));
  const [weeklyAvailability, setWeeklyAvailability] = useState(value.weeklyAvailability ?? 6);
  const [futurePlans, setFuturePlans] = useState<string[]>(value.futurePlans ?? []);
  const [motivation, setMotivation] = useState(value.motivation ?? "");

  const known = useMemo(() => knownStepIds(profile, value), [profile, value]);
  const remaining = steps.filter((step) => !known.has(step.id));
  const nextStep = remaining[0];
  const completedCount = steps.length - remaining.length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  if (!nextStep) return null;

  const persist = (patch: Partial<JourneyProfileExtension>, message: string) => {
    const next = { ...value, ...patch, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    onChange(next);
    setActiveStep(null);
    setReward(message);
    window.setTimeout(() => setReward(null), 2600);
  };

  const skip = (step: StepDefinition) => persist({ skippedSteps: [...new Set([...(value.skippedSteps ?? []), step.id])] }, step.optional ? "Você poderá responder isso quando quiser." : "Etapa deixada para depois.");
  const activeDefinition = steps.find((step) => step.id === activeStep);
  const inputClass = "h-11 w-full rounded-[13px] border border-[#d6e0db] bg-[#f9fbfa] px-3 text-[11px] text-[#29493c] outline-none transition focus:border-[#079272] focus:ring-2 focus:ring-[#079272]/10";

  return <div className="border-b border-[#dbe3df] bg-[#f2f7f4]"><div className="mx-auto w-[min(1180px,calc(100%-40px))] py-4"><section className="rounded-[20px] border border-[#d5e2dc] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(28,54,43,.04)]"><div className="flex flex-col gap-5 lg:flex-row lg:items-center"><div className="flex min-w-0 flex-1 items-start gap-4"><span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-[#e9f7f1] text-[#078166]">{value.profilePictureDataUrl ? <img src={value.profilePictureDataUrl} alt="Sua foto de perfil" className="size-full object-cover" /> : <UserRound size={18} />}</span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-[15px] font-semibold tracking-[-.025em] text-[#17372b]">Bem-vindo{value.preferredName || value.firstName ? `, ${value.preferredName || value.firstName}` : ""}!</h2><span className="rounded-full bg-[#edf7f3] px-2.5 py-1 text-[8px] font-semibold text-[#078166]">Perfil {percentage}% completo</span></div><p className="mt-1 max-w-2xl text-[10px] leading-5 text-[#68756f]">Quanto mais conhecemos seus objetivos, melhores ficam as recomendações, orientações e notificações.</p></div></div><div className="min-w-0 lg:w-[260px]"><div className="flex items-center justify-between text-[8px] font-semibold text-[#748079]"><span>Faltam {remaining.length} {remaining.length === 1 ? "etapa" : "etapas"}</span><span>{completedCount}/{steps.length}</span></div><div className="mt-2 grid grid-cols-10 gap-1">{steps.map((step) => <i className={`h-1.5 rounded-full ${known.has(step.id) ? "bg-[#079272]" : "bg-[#dce4e0]"}`} key={step.id} />)}</div><p className="mt-2 truncate text-[8px] text-[#7c8882]">Próximo desbloqueio: <strong className="text-[#456156]">{nextStep.benefit}</strong></p></div><button type="button" onClick={() => setActiveStep(activeStep ? null : nextStep.id)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#079272] px-5 text-[10px] font-semibold shadow-[0_8px_20px_rgba(7,146,114,.14)]" style={{ color: "#fff" }}>Completar uma etapa <ArrowRight size={13} /></button></div></section>

    <AnimatePresence>{reward && <motion.div role="status" className="mt-3 flex items-center gap-2 rounded-[14px] border border-[#cce3d8] bg-[#eaf7f1] px-4 py-3 text-[10px] font-semibold text-[#08745d]" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Check size={14} />{reward}</motion.div>}</AnimatePresence>

    <AnimatePresence mode="wait">{activeDefinition && <StepShell step={activeDefinition} onClose={() => setActiveStep(null)}>
      {activeDefinition.id === "name" && <div><div className="grid gap-3 sm:grid-cols-2"><label className="text-[9px] font-semibold text-[#52615a]">Primeiro nome<input className={`${inputClass} mt-1.5`} value={firstName} onChange={(event) => setFirstName(event.target.value)} autoFocus /></label><label className="text-[9px] font-semibold text-[#52615a]">Como prefere ser chamado <span className="font-normal text-[#929b97]">(opcional)</span><input className={`${inputClass} mt-1.5`} value={preferredName} onChange={(event) => setPreferredName(event.target.value)} /></label></div><button type="button" disabled={!firstName.trim()} onClick={() => persist({ firstName: firstName.trim(), preferredName: preferredName.trim() || undefined }, "Orientações agora usam o seu nome.")} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#079272] px-5 text-[10px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Usar este nome <ArrowRight size={12} /></button></div>}

      {activeDefinition.id === "notifications" && <div>{notificationYes === null ? <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setNotificationYes(true)} className="rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold" style={{ color: "#fff" }}><Check size={12} className="mr-1 inline" />Sim</button><button type="button" onClick={() => persist({ notificationChannel: "none" }, "Sem notificações por enquanto.")} className="rounded-full border border-[#d4dfda] bg-white px-5 py-2.5 text-[10px] font-semibold text-[#52615a]">Agora não</button></div> : <div><p className="mb-3 text-[9px] font-semibold text-[#52615a]">Onde prefere receber?</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => persist({ notificationChannel: "whatsapp" }, "Lembretes pelo WhatsApp habilitados.")} className="rounded-[13px] border border-[#cfe0d8] bg-[#f3f8f5] px-5 py-3 text-[10px] font-semibold text-[#08745d]">WhatsApp</button><button type="button" onClick={() => persist({ notificationChannel: "email" }, "Lembretes por e-mail habilitados.")} className="rounded-[13px] border border-[#cfe0d8] bg-[#f3f8f5] px-5 py-3 text-[10px] font-semibold text-[#08745d]">E-mail</button></div></div>}</div>}

      {activeDefinition.id === "location" && <div><div className="grid gap-3 sm:grid-cols-2"><label className="text-[9px] font-semibold text-[#52615a]">Cidade<input className={`${inputClass} mt-1.5`} value={city} onChange={(event) => setCity(event.target.value)} /></label><label className="text-[9px] font-semibold text-[#52615a]">País<input className={`${inputClass} mt-1.5`} value={country} onChange={(event) => setCountry(event.target.value)} /></label></div><div className="mt-4 flex gap-3"><button type="button" disabled={!city.trim() && !country.trim()} onClick={() => persist({ city: city.trim() || undefined, country: country.trim() || undefined }, "Oportunidades locais habilitadas.")} className="rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Salvar localização</button><button type="button" onClick={() => skip(activeDefinition)} className="text-[9px] font-semibold text-[#748079]">Agora não</button></div></div>}

      {activeDefinition.id === "school" && <div><label className="text-[9px] font-semibold text-[#52615a]">Escola ou universidade<input className={`${inputClass} mt-1.5`} value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="Digite o nome da instituição" /></label><div className="mt-4 flex gap-3"><button type="button" disabled={!institution.trim()} onClick={() => persist({ institution: institution.trim() }, "Bolsas regionais ficaram mais precisas.")} className="rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Salvar instituição</button><button type="button" onClick={() => skip(activeDefinition)} className="text-[9px] font-semibold text-[#748079]">Pular</button></div></div>}

      {activeDefinition.id === "grade" && <div><div className="grid gap-2 sm:grid-cols-3">{["1º ano EM", "2º ano EM", "3º ano EM", "Universidade", "Conclusão em 2027", "Outro"].map((option) => <button type="button" onClick={() => setGrade(option)} className={`rounded-[13px] border px-3 py-3 text-[9px] font-semibold ${grade === option ? "border-[#079272] bg-[#eaf7f1] text-[#08745d]" : "border-[#d6e0db] bg-white text-[#52615a]"}`} key={option}>{option}</button>)}</div><button type="button" disabled={!grade} onClick={() => persist({ gradeOrGraduation: grade }, "Filtros de elegibilidade melhorados.")} className="mt-4 rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Confirmar etapa</button></div>}

      {activeDefinition.id === "languages" && <div><div className="grid gap-2">{languageOptions.map((language) => <div className="flex items-center gap-3 rounded-[13px] border border-[#dce4e0] bg-[#fafbfa] px-3 py-2" key={language}><button type="button" onClick={() => setLanguages((current) => { const next = { ...current }; if (next[language]) delete next[language]; else next[language] = "Intermediário"; return next; })} className={`grid size-5 shrink-0 place-items-center rounded-md border ${languages[language] ? "border-[#079272] bg-[#079272]" : "border-[#b8c4be] bg-white"}`} style={languages[language] ? { color: "#fff" } : undefined}>{languages[language] && <Check size={12} />}</button><span className="flex-1 text-[10px] font-medium text-[#456156]">{language}</span>{languages[language] && <div className="relative"><select value={languages[language]} onChange={(event) => setLanguages((current) => ({ ...current, [language]: event.target.value as LanguageProficiency }))} className="h-8 appearance-none rounded-lg border border-[#d3ddd8] bg-white pl-3 pr-8 text-[8px] text-[#52615a]">{proficiencies.map((level) => <option key={level}>{level}</option>)}</select><ChevronDown size={11} className="pointer-events-none absolute right-2 top-2.5 text-[#7c8882]" /></div>}</div>)}</div><button type="button" disabled={!Object.keys(languages).length} onClick={() => persist({ languages: Object.entries(languages).map(([language, proficiency]) => ({ language, proficiency })) }, "Filtros internacionais habilitados.")} className="mt-4 rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Salvar idiomas</button></div>}

      {activeDefinition.id === "availability" && <div><div className="flex items-end justify-between"><strong className="text-2xl tracking-[-.04em] text-[#17372b]">{weeklyAvailability >= 15 ? "15h+" : `${weeklyAvailability}h`}</strong><span className="text-[9px] text-[#748079]">por semana</span></div><input type="range" min="2" max="15" step="1" value={weeklyAvailability} onChange={(event) => setWeeklyAvailability(Number(event.target.value))} className="mt-4 w-full accent-[#079272]" /><div className="mt-1 flex justify-between text-[8px] text-[#8a948f]"><span>2h</span><span>4h</span><span>6h</span><span>10h</span><span>15h+</span></div><button type="button" onClick={() => persist({ weeklyAvailability }, "Planos de preparação mais realistas.")} className="mt-4 rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold" style={{ color: "#fff" }}>Usar esta disponibilidade</button></div>}

      {activeDefinition.id === "future" && <div><div className="flex flex-wrap gap-2">{futurePlanOptions.map((option) => <button type="button" onClick={() => setFuturePlans((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])} className={`rounded-full border px-3 py-2 text-[9px] font-semibold ${futurePlans.includes(option) ? "border-[#079272] bg-[#eaf7f1] text-[#08745d]" : "border-[#d6e0db] bg-white text-[#52615a]"}`} key={option}>{futurePlans.includes(option) && <Check size={11} className="mr-1 inline" />}{option}</button>)}</div><button type="button" disabled={!futurePlans.length} onClick={() => persist({ futurePlans }, "O Coach agora considera seus planos futuros.")} className="mt-4 rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Salvar planos</button></div>}

      {activeDefinition.id === "motivation" && <div><textarea value={motivation} onChange={(event) => setMotivation(event.target.value)} className="min-h-24 w-full resize-none rounded-[13px] border border-[#d6e0db] bg-[#f9fbfa] p-3 text-[11px] leading-5 text-[#29493c] outline-none focus:border-[#079272]" placeholder="Ex.: Quero estudar fora, mas ainda não sei por onde começar." /><div className="mt-4 flex gap-3"><button type="button" disabled={!motivation.trim()} onClick={() => persist({ motivation: motivation.trim() }, "Seu Coach ganhou mais contexto sobre você.")} className="rounded-full bg-[#079272] px-5 py-2.5 text-[10px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Compartilhar contexto</button><button type="button" onClick={() => skip(activeDefinition)} className="text-[9px] font-semibold text-[#748079]">Pular</button></div></div>}

      {activeDefinition.id === "picture" && <div><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#cfe0d8] bg-[#f3f8f5] px-5 text-[10px] font-semibold text-[#08745d]"><Camera size={15} />Escolher uma foto<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => persist({ profilePictureDataUrl: String(reader.result) }, "Perfil da comunidade atualizado."); reader.readAsDataURL(file); }} /></label><button type="button" onClick={() => skip(activeDefinition)} className="ml-3 text-[9px] font-semibold text-[#748079]">Agora não</button></div>}
    </StepShell>}</AnimatePresence>
  </div></div>;
}
