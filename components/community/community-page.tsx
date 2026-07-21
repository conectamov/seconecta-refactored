"use client";

import { ArrowRight, Check, MessageCircle, Plus, Send, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { useAuthentication } from "@/components/auth/authentication-provider";
import { SiteHeader } from "@/components/site-header";

const discussions = [
  { name: "Marina Alves", initials: "MA", context: "Programa de Verão em IA", text: "Alguém quer revisar a estrutura da redação comigo?", replies: 6 },
  { name: "Lucas Rocha", initials: "LR", context: "Bolsas internacionais", text: "Compartilhei o checklist que usei na minha candidatura aprovada.", replies: 12 },
  { name: "Ana Costa", initials: "AC", context: "OBMEP", text: "Como vocês estão organizando a preparação para a próxima fase?", replies: 9 },
];

export function CommunityPage() {
  const { isAuthenticated, openAuthentication } = useAuthentication();
  const [composerOpen, setComposerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const beginContribution = () => {
    const continueContribution = () => setComposerOpen(true);
    if (isAuthenticated) continueContribution();
    else openAuthentication("community", continueContribution);
  };

  const publish = () => {
    if (!message.trim()) return;
    setMessage("");
    setComposerOpen(false);
    setFeedback("Sua contribuição foi adicionada à conversa.");
    window.setTimeout(() => setFeedback(null), 2600);
  };

  return <main className="min-h-screen bg-[#f4f7f5] font-[family-name:var(--font-poppins)] text-[#17372b]"><SiteHeader /><section className="border-b border-[#dbe3df] bg-white"><div className="mx-auto flex w-[min(1080px,calc(100%-40px))] flex-col justify-between gap-6 py-10 sm:flex-row sm:items-end"><div><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#078166]">Comunidade</span><h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-[-.06em]">Pessoas aceleram pessoas.</h1><p className="mt-3 max-w-xl text-[12px] leading-6 text-[#66736d]">Explore livremente. Conecte sua Jornada apenas quando quiser participar e preservar suas conversas.</p></div><button type="button" onClick={beginContribution} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#079272] px-5 text-[10px] font-semibold" style={{ color: "#fff" }}><Plus size={14} />Fazer uma pergunta</button></div></section><div className="mx-auto grid w-[min(1080px,calc(100%-40px))] gap-6 py-9 lg:grid-cols-[1fr_310px]"><section><div className="mb-5 flex items-center justify-between"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#078166]">Acontecendo agora</span><h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">Conversas recentes</h2></div><span className="inline-flex items-center gap-2 rounded-full bg-[#eaf7f1] px-3 py-1.5 text-[9px] font-semibold text-[#078166]"><i className="size-1.5 rounded-full bg-[#079272]" />18 estudantes ativos</span></div><div className="grid gap-3">{discussions.map((discussion) => <article className="rounded-[20px] border border-[#d8e1dc] bg-white p-5 shadow-[0_9px_26px_rgba(28,54,43,.04)]" key={discussion.name}><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eaf3ef] text-[9px] font-bold text-[#456156]">{discussion.initials}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2"><strong className="text-[11px]">{discussion.name}</strong><span className="text-[8px] text-[#89938e]">em {discussion.context}</span></div><p className="mt-3 text-[12px] leading-6 text-[#52615a]">{discussion.text}</p><div className="mt-4 flex items-center gap-4"><span className="inline-flex items-center gap-1.5 text-[9px] text-[#748079]"><MessageCircle size={12} />{discussion.replies} respostas</span><button type="button" onClick={beginContribution} className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#078166]">Responder <ArrowRight size={11} /></button></div></div></div></article>)}</div></section><aside className="rounded-[22px] border border-[#d8e1dc] bg-white p-5 lg:self-start"><span className="grid size-10 place-items-center rounded-[14px] bg-[#eaf7f1] text-[#078166]"><Users size={18} /></span><h2 className="mt-4 text-lg font-semibold tracking-[-.035em]">Participe com contexto.</h2><p className="mt-2 text-[10px] leading-5 text-[#66736d]">Ao conectar sua Jornada, suas perguntas permanecem ligadas às oportunidades que você acompanha.</p><ul className="mt-4 grid gap-2 text-[9px] text-[#52615a]"><li className="flex gap-2"><Check size={12} className="text-[#078166]" />Encontre estudantes preparando</li><li className="flex gap-2"><Check size={12} className="text-[#078166]" />Converse com aprovados</li><li className="flex gap-2"><Check size={12} className="text-[#078166]" />Continue depois no WhatsApp</li></ul></aside></div>{composerOpen && <div className="fixed inset-x-0 bottom-5 z-40 mx-auto w-[min(620px,calc(100%-24px))] rounded-[22px] border border-[#cfdcd6] bg-white p-4 shadow-[0_20px_60px_rgba(19,55,43,.18)]"><div className="flex items-center gap-2"><Sparkles size={15} className="text-[#078166]" /><strong className="text-[10px]">Sua Jornada está conectada a esta conversa.</strong></div><textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-3 min-h-20 w-full resize-none rounded-[13px] border border-[#d8e1dc] bg-[#f8faf9] p-3 text-[11px] outline-none focus:border-[#079272]" placeholder="Escreva sua pergunta ou resposta..." autoFocus /><div className="mt-3 flex justify-end gap-2"><button type="button" onClick={() => setComposerOpen(false)} className="px-3 text-[9px] font-semibold text-[#748079]">Agora não</button><button type="button" onClick={publish} disabled={!message.trim()} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#079272] px-4 text-[9px] font-semibold disabled:opacity-35" style={{ color: "#fff" }}>Publicar <Send size={12} /></button></div></div>}{feedback && <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#173b30] px-5 py-3 text-[9px] font-semibold shadow-xl" style={{ color: "#fff" }}><Check size={13} />{feedback}</div>}</main>;
}
