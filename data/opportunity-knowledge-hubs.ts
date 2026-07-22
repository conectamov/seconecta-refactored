import type { OpportunityDetail } from "@/data/opportunity-details";
import type { OpportunityCommunityHub, OpportunityGuide } from "@/types/opportunity-knowledge-hub";

export function getOpportunityGuide(opportunity: OpportunityDetail): OpportunityGuide {
  return {
    opportunityId: opportunity.id,
    updatedAt: "Atualizado nesta semana",
    articles: [
      { id: "what", category: "Entenda", title: "O que é esta oportunidade?", summary: opportunity.description, source: "official", href: opportunity.officialUrl, available: true },
      { id: "requirements", category: "Candidatura", title: "Requisitos e documentos", summary: `${opportunity.requirements.filter((item) => item.required).length} itens obrigatórios organizados em uma lista prática.`, source: "seconecta", available: true },
      { id: "application", category: "Candidatura", title: "Como funciona a candidatura", summary: "Etapas, ordem recomendada e tempo estimado para concluir cada parte.", source: "seconecta", available: true },
      { id: "selection", category: "Seleção", title: "Como funciona a seleção", summary: "Critérios conhecidos, entrevistas e o que acontece depois do envio.", source: "official", href: opportunity.officialUrl, available: true },
      { id: "timeline", category: "Entenda", title: "Cronograma completo", summary: `${opportunity.timeline.length} momentos importantes, das inscrições ao início da experiência.`, source: "official", available: opportunity.timeline.length > 0 },
      { id: "preparation", category: "Preparação", title: "Guia de preparação", summary: "Uma sequência curta para reunir documentos e preparar uma candidatura clara.", source: "seconecta", available: true },
      { id: "faq", category: "Referências", title: "Perguntas frequentes", summary: `${opportunity.popularQuestions.length} respostas objetivas sobre elegibilidade, esforço e participação.`, source: "seconecta", available: opportunity.popularQuestions.length > 0 },
      { id: "resources", category: "Referências", title: "Recursos recomendados", summary: "Guias oficiais e conteúdos selecionados para esta oportunidade.", source: "seconecta", available: true },
      { id: "templates", category: "Preparação", title: "Modelos e templates", summary: "Estruturas reutilizáveis para textos, recomendações e organização.", source: "community-curated", available: false },
    ],
  };
}

export function getOpportunityCommunityHub(opportunity: OpportunityDetail): OpportunityCommunityHub {
  const subject = opportunity.type === "Olimpíada" ? "preparação para a próxima fase" : "processo seletivo";
  return {
    opportunityId: opportunity.id,
    opportunitySlug: opportunity.slug,
    activeNow: 14 + opportunity.id * 4,
    questions: [
      { id: "previous-experience", title: opportunity.type === "Pesquisa" ? "Experiência anterior em pesquisa é importante?" : "Quanto pesa ter experiência anterior?", replies: 12, lastActivity: "Há 18 min", author: "Marina A." },
      { id: "brazil", title: "Alguém de escola pública já foi selecionado?", replies: 8, lastActivity: "Há 1 h", author: "Pedro L." },
      { id: "profile", title: `O que costuma destacar alguém neste ${subject}?`, replies: 6, lastActivity: "Ontem", author: "Ana C." },
    ],
    experiences: [
      { id: "after-applying", title: "O que aprendi depois de me candidatar", excerpt: "O processo foi menos sobre ter um currículo perfeito e mais sobre explicar minhas escolhas.", author: "Luiza Mendes", connection: "Foi participante", readTime: "4 min" },
      { id: "interview", title: "Minha experiência na entrevista", excerpt: "As perguntas buscaram entender como eu pensava, não testar respostas decoradas.", author: "Isadora Lima", connection: "Foi aprovada", readTime: "3 min" },
      { id: "wish-knew", title: "O que eu gostaria de ter sabido antes", excerpt: "Começar o texto cedo teria deixado espaço para pedir feedback com calma.", author: "Rafael Costa", connection: "É mentor", readTime: "5 min" },
    ],
    preparation: [
      { id: "preparing-now", title: `${14 + opportunity.id * 4} estudantes estão preparando agora`, detail: "Veja quem está na mesma etapa que você.", participants: 14 + opportunity.id * 4, actionLabel: "Ver estudantes" },
      { id: "accountability", title: "Procurando parceiro de preparação", detail: "Combine pequenos check-ins até o prazo.", participants: 6, actionLabel: "Participar" },
      { id: "study-group", title: "Grupo de estudo desta semana", detail: "Encontro focado em dúvidas e organização.", participants: 9, actionLabel: "Ver grupo" },
      { id: "essay-review", title: "Rodada de revisão de textos", detail: "Troque feedback com outros candidatos.", participants: 5, actionLabel: "Pedir revisão" },
    ],
    updates: [
      { id: "deadline", title: "Prazo confirmado pela organização", detail: opportunity.deadlineNote, timestamp: "Hoje, 09:20", source: "official" },
      { id: "faq", title: "FAQ oficial recebeu novas respostas", detail: "A organização esclareceu dúvidas sobre documentos e participação.", timestamp: "Ontem", source: "official" },
      { id: "results", title: "Calendário de resultados atualizado", detail: "A data já aparece no cronograma da oportunidade.", timestamp: "Há 3 dias", source: "community" },
    ],
    sharedResources: [
      { id: "checklist", title: "Checklist para revisar a candidatura", description: "Uma lista curta para conferir documentos, textos e envio.", type: "Template", sharedBy: "Marina Alves", saves: 31, site: "Notion", href: "https://www.notion.so/templates", favicon: "https://www.notion.so/images/favicon.ico" },
      { id: "essay-example", title: "Estrutura comentada de texto de motivação", description: "Exemplo compartilhado com observações sobre clareza e narrativa.", type: "Exemplo", sharedBy: "Luiza Mendes", saves: 24, site: "Google Docs", href: "https://docs.google.com/", favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
      { id: "interview-notes", title: "Perguntas para simular uma entrevista", description: "Perguntas organizadas por motivação, trajetória e interesse acadêmico.", type: "Guia", sharedBy: "Rafael Costa", saves: 17, site: "GitHub", href: "https://github.com/", favicon: "https://github.com/favicon.ico" },
    ],
  };
}
