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

* Contract: `0xf9bF16af4253064E349fF0fCfc7472f75c63110e`
* Deployment transaction: [`0xde0b737e…22951`](https://explorer-studio.genlayer.com/tx/0xde0b737e7d4fb2b1540afaf060b4d80d43ae9687748908866fbd7f2300222951)
* Deployment result: `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`
* Frontend: [https://crossrule.vercel.app](https://crossrule.vercel.app)
* Source parity: `gen_getContractCode` returned 44,575 bytes that matched `contracts/Crossrule.py` byte-for-byte; SHA-256 `58f998ff4b8401ecc623d9aa0a934d14352cf6a177f62c43d9c5ad53415b469e`
* Deployed contract source commit: `cf96ee8e88ef83d2b5ffc8cbbe9f24b389943dea`
* Full ledger: [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md)
* Live readback: communities 2, rooms 1, posts 6, cases 4; the room preserves policy versions 1–3; case 4 closed after a reporter appeal that retained `NO_VIOLATION`.

## Final engineer's non-optional checks

- Verify current chain and SDK compatibility **without silently changing the locked stack**. Report a true compatibility blocker, if discovered.
- Fresh checkout: run root `npm ci`, `frontend/npm ci`, Python offline suite, `genvm-lint`, real Direct Mode suite, frontend lint/typecheck/unit/build, Playwright desktop and mobile, and GitHub CI.
- Expand Direct Mode test coverage for membership/charter/feature/amendment/failures, forged context, freeze boundaries, and policy version snapshots; add mutation tests and prove each important mutation is killed.
- Inspect contract for GenVM resource limits, storage constraints, exception behavior, no privileged paths, and semantic LLM consensus under real validators.
- Inspect frontend for every actionable call and read signature; test connected and disconnected provider behavior, chain switching, finalized receipt parsing, bad RPC/timeout, mobile ergonomics, accessibility, and content safety.
- Deploy exactly the reviewed **single contract source** to StudioNet; this is complete for the address and deployment transaction above. The source parity check uses `gen_getContractCode`, decodes the returned base64 bytes and compares them directly against the LF repository source. The historical deployment's CRLF mismatch remains documented as historical evidence; it is not the current deployment.
- Configure only `NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS` in Vercel; the production URL above is READY and serves the configured address. Re-deploy after any frontend or documentation commit intended to be the final presentation SHA.
- Execute and archive genuine positive and negative multi-wallet lifecycle evidence in `docs/LIVE_EVIDENCE.md` or via verifiable links with identities and links, never secret keys. This is complete for the current deployment, including counterpart consent, feature/unfeature, three policy versions, six-post pagination, four semantic cases, an application appeal and an outsider rollback; preserve the six encrypted CLI keystores.
- Do not claim a network-level finality or validator decision if it is a local mock, pending receipt or UI-only transaction.
- Verify all application timers can be chosen from the frontend; explain why network consensus/finality timing is external.
- Produce final acceptance report mapping concrete evidence to the four 5/5/5/5 target axes, including remaining risks and the external reviewer outcome when available. Do not self-award the Portal score.

## Scope freeze

No admin, owner, pause, upgrade, backend, external AI API, worker, database, Docker requirement, escrow, wallet import, external social integration, token incentives, privacy promises or new milestone features. An unrelated future milestone may be discussed separately after this full initial delivery; **do not phase or dilute the current locked scope**.
