export type EducationLevel = "Ensino Fundamental II" | "Ensino Médio" | "Universidade" | "Outro";

export type PrimaryGoal = "STUDY_ABROAD" | "OLYMPIADS" | "RESEARCH" | "TECHNOLOGY" | "CAREER" | "EXPLORING";

export type PreferredChannel = "WhatsApp" | "Site" | "E-mail";
export type Experience = "OLYMPIADS" | "RESEARCH" | "PROGRAMMING_PROJECTS" | "HACKATHONS" | "INTERNSHIPS" | "STUDY_ABROAD" | "COURSES" | "VOLUNTEERING" | "ENTREPRENEURSHIP" | "NONE";

export type OnboardingProfile = {
  educationLevel: EducationLevel;
  previousExperiences: Experience[];
  themes: import("@/types/taxonomy").Theme[];
  opportunityTypes: import("@/types/taxonomy").OpportunityType[];
  primaryGoal: PrimaryGoal;
  preferredChannel: PreferredChannel;
};
