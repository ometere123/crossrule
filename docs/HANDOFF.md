# Deployment and final engineering closeout

This document is the operational handoff for the verified source, StudioNet deployment, six-wallet lifecycle and Accord Chamber Vercel build. It deliberately distinguishes finalized execution/readback evidence from protocol details that are not publicly exposed.

## Locked parameters

| Setting | Value |
| --- | --- |
| Repo | `https://github.com/ometere123/crossrule` |
| Network | GenLayer StudioNet 61999 |
| RPC | `https://studio.genlayer.com/api` |
| Single contract | `contracts/Crossrule.py` |
| CLI | repo-local `genlayer@0.39.1` |
| Frontend SDK | `genlayer-js@1.1.8` |
| Frontend | Next.js 16.4.3, React 19.3.1, TS 5.9.3, Tailwind 4.3.3 |
| Hosting | Vercel, project root `frontend` |
| Wallet | injected EIP-1193 only |
| Duration config | 2–10,080 minutes, from frontend, immutable per vote/policy/case |

## Current handoff values

* Contract: `0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab`
* Deployment transaction: [`0x8fb258e9…f2468`](https://explorer-studio.genlayer.com/tx/0x8fb258e9a5caf28d10166cf6c5922c9ba39bc8a698a535cfcd622d741f9c2468)
* Deployment result: `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`
* Frontend: [https://crossrule.vercel.app](https://crossrule.vercel.app)
* Vercel deployment: [READY `dpl_9ZVwixDHKntpaEYQJ4C7HkAD5jRJ`](https://vercel.com/delealufejoel-4184s-projects/crossrule/9ZVwixDHKntpaEYQJ4C7HkAD5jRJ), alias [https://crossrule.vercel.app](https://crossrule.vercel.app), uploaded from local release commit `1a963f027323b10ea363595138156a0dce952768`
* Source parity: `gen_getContractCode` returned 49,865 bytes that matched `contracts/Crossrule.py` byte-for-byte; SHA-256 `8d4ea453bcb15aafff493f9d8ae2de186bd9482b10635857fc0ff8585f3b21b2`
* Deployed contract source commit: `21e5af60ac116b31a7d6fa53034a85303f28cecf`
* Full ledger: [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md)
* Live readback: communities 4 total (three active plus one browser-created `FOUNDING` record), one active room, posts 6, cases 4; the room preserves policy versions 1–3; case 4 closed after an upheld `SERIOUS_BREACH` appeal without restarting its original restriction clock.

## Final engineer's non-optional checks

- Verify current chain and SDK compatibility **without silently changing the locked stack**. Report a true compatibility blocker, if discovered.
- Fresh checkout: run root `npm ci`, `frontend/npm ci`, Python offline suite, `genvm-lint`, real Direct Mode suite, frontend lint/typecheck/unit/build, Playwright desktop and mobile, and GitHub CI.
- Expand Direct Mode test coverage for membership/charter/feature/amendment/failures, forged context, freeze boundaries, and policy version snapshots; add mutation tests and prove each important mutation is killed.
- Inspect contract for GenVM resource limits, storage constraints, exception behavior, no privileged paths, and semantic LLM consensus under real validators.
- Inspect frontend for every actionable call and read signature; test connected and disconnected provider behavior, chain switching, finalized receipt parsing, bad RPC/timeout, mobile ergonomics, accessibility, and content safety.
- Deploy exactly the reviewed **single contract source** to StudioNet; this is complete for the address and deployment transaction above. The source parity check uses `gen_getContractCode`, decodes the returned base64 bytes and compares them directly against the LF repository source. The historical deployment's CRLF mismatch remains documented as historical evidence; it is not the current deployment.
- Configure only `NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS` in Vercel. The current production alias is configured with `0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab` and must be rechecked after the final READY deployment.
- Execute and archive genuine positive and negative multi-wallet lifecycle evidence in `docs/LIVE_EVIDENCE.md` or via verifiable links with identities and links, never secret keys. This is complete for the current deployment, including counterpart consent, feature/unfeature, three policy versions, six posts, four semantic cases, two application appeals and finalized negative controls; preserve the six encrypted CLI keystores.
- Do not claim a network-level finality or validator decision if it is a local mock, pending receipt or UI-only transaction.
- Verify all application timers can be chosen from the frontend; explain why network consensus/finality timing is external.
- Produce final acceptance report mapping concrete evidence to the four 5/5/5/5 target axes, including remaining risks and the external reviewer outcome when available. Do not self-award the Portal score.

## Scope freeze

No admin, owner, pause, upgrade, backend, external AI API, worker, database, Docker requirement, escrow, wallet import, external social integration, token incentives, privacy promises or new milestone features. An unrelated future milestone may be discussed separately after this full initial delivery; **do not phase or dilute the current locked scope**.
