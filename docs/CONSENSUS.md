# CROSSRULE semantic consensus specification

## Why GenLayer is necessary

The contract can validate membership, IDs, deadlines, byte bounds, publication-time policy versions and evidence provenance deterministically. It cannot decide whether a human-written post semantically violates a jointly ratified clause. That subjective step is deliberately executed through GenLayer's nondeterministic leader/validator path. Removing that path would remove the trust boundary that distinguishes CROSSRULE from a CRUD feed with a centralized moderator.

## Frozen input

At `freeze_case`, the contract serializes a sorted-key, compact UTF-8 JSON object with `ensure_ascii=False` and separators `(',', ':')`. The initial digest covers:

```text
id, post_id, room_id, author, reporter, post_text, clause_id,
policy_version, full policy, contract-derived context, allegation,
defense, defense_submitted, opened_at, defense_due
```

Context bodies and authors are copied from on-chain posts before hashing. The full policy object is copied from the active version at case opening. Appeal evidence adds `appeal_due`, `original_finding`, `original_decision`, and the appeal snapshot containing appellant, grounds, response, response-submitted flag and response deadline. A static appeal instruction is included. Mutable processing fields such as status, digest and the new decision are intentionally excluded to avoid a circular self-hash.

The digest is SHA-256 of the UTF-8 bytes of that exact canonical JSON string. Key order, Unicode bytes and whitespace therefore matter. `adjudicate_case` and `adjudicate_appeal` recompute and compare the digest before calling GenLayer.

## Leader and validator responsibilities

The leader receives only the frozen evidence and a prompt that defines the four accepted findings:

* `NO_VIOLATION`
* `INSUFFICIENT_EVIDENCE`
* `MINOR_BREACH`
* `SERIOUS_BREACH`

It must return exactly `finding`, `clause_id`, `anchor`, and `reason`. The anchor is 1–180 non-whitespace UTF-8 bytes and must be an exact substring of the frozen challenged post. For a post longer than eight UTF-8 bytes, the anchor must be at least eight UTF-8 bytes; for a one-to-eight-byte post, the complete short post is an acceptable minimum anchor. The reason is 12–500 UTF-8 bytes. The contract also checks the exact cited clause ID, finding enum, anchor provenance and severity cap; a serious result under a minor-only clause reverts.

The validator does not accept a valid-looking leader JSON object as sufficient. It independently invokes the same substantive assessment over the same frozen evidence, validates its own output, and must agree on the decision-bearing `finding`, `clause_id` and exact `anchor`. Its prompt requires it to establish that the anchor is materially relevant to the cited clause and that the proposed classification follows from the post, policy, context and defense. Explanations need not be verbatim identical. A real but irrelevant substring, unsupported exception, wrong policy version or invented fact is not enough. Any malformed leader result, invalid anchor, independent classification/anchor mismatch, validator exception, provider error or post-consensus invalid result fails the write; the contract has no fallback ruling. For a one-byte or short Unicode post, the complete post may be the anchor; the short-post exception preserves adjudicability without allowing a one-character excerpt to ground a long post.

For appeals, both leader and validator are explicitly instructed to treat the original decision as an untrusted prior claim and to reconsider the frozen rule, post, defense, grounds and response. The original decision remains in evidence for auditability, not as an automatic answer.

## What is and is not observable

Direct Mode tests can deterministically inject valid, malformed, adversarial and disagreeing assessment results and prove that the contract rejects unsupported classifications. On StudioNet, transaction receipts expose consensus votes, validator records, execution results and vote hashes, but they do not necessarily expose every validator's private prompt or reasoning. The deployment receipt recorded in `docs/LIVE_EVIDENCE.md` proves finalized contract deployment consensus; it is not a semantic case adjudication and must not be presented as one.

## Failure behavior

Evidence remains immutable and the case remains recoverable when semantic consensus fails. A caller must reach the next legitimate state and retry only through the published lifecycle; there is no owner, force-finalize method, centralized adjudicator, or backend fallback.

## StudioNet observations from the completed lifecycle

The semantic case assessments and application appeals currently documented in [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md) are historical records from superseded deployments. The replacement address has deployment consensus, one current-contract browser founding transaction, and the corresponding `FOUNDING` readback; it has no current-contract semantic case yet. Observable validator metadata includes vote/status records where the protocol exposes them; the receipts do not expose every validator's private reasoning. No current-contract semantic outcome is claimed until a fresh case is finalized and read back.

The transaction receipts expose validator status/vote metadata and the leader equivalence output, but not every validator's private prompt or chain-local reasoning. This ledger therefore claims observable independent validator participation, not private validator transcripts. The controlled Direct Mode suite remains the proof of malformed output, false leader classification, prompt injection, provider failure and disagreement rejection.
