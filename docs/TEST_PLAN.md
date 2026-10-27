# CROSSRULE — Test matrix and 5/5/5/5 evidence target

The numbers **5/5/5/5 are a target for Portal review**, not a self-awarded score. Automated tests prove specific implementation properties; the final deployment engineer must separately establish chain compatibility, completed lifecycle transactions, user-facing interactions, security evidence, and source parity.

## Required build checks

| Layer | Command / deliverable | Criteria |
| --- | --- | --- |
| Contract source Python | `python -m py_compile contracts/Crossrule.py` | No Python errors |
| Contract offline | `python -m unittest discover -s tests -p test_contract_offline.py -v` | All cases pass Linux and Windows |
| GenVM lint | `genvm-lint check contracts/Crossrule.py` | Genuine pinned-runner validation passed |
| GenVM Direct Mode | `python -m pytest tests/direct -v` | Actual GenLayer runner, wallet identities, votes, deadlines, mocked LLM, validator agreement/disagreement |
| Frontend lint | `cd frontend && npm run lint` | Zero errors/warnings |
| TypeScript | `cd frontend && npm run typecheck` | Zero errors |
| UI/domain tests | `cd frontend && npm test` | Green with mocked read-only RPC/wallet |
| Production build | `cd frontend && npm run build` | Successful Next.js production build |
| Browser tests | `cd frontend && npm run test:e2e` | Desktop and mobile Chrome paths, no console errors |
| CI | `.github/workflows/ci.yml` | Linux/Windows matrices plus GenVM and Playwright green on GitHub |

`genlayer-test==0.29.2` may request a renamed GenVM archive; the CI runs `genvm-linter==0.11.0` first and shares its downloaded verified tarball. Do not remove the real Direct Mode job because of artifact download friction.

## Local contract regression matrix

- Empty state counters.
- Three distinct founders and explicit consent.
- Two thirds vote per community with independent denominators.
- Duplicate ballot and outsider rejection.
- Deadline expiration and failed proposal finalization.
- Public post permissions and reply ownership.
- No immediate punishment from merely filing a challenge.
- `NO_VIOLATION`, `INSUFFICIENT_EVIDENCE`, `MINOR_BREACH`, `SERIOUS_BREACH` outcomes.
- Active serious sanction blocking publication.
- Severity cap per frozen clause.
- No fabricated excerpt or uncontrolled evidence source.
- Leader/validator disagreement kills the verdict.
- Appeal grounds and optional respondent reply.
- Appeal reversal restores post and removes its restriction.
- Appeal upholding a serious finding does not extend earlier suspension.
- Only adversely affected party may appeal; one application appeal.
- Frozen evidence hash and original policy version unchanged by later amendments.
- Malformed context IDs rejected before reading.
- Proposal-supplied 2 to 10,080 minute bound, not a day-long hardcoded wait.

## Mandatory live StudioNet lifecycle, using distinct real wallets

Use **at least six consenting addresses**, three per community, and collect chain explorer references for each call. Document chain ID, RPC, contract address, deploy hash, `FINALIZED` and `SUCCESS` receipt, source SHA, deployed code parity, Vercel build SHA, wallet signature and UI screenshot/video.

1. **Found communities:** Wallets A1/A2/A3 create/accept one group, B1/B2/B3 create/accept another. Test unaccepted wallet exclusion and fourth member admission (consent + 2/3 vote), charter amendment vote and history.
2. **Ratify agreement:** A member proposes a joint clause set with testable frontend-specified 2–10,080 minute timers. Show that A-only support cannot finalize an approved rule; get two yes ballots from each 3-wallet group and finalize active agreement version 1. Negative double-ballot and outsider attempt.
3. **Publish and discuss:** Post by A1; reply by B1; confirm public feed and unauthorized outsider/other-room reply failure.
4. **Feature:** Independently approve a featured post with two-thirds yes from each group, then unfeature with the same bilateral protection.
5. **Amend rules:** Propose a real substantive clause change, obtain bilateral ratification, verify version 2 and preserved version 1. Open one case under version 1 before amendment if proving time-frozen policy behavior.
6. **Case with no breach:** Post a contextual research example; B1 files specific, clause-grounded challenge and cites exact older post IDs; A1 submits defense; wait true on-chain deadline, freeze; evaluate using real leader and validators; verify no breach classification, original post visible, no sanction, and case trace.
7. **Case with breach:** Separately post an explicit forbidden solicitation or unsupported claim governed by an existing ratified clause. B1 challenges. Freeze then obtain a genuine `MINOR_BREACH` or clause-authorized `SERIOUS_BREACH`. Confirm hide effect; for serious confirm room-limited temporary posting suspension and expiry.
8. **App appeal:** Author appeals an adverse case once, reporter responds, deadline expires, freeze, re-evaluate independently. Record actual outcome (`upheld` or `reversed`) honestly. If reversed, verify restored post and removed restriction. If upheld, verify original deadline is not extended. Negative wrong-party and second appeal.
9. **Protocol consensus:** Archive original leader result and at least one independent validator result/equivalence trace; execute a controlled *negative mock or Direct Mode* to show disagreement rejection. Never claim a real network disagreement unless observed.
10. **UX:** Connect injected wallet on mobile and desktop; verified account/network switch; before/after state screens; transaction pending, finalized success, finalized failure/revert; missing provider and unconfigured contract screens.
11. **Reproducibility:** Run commands in fresh Linux + Windows environments and GitHub CI; prove UI and code were deployed from the same commit. Do not hide or rewrite failed receipts.

## Capture template for each reviewer claim

| Field | Required |
| --- | --- |
| Contract chain / address / source hash | Yes |
| Frontend live URL and Git commit SHA | Yes |
| Actor wallet + action + arguments | Yes (redact private keys) |
| Transaction hash / explorer URL | Yes |
| Finalized status + receipt SUCCESS | Yes for successful lifecycle claim |
| Before/after public view result | Yes |
| Positive control and matched negative control | Yes |
| Genuine GenLayer semantic validator result when applicable | Yes |
| UI desktop and mobile evidence | Yes |

## Four review goals

1. **Social fit 5/5:** clearly demonstrate two autonomous groups, cross-community governance, balanced consent, real dialogue, visible member participation and substantive social moderation.
2. **Intelligent contract 5/5:** single on-chain source of truth, bounded prompts, valid proof excerpts, material validator equivalence, appeal reassessment, immutable agreement versions and enforceable sanctions.
3. **Engineering 5/5:** code/lint/Direct-mode/negative tests, frozen evidence, no privileged paths, zero-value SDK calls, finalized receipts, reproducible deployment, mutation tests and cross-platform CI.
4. **Frontend 5/5:** attractive accessible responsive design, all operations exposed, honest wallet/network pending and success states, no hidden backend dependencies, complete histories and approachable end-to-end workflow.

Final reviewer score is external and not inferable solely from these checks.
