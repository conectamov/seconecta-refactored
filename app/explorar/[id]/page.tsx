import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpportunityDetailPage } from "@/components/opportunity-detail/opportunity-detail-page";
import { getOpportunityDetail, opportunityIds } from "@/data/opportunity-details";

type OpportunityPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return opportunityIds.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: OpportunityPageProps): Promise<Metadata> {
  const { id } = await params;
  const opportunity = getOpportunityDetail(Number(id));
  if (!opportunity) return {};
  return {
    title: `${opportunity.title} | seConecta`,
    description: opportunity.summary,
  };
}

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = getOpportunityDetail(Number(id));
  if (!opportunity) notFound();
  return <OpportunityDetailPage opportunity={opportunity} />;
}
