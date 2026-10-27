# CROSSRULE live evidence ledger

This ledger distinguishes submitted transactions, protocol finality, execution success, semantic consensus metadata and contract readback. Every positive lifecycle claim below has a finalized receipt and a matching state read. Failed receipts are retained as negative evidence.

## Network, deployment and provenance

| Field | Observed value |
| --- | --- |
| Network | GenLayer StudioNet |
| Chain ID | 61999 (0xf22f) |
| RPC | https://studio.genlayer.com/api |
| Explorer | https://explorer-studio.genlayer.com |
| CLI | repository-local genlayer 0.39.1 |
| SDK | genlayer-js 1.1.8 |
| Contract | 0x3c5C74733E10BDD4b7520e62dF8852c2Ef550D12 |
| Deployment wallet | PRAEST / 0x0d5540e0ad4b92aa0ad4e5f1b8cd645ee1e363e7 |
| Deployment transaction | [0xc46b0b7e...7006f9c](https://explorer-studio.genlayer.com/tx/0xc46b0b7e3e83482eb2c0b4dec2951d81dd8ba5724a14b7f1a4d7810527006f9c) |
| Deployment result | FINALIZED, MAJORITY_AGREE, leader SUCCESS |
| Contract source SHA-256 | 94577d12e28208f33de8365f3cd40c23476617ed234c61a4eedf3ca07221c8ff |
| Source parity | Returned deployment data.contract_code was base64-decoded and compared byte-for-byte with contracts/Crossrule.py; 34,759 bytes matched exactly |
| Contract source commit | acb7e7adfef59166fd602636ab9ffb377e570840 |
| Final Vercel deployment | [READY deployment](https://vercel.com/delealufejoel-4184s-projects/crossrule/2xpb1NnyTmn5LZ9vwa5dLGaQ3qBg), source SHA `5338d57617cfca87c995c60d69fff8b3a6bda0dd` |

The single deployed contract source was not changed during the Accord Chamber frontend work, so a frontend-only release does not require a contract redeployment.

## Six live signing identities

All six accounts were existing repository-local CLI accounts, verified on StudioNet 61999, distinct, unlocked for the session and retained in encrypted CLI keychain storage. No private key, mnemonic or password is recorded here.

| Role | CLI alias | Public address |
| --- | --- | --- |
| A1 | party_a | 0xac3ac69dc0bde389256dd6748c75817ead9286d9 |
| A2 | walletA | 0x951e6b75530774ff82321a5ae54e14f778f0c855 |
| A3 | walletB | 0xb845a69860ba4cdf19cfdc5afbaf2e20b6be86b0 |
| B1 | conveyance-deployer | 0x21892bba93381d94037fb4aab01cafbdf4453b56 |
| B2 | slash-owner | 0x9dce0dc7005d6b92e03c27640081096cd36dd468 |
| B3 | termsmet-studionet-submitter | 0xb5ecd6dda36b370aca4af5e2005d8e2ae89c6db2 |

The extra applicant used for admission was party_b at 0xa7eeae0e93793e3146cb14b0700251b8b0ebadfb. The six encrypted keystores remain preserved; no wallet was deleted or overwritten.

## Final live readback

At the end of the lifecycle, finalized contract views returned:

| Read | Result |
| --- | --- |
| get_counts | communities 2, rooms 2, posts 4, cases 2 |
| Community 1 | Builders Collective, ACTIVE, four members, two charter versions |
| Community 2 | Research Forum, ACTIVE, three members, one charter version |
| Room 1 | REJECTED after its initial agreement timed out |
| Room 2 | ACTIVE, communities 1 and 2, policy version 2, policy history length 2, posts 1/2/3/4 |
| Case 1 | DECIDED, NO_VIOLATION, policy version 1, post 2 VISIBLE, no restriction |
| Case 2 | CLOSED, MINOR_BREACH after appeal, policy version 2, post 4 HIDDEN, no serious restriction |

## Lifecycle transaction ledger

Explorer links use the verified StudioNet route https://explorer-studio.genlayer.com/tx/{hash}.

| Sequence | Actor | Action | Transaction | Result and readback |
| --- | --- | --- | --- | --- |
| 1 | A1 | create community 1, Builders Collective | [0x69afa74e...47bfaec4](https://explorer-studio.genlayer.com/tx/0x69afa74eeae4be61f00473ca6c5af2a0ad730cc49722ec3a7637a28b47bfaec4) | FINALIZED, leader SUCCESS; community 1 created in FOUNDING |
| 2 | A2 | accept_foundership community 1 | [0xd9a9427f...14c3df07](https://explorer-studio.genlayer.com/tx/0xd9a9427fdc82b1bb964e9b08ef33c37b44f7aaaf73bf8a1273501a1914c3df07) | FINALIZED, leader SUCCESS |
| 3 | A3 | accept_foundership community 1 | [0x22dbda3d...42dcd1d](https://explorer-studio.genlayer.com/tx/0x22dbda3dd4cc926821206f1c35a86739589e905e08549c560cd7fe2ea42dcd1d) | FINALIZED, leader SUCCESS; community 1 ACTIVE |
| 4 | B1 | create community 2, Research Forum | [0xcfb169d2...7aa5d01](https://explorer-studio.genlayer.com/tx/0xcfb169d2cc8523a04c435831273cc681d13b8635ae3e9b57246f0370d7aa5d01) | FINALIZED, leader SUCCESS; community 2 created |
| 5 | B2 | accept_foundership community 2 | [0x9e1ad9d7...14b22e](https://explorer-studio.genlayer.com/tx/0x9e1ad9d7f21bb8f7147eb0389a1f5c7a9a341bfb08a51c427ae0c6f5da14b22e) | FINALIZED, leader SUCCESS |
| 6 | B3 | accept_foundership community 2 | [0xb96e64f1...f1ca9f8](https://explorer-studio.genlayer.com/tx/0xb96e64f130a137cab7eaeea2f133e993b4112f17dbe5c6dc3e40aa39ff1ca9f8) | FINALIZED, leader SUCCESS; community 2 ACTIVE |
| 7 | A1 | propose applicant admission for party_b | [0x0d05dc9f...e2ca2845](https://explorer-studio.genlayer.com/tx/0x0d05dcf9b48af585e2ee8111c5d98ad680d7e88e7fe41ff06fc7a22e2ca2845f) | FINALIZED, leader SUCCESS; pending invitation |
| 8 | applicant | accept_membership community 1 | [0x41c3f5ba...f6fe182](https://explorer-studio.genlayer.com/tx/0x41c3f5baa206f13b9947eb65078b65f756c6367af2568bd5140e35026f6fe182) | FINALIZED, leader SUCCESS; applicant consent true |
| 9 | A1/A2 | vote_member approve | [0x6b3a1398...da5aa7a](https://explorer-studio.genlayer.com/tx/0x6b3a1398bdf18a9569a9209bf2fcf9859441fd1c26fbbc0367e4d7b6bda5aa7a), [0xe7f5cffc...aaa4d10](https://explorer-studio.genlayer.com/tx/0xe7f5cffca9aeba7ba6cfb43f1e1d6b86b6071a476015f1f14ea6417feaaa4d10) | Both FINALIZED, leader SUCCESS; two approvals in a four-wallet roster |
| 10 | A1 | finalize_member | [0xca8ccbe2...2c0f1](https://explorer-studio.genlayer.com/tx/0xca8ccbe25f5f7596236cdf161807ad314d0f6693543136b6970c4ee28da2c0f1) | FINALIZED, leader SUCCESS; community 1 now contains party_b |
| 11 | A1/A2/A3 | charter v2 proposal, approvals and finalization | [0x8631a7d4...bc6071](https://explorer-studio.genlayer.com/tx/0x8631a7d451083342c20a76fb51c6323109aab01af3ce9be1bf552af135bc6071), [0x1b2365cd...c21ded](https://explorer-studio.genlayer.com/tx/0x1b2365cd508a3e1205a68dfe6320bb70e739a4a0adb4fe35b7bc574536c21ded), [0x47f392e6...32fb5f8](https://explorer-studio.genlayer.com/tx/0x47f392e64a2b47c390d2dd32a24a140014874aa6ed953557f7c22538b32fb5f8), [0xee622b19...634ca6e](https://explorer-studio.genlayer.com/tx/0xee622b19cd454dc6949f3b801617d9a37d6b1b3012a3b44d21172d9bc634ca6e), [0x0dee13e4...bcb790](https://explorer-studio.genlayer.com/tx/0x0dee13e45a222cb857486473c1ea4069156e9b7a9cd73bc19ec5afc47abcb790) | All finalized successfully; get_community(1) reports two historical charters |
| 12 | A1 | failed initial room proposal and finalization | [0x4a233baf...f4694c9](https://explorer-studio.genlayer.com/tx/0x4a233baf6e43e0f15be8e0da0c5f0a843622c15c9b634f296781e74b9f4694c9), [0xca0c1564...9def21](https://explorer-studio.genlayer.com/tx/0xca0c156490cbd605c42f5656b7dd36bbd4c4feb82ab46a2e1042a4130a9def21) | Finalized; room 1 readback is REJECTED |
| 13 | A1/A2/A3/B1/B2 | propose room 2 and approve independently | [0xde1115a8...4d57f8](https://explorer-studio.genlayer.com/tx/0xde1115a889ab76921a26ae3362e131128e83462d788d8ddcbec59291bf4d57f8), votes [0x14ea8071...1ca5bd16](https://explorer-studio.genlayer.com/tx/0x14ea80717524495bc123d6c32636b8cd29290a20898bbd1f4c3073351ca5bd16), [0x4a4e3f1b...c206fa4](https://explorer-studio.genlayer.com/tx/0x4a4e3f1b72ae860587059b90c35154be82b6cd01eee8036bb45608c37c206fa4), [0x2df62229...6f0c8](https://explorer-studio.genlayer.com/tx/0x2df6222961881b3301d086350ddf12bcf3400c841e28721bad3f1706ae86f0c8), [0xd8370f21...14059ae](https://explorer-studio.genlayer.com/tx/0xd8370f21c79430c50f853e6546a6925e23a1b9326cc19d1932439e24614059ae), [0xc1ea9434...9afb562](https://explorer-studio.genlayer.com/tx/0xc1ea943476a73ccddd24aca27cf798cba1047b1977fe42b273554118d9afb562) | All finalized; finalization [0x24db9dcd...37a26d](https://explorer-studio.genlayer.com/tx/0x24db9dcd03ae550dd2231adcad382ad7d0c7b8fd1b670dd28c401df59837a26d) made room 2 ACTIVE with policy v1 |
| 14 | B1/A1/B1 | post and same-room reply chain | [0xb0c72d52...37bc54](https://explorer-studio.genlayer.com/tx/0xb0c72d526105a795b6631b26883d31f0159a13b15ac5f11c1e60697a5337bc54), [0x50fa4cdb...c8bdd](https://explorer-studio.genlayer.com/tx/0x50fa4cdb04b1b71c7a3c3ff87b089b9f007abbe5964d022e8f3f679dfc8dbcdd), [0x625cdd4d...cbcad5d](https://explorer-studio.genlayer.com/tx/0x625cdd4d80d9c1467cd3a1fa40c4e7cdbef6b357f6a4fc13f4453d921cbcad5d) | Readback lists posts 1, 2 replying to 1, and 3 replying to 2; all room 2 |
| 15 | A1 + bilateral voters | feature post 1, then unfeature | Feature proposal [0x364cf188...f05faf](https://explorer-studio.genlayer.com/tx/0x364cf188749f677e69e67df3964293efd649b577d16d26b87b017ca424f05faf), feature finalization [0xac19a61a...52a46e](https://explorer-studio.genlayer.com/tx/0xac19a61ab799d4b3b3b6322323d1291a69a171c3bdf91dc00db7dacb9526a46e), unfeature proposal [0x5d18847e...a4dc83c](https://explorer-studio.genlayer.com/tx/0x5d18847e31de005a9848d4be4c2ddc03fb846c0c28bd0367caacc20c1a4dc83c), unfeature finalization [0x7fb88681...7269b0](https://explorer-studio.genlayer.com/tx/0x7fb88681dda4689c2adc4f67815a6b8ad95c4d95756230d25a75386e967269b0) | Five yes votes were read in each feature ballot; room readback moved featured_post 0 → 1 → 0 |
| 16 | A1 + bilateral voters | amendment to policy v2 | Proposal [0x36d93feb...ad4876](https://explorer-studio.genlayer.com/tx/0x36d93febcfb542f758f4e6429946b1883037a392c649c2e9882f479729ad4876), votes [0x7befd9af...c8e77e9](https://explorer-studio.genlayer.com/tx/0x7befd9af6418c85be848b5ca769f27f3d5978a378ae4a9a0bb5f527dbc8e77e9), [0x7490debb...c5b26a](https://explorer-studio.genlayer.com/tx/0x7490debba72d07dc59109efbc446f21a3a4ccdb378d41bad1d6f854ef2c5b26a), [0xb0a2d88e...2fef70](https://explorer-studio.genlayer.com/tx/0xb0a2d88efde87ee7a7f624fabaa0fdaceda87501d5286843f6a7deaca62fef70), [0x76c090de...d11644](https://explorer-studio.genlayer.com/tx/0x76c090de81263b8d26d36d9f19c3b9d49f41ba7bf759a5cee198961f41d11644), [0xd7248945...61ddc7](https://explorer-studio.genlayer.com/tx/0xd72489451a24126249ba1669eadd5ac358300f512c796f4f1d78a77eba61ddc7) | Finalization [0x447aeffa...67726d](https://explorer-studio.genlayer.com/tx/0x447aeffa88405950dafcc254d34513e6bf983228cfe55c27279f649de667726d) is finalized; get_room(2) preserves v1 and reports active v2 |
| 17 | B1/A1 | case 1 under frozen policy v1 | Open [0x54a0c192...b9876c](https://explorer-studio.genlayer.com/tx/0x54a0c192c9edd530aa608b80633799a372c5c11755ab38b5b4f17f78ecb9876c), defense [0xec78eb62...c17e6f](https://explorer-studio.genlayer.com/tx/0xec78eb628743def87a7be57eb6e843f8fb4e6b061fff062c106e03d493c17e6f), freeze [0xc7ca130d...208a9e](https://explorer-studio.genlayer.com/tx/0xc7ca130dbcbcfe8f4cc8353e4cf3e4d88da2e1c586c837d7868eda71eb208a9e), adjudication [0xa77c3095...027e36](https://explorer-studio.genlayer.com/tx/0xa77c30955ec897501a7ec44fa26b1e7c57d743d8282ea16ff9d3afce18027e36) | Frozen digest b728c50b035fbbc08aa30c5ba17961317d09edd9156e224d815ee43eb957beec; leader finding NO_VIOLATION; case DECIDED; post 2 VISIBLE; restriction false |
| 18 | A2/B1 | case 2 and initial adjudication | Post 4 [0x3d2898cd...c088fb](https://explorer-studio.genlayer.com/tx/0x3d2898cd1fb0e55aaaaa86847da533afb30b4f6e22410be4d8fabd0b0c088fb2), open [0x8ff4c7ae...0fef79](https://explorer-studio.genlayer.com/tx/0x8ff4c7ae03d3193706d7f26d75f9848804a2e42e08d07b72f89aa35260fef79e), defense [0x67edeb23...bfee1b](https://explorer-studio.genlayer.com/tx/0x67edeb23471fb87c485c1191e52b0f6178da31821efc03b463cebab4a3bfee1b), freeze [0x37678a90...8aa30b](https://explorer-studio.genlayer.com/tx/0x37678a9096be94a9f84a49faefda1899bd159a4bccde88b014b2d2ed728aa30b), adjudication [0x9728d7d6...ab430a](https://explorer-studio.genlayer.com/tx/0x9728d7d63da3581e25bd98f36dec88fbe805fd21938170a3bcb4933531ab430a) | Frozen digest feb6c05ca00acb1cf10500207f634efb7635d829979baeee338b24806f94347c; leader finding MINOR_BREACH; post 4 HIDDEN |
| 19 | A2/B1 | application appeal for case 2 | Appeal [0x48c94705...6ec2ed](https://explorer-studio.genlayer.com/tx/0x48c94705d04a291115b50ab11752791f00f871ba82853b0b7898155a536ec2ed), response [0xaf7e51fc...e135](https://explorer-studio.genlayer.com/tx/0xaf7e51fca73246d23b032df99fbfb2e34950e36183356338b6b19554de73e135), freeze [0x66814d9f...6fa3b](https://explorer-studio.genlayer.com/tx/0x66814d9f588e88d774dc2ea48ecbf5d01aee9c0bd0e92cee2e22ddc9fd56fa3b), adjudication [0xfff2420f...b9c8](https://explorer-studio.genlayer.com/tx/0xfff2420f608f2fd20542e90f55fd72622ade49e5c627f11fbda247daafd9b2c8) | Appeal digest d78ccc83a465c6c146ba253122d60285505973f7829333f3bef3d6844a80c188; appellate finding MINOR_BREACH; case CLOSED; original decision preserved |

## Genuine semantic-consensus observations

The case adjudication receipts are not merely finality receipts:

* Case 1 transaction 0xa77c30955ec897501a7ec44fa26b1e7c57d743d8282ea16ff9d3afce18027e36 finalized with result MAJORITY_AGREE and leader SUCCESS. The observable leader structured result was NO_VIOLATION with clause EVIDENCE-01 and an exact anchor from post 2. Validator vote metadata was AGREE, DISAGREE, AGREE, AGREE, IDLE.
* Case 2 transaction 0x9728d7d63da3581e25bd98f36dec88fbe805fd21938170a3bcb4933531ab430a finalized with leader MINOR_BREACH for PROMO-02. Validator vote metadata was AGREE, DISAGREE, DISAGREE, AGREE, AGREE. The post became HIDDEN.
* Appeal transaction 0xfff2420f608f2fd20542e90f55fd72622ade49e5c627f11fbda247daafd9b2c8 finalized with an independently generated MINOR_BREACH result. Validator vote metadata was IDLE, AGREE, AGREE, AGREE, IDLE. The appellate result was stored separately, while original_finding and original_decision remained unchanged.

StudioNet exposes validator vote/status metadata and leader equivalence output for these transactions, but not every validator's private prompt or reasoning. No private validator trace or individual hidden rationale is claimed. Direct Mode remains the controlled source for adversarial disagreement tests.

## Negative live controls

| Control | Transaction | Observed finalized behavior |
| --- | --- | --- |
| Initial room proposal without bilateral approvals | [0xca0c1564...9def21](https://explorer-studio.genlayer.com/tx/0xca0c156490cbd605c42f5656b7dd36bbd4c4feb82ab46a2e1042a4130a9def21) | Finalized successful finalizer call; room 1 readback is REJECTED |
| Outsider tries to publish in room 2 | [0xeb501914...54f2091](https://explorer-studio.genlayer.com/tx/0xeb5019140aa11cd47208380d98ec31c073ae1913989176b4ac9fad45954f2091) | FINALIZED, leader ERROR, rollback reason room membership required |
| Invalid clause reference | [0x7445a82d...02b5293](https://explorer-studio.genlayer.com/tx/0x7445a82d2a9d5c9ed3743149a5dc3c31c2d74dd75c4782a139e737e8302b5293) | FINALIZED, leader ERROR, rollback reason unknown clause |
| Late appeal by reporter after case 1 appeal window | [0x2069d543...aaee78](https://explorer-studio.genlayer.com/tx/0x2069d543fbe6a8a503b0b1c2c96b38a4f870e764d89469c76f3460e310aaee78) | FINALIZED, leader ERROR, rollback reason appeal not available |
| Late admission ballot | [0x72366de7...a6c53](https://explorer-studio.genlayer.com/tx/0x72366de79b085c8678c066bc3cb4722ba69030fe23028d538d36fab9318a6c53) | FINALIZED, leader ERROR, rollback reason not eligible |
| CLI address coercion diagnostic | [0xe5878c2e...3e9ed](https://explorer-studio.genlayer.com/tx/0xe5878c2ef5d8eb4b154524220c02338aa8bc57307d474f97b15376e92363e9ed) | FINALIZED, leader ERROR, invalid wallet; no state change. A second reproduction was 0x792d13e9d4733d006dc4b1ba2ba6d353e534c8439546653a680e1f47f5d6066a |

The live CLI argument coercion issue is documented because it caused actual finalized failures. It was not bypassed by changing the contract or using a fake sender; the pinned SDK signing path passed the intended plain string arguments and all six real wallet identities remained distinct.

## Reproduction

Run the source checks from docs/TEST_PLAN.md. Use the public contract address and explorer links above for read-only verification. Never treat a UI screenshot, a pending transaction or a finality label alone as proof of successful execution.
