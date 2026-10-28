# CROSSRULE governance specification

## Founding and membership

Community creation records exactly three distinct wallet addresses. The sender is founder one; the two supplied addresses are founders two and three. The sender is immediately recorded as consenting, while the other two founders must submit their own `accept_foundership` transactions. A wallet cannot accept another founder's invitation, and the community becomes `ACTIVE` only after all three addresses have consented. There is no founder administrator role.

Later admission is a two-step consent process. An active member proposes one candidate, the candidate personally calls `accept_membership`, and the frozen current member roster votes. The required approvals are `ceil(2 * voters / 3)`. Each roster member may cast one approve or reject ballot. The 12-member cap is checked at proposal, consent, and finalization.

Admission uses an incremental conflict index rather than scanning historical rooms. The index records only active bilateral partner relationships and is updated atomically with membership and room reservation transitions. A wallet already present in the opposing community cannot be admitted across an active room boundary; unrelated communities and rejected/expired proposals do not increase admission work. The authoritative membership record and index are changed in one transaction, and the same conflict check is applied at every admission entry point.

## Charters

Charter proposals freeze the active member roster and community voting duration at proposal time. They require the same two-thirds threshold, reject duplicate ballots, expire at the recorded deadline, and append a new version rather than replacing history. Charter history is bounded at 64 versions to keep storage growth explicit.

## Bilateral rooms

A room always names two different active communities. A proposal begins as `CONSENT_PENDING`; a member of the counterpart community must independently call `consent_room` before either side can ratify. Pair-key uniqueness and a bounded pending counter prevent one community from accumulating unlimited duplicate proposals. Expired proposals can be cleared permissionlessly through `expire_room_proposal`, which releases the pending accounting without changing an existing active room. Creation and every amendment then copy both member rosters into separate `voters_a` and `voters_b` arrays. The contract rejects overlapping rosters and never computes a combined majority. A proposal activates only when both sides independently reach their own threshold:

```text
required(side) = ceil(2 × len(frozen_side_roster) / 3)
```

For 3, 4, 5, and 6 voters this is 2, 3, 4, and 4. Adding a member after proposal creation cannot change the denominator. A failed initial proposal becomes `REJECTED`; a failed amendment clears only the pending vote and preserves the current active policy. A successful amendment appends the next sequential policy version. History is bounded at 64 versions.

## Features and discussion

Posting requires current membership in either governing community, an active room, and no active serious restriction for that room/wallet pair. Posts use monotonic IDs plus a room-scoped ordinal index, so the original 150-post lifetime limit is removed. `list_posts` returns deterministic pages of at most 20 records; no read or write scans the full room history. Post bodies, authors, IDs and reply relationships are immutable after publication. Replies must point to an earlier post in the same room. Feature and unfeature proposals use the same two independent frozen rosters; a hidden or stale candidate cannot become the active featured post. If moderation later restores a post, its earlier featured status does not return automatically: a fresh bilateral feature vote is required.

## Cases and appeals

An eligible other room member may challenge a post under one applicable clause at a time. The contract allows at most one serial case per distinct clause in the immutable publication-time policy, capped by the policy's actual one-to-six clause count. A duplicate clause is rejected; a new clause cannot begin while an earlier case or appeal is unresolved; and an upheld breach blocks further proceedings against the post. This bounded serial policy prevents first-reporter capture without enabling unbounded complaint spam or contradictory sanctions. The author cannot self-report. The clause must exist in the policy snapshot frozen when the post was published, context IDs are unique numeric IDs for earlier posts from the same room, and the contract copies context bodies and authors into the case. Filing changes the display state to `UNDER_REVIEW` but applies no sanction.

The author may submit one bounded defense before the case deadline. After the strict deadline boundary, any caller may freeze evidence; the freeze stores a canonical SHA-256 digest. Adjudication is possible only from the frozen state and re-verifies that digest.

One application-level appeal is available within the frozen appeal window. The adverse party is the author for a breach finding and the reporter for `NO_VIOLATION` or `INSUFFICIENT_EVIDENCE`. The other party may submit one response before the response deadline. Appeal evidence is frozen and hashed separately. GenLayer reassesses the frozen rule and facts rather than blindly copying the original result. The original finding and decision remain preserved; the current finding and post/restriction state reflect the final application outcome.

Application appeals are distinct from GenLayer protocol-level finality or transaction appeals. Neither is controlled by the frontend timer settings.

## Live demonstration record

The prior corrected-contract StudioNet demonstration used Builders Collective, Research Forum and Evidence Lab; it is historical evidence for a superseded deployment. It demonstrated applicant consent, frozen admission thresholds, bilateral ratification, policy versions, cases, appeals and negative controls. The current replacement deployment is documented at the top of [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md) and was initialized empty, so no historical record is represented as a current-contract result.
