# CROSSRULE

**Social | Community Moderation | Group Consensus**

CROSSRULE is a complete, wallet-native social governance system where **two autonomous communities negotiate a shared rulebook**, approve it independently, converse in a joint room, challenge specific posts under cited clauses, and appeal an AI-assisted ruling. The rulebook, procedural deadlines, evidence, and decisions are public GenLayer Intelligent Contract state. Neither community can impose a rule on the other.

**Current release status:** the hardened source is pushed to `main`, the corrected contract is deployed to StudioNet, the fresh lifecycle was executed with six distinct CLI identities, a current-contract injected-wallet write was verified, and the Accord Chamber frontend is live on Vercel. The live record contains four communities total (three active plus one founding browser-verification record), one active bilateral room, policy versions 1–3, six stable post IDs, four semantic cases, appealed serious findings with preserved original/appellate decisions, and finalized negative permission controls. See [`docs/LIVE_EVIDENCE.md`](docs/LIVE_EVIDENCE.md) for exact receipts, readbacks and limitations.

## Exact stack

| Layer | Pinned implementation |
| --- | --- |
| Network | GenLayer StudioNet, chain `61999`, `https://studio.genlayer.com/api` |
| Contract | One Python Intelligent Contract, `contracts/Crossrule.py` |
| Contract developer CLI | Local `genlayer@0.39.1` (root lockfile) |
| JS SDK | `genlayer-js@1.1.8` |
| Web | Next.js `16.4.3`, React `19.3.1`, TypeScript `5.9.3`, Tailwind `4.3.3` |
| Wallet | User-injected EIP-1193 provider; user signs all writes |
| Frontend hosting | Vercel static/client-connected app |
| Test tools | `genlayer-test==0.29.2`, `genvm-linter==0.11.0`, Vitest, Playwright |
| Server / database / indexer / keeper | **None** |

Do not upgrade to the Bradbury/consensus-v0.6 SDK family within this locked StudioNet release. Validate that the target RPC and SDK combination still work before deployment.

## Verified deployment

