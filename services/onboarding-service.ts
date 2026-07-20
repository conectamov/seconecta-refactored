import type { OnboardingProfile } from "@/types/onboarding";
import type { OpportunityType, Theme } from "@/types/taxonomy";

const STORAGE_KEY = "seconecta:onboarding-profile";

export const onboardingService = {
  load(): OnboardingProfile | null {
    if (typeof window === "undefined") return null;

    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      if (!value) return null;
      const profile = JSON.parse(value) as OnboardingProfile & { interests?: string[] };
      if (profile.themes && profile.opportunityTypes) return profile;

      const oldInterests = profile.interests ?? [];
      const themes = oldInterests.map((interest) => ({ IA: "Inteligência Artificial", Programação: "Ciências da Computação", Tecnologia: "Ciências da Computação", Olimpíadas: "Matemática" }[interest] ?? interest)).filter((interest): interest is Theme => ["Inteligência Artificial", "Matemática", "Física", "Química", "Biologia", "Robótica", "Artes", "Empreendedorismo"].includes(interest));
      const opportunityTypes = oldInterests.map((interest) => ({ Olimpíadas: "Olimpíada", Pesquisa: "Pesquisa", Bolsas: "Bolsa", Intercâmbios: "Programa de Verão" }[interest])).filter((interest): interest is OpportunityType => Boolean(interest));
      return { ...profile, themes, opportunityTypes };
    } catch {
      return null;
    }
  },

  save(profile: OnboardingProfile) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  },
};
