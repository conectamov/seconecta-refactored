"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  FileText,
  Gauge,
  Globe2,
  GraduationCap,
  Languages,
  MapPin,
  MessageCircleQuestion,
  Monitor,
  Route,
  Rows3,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useOpportunityJourney } from "@/components/opportunity-journey-provider";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OpportunityDetail } from "@/data/opportunity-details";

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: .45, ease: "easeOut" as const },
};

const stateLabels = {
  following: "Acompanhando",
  deciding: "Decidindo",
  preparing: "Preparando candidatura",
  willApply: "Vou me candidatar",
  applied: "Candidatei-me",
  resultReceived: "Resultado recebido",
  completed: "Concluído",
};

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="mb-8 max-w-2xl">
    <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#079272]">{eyebrow}</span>
    <h2 className="text-[clamp(1.8rem,4vw,2.65rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-[#1c372c]">{title}</h2>
    {description && <p className="mt-4 max-w-xl text-sm leading-7 text-[#69756f]">{description}</p>}
  </div>;
}

function OpportunityActions({ opportunity, inverse = false }: { opportunity: OpportunityDetail; inverse?: boolean }) {
  const { getJourney, startJourney, followOpportunity, removeJourney } = useOpportunityJourney();
  const journey = getJourney(opportunity.id);
  const opportunityRef = { id: opportunity.id, title: opportunity.title };

  if (journey) return <div className="flex flex-wrap items-center gap-3">
    <span className={inverse ? "inline-flex h-12 items-center gap-2 rounded-full bg-white/12 px-5 text-sm font-semibold text-white" : "inline-flex h-12 items-center gap-2 rounded-full bg-[#eaf8f2] px-5 text-sm font-semibold text-[#056e57]"}><Check size={17} /> {stateLabels[journey.state]}</span>
    <Button variant="ghost" className={inverse ? "text-white/80 hover:bg-white/10 hover:text-white" : ""} onClick={() => removeJourney(opportunity.id)}>Remover da jornada</Button>
  </div>;

  if (opportunity.applicationStatus !== "open") return <Button size="lg" variant="outline" className={inverse ? "border-white/25 bg-white/8 text-white hover:border-white/40 hover:bg-white/14" : ""} onClick={() => followOpportunity(opportunityRef)}>Acompanhar próxima edição</Button>;

  return <div className="flex flex-wrap gap-3">
    <Button size="lg" className={inverse ? "bg-white text-[#056e57] hover:bg-[#f1faf6]" : ""} onClick={() => startJourney(opportunityRef, "apply")}>Participar <ArrowRight size={17} /></Button>
    <Button size="lg" variant="outline" className={inverse ? "border-white/25 bg-white/8 text-white hover:border-white/40 hover:bg-white/14" : ""} onClick={() => followOpportunity(opportunityRef)}>Acompanhar</Button>
  </div>;
}

function OpportunityFactRail({ opportunity }: { opportunity: OpportunityDetail }) {
  const lookup = (label: string) => opportunity.overview.find((item) => item.label === label)?.value ?? "—";
  const isInternational = /internacional|portugal|global|exterior/i.test(opportunity.location);
  const facts = [
    { label: "Prazo", value: opportunity.deadline, icon: CalendarDays, tone: "text-[#b35a42]" },
    { label: "Alcance", value: isInternational ? "Internacional" : "Nacional", icon: Globe2, tone: "text-[#4e78aa]" },
    { label: "Bolsa", value: lookup("Bolsa"), icon: CircleDollarSign, tone: "text-[#079272]" },
    { label: "Nível", value: opportunity.educationLevel, icon: GraduationCap, tone: "text-[#7967d8]" },
    { label: "Preparação", value: lookup("Preparação"), icon: Clock3, tone: "text-[#b87824]" },
    { label: "Concorrência", value: opportunity.competitiveness, icon: Gauge, tone: "text-[#079272]" },
  ];

  return <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">{facts.map(({ label, value, icon: Icon, tone }) => <div className="group rounded-[17px] border border-white/90 bg-white/80 px-4 py-4 shadow-[0_10px_26px_rgba(28,54,43,.045)] transition-transform duration-200 hover:-translate-y-0.5" key={label}><span className="grid size-9 place-items-center rounded-xl bg-[#f2f6f3]"><Icon size={19} strokeWidth={2} className={tone} /></span><span className="mt-3 block text-[9px] font-bold uppercase tracking-[.1em] text-[#7d8882]">{label}</span><strong className="mt-1 block text-xs leading-4 text-[#1c372c]">{value}</strong></div>)}</div>;
}

export function OpportunityHero({ opportunity }: { opportunity: OpportunityDetail }) {
  return <section className="relative overflow-hidden border-b border-[#dfe5e1] bg-[radial-gradient(circle_at_80%_10%,rgba(2,109,240,.10),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(11,196,182,.12),transparent_32%),#f8faf7]">
    <div className="mx-auto grid w-[min(1160px,calc(100%-48px))] gap-9 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-end">
      <div>
        <Link href="/explorar" className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#52615a] no-underline hover:text-[#079272]"><ArrowLeft size={15} /> Voltar para oportunidades</Link>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-[#e9e8fb] px-3 py-1.5 text-[#6555b5]">{opportunity.type}</span>
          <span className="rounded-full border border-[#dfe5e1] bg-white/70 px-3 py-1.5 text-[#52615a]">{opportunity.organization}</span>
        </div>
        <h1 className="max-w-4xl text-[clamp(2.35rem,5vw,4rem)] font-semibold leading-[1.01] tracking-[-0.06em] text-[#18372b]">{opportunity.title}</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#52615a] md:text-base">{opportunity.summary}</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#52615a]"><MapPin size={16} className="text-[#079272]" />{opportunity.location}</div>
        <OpportunityFactRail opportunity={opportunity} />
      </div>

      <aside className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_55px_rgba(27,63,49,.10)] backdrop-blur" aria-label="Prazo e ações">
        <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#b35a42]">Prazo de inscrição</span>
        <strong className="mt-2 block text-2xl tracking-[-.04em] text-[#1c372c]">{opportunity.deadline}</strong>
        <p className="mt-1 flex items-center gap-2 text-xs font-medium text-[#b35a42]"><Clock3 size={14} /> {opportunity.deadlineNote}</p>
        <div className="my-5 h-px bg-[#e7ebe8]" />
        <p className="mb-5 text-xs leading-6 text-[#69756f]">{opportunity.fitSummary}</p>
        <div className="hidden md:block"><OpportunityActions opportunity={opportunity} /></div>
      </aside>
    </div>
  </section>;
}

