import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpportunityCommunityHubPage } from "@/components/community/opportunity-community-hub-page";
import { getOpportunityDetailBySlug, opportunitySlugs } from "@/data/opportunity-details";
import { getOpportunityCommunityHub } from "@/data/opportunity-knowledge-hubs";

type CommunityHubRouteProps = { params: Promise<{ slug: string }>; searchParams: Promise<{ tab?: string }> };

export function generateStaticParams() {
  return opportunitySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CommunityHubRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = getOpportunityDetailBySlug(slug);
  return opportunity ? { title: `Discussão sobre ${opportunity.title} | seConecta`, description: `Perguntas, experiências e recursos relacionados a ${opportunity.title}.` } : {};
}

export default async function Page({ params, searchParams }: CommunityHubRouteProps) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const opportunity = getOpportunityDetailBySlug(slug);
  if (!opportunity) notFound();
  const validTabs = ["questions", "experiences", "resources", "people"] as const;
  const initialTab = validTabs.find((item) => item === tab) ?? "questions";
  return <OpportunityCommunityHubPage opportunity={opportunity} hub={getOpportunityCommunityHub(opportunity)} initialTab={initialTab} />;
}
