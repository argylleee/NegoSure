import { extractBusinessFacts } from "./extractBusinessFacts";

describe("extractBusinessFacts (placeholder heuristic)", () => {
  it("every fact starts unconfirmed — nothing here may feed the requirement engine unconfirmed", () => {
    const facts = extractBusinessFacts("I'm opening a small coffee shop in Dasmariñas.");
    expect(facts.length).toBeGreaterThan(0);
    expect(facts.every((f) => f.confirmed === false)).toBe(true);
  });

  it("guesses a coffee shop business type from the description", () => {
    const facts = extractBusinessFacts("I'm opening a small coffee shop in Dasmariñas.");
    const businessType = facts.find((f) => f.key === "businessType");
    expect(businessType?.value).toBe("Coffee shop");
  });

  it("guesses a sari-sari store business type", () => {
    const facts = extractBusinessFacts("I run a sari-sari store in Quezon City.");
    const businessType = facts.find((f) => f.key === "businessType");
    expect(businessType?.value).toBe("Sari-sari store");
  });

  it("falls back to general retail when nothing matches", () => {
    const facts = extractBusinessFacts("I run a small shop.");
    const businessType = facts.find((f) => f.key === "businessType");
    expect(businessType?.value).toBe("General retail");
  });

  it("extracts a trailing 'in <location>' phrase", () => {
    const facts = extractBusinessFacts("I'm opening a small coffee shop in Dasmariñas.");
    const location = facts.find((f) => f.key === "location");
    expect(location?.value).toBe("Dasmariñas");
  });

  it("reports 'Not specified' when no location phrase is present", () => {
    const facts = extractBusinessFacts("I sell coffee.");
    const location = facts.find((f) => f.key === "location");
    expect(location?.value).toBe("Not specified");
  });
});