export function OpportunitySectionNav() {
  const links = [["visao-geral", "Visão geral"], ["requisitos", "O que você precisa"], ["trajetoria", "Trajetória"], ["orientacao", "Orientação"], ["pessoas", "Pessoas"]];
  return <nav className="sticky top-[72px] z-30 overflow-x-auto border-b border-[#dfe5e1] bg-[#fafbf9]/92 backdrop-blur-xl" aria-label="Nesta oportunidade">
    <div className="mx-auto flex w-[min(1160px,calc(100%-48px))] min-w-max gap-7 py-4">
      {links.map(([id, label]) => <a className="text-[11px] font-semibold text-[#69756f] no-underline transition-colors hover:text-[#079272]" href={`#${id}`} key={id}>{label}</a>)}
    </div>
  </nav>;
}

export function RecommendationReasons({ reasons }: { reasons: string[] }) {
  return <motion.section {...reveal} className="mx-auto w-[min(1160px,calc(100%-48px))] py-12" aria-labelledby="recommendation-title">
    <div className="flex flex-col justify-between gap-5 rounded-[22px] border border-[#dfe5e1] bg-white px-6 py-5 md:flex-row md:items-center">
      <div><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7967d8]">Por que apareceu para você</span><h2 id="recommendation-title" className="mt-1 text-base font-semibold tracking-[-.025em] text-[#1c372c]">Combina com interesses que você indicou.</h2></div>
      <div className="flex flex-wrap items-center gap-2">{reasons.map((reason) => <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f1] px-3 py-2 text-[10px] font-semibold text-[#52615a]" key={reason}><Check size={13} className="text-[#079272]" />{reason}</span>)}</div>
      <button className="flex shrink-0 items-center gap-1 border-0 bg-transparent text-[10px] font-semibold text-[#52615a] underline decoration-[#b8c0bb] underline-offset-4" type="button" title="As recomendações usam seus interesses, objetivo e etapa de ensino."><MessageCircleQuestion size={14} /> Como funciona</button>
    </div>
  </motion.section>;
}

const overviewIcons = [Clock3, MapPin, Languages, Monitor, CircleDollarSign, Star, Gauge, BookOpenCheck];

export function QuickOverview({ items }: { items: OpportunityDetail["overview"] }) {
  return <motion.section {...reveal} id="visao-geral" className="scroll-mt-36 border-y border-[#e5e9e6] bg-white py-20">
    <div className="mx-auto w-[min(1160px,calc(100%-48px))]">
      <SectionHeading eyebrow="Fatos da oportunidade" title="O essencial, sem letras pequenas." description="Informações objetivas para você entender rapidamente o compromisso envolvido." />
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-[#dfe5e1] bg-[#dfe5e1] md:grid-cols-4">
        {items.map((item, index) => { const Icon = overviewIcons[index] ?? Check; return <div className="min-h-36 bg-white p-5 md:p-6" key={item.label}><Icon size={19} className="mb-7 text-[#079272]" /><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#8a948f]">{item.label}</span><strong className="mt-2 block text-lg font-semibold tracking-[-.03em] text-[#1c372c]">{item.value}</strong>{item.detail && <small className="mt-1 block text-[10px] leading-5 text-[#69756f]">{item.detail}</small>}</div>; })}
      </div>
    </div>
  </motion.section>;
}

export function RequirementsChecklist({ requirements }: { requirements: OpportunityDetail["requirements"] }) {
  const requiredCount = requirements.filter((item) => item.required).length;
  return <motion.section {...reveal} id="requisitos" className="scroll-mt-36 py-24">
    <div className="mx-auto grid w-[min(1160px,calc(100%-48px))] gap-10 lg:grid-cols-[.72fr_1.28fr]">
      <div><SectionHeading eyebrow="O que você vai precisar" title="Veja o esforço antes de decidir." description="Nenhum requisito isolado é complicado, mas os itens obrigatórios pedem organização." /><div className="inline-flex items-center gap-3 rounded-2xl bg-[#fff4e7] px-4 py-3 text-xs text-[#8c5b25]"><FileText size={18} /><span><strong className="block">{requiredCount} itens obrigatórios</strong>Preparação estimada: 8–12 horas</span></div></div>
      <Card className="shadow-[0_18px_55px_rgba(28,54,43,.06)]"><CardContent className="divide-y divide-[#e7ebe8] p-2 md:p-4">{requirements.map((item) => <div className="flex gap-4 p-4" key={item.label}><span className={item.required ? "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#eaf8f2] text-[#079272]" : "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#f1f2ef] text-[#7f8984]"}><Check size={15} /></span><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-[#1c372c]">{item.label}</strong><span className={item.required ? "rounded-full bg-[#eef7f3] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#057259]" : "rounded-full bg-[#f1f2ef] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#77817c]"}>{item.required ? "Obrigatório" : "Diferencial"}</span></div><p className="mt-1 text-xs leading-5 text-[#69756f]">{item.detail}</p></div></div>)}</CardContent></Card>
    </div>
  </motion.section>;
}

export function TrajectoryMap({ steps }: { steps: OpportunityDetail["trajectory"] }) {
  return <motion.section {...reveal} id="trajetoria" className="scroll-mt-36 overflow-hidden bg-[#173b30] py-24 text-white">
    <div className="mx-auto w-[min(1160px,calc(100%-48px))]">
      <div className="mb-12 grid gap-5 md:grid-cols-[1fr_.7fr] md:items-end"><div><span className="mb-3 block text-[11px] font-bold uppercase tracking-[.15em] text-[#75dfc4]">Mapa de trajetória</span><h2 className="max-w-2xl text-[clamp(2rem,5vw,3.7rem)] font-semibold leading-[1.04] tracking-[-.055em]">Esta oportunidade não existe isolada.</h2></div><p className="max-w-md text-sm leading-7 text-white/65">Ela pode funcionar como uma ponte entre seu interesse atual e experiências mais avançadas.</p></div>
      <div className="grid gap-3 md:grid-cols-4">{steps.map((step, index) => <div className="relative" key={step.label}><div className={step.active ? "min-h-44 rounded-[22px] border border-[#65d6b8]/60 bg-[#079272] p-5 shadow-[0_18px_45px_rgba(0,0,0,.18)]" : "min-h-44 rounded-[22px] border border-white/12 bg-white/[.06] p-5"}><span className="text-[10px] font-bold text-white/45">0{index + 1}</span><Route size={19} className={step.active ? "my-5 text-white" : "my-5 text-[#75dfc4]"} /><strong className="block text-sm leading-5">{step.label}</strong><small className="mt-2 block text-[10px] text-white/55">{step.context}</small></div>{index < steps.length - 1 && <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden text-[#75dfc4] md:block" size={26} />}</div>)}</div>
      <p className="mt-7 text-[10px] leading-5 text-white/45">Este mapa mostra caminhos comuns, não uma sequência obrigatória. Sua trajetória pode começar ou mudar em qualquer ponto.</p>
    </div>
  </motion.section>;
}

export function AIGuidance({ guidance }: { guidance: OpportunityDetail["guidance"] }) {
  return <motion.section {...reveal} id="orientacao" className="scroll-mt-36 py-24">
    <div className="mx-auto grid w-[min(1160px,calc(100%-48px))] gap-8 lg:grid-cols-[.65fr_1.35fr]">
      <SectionHeading eyebrow="Orientação personalizada" title="O que um mentor diria agora." description="Uma leitura do seu perfil combinada com o esforço e o prazo desta oportunidade." />
      <div className="relative overflow-hidden rounded-[28px] border border-[#cfe5db] bg-[linear-gradient(135deg,#eef9f4_0%,#f4f3ff_100%)] p-7 md:p-10">
        <Sparkles className="absolute right-7 top-7 text-[#7967d8]/30" size={34} />
        <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#6555b5]"><Sparkles size={13} /> Orientação simulada</span>
        <h3 className="mt-7 text-2xl font-semibold tracking-[-.04em] text-[#1c372c]">{guidance.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#52615a]">{guidance.body}</p>
        <div className="mt-7 grid gap-3">{guidance.actions.map((action, index) => <div className="flex gap-3 rounded-2xl bg-white/70 p-4" key={action}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#079272] text-[10px] font-bold text-white">{index + 1}</span><p className="text-xs leading-6 text-[#365247]">{action}</p></div>)}</div>
        <p className="mt-5 text-[10px] leading-5 text-[#7a8580]">Orientação baseada nas preferências informadas no onboarding. Confirme requisitos no site oficial.</p>
      </div>
    </div>
  </motion.section>;
}

export function OpportunityTimeline({ timeline }: { timeline: OpportunityDetail["timeline"] }) {
  return <motion.section {...reveal} className="border-y border-[#e2e7e4] bg-white py-20">
    <div className="mx-auto w-[min(1160px,calc(100%-48px))]">
      <SectionHeading eyebrow="Calendário" title="O caminho até o início." description="Datas importantes para você não precisar reconstruir o cronograma sozinho." />
      <ol className="grid gap-0 md:grid-cols-5">{timeline.map((item, index) => <li className="relative flex gap-4 border-l border-[#dfe5e1] pb-7 pl-6 md:block md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pt-7" key={item.label}><span className={item.current ? "absolute -left-[7px] top-0 size-[13px] rounded-full border-[3px] border-white bg-[#079272] ring-2 ring-[#079272]/25 md:-top-[7px] md:left-0" : "absolute -left-[5px] top-0 size-[9px] rounded-full bg-[#bdc6c1] md:-top-[5px] md:left-0"} /><div><time className={item.current ? "text-[10px] font-bold uppercase tracking-[.1em] text-[#079272]" : "text-[10px] font-bold uppercase tracking-[.1em] text-[#8a948f]"}>{item.date}</time><strong className="mt-2 block text-sm text-[#1c372c]">{item.label}</strong><small className="mt-1 block text-[10px] text-[#69756f]">{item.detail}</small></div></li>)}</ol>
    </div>
  </motion.section>;
}

export function PeopleWhoCanHelp({ people }: { people: OpportunityDetail["people"] }) {
  return <motion.section {...reveal} id="pessoas" className="scroll-mt-36 py-24">
    <div className="mx-auto w-[min(1160px,calc(100%-48px))]">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionHeading eyebrow="Pessoas aceleram pessoas" title="Você não precisa descobrir tudo sozinho." description="Converse com quem já passou por esta oportunidade ou pode ajudar na preparação." /><span className="mb-8 inline-flex items-center gap-2 text-[10px] font-semibold text-[#69756f]"><Users size={15} className="text-[#079272]" /> 12 pessoas conectadas</span></div>
      <div className="grid gap-4 md:grid-cols-3">{people.map((person) => <Card className="overflow-hidden transition-transform duration-200 hover:-translate-y-1" key={person.name}><CardContent className="p-5"><div className="flex items-center gap-4"><Image className="size-14 rounded-2xl object-cover" src={person.image} alt={`Retrato de ${person.name}`} width={56} height={56} /><div><h3 className="text-sm font-semibold text-[#1c372c]">{person.name}</h3><p className="mt-1 text-[10px] font-medium text-[#079272]">{person.role}</p></div></div><p className="my-5 min-h-10 text-xs leading-5 text-[#69756f]">{person.journey}</p><Link href={`/historias#${person.name.toLowerCase().replaceAll(" ", "-")}`} className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#1c372c] no-underline hover:text-[#079272]">Ver trajetória <ArrowRight size={14} /></Link></CardContent></Card>)}</div>
    </div>
  </motion.section>;
}

export function StudentJourneys({ journeys }: { journeys: OpportunityDetail["studentJourneys"] }) {
  return <motion.section {...reveal} className="bg-[#f1f5f2] py-24">
    <div className="mx-auto w-[min(1160px,calc(100%-48px))]">
      <SectionHeading eyebrow="Trajetórias reais" title="Veja transformação, não depoimentos." description="Do ponto de partida ao próximo caminho que se abriu." />
      <div className="grid gap-5 lg:grid-cols-2">{journeys.map((journey) => <Card className="p-2" key={journey.name}><CardContent className="grid gap-6 p-5 sm:grid-cols-[130px_1fr]"><div><Image className="aspect-[4/5] w-full rounded-[18px] object-cover" src={journey.image} alt={`Retrato de ${journey.name}`} width={180} height={225} /><strong className="mt-3 block text-sm text-[#1c372c]">{journey.name}</strong><small className="mt-1 block text-[9px] leading-4 text-[#69756f]">{journey.location}</small></div><ol className="grid content-center">{journey.steps.map((step, index) => <li className="relative flex min-h-14 items-center gap-3 border-l border-[#cdd8d2] pl-5 text-xs font-medium text-[#365247] last:border-transparent" key={step}><span className={index === 1 ? "absolute -left-[7px] grid size-[13px] place-items-center rounded-full bg-[#079272] ring-4 ring-[#eaf8f2]" : "absolute -left-[4px] size-[7px] rounded-full bg-[#aebbb5]"} />{step}</li>)}</ol></CardContent></Card>)}</div>
    </div>
  </motion.section>;
}

export function SimilarOpportunities({ opportunities }: { opportunities: OpportunityDetail["similar"] }) {
  return <motion.section {...reveal} className="py-24">
    <div className="mx-auto w-[min(1160px,calc(100%-48px))]">
      <SectionHeading eyebrow="Continue explorando" title="Se esta oportunidade chamou sua atenção..." description="Estas opções compartilham temas, nível de ensino ou formato — não são recomendações aleatórias." />
      <div className="grid gap-4 md:grid-cols-3">{opportunities.map((item) => <Link href={`/explorar/${item.id}`} className="group rounded-[22px] border border-[#dfe5e1] bg-white p-6 no-underline transition-all hover:-translate-y-1 hover:border-[#079272]/25 hover:shadow-[0_18px_40px_rgba(28,54,43,.07)]" key={item.id}><span className="text-[10px] font-bold uppercase tracking-[.1em] text-[#7967d8]">{item.type}</span><h3 className="mt-4 min-h-14 text-lg font-semibold leading-6 tracking-[-.035em] text-[#1c372c]">{item.title}</h3><p className="mt-4 text-xs leading-5 text-[#69756f]">{item.fit}</p><div className="mt-6 flex items-center justify-between border-t border-[#e7ebe8] pt-4 text-[10px] font-semibold text-[#52615a]"><span>{item.deadline}</span><ArrowRight className="transition-transform group-hover:translate-x-1" size={16} /></div></Link>)}</div>
    </div>
  </motion.section>;
}

type DetailSectionId = "overview" | "requirements" | "trajectory" | "guidance" | "people" | "similar";

const detailSections: { id: DetailSectionId; label: string; description: string; icon: typeof Rows3 }[] = [
  { id: "guidance", label: "Orientação", description: "Por onde começar", icon: Sparkles },
  { id: "overview", label: "Visão geral", description: "Fatos e compatibilidade", icon: Rows3 },
  { id: "requirements", label: "Requisitos", description: "O que preparar", icon: BookOpenCheck },
  { id: "trajectory", label: "Trajetória", description: "Caminhos possíveis", icon: Route },
  { id: "people", label: "Pessoas", description: "Quem pode ajudar", icon: Users },
  { id: "similar", label: "Descobrir", description: "Explorar caminhos", icon: Star },
];

function PanelHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="mb-7 border-b border-[#e5e9e6] pb-6"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#079272]">{eyebrow}</span><h2 className="mt-2 text-[clamp(1.65rem,3vw,2.25rem)] font-semibold leading-tight tracking-[-.045em] text-[#1c372c]">{title}</h2><p className="mt-2 max-w-2xl text-xs leading-6 text-[#69756f]">{description}</p></header>;
}

function ContextualQuestions({ questions }: { questions: string[] }) {
  const selectQuestion = (question: string) => window.dispatchEvent(new CustomEvent("seconecta:guidance-question", { detail: { question } }));
  return <div className="mt-10 border-t border-[#e2e7e4] pt-7">
    <h3 className="text-sm font-semibold text-[#1c372c]">Dúvidas comuns</h3>
    <div className="mt-4 grid gap-3">{questions.map((question) => <button className="group flex w-fit items-start gap-2 border-0 bg-transparent p-0 text-left text-[11px] leading-5 text-[#52615a] transition-colors hover:text-[#079272]" type="button" onClick={() => selectQuestion(question)} key={question}><ArrowRight className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5" size={14} />{question}</button>)}</div>
  </div>;
}

function OverviewPanel({ opportunity }: { opportunity: OpportunityDetail }) {
  return <div>
    <PanelHeading eyebrow="Visão geral" title="O essencial, sem excesso." description="Informações objetivas para entender o compromisso envolvido." />
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">{opportunity.overview.map((item, index) => { const Icon = overviewIcons[index] ?? Check; return <div className={index % 3 === 0 ? "min-h-36 rounded-[18px] border border-[#dfe5e1] bg-[#f2f7f4] p-4 md:p-5" : "min-h-36 rounded-[18px] border border-[#dfe5e1] bg-white p-4 shadow-[0_8px_20px_rgba(28,54,43,.025)] md:p-5"} key={item.label}><Icon size={17} className="mb-6 text-[#079272]" /><dt className="text-[9px] font-bold uppercase tracking-[.1em] text-[#89938e]">{item.label}</dt><dd className="mt-1.5 text-base font-semibold tracking-[-.025em] text-[#1c372c]">{item.value}</dd>{item.detail && <small className="mt-1 block text-[9px] leading-4 text-[#69756f]">{item.detail}</small>}</div>; })}</dl>
    <div className="mt-10 rounded-[20px] border border-[#e1e7e3] bg-[#f7f9f7] px-5 py-3"><h3 className="mb-1 text-sm font-semibold text-[#1c372c]">Perguntas frequentes</h3><div className="divide-y divide-[#e2e7e4]">{opportunity.popularQuestions.map((item) => <details className="group py-4" key={item.question}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-medium text-[#1c372c]">{item.question}<span className="text-lg font-light text-[#87918c] transition-transform group-open:rotate-45">+</span></summary><p className="mt-2 max-w-2xl pr-8 text-[10px] leading-5 text-[#69756f]">{item.answer}</p></details>)}</div></div>
  </div>;
}

function RequirementsPanel({ opportunity }: { opportunity: OpportunityDetail }) {
  return <div>
    <PanelHeading eyebrow="Preparação" title="Prepare sua candidatura." description="Transforme os requisitos em uma sequência concreta de preparação." />
    <div className="mb-8 grid gap-3 sm:grid-cols-2"><div className="rounded-[18px] border border-[#dbe7e0] bg-[#eef7f2] p-4 text-[#365247]"><Clock3 size={17} className="text-[#079272]" /><span className="mt-4 block text-[9px] font-bold uppercase tracking-[.1em] text-[#6f8077]">Preparação estimada</span><strong className="mt-1 block text-base text-[#1c372c]">8–12 horas</strong></div><div className="rounded-[18px] border border-[#e4e5e7] bg-[#f8f8fa] p-4 text-[#365247]"><FileText size={17} className="text-[#7967d8]" /><span className="mt-4 block text-[9px] font-bold uppercase tracking-[.1em] text-[#777a85]">Itens para reunir</span><strong className="mt-1 block text-base text-[#1c372c]">{opportunity.requirements.filter((item) => item.required).length} obrigatórios</strong></div></div>
    <span className="mb-3 block text-[10px] font-bold uppercase tracking-[.12em] text-[#69756f]">Prepare:</span><div className="divide-y divide-[#e2e7e4] rounded-[20px] border border-[#dfe5e1] bg-white px-5">{opportunity.requirements.map((item) => <div className="flex gap-3 py-4" key={item.label}><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#eaf8f2] text-[#079272]"><Check size={13} /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-xs text-[#1c372c]">{item.label}</strong>{!item.required && <span className="text-[8px] font-bold uppercase tracking-wide text-[#839089]">Diferencial</span>}</div><p className="mt-1 text-[10px] leading-5 text-[#69756f]">{item.detail}</p></div></div>)}</div>
    <ContextualQuestions questions={opportunity.suggestedQuestions.requirements} />
  </div>;
}

function TrajectoryPanel({ opportunity }: { opportunity: OpportunityDetail }) {
  return <div>
    <PanelHeading eyebrow="Mapa de trajetória" title="Onde esta oportunidade pode levar." description="Um caminho possível — não uma sequência obrigatória." />
    <div className="grid gap-2 md:grid-cols-4">{opportunity.trajectory.map((step, index) => <div className={step.active ? "relative rounded-[18px] bg-[#079272] p-4 text-white" : "relative rounded-[18px] border border-[#dfe5e1] bg-white p-4 text-[#1c372c]"} key={step.label}><span className={step.active ? "text-[9px] font-bold text-white/55" : "text-[9px] font-bold text-[#9aa39f]"}>0{index + 1}</span><strong className="mt-8 block min-h-10 text-xs leading-5">{step.label}</strong><small className={step.active ? "mt-2 block text-[9px] text-white/65" : "mt-2 block text-[9px] text-[#69756f]"}>{step.context}</small>{index < opportunity.trajectory.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden text-[#079272] md:block" size={21} />}</div>)}</div>
    <h3 className="mb-3 mt-7 text-sm font-semibold text-[#1c372c]">Estudantes que percorreram caminhos parecidos</h3>
    <div className="grid gap-3 md:grid-cols-2">{opportunity.studentJourneys.map((journey) => <div className="flex gap-4 rounded-[18px] border border-[#dfe5e1] bg-white p-4" key={journey.name}><Image className="size-14 shrink-0 rounded-2xl object-cover" src={journey.image} alt={`Retrato de ${journey.name}`} width={56} height={56} /><div className="min-w-0"><strong className="text-xs text-[#1c372c]">{journey.name}</strong><p className="mt-1 text-[9px] text-[#69756f]">{journey.location}</p><p className="mt-3 text-[10px] leading-5 text-[#365247]">{journey.steps.join(" → ")}</p></div></div>)}</div>
    <ContextualQuestions questions={opportunity.suggestedQuestions.trajectory} />
  </div>;
}

function GuidancePanel({ opportunity }: { opportunity: OpportunityDetail }) {
  return <div>
    <PanelHeading eyebrow="Orientação" title="Como esta oportunidade se encaixa na sua jornada." description="" />
    <article className="max-w-3xl py-2">
      <h3 className="max-w-2xl text-[clamp(1.45rem,3vw,2rem)] font-semibold leading-[1.25] tracking-[-.035em] text-[#1c372c]">{opportunity.orientation.headline}</h3>
      <div className="mt-7 grid gap-5">{opportunity.orientation.paragraphs.map((paragraph) => <p className="max-w-2xl text-[15px] leading-8 text-[#465d53] md:text-base" key={paragraph}>{paragraph}</p>)}</div>
    </article>
    <div className="mt-8 border-y border-[#dfe5e1] py-5"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#8a948f]">Levamos em consideração</span><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{opportunity.orientation.considerations.map((item) => <span className="text-[10px] font-medium text-[#52615a]" key={item}>{item}</span>)}</div></div>
    <section className="mt-10"><h3 className="text-base font-semibold tracking-[-.025em] text-[#1c372c]">O que considerar agora</h3><dl className="mt-4 grid gap-3 md:grid-cols-3">{opportunity.orientation.now.map((item) => <div className="min-h-32 rounded-[18px] border border-[#e1e7e3] bg-[#f4f7f5] p-4" key={item.label}><dt className="text-[9px] font-bold uppercase tracking-[.12em] text-[#8a948f]">{item.label}</dt><dd className="mt-4 text-[11px] leading-5 text-[#365247]">{item.text}</dd></div>)}</dl></section>
    {opportunity.orientation.alternative && <section className="mt-8 border-l-2 border-[#079272] pl-5"><p className="max-w-2xl text-xs leading-6 text-[#52615a]">{opportunity.orientation.alternative.message}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{opportunity.orientation.alternative.categories.map((category) => <span className="text-[10px] font-semibold text-[#056e57]" key={category}>{category}</span>)}</div></section>}
    <ContextualQuestions questions={opportunity.suggestedQuestions.orientation} />
  </div>;
}

function PeoplePanel({ opportunity }: { opportunity: OpportunityDetail }) {
  return <div>
    <PanelHeading eyebrow="Rede de apoio" title="Pessoas que podem aproximar o caminho." description="Participantes e mentores conectados a esta oportunidade." />
    <div className="grid gap-3 md:grid-cols-3">{opportunity.people.map((person) => <div className="rounded-[20px] border border-[#dfe5e1] bg-white p-4" key={person.name}><Image className="size-16 rounded-[18px] object-cover" src={person.image} alt={`Retrato de ${person.name}`} width={64} height={64} /><h3 className="mt-4 text-sm font-semibold text-[#1c372c]">{person.name}</h3><p className="mt-1 text-[9px] font-semibold text-[#079272]">{person.role}</p><p className="my-4 min-h-10 text-[10px] leading-5 text-[#69756f]">{person.journey}</p><span className="text-[8px] font-bold uppercase tracking-[.1em] text-[#8a948f]">Pode ajudar com</span><div className="mb-5 mt-2 flex flex-wrap gap-1.5">{person.helpsWith.map((topic) => <span className="rounded-full bg-[#f1f4f2] px-2.5 py-1.5 text-[8px] font-medium text-[#52615a]" key={topic}>{topic}</span>)}</div><Link href={`/historias#${person.name.toLowerCase().replaceAll(" ", "-")}`} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#1c372c] no-underline hover:text-[#079272]">Ver trajetória <ArrowRight size={13} /></Link></div>)}</div>
    <div className="mt-5 rounded-[18px] bg-[#f1f5f2] p-5"><p className="text-xs font-medium text-[#365247]">12 pessoas estão conectadas a esta oportunidade.</p><p className="mt-1 text-[10px] text-[#69756f]">Conversas e pedidos de mentoria serão habilitados quando os perfis da comunidade estiverem disponíveis.</p></div>
  </div>;
}

function DiscoveryPanel({ opportunity }: { opportunity: OpportunityDetail }) {
  return <div>
    <PanelHeading eyebrow="Descoberta" title="Se esta oportunidade despertou seu interesse..." description="Explore caminhos relacionados, não apenas outras inscrições parecidas." />
    <div className="grid gap-3 sm:grid-cols-2">{opportunity.discoveryCategories.map((category, index) => <Link href={`/explorar?categoria=${encodeURIComponent(category.query)}`} className="group min-h-36 rounded-[18px] border border-[#dfe5e1] bg-white p-5 no-underline transition-all hover:border-[#079272]/30 hover:shadow-[0_12px_30px_rgba(28,54,43,.06)]" key={category.label}><span className="text-[9px] font-bold text-[#9aa39f]">0{index + 1}</span><h3 className="mt-5 text-sm font-semibold tracking-[-.02em] text-[#1c372c]">{category.label}</h3><p className="mt-2 max-w-xs text-[10px] leading-5 text-[#69756f]">{category.description}</p><span className="mt-4 inline-flex items-center gap-2 text-[9px] font-semibold text-[#056e57]">Explorar caminho <ArrowRight className="transition-transform group-hover:translate-x-1" size={13} /></span></Link>)}</div>
  </div>;
}

export function OpportunityWorkspace({ opportunity }: { opportunity: OpportunityDetail }) {
  const [activeSection, setActiveSection] = useState<DetailSectionId>("guidance");
  const panels: Record<DetailSectionId, React.ReactNode> = {
    overview: <OverviewPanel opportunity={opportunity} />,
    requirements: <RequirementsPanel opportunity={opportunity} />,
    trajectory: <TrajectoryPanel opportunity={opportunity} />,
    guidance: <GuidancePanel opportunity={opportunity} />,
    people: <PeoplePanel opportunity={opportunity} />,
    similar: <DiscoveryPanel opportunity={opportunity} />,
  };

  return <section className="mx-auto grid w-[min(1160px,calc(100%-48px))] gap-7 py-8 md:grid-cols-[296px_minmax(0,1fr)] md:items-start md:py-10">
    <aside className="sticky top-[72px] z-30 -mx-6 overflow-x-auto border-y border-[#dfe5e1] bg-[#fafbf9]/95 px-6 py-3 backdrop-blur-xl md:top-[96px] md:mx-0 md:overflow-visible md:rounded-[24px] md:border md:bg-white md:p-4" aria-label="Seções da oportunidade">
      <span className="mb-3 hidden px-3 pt-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#7d8882] md:block">Nesta oportunidade</span>
      <nav className="flex min-w-max gap-2 md:grid md:min-w-0 md:gap-2">{detailSections.map(({ id, label, description, icon: Icon }) => <button className={activeSection === id ? "flex items-center gap-4 rounded-[18px] bg-[#eaf8f2] px-4 py-4 text-left text-[#056e57] shadow-[inset_0_0_0_1px_rgba(7,146,114,.06)] md:w-full" : "flex items-center gap-4 rounded-[18px] px-4 py-4 text-left text-[#69756f] transition-colors hover:bg-[#f3f5f2] hover:text-[#1c372c] md:w-full"} type="button" onClick={() => setActiveSection(id)} aria-current={activeSection === id ? "page" : undefined} key={id}><span className={activeSection === id ? "grid size-10 shrink-0 place-items-center rounded-[13px] bg-white text-[#079272] shadow-[0_5px_14px_rgba(7,146,114,.09)]" : "grid size-10 shrink-0 place-items-center rounded-[13px] bg-[#f1f5f2] text-[#52615a]"}><Icon size={21} strokeWidth={2} /></span><span><strong className="block text-[13px] font-semibold">{label}</strong><small className="mt-1 hidden text-[10px] leading-4 opacity-75 md:block">{description}</small></span></button>)}</nav>
      <div className="mt-4 hidden border-t border-[#e5e9e6] px-4 pb-3 pt-5 md:block"><span className="text-[10px] font-bold uppercase tracking-[.1em] text-[#b35a42]">Prazo</span><strong className="mt-1.5 block text-base text-[#1c372c]">{opportunity.deadline}</strong><p className="mt-1 text-[10px] text-[#b35a42]">{opportunity.deadlineNote}</p><div className="mt-5"><OpportunityActions opportunity={opportunity} /></div></div>
    </aside>
    <div className="min-h-[680px] px-1 py-4 md:px-8 md:py-5">
      <AnimatePresence mode="wait" initial={false}><motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: .18 }}>{panels[activeSection]}</motion.div></AnimatePresence>
    </div>
  </section>;
}

export function FinalDecisionCTA({ opportunity }: { opportunity: OpportunityDetail }) {
  return <motion.section {...reveal} className="px-6 pb-10">
    <div className="mx-auto grid w-full max-w-[1160px] gap-8 overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_85%_0%,rgba(11,196,182,.26),transparent_36%),#173b30] p-8 text-white md:grid-cols-[1fr_auto] md:items-end md:p-12">
      <div><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#75dfc4]">Seu próximo passo</span><h2 className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.04] tracking-[-.055em]">Esta oportunidade merece um lugar na sua jornada?</h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/65">Você já conhece o esforço, o prazo e os caminhos que ela pode abrir. Escolha o nível de compromisso que faz sentido agora.</p></div>
      <OpportunityActions opportunity={opportunity} inverse />
    </div>
  </motion.section>;
}

export function MobileActionBar({ opportunity }: { opportunity: OpportunityDetail }) {
  return <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dfe5e1] bg-white/94 px-4 py-3 shadow-[0_-12px_35px_rgba(28,54,43,.09)] backdrop-blur-xl md:hidden">
    <OpportunityActions opportunity={opportunity} />
  </div>;
}

export function OpportunityDetailPage({ opportunity }: { opportunity: OpportunityDetail }) {
  return <main className="min-h-screen bg-[#fafbf9] font-[family-name:var(--font-poppins)] text-[#1c372c]">
    <SiteHeader />
    <OpportunityHero opportunity={opportunity} />
    <OpportunityWorkspace opportunity={opportunity} />
    <footer className="py-10 text-center text-[10px] text-[#7d8781]">Informações simuladas para prototipação · Confirme os detalhes no site oficial da organização.</footer>
    <MobileActionBar opportunity={opportunity} />
  </main>;
}
