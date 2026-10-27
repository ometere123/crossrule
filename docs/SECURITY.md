# Security model and explicit limitations

## Nonnegotiable invariants

1. **No privileged authority.** The contract exposes no owner, admin, upgrade, emergency pause, central adjudicator, override, or service signer. Only the real wallet sender has write identity.
2. **Bilateral sovereignty.** A room is ratified or amended only when each frozen community voting roster independently reaches two-thirds yes. A majority on one side cannot outweigh the other.
3. **Opt-in membership.** All three founders consent; later applicants must accept their invitation and pass the community's threshold. Voting snapshots prevent late additions from changing a vote's denominator.
4. **Explicit and stable policy.** A filed case freezes the active agreement version, cited clause, permitted severity, deadlines, allegations, post, context, and defense. Later amendments do not alter that case's original standards.
5. **Evidence authenticity relative to chain state.** Reporter context IDs must be previous same-room post IDs and are copied from contract state. The model may not introduce off-chain evidence or new identities as facts.
6. **Bounded model outputs.** Four exact findings; matching clause ID; bounded in-post quote and bounded reasoning; the independent validator repeats classification and rejects disagreement. Strict equivalence limits model-internal arbitrary outputs from silently becoming valid state transitions.
7. **Appeal isolation.** A single adverse party may appeal once. The case-specific restriction is removed if overturned; confirming a serious ruling does not extend an earlier suspension.
8. **Public audit.** Hiding changes the official display status but cannot delete immutable on-chain text. Do not suggest privacy, erasure, or confidentiality.

## Threat scenarios and defenses

| Threat | Response | Residual risk |
| --- | --- | --- |
| Reporter submits an instruction as post/context text | Prompt labels evidence untrusted; no web tool access; validator reclassification; JSON/schema checks | LLM prompt injection and correlated model errors are not eliminated |
| Reporter fabricates an external context post | Context is a validated bounded list of earlier IDs; server/LLM sees contract-sourced text | Earlier real posts could themselves be misleading |
| Single member forces policy or highlights own post | Frozen, side-separated two-thirds thresholds | Wallet voters can collude; one-person-one-wallet is not identity proof |
| Case filed under a later changed rule | Freeze policy version and clause at report time; immutable case evidence digest | Two communities can agree to bad rules |
| Validator accepts plausible prose with different judgment | Exact valid enumeration, source anchor, and classification-equivalence requirement | Matching wrong judgments across models remain possible |
| Author is punished under a minor-only clause | Serious finding rejected if clause does not authorize it | Severity classifications remain subjective |
| Appeal keeps sanction alive forever | Upholding does not reset `until`; successful appeal removes case's restriction | Sanction may expire before an appeal transaction reaches finality |
| Wallet replays or double votes | On-chain `yes/no` voter maps prevent multiple ballot submissions | Sybil wallets may join different communities, subject to membership process |
| Outsider writes posts or manipulates another wallet's vote | Contract sender and membership checks | Compromised wallets, malicious extensions, signing phishing |
| App operator alters UI or hides evidence | Canonical state remains in contract; transparent source and explorer pointers | Users may still be misled by a compromised website |
| Short test window races network finality | Deadlines enforced on-chain; UI warns about timing; production use longer windows | No mechanism can guarantee a 2-minute transaction finalizes in time |
| Frontend reads stale or failed transaction state | SDK `LATEST_FINAL` reads and explicit receipt/status handling | RPC outages, network stalls and chain reorganizations can affect UX |

## Known operational limits

- Exact contract limits: at most 12 wallets per community, 150 posts per room, 1–6 clauses per joint agreement, up to 3 older same-room context posts, one challenge per post, and one app appeal per case.
- All author, defense, context and allegation text is public **regardless of UI status**. Never post secrets, identifying information that requires protection, privileged documents, or private health information.
- A wallet can create several communities with separate wallets; CROSSRULE is not a KYC or sybil-resistant identity system.
- Default web RPC infrastructure is external and may be unavailable. The source app has no independently powered backend or fallback transaction writer.
- GenLayer semantic classification may fail due provider/model errors or validator disagreement. A frozen case stays frozen until a successful call; do not invent a verdict, bypass validation, or auto-force success.
- The 2–10,080 minute settings are **application deadlines**, not GenLayer's protocol appeal period or finality rules.
- No one automatically calls `freeze_case`, `freeze_appeal`, `adjudicate_case`, `adjudicate_appeal`, `close_case`, or vote finalizers. Eligible community members must submit transactions; others may submit finalization calls where the contract allows it.
- Public enumeration is bounded to page size 20 and stored IDs. This is not an indexer or search engine.
- One challenge per post prevents duplicate complaint spam and repeated punishment, but also prevents retrying an earlier rejected complaint on that same post.
- Contract source has no token transfer or withdrawal method; GEN is only network gas/fee asset. Do not send arbitrary funds to the contract.

## Reviewer security tests

Perform negative sender tests for founding spoof, nonmember posts, vote duplication, cross-group wallet overlap, post reply cross-room, case context tampering, unrelated clause, invalid JSON, pre-deadline freeze, appeal wrong party, repeated appeal, fabricated source quotes, minor-clause serious penalty, validator classification disagreement, and sanctions after reversal. Capture finalized on-chain receipts for the live equivalents and retain offline/Direct regression tests in CI.

Security claims in this source are engineering intent until corroborated by actual StudioNet deployment and independent review; this file is not a third-party audit.
