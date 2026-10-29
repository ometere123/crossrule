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

* Contract: `0x52216B878474b97897b3878071eBF92DB42cd0E0`
* Deployment transaction: [`0x85afe807…950495`](https://explorer-studio.genlayer.com/tx/0x85afe80786dceecf32a3536f2ede30d29cd48f12be3dc621a3472de728950495)
* Deployment result: `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`
* Frontend: [https://crossrule.vercel.app](https://crossrule.vercel.app)
* Vercel deployment: [READY `dpl_cTpND7kgGZdx3CiEMJsQ9DyPVYNL`](https://vercel.com/delealufejoel-4184s-projects/crossrule/cTpND7kgGZdx3CiEMJsQ9DyPVYNL), alias [https://crossrule.vercel.app](https://crossrule.vercel.app)
* Source parity: `gen_getContractCode` returned 57,518 bytes that matched `contracts/Crossrule.py` byte-for-byte; SHA-256 `bd7af33a291f9c3d26d36422cf4f0cdc1dd9ef63454b50d7a4e48e1b7901c104`
* Deployed contract source commit: `bb614994ea4f4d2235ef18dc01437b51e31e3197`
* Full ledger: [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md)
* Current deployment readback: `get_counts = {communities:0, rooms:0, posts:0, cases:0}`; community, room and case lists are empty immediately after deployment. The earlier six-wallet lifecycle is retained only as historical evidence for superseded deployments.

## Final engineer's non-optional checks

- Verify current chain and SDK compatibility **without silently changing the locked stack**. Report a true compatibility blocker, if discovered.
- Fresh checkout: run root `npm ci`, `frontend/npm ci`, Python offline suite, `genvm-lint`, real Direct Mode suite, frontend lint/typecheck/unit/build, Playwright desktop and mobile, and GitHub CI.
- Expand Direct Mode test coverage for membership/charter/feature/amendment/failures, forged context, freeze boundaries, and policy version snapshots; add mutation tests and prove each important mutation is killed.
- Inspect contract for GenVM resource limits, storage constraints, exception behavior, no privileged paths, and semantic LLM consensus under real validators.
- Inspect frontend for every actionable call and read signature; test connected and disconnected provider behavior, chain switching, finalized receipt parsing, bad RPC/timeout, mobile ergonomics, accessibility, and content safety.
- Deploy exactly the reviewed **single contract source** to StudioNet; this is complete for the address and deployment transaction above. The source parity check uses `gen_getContractCode`, decodes the returned base64 bytes and compares them directly against the LF repository source. The historical deployment's CRLF mismatch remains documented as historical evidence; it is not the current deployment.
- Configure only `NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS` in Vercel. The current production alias is configured with `0x52216B878474b97897b3878071eBF92DB42cd0E0` and was rechecked after the READY deployment.
- Execute and archive genuine positive and negative multi-wallet lifecycle evidence for this replacement address in `docs/LIVE_EVIDENCE.md`, never secret keys. Historical lifecycle rows remain clearly labelled as superseded; preserve the six encrypted CLI keystores. A current-contract Convert Chrome `create_community` write is now verified with a user-approved prompt, finalized receipt and `FOUNDING` community readback; the remaining full multi-wallet lifecycle is not claimed for this replacement address.
- Do not claim a network-level finality or validator decision if it is a local mock, pending receipt or UI-only transaction.
- Verify all application timers can be chosen from the frontend; explain why network consensus/finality timing is external.
- Produce final acceptance report mapping concrete evidence to the four 5/5/5/5 target axes, including remaining risks and the external reviewer outcome when available. Do not self-award the Portal score.

## Scope freeze

No admin, owner, pause, upgrade, backend, external AI API, worker, database, Docker requirement, escrow, wallet import, external social integration, token incentives, privacy promises or new milestone features. An unrelated future milestone may be discussed separately after this full initial delivery; **do not phase or dilute the current locked scope**.
