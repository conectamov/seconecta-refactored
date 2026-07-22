"use client";

import { ArrowUpRight, BookOpen, Check, FileText, LockKeyhole } from "lucide-react";
import type { OpportunityGuide as OpportunityGuideData } from "@/types/opportunity-knowledge-hub";

const sourceLabels = { official: "Fonte oficial", seconecta: "Organizado pela seConecta", "community-curated": "Conhecimento da comunidade" };

export function OpportunityGuide({ guide, onOpen }: { guide: OpportunityGuideData; onOpen: (articleId: string) => void }) {
  const categories = [...new Set(guide.articles.map((article) => article.category))];
  return <div><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="max-w-xl text-[10px] leading-5 text-[#69756f]">Informação estável e organizada. Discussões da comunidade só entram aqui depois de revisão e curadoria.</p><span className="inline-flex items-center gap-1.5 text-[8px] font-semibold text-[#7d8882]"><Check size={11} className="text-[#079272]" />{guide.updatedAt}</span></div><div className="grid gap-7">{categories.map((category) => <section key={category}><h3 className="mb-2.5 text-[9px] font-bold uppercase tracking-[.13em] text-[#7b8781]">{category}</h3><div className="divide-y divide-[#e5eae7] overflow-hidden rounded-[18px] border border-[#dce3df] bg-white">{guide.articles.filter((article) => article.category === category).map((article) => { const content = <><span className={`grid size-9 shrink-0 place-items-center rounded-[12px] ${article.available ? "bg-[#eaf7f2] text-[#078166]" : "bg-[#f1f3f2] text-[#8a948f]"}`}>{article.available ? article.source === "official" ? <FileText size={15} /> : <BookOpen size={15} /> : <LockKeyhole size={14} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-[11px] text-[#29493c]">{article.title}</strong><span className="text-[7px] font-semibold uppercase tracking-[.08em] text-[#929b97]">{sourceLabels[article.source]}</span></div><p className="mt-1 text-[9px] leading-4 text-[#748079]">{article.summary}</p></div>{article.available ? <ArrowUpRight size={14} className="shrink-0 text-[#078166]" /> : <span className="shrink-0 text-[8px] font-semibold text-[#929b97]">Em breve</span>}</>;
        const className = "flex w-full items-center gap-3 px-4 py-4 text-left no-underline transition hover:bg-[#f8fbf9]";
        if (!article.available) return <div className={`${className} cursor-default`} key={article.id}>{content}</div>;
        return article.href ? <a href={article.href} target="_blank" rel="noopener noreferrer" className={className} key={article.id}>{content}</a> : <button type="button" onClick={() => onOpen(article.id)} className={className} key={article.id}>{content}</button>;
      })}</div></section>)}</div></div>;
}
