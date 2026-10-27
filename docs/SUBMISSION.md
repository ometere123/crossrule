# GenLayer Portal submission materials

## Project title

**CROSSRULE — Bilateral social governance with independently checked moderation**

## Concise description

CROSSRULE lets two autonomous wallet communities create a shared public discussion room without giving either side unilateral rule-making or moderation power. Both communities ratify the same bounded policy, members publish and challenge posts under cited clauses, and GenLayer independently checks semantic case classifications before the contract applies any permitted moderation consequence. Evidence, policies, rulings and appeals remain publicly auditable.

## Technical description

CROSSRULE is one Python Intelligent Contract on GenLayer StudioNet (chain 61999) with no owner, moderator, upgrade path, database, indexer or signing backend. It stores communities, member-consent records, bilateral voter snapshots, versioned charters and policies, posts, frozen cases, SHA-256 evidence digests, case-scoped restrictions and one application appeal in bounded JSON `TreeMap` state. The Next.js frontend is a presentation and injected-wallet transaction layer. All user-controlled application deadlines are configured in the frontend from 2 to 10,080 minutes and frozen on-chain at the relevant transition; they do not control GenLayer protocol finality.

## Social-category justification

The product addresses a concrete coordination problem: two communities may want a common discussion space while preserving their separate membership, charter and veto power. CROSSRULE makes cooperation bilateral and visible. A single community cannot ratify a room, feature a post, amend a policy or decide a case on behalf of the other. The social value is the shared space; the governance value is the ability to cooperate without surrendering autonomy.

## Intelligent Contract and Equivalence Principle

The contract enforces the deterministic boundaries: three distinct consenting founders, applicant consent, two-thirds thresholds per frozen roster, disjoint bilateral voting identities, bounded clause IDs and severities, same-room evidence, immutable post text, deadlines, policy snapshots, case-scoped sanctions and one appeal. The subjective step is GenLayer-native: a leader produces a structured finding and a validator independently assesses the same frozen evidence. The contract accepts only matching decision-bearing classifications and a ratified clause ID; it does not require identical prose. Invalid structure, fabricated anchors, unsupported serious severity, validator disagreement, provider errors and digest mismatches do not receive a fallback ruling.

## Key functionality

* Independent community founding, admission and charter history.
* Bilateral room ratification and versioned amendments.
* Separate two-thirds agreement, feature and unfeature votes.
* Immutable public posts, same-room replies and bounded pagination.
* Clause-specific challenge, copied context, defense and evidence freeze.
* Four bounded findings with independent GenLayer validation.
* Room-and-wallet-specific temporary serious-breach restrictions.
* One application appeal with opposing response and independent reassessment.
* Public policy, case and audit views; injected EIP-1193 wallet writes.
* Finality-aware transaction history with no automatic duplicate retry.

## Reviewer links

* Frontend: [crossrule.vercel.app](https://crossrule.vercel.app)
* Repository: [github.com/ometere123/crossrule](https://github.com/ometere123/crossrule)
* Contract explorer: [StudioNet contract](https://explorer-studio.genlayer.com/address/0x3c5C74733E10BDD4b7520e62dF8852c2Ef550D12)
* Deployment transaction: [finalized deployment](https://explorer-studio.genlayer.com/tx/0xc46b0b7e3e83482eb2c0b4dec2951d81dd8ba5724a14b7f1a4d7810527006f9c)
* Vercel deployment: [READY deployment](https://vercel.com/delealufejoel-4184s-projects/crossrule/375cf3FL8nn1f7i3x9BmbdQEUmY8)
* Live evidence: [`docs/LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md)
* Consensus specification: [`docs/CONSENSUS.md`](CONSENSUS.md)

## Reviewer walkthrough

1. Open the frontend and inspect public counts, community directory, room directory, policy versions and public case views without a wallet.
2. Read `contracts/Crossrule.py` and confirm there is exactly one contract and no owner/admin/upgrade path.
3. Inspect the deployment receipt and source-parity record in `docs/LIVE_EVIDENCE.md`.
4. In Direct Mode, run the adversarial tests for false classifications, invalid anchors, forged context, digest tampering, severity caps and appeals.
5. If six authorized StudioNet signers are supplied, follow the complete live sequence in `docs/TEST_PLAN.md`; until then, treat the live multi-wallet rows as not run.

## Known limitations

The deployed address has finalized initialization/read evidence, but this closeout does not claim a six-wallet live social lifecycle because only PRAEST was authorized. It also does not claim private validator prompts or reasoning when StudioNet receipts expose only aggregate votes/records. Text is public and persistent. The contract is bounded at 12 members, 150 posts, six clauses, three context posts, one challenge per post and one application appeal. The full JavaScript development audit still reports three dev-only Vitest/tinypool advisories; production dependencies audit cleanly. These are disclosed engineering limits, not claims of external audit or a self-awarded Portal score.
