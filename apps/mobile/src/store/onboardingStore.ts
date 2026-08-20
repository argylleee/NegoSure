import { create } from "zustand";
import type { BusinessFact } from "../lib/extractBusinessFacts";

// Onboarding draft state — UI/application state, not server state, so it
// lives in Zustand rather than TanStack Query. See .claude/MOBILE_UI.md §14.
type FollowUpKey = "physicalStore" | "foodPreparation" | "onlineSelling";

type OnboardingState = {
  description: string;
  facts: BusinessFact[];
  followUps: Record<FollowUpKey, boolean | null>;
  hasOnboarded: boolean;
  setDescription: (text: string) => void;
  setFacts: (facts: BusinessFact[]) => void;
  toggleFactConfirmed: (key: string) => void;
  setFollowUp: (key: FollowUpKey, value: boolean) => void;
  complete: () => void;
  reset: () => void;
};

const initialFollowUps: Record<FollowUpKey, boolean | null> = {
  physicalStore: null,
  foodPreparation: null,
  onlineSelling: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  description: "",
  facts: [],
  followUps: initialFollowUps,
  hasOnboarded: false,
  setDescription: (text) => set({ description: text }),
  setFacts: (facts) => set({ facts }),
  toggleFactConfirmed: (key) =>
    set((state) => ({
      facts: state.facts.map((f) => (f.key === key ? { ...f, confirmed: !f.confirmed } : f)),
    })),
  setFollowUp: (key, value) =>
    set((state) => ({ followUps: { ...state.followUps, [key]: value } })),
  complete: () => set({ hasOnboarded: true }),
  reset: () =>
    set({ description: "", facts: [], followUps: initialFollowUps, hasOnboarded: false }),
}));
