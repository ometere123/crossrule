# GenLayer Portal submission materials

## Project title

**CROSSRULE — Bilateral social governance with independently checked moderation**

## Concise description

CROSSRULE lets two autonomous wallet communities create a shared public discussion room without giving either side unilateral rule-making or moderation power. Both communities ratify the same bounded policy, members publish and challenge posts under cited clauses, and GenLayer independently checks semantic case classifications before the contract applies any permitted moderation consequence. Evidence, policies, rulings and appeals remain publicly auditable.

## Technical description

CROSSRULE is one Python Intelligent Contract on GenLayer StudioNet (chain 61999) with no owner, moderator, upgrade path, database, indexer or signing backend. It stores communities, member-consent records, indexed bilateral relationships, counterpart-consented room proposals, bilateral voter snapshots, versioned charters and policies, stable-ID paginated posts, frozen cases, SHA-256 evidence digests, case-scoped restrictions and one application appeal in bounded JSON `TreeMap` state. The Next.js frontend is a presentation and injected-wallet transaction layer. All user-controlled application deadlines are configured in the frontend from 2 to 10,080 minutes and frozen on-chain at the relevant transition; they do not control GenLayer protocol finality.

## Social-category justification

The product addresses a concrete coordination problem: two communities may want a common discussion space while preserving their separate membership, charter and veto power. CROSSRULE makes cooperation bilateral and visible. A single community cannot ratify a room, feature a post, amend a policy or decide a case on behalf of the other. The social value is the shared space; the governance value is the ability to cooperate without surrendering autonomy.

## Intelligent Contract and Equivalence Principle

The contract enforces the deterministic boundaries: three distinct consenting founders, applicant consent, two-thirds thresholds per frozen roster, indexed disjoint bilateral voting identities, counterpart consent and proposal expiry, bounded clause IDs and severities, same-room evidence, immutable post text and IDs, deterministic pagination, deadlines, policy snapshots, case-scoped sanctions and one appeal. The subjective step is GenLayer-native: a leader produces a structured finding and validators independently assess the same frozen evidence, including whether the proposed anchor materially supports the clause and classification. The contract accepts only matching decision-bearing finding, clause and anchor; it does not require identical prose. Invalid structure, fabricated or irrelevant anchors, unsupported serious severity, validator disagreement, provider errors and digest mismatches do not receive a fallback ruling.

## Key functionality

* Independent community founding, admission and charter history.
* Bilateral room ratification and versioned amendments.
* Separate two-thirds agreement, feature and unfeature votes.
* Immutable public posts, same-room replies and stable bounded pagination beyond the former 150-post boundary.
* Counterpart-community consent, bounded pending room proposals and permissionless expiry cleanup.
* Clause-specific challenge, copied context, defense and evidence freeze.
* Four bounded findings with independent GenLayer validation.
* Room-and-wallet-specific temporary serious-breach restrictions.
* One application appeal with opposing response and independent reassessment.
* Public policy, case and audit views; injected EIP-1193 wallet writes.
* Finality-aware transaction history with no automatic duplicate retry.

## Reviewer links

* Frontend: [crossrule.vercel.app](https://crossrule.vercel.app)
* Repository: [github.com/ometere123/crossrule](https://github.com/ometere123/crossrule)
* Contract explorer: [StudioNet contract](https://explorer-studio.genlayer.com/address/0xf9bF16af4253064E349fF0fCfc7472f75c63110e)
* Deployment transaction: [finalized deployment](https://explorer-studio.genlayer.com/tx/0xde0b737e7d4fb2b1540afaf060b4d80d43ae9687748908866fbd7f2300222951)
* Production frontend: [crossrule.vercel.app](https://crossrule.vercel.app), verified against the corrected contract after [READY Vercel deployment `dpl_C48PNMuVsaCa1pdeEHS2SVmvU6gJ`](https://vercel.com/delealufejoel-4184s-projects/crossrule/C48PNMuVsaCa1pdeEHS2SVmvU6gJ), uploaded from Git commit `601f221dc172f9e8aa7b061252386330c9539be9`
* Live evidence: [`docs/LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md)
* Consensus specification: [`docs/CONSENSUS.md`](CONSENSUS.md)
* Latest full CI: [run 40560229019](https://github.com/ometere123/crossrule/actions/runs/40560229019), successful 9/9 jobs at `601f221dc172f9e8aa7b061252386330c9539be9`

## Production UI evidence

The public Accord Chamber interface was inspected at `https://crossrule.vercel.app` at 1440, 1280, 1024, 768, 390 and 375 CSS pixels. The READY production alias now reads the corrected contract and displayed 2 communities, 1 room, 4 cases and 6 posts, with the real community directory and public casebook populated. The committed frontend passed the desktop/mobile Playwright suite. The browser verification profile emitted wallet-extension provider errors, but no user-visible application error; local and CI browser suites had no application console errors. Representative captures are [desktop hero](screenshots/accord-hero-1440.png), [mobile hero](screenshots/accord-hero-390.png) and [full desktop page](screenshots/accord-1440.png). The diagram is explicitly illustrative.

## Reviewer walkthrough

1. Open the Accord Chamber landing page and inspect the contract-backed counts, community directory, room directory, policy versions and public case views without a wallet.
2. Read `contracts/Crossrule.py` and confirm there is exactly one contract and no owner/admin/upgrade path.
3. Inspect the deployment receipt and source-parity record in `docs/LIVE_EVIDENCE.md`.
4. In Direct Mode, run the adversarial tests for false classifications, invalid anchors, forged context, digest tampering, severity caps and appeals.
5. Follow the completed six-wallet StudioNet sequence and exact readbacks in [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md). The page is a presentation layer; the explorer and contract views are the authority.

## Known limitations

The deployed address has finalized exact-byte source parity and a completed fresh six-wallet live social lifecycle: two communities, one active room, six stable posts, three policy versions, four semantic cases, one application appeal and finalized negative controls. StudioNet receipts expose validator status/vote metadata and structured leader equivalence output, but not every validator's private prompt or reasoning; no private validator trace is claimed. Text is public and persistent. The contract is bounded at 12 members, six clauses, three context posts, one challenge per post, one application appeal, 20 records per public page and 64 retained history entries; posts have no permanent lifetime cap. Dependency advisories and browser-wallet availability are reported from the final verification rather than hidden. These are disclosed engineering limits, not claims of external audit or a self-awarded Portal score.

## Portal review framing

**GenLayer Fit:** Two autonomous communities ratify a single room policy independently, and the subjective clause interpretation is checked by GenLayer leader/validator execution over frozen evidence. The social trust question is not reducible to a feed or a centralized AI call.

**Intelligent Contract Quality:** The contract enforces caller identity, founder/applicant consent, side-separated voter snapshots, versioned policy history, authentic context, canonical digests, severity caps, room-and-wallet restrictions and one independent appeal.

**Engineering Quality:** The repository retains pinned tooling, genuine Direct Mode, mutation tests, lint/build/browser gates, source-matched StudioNet deployment evidence and a live transaction/readback ledger that includes failures.

**Frontend/UX:** The public first screen is the responsive Accord Chamber experience with an educational bilateral diagram, honest live counts, polished empty states and a clear route into the complete operational workspace. The workspace still exposes the full contract lifecycle and finality-aware transaction states.