| Item | Value |
| --- | --- |
| Frontend | [crossrule.vercel.app](https://crossrule.vercel.app) — public Accord Chamber landing page |
| Vercel deployment | [READY `dpl_9ZVwixDHKntpaEYQJ4C7HkAD5jRJ`](https://vercel.com/delealufejoel-4184s-projects/crossrule/9ZVwixDHKntpaEYQJ4C7HkAD5jRJ), alias [crossrule.vercel.app](https://crossrule.vercel.app), uploaded from release commit `1a963f027323b10ea363595138156a0dce952768` |
| Contract | `0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab` |
| Contract explorer | [StudioNet address](https://explorer-studio.genlayer.com/address/0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab) |
| Deployment | [FINALIZED deployment transaction](https://explorer-studio.genlayer.com/tx/0x8fb258e9a5caf28d10166cf6c5922c9ba39bc8a698a535cfcd622d741f9c2468) |
| Latest full GitHub CI | [9/9 jobs successful](https://github.com/ometere123/crossrule/actions/runs/40684788894) at code-bearing release commit `487faeffca20c2e2c139274eee473245023ae809` |
| Source | SHA-256 `8d4ea453bcb15aafff493f9d8ae2de186bd9482b10635857fc0ff8585f3b21b2`, contract-source commit `21e5af60ac116b31a7d6fa53034a85303f28cecf` |
| Receipt | `FINALIZED` + `MAJORITY_AGREE` + leader `SUCCESS`; decoded deployed source matched the committed LF bytes exactly (49,865 bytes) |

The live StudioNet readback after the fresh demonstration lifecycle is communities `4` total (`3` active and `1` founding browser-verification record), room records `1` (`ACTIVE`), posts `6`, cases `4`. The active room has policy versions 1–3. Case 1 is a closed `NO_VIOLATION` under policy v1; cases 2–4 are serious findings under the policy version captured when each post was published, with cases 3 and 4 independently appealed and case 4 demonstrating an upheld appeal without restarting the original suspension clock. Finalized outsider, unauthorized-vote, duplicate-challenge and unauthorized-appeal controls are retained.

The production Accord Chamber was checked at 1440, 1280, 1024, 768, 390 and 375 CSS pixels with no horizontal overflow, no page errors and no console errors. Representative captures: [desktop hero](docs/screenshots/accord-hero-1440.png), [mobile hero](docs/screenshots/accord-hero-390.png), and [full desktop page](docs/screenshots/accord-1440.png).

The production build uses `NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS` only. The RPC and chain are public network configuration, not secrets; PRAEST credentials are never placed in Vercel. The Vercel project root is `frontend` and the deployment is built with Node 22. The READY production deployment above was verified at the public alias and reads the corrected contract state: 2 communities, 2 room records, 2 cases and 4 posts after the fresh lifecycle.

## Product in one story

1. Wallet A creates **Builders**, nominates two founding wallet addresses, and both invitees independently accept. Three founders are required to activate a community. A separate trio creates **Researchers**. A wallet cannot sit on both sides of an agreement.
2. Community members may propose a fourth member. The invitee must consent and two-thirds of the frozen roster must approve; no more than 12 wallets belong to one community. Community charters are independently versioned by two-thirds voting.
3. A member of either community proposes a joint room and specifies agreement text, 1–6 explicit clauses, each clause's maximum penalty, and **all four durations from the frontend**: vote, defense, appeal, and suspension. All durations are 2–10,080 minutes. The governance snapshot is frozen at proposal time.
4. **Two-thirds of each community, counted separately**, must approve; a simple combined majority cannot override either community. Failed initial ratification rejects that proposed room. Later amendments require the same bilateral process and create a new version; old cases retain their original policy snapshot.
5. Room members create text posts and replies. Two-thirds approval by each community can feature or unfeature a post. Public readers can inspect the feed, agreement, and audit without a wallet.
6. Another room member may challenge a post by citing one ratified clause and up to three prior same-room context posts. The author receives the frozen defense window; evidence is then hashed and sent to GenLayer's leader/validator LLM process. Validators independently assess the case; the equivalence logic requires a matching **decision-bearing classification**, not merely plausible prose.
7. Findings: `NO_VIOLATION`, `INSUFFICIENT_EVIDENCE`, `MINOR_BREACH`, or `SERIOUS_BREACH`. Minor and serious proven breaches hide the post from the official feed. Serious requires a clause that explicitly allows it, and suspends the author from that room for the proposed duration. An appeal can restore the post and remove the case-specific suspension. An upheld serious sanction does **not** restart its clock.
8. The adversely affected party can file **one application-level appeal per case** within the policy's appeal window; the other party may respond during the frozen response window. An independent GenLayer semantic reassessment closes the case. The application appeal is distinct from GenLayer protocol-level challenges/finality.

## Repository structure

```
contracts/Crossrule.py       Single GenLayer contract; all authoritative state
frontend/app/               Responsive web app
frontend/components/        Screens, navigation and governance forms
frontend/lib/               Typed domain and wallet/RPC client
frontend/tests/             Domain and React UI tests
frontend/tests/e2e/         Desktop/mobile Playwright public paths
tests/test_contract_offline.py   Actual-method offline Python regressions
tests/direct/               Real GenLayer Direct Mode suite
docs/                       System boundaries, threat model, tests and handoff
.github/workflows/ci.yml    Linux/Windows + GenVM + Playwright gates
```

## Run locally

Use Node.js 22 and Python 3.12.

```bash
npm ci
npm run genlayer -- --version

cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

Before deployment, the UI truthfully displays **Source build · not deployed**. To connect the deployed contract, set `NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS=0x...` in the frontend's Vercel project environment and redeploy. No server-side signing key or API secret is needed; never store an application private key in `NEXT_PUBLIC_*`.

### Quality gates

```bash
python -m unittest discover -s tests -p test_contract_offline.py -v
python -m pip install genlayer-test==0.29.2 genvm-linter==0.11.0
genvm-lint check contracts/Crossrule.py
python -m pytest tests/direct -v

cd frontend
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

**Direct Mode / linter artifact note:** the pinned toolchain has a runner archive-name/cache mismatch on some installations. The reproducible CI workaround downloads the exact `v0.2.16` artifact through `gltest.direct.sdk_loader`, places the pinned `py-lib-genlayer-std` runner under a temporary `GENVMROOT`, and then runs genuine `genvm-lint check` and Direct Mode. On Windows, `genlayer-test==0.29.2` also needs a session-only `os.unlink` shim for its open temporary file; CI runs on Linux without that local Windows workaround. Direct Mode is never replaced by a Python mock. During the live CLI session, the repository-pinned `genlayer@0.39.1` argument parser auto-coerced `0x...` strings to typed addresses even though these contract parameters are `str`; two finalized error receipts reproduce the issue. The same pinned `genlayer-js@1.1.8` signing client was then used with plain strings. The contract and frontend source are unchanged.

## Time safety

Every proposal's own duration is adjustable in the web UI from **2 minutes to 7 days**, with short windows for quick demonstration. Voting, membership, and charter deadlines are frozen when initiated; case defense, appeal eligibility, appeal response, and sanction durations are inherited from the jointly ratified policy version, which was configured from the UI. On-chain timestamps determine enforcement. `freeze_case`, `freeze_appeal` and deadline-based closure are permissionless write calls made by a participant; **no background scheduler** auto-advances state. GenLayer network execution, consensus, appeals, and finality have their own timing that **cannot** be accelerated from the application. A 2-minute window may close before an on-chain transaction finalizes; use longer windows for production and final live demonstrations.

## Immutable scope / boundaries

- No admin, owner, pause, upgrade, force-finalize, centralized moderator, arbitrary oracle or back-end signing authority.
- No Supabase, Cloudflare Worker, database, hidden LLM service, off-chain reputation or custodial funds.
- No third community, AI autoposting, token rewards, stake/slash economics, hidden moderation content deletion, external social-platform integration, or infinite-scroll indexer.
- Text content remains recoverable from public contract storage even if marked hidden in the official feed. Users must never post secrets or private data.
- The application supports up to **three serial, clause-distinct challenge cases per post**, one per applicable clause, and one application appeal per case. A new case cannot begin while an earlier case/appeal is unresolved, and an upheld breach blocks further proceedings against that post. The contract enforces **12 members per community**, six clauses per policy and bounded page reads of at most 20 records; posts use stable room-scoped indexes rather than a permanent lifetime cap. Historic post bodies and evidence remain public and immutable.
- A future Portal milestone may introduce different functionality, but it is outside this complete initial submission.

## Documentation

- [Architecture, actors, data and lifecycle](docs/ARCHITECTURE.md)
- [Governance specification](docs/GOVERNANCE.md)
- [Semantic consensus specification](docs/CONSENSUS.md)
- [Threat model and explicit limits](docs/SECURITY.md)
- [Testing and score evidence plan](docs/TEST_PLAN.md)
- [Live evidence ledger](docs/LIVE_EVIDENCE.md)
- [GenLayer Portal submission materials](docs/SUBMISSION.md)
- [Deployment and reviewer closeout checklist](docs/HANDOFF.md)

The 5/5/5/5 Portal rubric is a **target**, not a guaranteed score. Live finalized SUCCESS receipts, source parity, consensus observations and reviewer acceptance must be independently proven after deployment.
