# CROSSRULE live evidence ledger

This ledger separates source tests, Direct Mode execution, submitted transactions, protocol finality, execution success and readback. Missing lifecycle steps are marked `NOT RUN`; no link below is a substitute for a different transaction.

## Network and deployment

| Field | Observed value |
| --- | --- |
| Network | GenLayer StudioNet |
| Chain ID | `61999` (`0xf22f`) |
| RPC | `https://studio.genlayer.com/api` |
| Official explorer | `https://explorer-studio.genlayer.com` |
| CLI | repository-local `genlayer@0.39.1` |
| SDK | `genlayer-js@1.1.8` |
| Deployment wallet | `0x0d5540e0ad4b92aa0ad4e5f1b8cd645ee1e363e7` (`praest-deployer`) |
| Contract | `0x3c5C74733E10BDD4b7520e62dF8852c2Ef550D12` |
| Deployment transaction | [`0xc46b0b7e…7006f9c`](https://explorer-studio.genlayer.com/tx/0xc46b0b7e3e83482eb2c0b4dec2951d81dd8ba5724a14b7f1a4d7810527006f9c) |
| Receipt | `status_name=FINALIZED`, numeric `status=7` |
| Execution | `result_name=MAJORITY_AGREE`, numeric `result=6`; leader `SUCCESS` |
| Source SHA-256 | `94577d12e28208f33de8365f3cd40c23476617ed234c61a4eedf3ca07221c8ff` |
| Contract source commit | `acb7e7adfef59166fd602636ab9ffb377e570840` |

### Source parity method

Using `genlayer-js@1.1.8`, `getTransaction({hash})` returned `data.contract_code`. That value was base64-decoded and compared byte-for-byte with `contracts/Crossrule.py`. Both were 34,759 bytes and produced the SHA-256 above; the byte comparison returned `true`. The receipt also returned the same deployed `contract_address`. This is stronger than comparing a displayed source snippet, but it is still a comparison against the network's returned deployment input rather than a claim of independent bytecode decompilation.

### Deployment consensus evidence

The finalized receipt exposed three validator records with `execution_result=SUCCESS` and `vote=agree`. Two additional validator slots were `idle` after the quorum was reached. The constructor has no nondeterministic semantic assessment, so these validator records establish deployment consensus/finality only, not agreement on a moderation finding.

## Initial contract readback

Immediately after finalization, the following read calls succeeded against the deployed address:

| Read | Arguments | Result |
| --- | --- | --- |
| `get_counts` | none | `{"cases":0,"communities":0,"posts":0,"rooms":0}` |
| `list_communities` | `1, 20` | `[]` |
| `list_rooms` | `1, 20` | `[]` |
| `list_cases` | `1, 20` | `[]` |

## Lifecycle ledger

The required A1/A2/A3 and B1/B2/B3 live lifecycle was **not run**. Only the authorized disposable deployment wallet was available for signing in this session, and one signer cannot honestly represent six independent consenting participants. No fabricated addresses, receipts or screenshots are included.

| Sequence | Actor | Action | Transaction / explorer | State readback | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | PRAEST | Deploy `Crossrule.py` | [`0xc46b0b7e…7006f9c`](https://explorer-studio.genlayer.com/tx/0xc46b0b7e3e83482eb2c0b4dec2951d81dd8ba5724a14b7f1a4d7810527006f9c) | Contract address plus empty initial reads above | PASS |
| 2 | A1/A2/A3 | Found community A | — | — | NOT RUN: six authorized signers unavailable |
| 3 | B1/B2/B3 | Found community B | — | — | NOT RUN: six authorized signers unavailable |
| 4–18 | A/B wallets | Admission, charter, agreement, room, posts, feature, amendment, cases, appeals | — | — | NOT RUN: six authorized signers unavailable |
| Negative controls | Outsider / wrong party | Permission failures | — | — | NOT RUN live; covered offline and Direct Mode |

## Reproduction references

The source and test suites provide the reproducible non-live evidence:

* `tests/test_contract_offline.py`: 46 actual-method regression tests.
* `tests/direct/test_crossrule_direct.py`: 18 genuine GenLayer Direct Mode tests.
* `tests/mutation/test_mutations.py`: 18 purposeful high-risk mutations, all killed.
* `frontend/tests/e2e/public-flow.spec.ts`: 10 local desktop/mobile cases, with the same suite parameterized for the production URL.
