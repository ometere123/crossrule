# CROSSRULE governance specification

## Founding and membership

Community creation records exactly three distinct wallet addresses. The sender is founder one; the two supplied addresses are founders two and three. The sender is immediately recorded as consenting, while the other two founders must submit their own `accept_foundership` transactions. A wallet cannot accept another founder's invitation, and the community becomes `ACTIVE` only after all three addresses have consented. There is no founder administrator role.

Later admission is a two-step consent process. An active member proposes one candidate, the candidate personally calls `accept_membership`, and the frozen current member roster votes. The required approvals are `ceil(2 * voters / 3)`. Each roster member may cast one approve or reject ballot. The 12-member cap is checked at proposal, consent, and finalization.

Admission is also checked against every non-rejected bilateral room involving that community. A wallet already present in the opposing community cannot be admitted across that room boundary. This prevents a later roster change from creating two votes in one bilateral decision. A wallet that is pending in both communities is still checked again at each consent/finalization boundary.

## Charters

Charter proposals freeze the active member roster and community voting duration at proposal time. They require the same two-thirds threshold, reject duplicate ballots, expire at the recorded deadline, and append a new version rather than replacing history. Charter history is bounded at 64 versions to keep storage growth explicit.

## Bilateral rooms

A room always names two different active communities. Creation and every amendment copy both member rosters into separate `voters_a` and `voters_b` arrays. The contract rejects overlapping rosters and never computes a combined majority. A proposal activates only when both sides independently reach their own threshold:

```text
required(side) = ceil(2 × len(frozen_side_roster) / 3)
```

For 3, 4, 5, and 6 voters this is 2, 3, 4, and 4. Adding a member after proposal creation cannot change the denominator. A failed initial proposal becomes `REJECTED`; a failed amendment clears only the pending vote and preserves the current active policy. A successful amendment appends the next sequential policy version. History is bounded at 64 versions.

## Features and discussion

Posting requires current membership in either governing community, an active room, and no active serious restriction for that room/wallet pair. A room stores at most 150 post IDs. Post bodies and authors are immutable after publication. Replies must point to an earlier post in the same room. Feature and unfeature proposals use the same two independent frozen rosters; a hidden or stale candidate cannot become the active featured post.

## Cases and appeals

An eligible other room member may challenge a post once. The author cannot self-report. The clause must exist in the active policy, context IDs are unique numeric IDs for earlier posts from the same room, and the contract copies context bodies and authors into the case. Filing changes the display state to `UNDER_REVIEW` but applies no sanction.

The author may submit one bounded defense before the case deadline. After the strict deadline boundary, any caller may freeze evidence; the freeze stores a canonical SHA-256 digest. Adjudication is possible only from the frozen state and re-verifies that digest.

One application-level appeal is available within the frozen appeal window. The adverse party is the author for a breach finding and the reporter for `NO_VIOLATION` or `INSUFFICIENT_EVIDENCE`. The other party may submit one response before the response deadline. Appeal evidence is frozen and hashed separately. GenLayer reassesses the frozen rule and facts rather than blindly copying the original result. The original finding and decision remain preserved; the current finding and post/restriction state reflect the final application outcome.

Application appeals are distinct from GenLayer protocol-level finality or transaction appeals. Neither is controlled by the frontend timer settings.
