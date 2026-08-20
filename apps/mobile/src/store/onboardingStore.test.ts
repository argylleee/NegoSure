import { useOnboardingStore } from "./onboardingStore";

const initialFollowUps = {
  physicalStore: null,
  foodPreparation: null,
  onlineSelling: null,
};

describe("onboardingStore", () => {
  beforeEach(() => {
    useOnboardingStore.setState({
      description: "",
      facts: [],
      followUps: initialFollowUps,
      hasOnboarded: false,
    });
  });

  it("stores the free-text description", () => {
    useOnboardingStore.getState().setDescription("I'm opening a coffee shop.");
    expect(useOnboardingStore.getState().description).toBe("I'm opening a coffee shop.");
  });

  it("sets facts as unconfirmed by default and toggles confirmation per fact", () => {
    useOnboardingStore.getState().setFacts([
      { key: "businessType", label: "Business type", value: "Coffee shop", confirmed: false },
      { key: "location", label: "Location", value: "Dasmariñas", confirmed: false },
    ]);

    expect(useOnboardingStore.getState().facts.every((f) => !f.confirmed)).toBe(true);

    useOnboardingStore.getState().toggleFactConfirmed("businessType");
    const facts = useOnboardingStore.getState().facts;
    expect(facts.find((f) => f.key === "businessType")?.confirmed).toBe(true);
    // Toggling one fact must not confirm the others.
    expect(facts.find((f) => f.key === "location")?.confirmed).toBe(false);
  });

  it("records follow-up answers independently", () => {
    useOnboardingStore.getState().setFollowUp("physicalStore", true);
    useOnboardingStore.getState().setFollowUp("foodPreparation", false);

    const { followUps } = useOnboardingStore.getState();
    expect(followUps.physicalStore).toBe(true);
    expect(followUps.foodPreparation).toBe(false);
    expect(followUps.onlineSelling).toBeNull();
  });

  it("complete() marks onboarding done", () => {
    expect(useOnboardingStore.getState().hasOnboarded).toBe(false);
    useOnboardingStore.getState().complete();
    expect(useOnboardingStore.getState().hasOnboarded).toBe(true);
  });

  it("reset() clears everything including hasOnboarded", () => {
    useOnboardingStore.getState().setDescription("test");
    useOnboardingStore.getState().complete();
    useOnboardingStore.getState().reset();

    const state = useOnboardingStore.getState();
    expect(state.description).toBe("");
    expect(state.facts).toEqual([]);
    expect(state.hasOnboarded).toBe(false);
  });
});
