export type GuideArticleSource = "official" | "seconecta" | "community-curated";

export type GuideArticle = {
  id: string;
  category: "Entenda" | "Candidatura" | "Seleção" | "Preparação" | "Referências";
  title: string;
  summary: string;
  source: GuideArticleSource;
  href?: string;
  available: boolean;
};

export type OpportunityGuide = {
  opportunityId: number;
  updatedAt: string;
  articles: GuideArticle[];
};

export type CommunityQuestion = { id: string; title: string; replies: number; lastActivity: string; author: string };
export type CommunityExperience = { id: string; title: string; excerpt: string; author: string; connection: string; readTime: string };
export type CommunityPreparation = { id: string; title: string; detail: string; participants: number; actionLabel: string };
export type CommunityUpdate = { id: string; title: string; detail: string; timestamp: string; source: "official" | "community" };
export type CommunitySharedResource = { id: string; title: string; description: string; type: string; sharedBy: string; saves: number; site: string; href: string; favicon: string };

export type OpportunityCommunityHub = {
  opportunityId: number;
  opportunitySlug: string;
  activeNow: number;
  questions: CommunityQuestion[];
  experiences: CommunityExperience[];
  preparation: CommunityPreparation[];
  updates: CommunityUpdate[];
  sharedResources: CommunitySharedResource[];
};
