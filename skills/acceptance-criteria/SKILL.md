---
name: acceptance-criteria
description: "Write testable Gherkin acceptance criteria tied to the brief's goals. Use in the plan phase; these become the acceptance gate."
---

# acceptance-criteria

Turn the brief's definition of success into **executable** acceptance criteria — the contract the
site is verified against. Fires in the plan phase (from brief + IA). Canon: Adzic, *Specification by
Example*; Gherkin/Cucumber.

## Do

- **One feature file per page or major flow** in `.site/acceptance/`, Given-When-Then.
- **Tie each to a real user job** from the brief's primary goal — not implementation details.
- **Make them executable** against the built site (via playwright-bdd / Cucumber + Playwright): a
  scenario should map to observable behavior (visible text, reachable action, working navigation).
- **Cover the essentials for a high-end site**, not just happy paths:
  - the primary action works and is reachable (incl. keyboard),
  - key content is present and correct,
  - navigation and links resolve,
  - responsive: the primary job is doable on mobile,
  - error/empty states behave.

## Example

```gherkin
Feature: Landing page primary conversion
  Scenario: A visitor can start the primary action
    Given I am on the home page
    When I activate the primary call to action
    Then I am taken to the sign-up step
```

## Quality bar (god-tier)
Every promise the brief makes is expressed as a scenario that a machine can check. If it isn't in a
feature file, it isn't guaranteed.

## Feeds
The `acceptance-gate` in `verify`. Failing scenarios block the Definition of Done.
