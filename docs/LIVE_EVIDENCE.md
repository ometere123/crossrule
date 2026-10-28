# CROSSRULE final hardening live evidence ledger

## Current corrected release — authoritative section

This section supersedes all older “current” blocks below. Older deployments, browser writes and lifecycle records remain historical evidence only.

| Field | Observed value |
| --- | --- |
| Network | GenLayer StudioNet, chain `61999` |
| RPC | `https://studio.genlayer.com/api` |
| CLI / SDK | repository-local `genlayer@0.39.1` / `genlayer-js@1.1.8` |
| Contract | [0x673aF6595dA79799D86A8C0467D51088d9C935d4](https://explorer-studio.genlayer.com/address/0x673aF6595dA79799D86A8C0467D51088d9C935d4) |
| Deployment transaction | [0x82a04058051e61992916349ccdfde96c24d703ac09d4e1c16fe5d0c3dfb9f820](https://explorer-studio.genlayer.com/tx/0x82a04058051e61992916349ccdfde96c24d703ac09d4e1c16fe5d0c3dfb9f820) |
| Deployment result | Raw StudioNet receipt: `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; validator metadata exposed `AGREE/IDLE` participation |
| Source commit | `12427cd5bd828fd6c8d9eb282fce797014d87934` |
| Repository source | 56,884 LF bytes; SHA-256 `d4506d35a81b79c44190b6b0e91401c83e640f4b32bea226531fd246332d1d04` |
| Decoded deployed source | 56,884 bytes; SHA-256 `d4506d35a81b79c44190b6b0e91401c83e640f4b32bea226531fd246332d1d04` |
| Exact parity | `byteEqual: true`, checked with `scripts/verify_deployed_source.mjs` via `gen_getContractCode` |
| Production frontend | [crossrule.vercel.app](https://crossrule.vercel.app), READY deployment [`dpl_9m4y5WSkEEF3RaZvm2RJ1JcsFZTP`](https://vercel.com/delealufejoel-4184s-projects/crossrule/9m4y5WSkEEF3RaZvm2RJ1JcsFZTP) |

### Fresh six-wallet lifecycle

The six CLI identities were distinct and their encrypted keystores remain preserved. The deployment and lifecycle used the pinned SDK signer; the CLI's address-argument coercion was separately retained as failed diagnostic evidence.

| Stage | Finalized transaction(s) | Readback / result |
| --- | --- | --- |
| A founding | create `0x8f5691f080a3a3095c3e0e3c5bfef5f063000e73ce1b87f9f52c6e8e63eab9b9`; A2 `0x5eb741e11c5613d3e3091e906080fa0886dc622be148c0bb46dc0016bba60619`; A3 `0xe927ce58bc6c24ea9725662331f46a99ca9819b359713d473894f719ddcae3bc` | Community 1 `ACTIVE`, three founders plus the later admitted applicant |
| B founding | create `0x4d048a30d07aa5b19aff10cdc0561ca9d5cdc04679fa6ee897c5b5709d678e04`; B2 `0x4d6ca98c1f734a0ead1a4593c32c63c57cd043be452f00ef5470808ea6281965`; B3 `0x4430ecfb21ac09e9d6fbb0d6a2d3ec98a0a02424933bdd07ad8a84bb9fecb784` | Community 2 `ACTIVE`, three distinct founders |
| Admission | proposal `0x7835ed89a6095589c402c1aac28d6856eb79aa5f8c631a466ad4ecb34baaeb84`; applicant `0xf8380a6633a4c323b61c6cfa0b4b6dd0e0af93aed5189437e8df606e97a0e6d1`; votes `0x3d0149300d68e47970fcb18fa84dd82006462fe21b86cafe63a1c711f38f4c736`, `0x23fca68c0c926a419b34c11172f22aaae68fe53c776aa8554b5d5bf46a8f1fe44`; finalize `0xed3c154630e875c3032eb54551f6e04624da39069be216dfb5d33af0b46c57ae9` | Applicant consent was wallet-bound; frozen roster was three and threshold two |
| Charter boundary | expired/non-passing vote finalizer `0xe0ec50959c0e055688270e8410637571cd7e706a3cf111d218738a466a811795` | The four-member follow-up needed three approvals and was correctly not treated as passed; the final live state preserves the original charter. |
| Bilateral room | proposal `0xbc331ac52ab8a16cf83931e0c26e0780aec60e86c85601a3d97c8c5a9a514e88`; B1 consent `0xbbd41ff3aa16237987417bbce3406d82a333da57f52b60b1c082882e01f3ba2d`; A votes `0xc00813b6cbe91ee61cc03d6fc16202da8ef767a2c06fc9be500ab0ac0effe470`, `0xb4ac07d79ee271b749031794fe1f146e154026db5ea01d6ffb1811c42b4e8725`, `0x064bc0c949c6949c261bbec3cb90f75df6d93023aae371bd8d47175fe518868f`; B votes `0x541320bceb2469793991e0026d122294baa71b8a536779d7590c29c9b1a01368`, `0xfb47cc7bc14f9ab71610aa2fa710e81e01510a4fa6cabbacf7a1c938fc38e5dd`; finalize `0x5c5790e4737ec2c865b7d985e379bc0642ec630f6091971f7d14931866cc6694` | Independent A/B thresholds; room 1 `ACTIVE` |
| Posts and feature governance | post `0xf1b3fafc1984afc7459d1a23b7a444bdddef0121f936c6c941f82ff83d862997`; reply `0xa3470344c2f8ba2146c1c8a92da1e8c858cede882d08efab0f4df062f8c94284`; feature proposal `0x843d289d47e36d290e18beab41b2a0de41e8553f9f3954c24fe5c2e26048c96d`, finalize `0x5121f8a2146ae635eaab8b21595c835de6b4257621c9264bca2e59306ed26538`; unfeature proposal `0xa2e191cc094cc46620c6b303b07cda648d08ad92135b04b1429f2f2e2a0109b9`, finalize `0x1472d231b013e6e70a96a05f89acd40424e3a6903a2a78484cdbe23b79b862bc` | Post/reply read back; feature was approved and later removed; final `featured_post=0` |
| Policy amendment | proposal `0x1194e092a13edfeb6cc407e50f88026c4dca57d739616c703bc8b22325cb1bf0`; parallel votes `0xa8f824123a87534ef41f2db1a56e1af5484c0c2180df3021ef4aafd2a33ae474`, `0x9f3cbb5b1bca0c8c62cdcb0bba336b1856282be845af433f86ad9d00304d1b7e`, `0x10bc6f9533c85f5720ec003c4737efb2fc30364fd511e0a0ffcd33b8ad1b4452`, `0x1b4f19c4cc8b22ab7d3b248d684edc9a51654440cf8cff9b2ca318b4602de9ad`, `0xd887d6dd879b96f76d07aef5319ba705e4a54fa429e7e21f1af45084ce49c723`; finalize `0xc552d8417faa15aede5d92f1aa6207188469bd662b82f788362d00ee08c26221` | Policy v1 preserved; policy v2 became active before cases 1–2 were published |
| Case 1 | open `0x9fd727dd88fad4b8ca688912be01d4f454b9bc0cf8cfa55c366310969f1068b6`; defense `0x3df896a72f04ef176ef683ce447aa67ebf4e3d580793463b0a4e7ffbf318bc91`; freeze `0x1bedd52edada08c2470ba76822763f0b2d977b3c5ba7273d66b8929397184709`; adjudicate `0xceb8753f53c3d57da35f40df666f8a07173337a35564682e260819d5e5624f17`; close `0x690cbf1a20e52f8573356d0330b44e04d9b5716991d38f3c82dde83638cefc64` | Digest `f1a9ac10ee114d154e1de7c3602084817a9b3eb70fc3ae84d574a87930870a0d`; finalized `NO_VIOLATION`; post 3 visible; case closed |
| Case 2 + appeal | open `0xb1051934f93d4211630ae4f910c9966a135e8cf185ccf24464c18833dcda4bc3`; defense `0xe6679c5572500a78927a4ae66fb535d6a8082e86a196be57236bb5cf0b521eee`; freeze `0xce773efca679487bca45b2997b82f026a10ffc70da9c6f8c58d94e84ac437486`; adjudicate `0x1367998639ea9132a94ab969b10b8fab99b55e9a7ce7035b15fe224a2727267d`; appeal `0xdb7beeb1ba7303a032027da22371fc81b797f866bb6db95ca55d789fb6393f36`; response `0x3c8a532d7a24f22ff4a59339d1ecf2699fb5e566b100dc140718769c9edeacd1`; freeze `0x48abbb852694c233e18056dc063a5d9dda4e44f272a6bc781068587d01d54527`; appellate adjudication `0xe9ed5563c036eb601764fa7f99f6b0f7942e4050933b3a09ec25ea31a43df21d` | Original digest `0c02469f4bd749dc86f33f713e4f48ed60bc2db140cd7cefeb54be2b2bcf5d75`; appeal digest `8221bdf85fa3f25a88d830239e90ea2596d4c099a55f715eeb70b99805172ba2`; original and appellate `MINOR_BREACH`; post 4 remains hidden; case closed |
| Negative controls | outsider publish `0x4e70e108cbf6fa9ed0952ec4c54c6a8817e2a069feb4ba36194952c3a14106bc`; duplicate-clause challenge `0xa25b4dc9f1424885a7d7217ba9ba438c224767fcf8fa400a888ad1b0b03e7d5f`; earlier CLI argument-coercion failures `0xbd9bce78957195ea58db291f46b0faeef9d1c51465b4552dabe92bd67185e0f6`, `0x14723ca12a4b58212bc8678e95927ee2026aa093f6c45a85ff36c1fee4842305` | Finalized majority-agree rollback receipts with leader `ERROR`; no unauthorized state mutation |

### Final readback

The current corrected contract returns `get_counts = {communities:2, rooms:1, posts:4, cases:2}`. Community 1 is active with four members after the consented admission; community 2 is active with three members. Room 1 is active, preserves policy versions 1 and 2, and has `featured_post=0`. Case 1 is `CLOSED/NO_VIOLATION`; case 2 is `CLOSED/MINOR_BREACH` after an independently adjudicated appeal. Post 3 remains visible, post 4 remains hidden, and no restriction is active because the finding was minor. The six encrypted CLI keystores remain preserved.

### Current browser-wallet limitation

The prior browser-signed registration belongs to a superseded deployment and remains historical only. A fresh injected-wallet write against this corrected address was prepared but could not be completed through the current Convert Chrome automation session: the selected tab was not claimable by the UI bridge, which stopped before any wallet prompt or signature. No browser signature is claimed for the corrected address. CLI lifecycle evidence above is genuine and separate from mocked browser tests.

This top section is the current release record. Earlier sections below are retained and explicitly labelled historical/superseded; they must not be used as evidence for the current address.

## Current source-matched StudioNet deployment

| Field | Observed value |
| --- | --- |
| Network | GenLayer StudioNet, chain `61999` |
| RPC | `https://studio.genlayer.com/api` |
| CLI / SDK | repository-local `genlayer@0.39.1` / `genlayer-js@1.1.8` |
| Contract | [0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab](https://explorer-studio.genlayer.com/address/0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab) |
| Deployment wallet | PRAEST / `0x0d5540e0ad4b92aa0ad4e5f1b8cd645ee1e363e7` |
| Deployment transaction | [0x8fb258e9a5caf28d10166cf6c5922c9ba39bc8a698a535cfcd622d741f9c2468](https://explorer-studio.genlayer.com/tx/0x8fb258e9a5caf28d10166cf6c5922c9ba39bc8a698a535cfcd622d741f9c2468) |
| Deployment result | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; validator metadata exposed `AGREE` votes |
| Deployment timestamp | `2026-10-28T07:14:28.029832+00:00` |
| Contract-source commit | `21e5af60ac116b31a7d6fa53034a85303f28cecf` |
| Repository source | 49,865 LF bytes; SHA-256 `8d4ea453bcb15aafff493f9d8ae2de186bd9482b10635857fc0ff8585f3b21b2` |
| Decoded deployed source | 49,865 bytes; SHA-256 `8d4ea453bcb15aafff493f9d8ae2de186bd9482b10635857fc0ff8585f3b21b2` |
| Exact parity | `byteEqual: true`, verified by `scripts/verify_deployed_source.mjs` using `gen_getContractCode` |
| GitHub CI | [9/9 jobs successful](https://github.com/ometere123/crossrule/actions/runs/40684788894) at code-bearing release commit `487faeffca20c2e2c139274eee473245023ae809` |
| Frontend | [https://crossrule.vercel.app](https://crossrule.vercel.app), READY production deployment [`dpl_9ZVwixDHKntpaEYQJ4C7HkAD5jRJ`](https://vercel.com/delealufejoel-4184s-projects/crossrule/9ZVwixDHKntpaEYQJ4C7HkAD5jRJ), built from local release commit `1a963f027323b10ea363595138156a0dce952768` |

The exact parity command was:

```text
node scripts/verify_deployed_source.mjs contracts/Crossrule.py 0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab https://studio.genlayer.com/api
```

Immediate deployment reads were `get_counts = {communities:0, rooms:0, posts:0, cases:0}` and empty community, room and case lists. The source remained unchanged after deployment; the final repository source hash is still the value above.

## Six signing identities

The six encrypted CLI keystores remain preserved locally and were not imported into the browser. No secret material is recorded.

| Role | CLI alias | Public address |
| --- | --- | --- |
| A1 | `party_a` | `0xac3ac69dc0bde389256dd6748c75817ead9286d9` |
| A2 | `walletA` | `0x951e6b75530774ff82321a5ae54e14f778f0c855` |
| A3 | `walletB` | `0xb845a69860ba4cdf19cfdc5afbaf2e20b6be86b0` |
| B1 | `conveyance-deployer` | `0x21892bba93381d94037fb4aab01cafbdf4453b56` |
| B2 | `slash-owner` | `0x9dce0dc7005d6b92e03c27640081096cd36dd468` |
| B3 | `termsmet-studionet-submitter` | `0xb5ecd6dda36b370aca4af5e2005d8e2ae89c6db2` |

The extra admission applicant was `party_b`, `0xa7eeae0e93793e3146cb14b0700251b8b0ebadfb`.

## Current browser-wallet verification

The Convert Chrome profile used the injected EIP-1193 wallet at `0x7e2a8d765e0e346C451109eb42D92f61FBdbfd4b` to submit `create_community` against the current contract. The synthetic public record `Browser Wallet Verification` was finalized with successful contract execution: [transaction `0x6bde462e5ef93055abb096ddb3dd1453b9bb38138883eed46baa54284a950c0c`](https://explorer-studio.genlayer.com/tx/0x6bde462e5ef93055abb096ddb3dd1453b9bb38138883eed46baa54284a950c0c). The production UI read back community 4 in `FOUNDING` state with the supplied founder B/C addresses; the two required founder consents remain outstanding. No CLI key was imported into the browser.

## Fresh lifecycle on the current contract

All successful rows below were signed by the named CLI identity, finalized on StudioNet, classified from the authoritative receipt and checked against contract readback. Finalized rollback receipts are retained as negative evidence and are not described as rejected signatures.

| Stage | Finalized transaction evidence | Verified result |
| --- | --- | --- |
| Community A, `Builders Collective` | create [`0xe652bf52…b934d3aa`](https://explorer-studio.genlayer.com/tx/0xe652bf52f209081b6bf0c436df67b2cf306e7b727182e084749ece18b934d3aa); A2 [`0x6be5c1df…d86f538`](https://explorer-studio.genlayer.com/tx/0x6be5c1df7144f44583f97a7e29c7fa8604f614269f1f84ef1eccd5f70d86f538); A3 [`0x0cb853c5…980a0dd`](https://explorer-studio.genlayer.com/tx/0x0cb853c556dec9b3d5ee1de41f3ce9d2551b81fbd0fbf073a31b10ace980a0dd) | Community 1 `ACTIVE`; three distinct founders |
| Community B, `Research Forum` | create [`0xcc965a07…876e40ac`](https://explorer-studio.genlayer.com/tx/0xcc965a07497c713404fdb7f85479e27fa673d4789777a88308ad33fe876e40ac); B2 [`0xaeffed6e…b34dd52`](https://explorer-studio.genlayer.com/tx/0xaeffed6e0fb5c522ebf5ac2288cdb23128457b268d01cc89c964443ccb34dd52); B3 [`0xc0f3a7d0…5c867f8`](https://explorer-studio.genlayer.com/tx/0xc0f3a7d0fea1da820b8acb49ab4fab5ca042327d6097f8c7fdb63f08b5c867f8) | Community 2 `ACTIVE`; three distinct founders |
| Community C, `Evidence Lab` | create [`0x23a47596…d5721`](https://explorer-studio.genlayer.com/tx/0x23a47596b72bccf00a6320b8a9191578eef52122d9fc021a6731155bcd3d5721); A2 [`0x0abcd728…096f3`](https://explorer-studio.genlayer.com/tx/0x0abcd728b2af36ed1887d0ba4f5af0e476eb7d086a8f98280b2418b5645096f3); A3 [`0x377530b0…109a9d`](https://explorer-studio.genlayer.com/tx/0x377530b07935a10cb7c9c3e114c7adb915c6eb1620626f4b2cc0a12f97109a9d) | Community 3 `ACTIVE`; used for current-roster admission/index coverage |
| Admission and charter | proposal [`0xba5c0b88…fb9e5ad`](https://explorer-studio.genlayer.com/tx/0xba5c0b8896117a0265521871d9746f5dc67763ff6b0173a30e162d5acfb9e5ad); applicant [`0xf7977c2c…1eb0fc5`](https://explorer-studio.genlayer.com/tx/0xf7977c2caa1153411911a0244fc2b46c7fed08cc14e9436cacf3eba61eb0fc5); votes [`0xc2bcc267…b9ecc19`](https://explorer-studio.genlayer.com/tx/0xc2bcc26733b50fbad5fe42da14a554996c70c38289816e0e16f174a84b9ecc19), [`0x6c4d8a55…a1afaa3`](https://explorer-studio.genlayer.com/tx/0x6c4d8a5514847ce4b6006aae07c1251a8ac5c2bd6b1da49573fc2772da1afaa3), finalize [`0x99d2e997…a78f262`](https://explorer-studio.genlayer.com/tx/0x99d2e9978cefcf84a30c8336e2d67c6811d1a9d68a13b539df2d3f907a78f262); charter proposal [`0x0176a54d…101879`](https://explorer-studio.genlayer.com/tx/0x0176a54d7a89918b4a7e0d220adf7deafe646cfe7fc28baafe372cc622101879), finalize [`0x7330241a…adf297`](https://explorer-studio.genlayer.com/tx/0x7330241ae93d84155f138feeac390350b4638f61273355ed4c132cf1bcadf297) | Admission roster was frozen at 3, threshold 2; community 3 readback has 4 members and charter history |
| Room formation | proposal [`0x8f8578ef…f2b83d`](https://explorer-studio.genlayer.com/tx/0x8f8578efd217d537155f5d894d7ee3d00361ef1fcfc9abbaf1024e6203f2b83d); counterpart consent [`0xd543ed3f…729004`](https://explorer-studio.genlayer.com/tx/0xd543ed3fc1c0d63ccb56921b5b2c2128ea3bb252bb183ab90e8252f600729004) | Evidence Lab/Research Forum room 1 became `ACTIVE`; independent rosters and thresholds read back |
| Feature / unfeature | feature proposal [`0xe66c0a8c…74e4ac6`](https://explorer-studio.genlayer.com/tx/0xe66c0a8c223b60d29f82fa9abc522c1962f6cdba279a54a2ad5a99dba74e4ac6), finalize [`0x4d851c29…7eee9a`](https://explorer-studio.genlayer.com/tx/0x4d851c296bef735a52884f59c8af8e7b5b95a95e9532c4b8110348d3a77eee9a); unfeature proposal [`0xab10d3e9…3dde90a`](https://explorer-studio.genlayer.com/tx/0xab10d3e92936a9cbcb83e964fe5b5dafca19506cbbbb99b12ef1809eb3dde90a), finalize [`0x3fb61419…6ffc44`](https://explorer-studio.genlayer.com/tx/0x3fb614191c8a1ea84641121cb76d6cd3c44f202bd8e41c63b9c370e5916ffc44) | `featured_post` readback `0 → 1 → 0`; restoration does not silently re-feature |
| Policy amendments | v2 proposal [`0x3dda0a9b…dd414bf`](https://explorer-studio.genlayer.com/tx/0x3dda0a9b052be9d9e4e166d8910bae34e1ef19b253c5d9c8c2bcd8fc3dd414bf), consent [`0xd15854b0…cd0f5d7`](https://explorer-studio.genlayer.com/tx/0xd15854b03317b7f15c6e75ef429b60f6f6504e76d8fa160d3f1766a4fcd0f5d7), finalize [`0xc87494b8…dd24ea`](https://explorer-studio.genlayer.com/tx/0xc87494b8618a0b51b90581c9c2da69dc16f1b5bdc2b76ac51b5f2f32b6dd24ea); v3 proposal [`0x8099a73f…7c652f`](https://explorer-studio.genlayer.com/tx/0x8099a73f7e5e3fb28ef140f340096de55671471fe61cfc710d988e556a7c652f), consent [`0x14f43c16…3a107be`](https://explorer-studio.genlayer.com/tx/0x14f43c16aecf89fa1867a17c5a0a117ddc1b66f8e51b0c3d069dc6d923a107be), finalize [`0xb03da347…53dc7aa`](https://explorer-studio.genlayer.com/tx/0xb03da347978e8bbec4ba043f28c18e8ad6429d951d03d5d0d763300e553dc7aa) | Version 1 remains preserved; v3 is active and includes a 10-minute appeal window |
| Case 1, policy v1 | open [`0xb6dd96f8…b2dff7`](https://explorer-studio.genlayer.com/tx/0xb6dd96f8d2a8fa421a908fb10258f29b69399fa6742f10ed04cfc17c6bb2dff7), defense [`0xac15e264…eda3c25`](https://explorer-studio.genlayer.com/tx/0xac15e264a51c79ff3a9bbc20609860a9f347363f37429f2c3c8e47e86eda3c25), freeze [`0x5eba0a6a…e447742`](https://explorer-studio.genlayer.com/tx/0x5eba0a6a79bb64d4013628f4c381aa56c37165b2cdb6e13c58728f802e447742), adjudicate [`0xfc183221…75633c`](https://explorer-studio.genlayer.com/tx/0xfc18322156b56f836c25ee0d0cabe030ecff7171e4b77cdbdd311ed32475633c), close [`0x4d3d3745…878c8a`](https://explorer-studio.genlayer.com/tx/0x4d3d3745ddf43a9c7113d6f7861c59ca8bcd5413fb0464646e1db19b47878c8a) | Digest `4ff62353948e9dbf395ace111a1305ac5a47686946d14f3fe4ef7cfb26d97003`; `NO_VIOLATION`; post remains visible; case closed |
| Case 2, policy v2 | post [`0x740bde6f…9a88453`](https://explorer-studio.genlayer.com/tx/0x740bde6fb5f69855ed4644f68470b86f8decae643cfbc2320eb340c339a88453), open [`0xc8cecff8…0d93378`](https://explorer-studio.genlayer.com/tx/0xc8cecff87af53a04b0ebca7e2e581e20dc3897c345c69501788f15f480d93378), defense [`0x33a25b82…938bc16f`](https://explorer-studio.genlayer.com/tx/0x33a25b82836eac5b06eee078975527b5b9286542ccc75e23e0fba668938bc16f), freeze [`0xa32fb73e…d6c0d1d`](https://explorer-studio.genlayer.com/tx/0xa32fb73e123ea40b6ec8e10b7115f62851e015a3ccf939eeccdcdb669d6c0d1d), adjudicate [`0x654c73cc…5009cb4`](https://explorer-studio.genlayer.com/tx/0x654c73cce17861e5c0a5abc95fed75b999765754c24e0800f7fbec7915009cb4) | Digest `7aca3638f4635de89969c2499726240dd8cc8f2ae98c603f6a28006b97b24142`; `SERIOUS_BREACH`; post hidden; room-specific restriction until `1793183958` |
| Case 3, policy v2 + appeal | post [`0xbc6c7f17…1b956`](https://explorer-studio.genlayer.com/tx/0xbc6c7f17b4e691261564f15c2363126979d1dc13ef3294f1029282641b61b956), open [`0x7bfbe3c9…1b40f4`](https://explorer-studio.genlayer.com/tx/0x7bfbe3c918f7dda3ffbbe0be2617d766c83e111f55daa26934a39bb5691b40f4), freeze [`0xe637e1c5…63589a2`](https://explorer-studio.genlayer.com/tx/0xe637e1c5dc7234c83bc49657222d89bb45132deaf4ee4029287949e1063589a2), adjudicate [`0x40506c72…5d9e2c6d`](https://explorer-studio.genlayer.com/tx/0x40506c72c39910771da592cff459e788529362f8afd5e346dc64b9175d9e2c6d), appeal [`0x9c5c84ef…b5b27d`](https://explorer-studio.genlayer.com/tx/0x9c5c84efb0ffba71725273e6822ca338b1001f7a201e878c0df61c92b6b5b27d), freeze appeal [`0xfb5f8d63…5187cc0`](https://explorer-studio.genlayer.com/tx/0xfb5f8d63701b31c70c5bfaa8eb74c810c0d021a36928bc3e761d286555187cc0), adjudicate appeal [`0x9e82ce39…8a95ff`](https://explorer-studio.genlayer.com/tx/0x9e82ce392e4f83e7a5d076a82c96170130cdce060ccce3e8039ccab38c8a95ff) | Digest `38bd1ad80e46bb963f10ba563b64c1eb15b42402b99a7d1e620db1fccb8a6c81`; initial/appellate `SERIOUS_BREACH`; late response rollback [`0x694ed48a…165055`](https://explorer-studio.genlayer.com/tx/0x694ed48a20190a0cebba2002b69e56f33fe2268d3e0d6b87602c028207165055); restriction later expired |
| Case 4, policy v3 + upheld appeal | post [`0x5f8ce43c…fb8d1b`](https://explorer-studio.genlayer.com/tx/0x5f8ce43c782cb22a7f3a522ca63d9e6f6cb88c86a4a0d733d6d7bfe422fb8d1b), open [`0xe28655f0…fbf79c0`](https://explorer-studio.genlayer.com/tx/0xe28655f06d3ee5b3131b71b466721794d15d6f8fb347a4e0d4c574f53fbf79c0), defense [`0x23509e92…c0216b`](https://explorer-studio.genlayer.com/tx/0x23509e928a8c15720fdc9b1b8f790368cd965d5e1a8a736b7b00676e91c0216b), freeze [`0xe50ecbfc…f3095a`](https://explorer-studio.genlayer.com/tx/0xe50ecbfc175dfce2658b9bb3bc11f15cde260f43e078d1396259b976c3f3095a), adjudicate [`0x37b5608a…eeb050`](https://explorer-studio.genlayer.com/tx/0x37b5608adc456b185e8515ffd5bb49c96a6e7d7d7031968aa9a45e0dc2eeb050), appeal [`0xcae81558…2a869`](https://explorer-studio.genlayer.com/tx/0xcae81558ee59bd7027010fb7b12d0661aaecbb505538c137d9e616bc2226a869), response [`0xc6f257ef…ba98d3`](https://explorer-studio.genlayer.com/tx/0xc6f257ef5172b067f163db1354b60cb2c0bf0d9c72e7d98ce025a0406fba98d3), freeze appeal [`0xe5152911…e388f`](https://explorer-studio.genlayer.com/tx/0xe5152911137b06bfccd7ebfbca4ccc8a205676aa1cb4940ae9f1440bb81e388f), adjudicate appeal [`0x52af3759…51a90`](https://explorer-studio.genlayer.com/tx/0x52af375972cdf6bdc3c0708626683d4b41fc442612de87e958ad8bb620751a90) | Digest `ecbd420a055680f7e30fe6a1741cc93f4d78fd9e7701271e84a381778d879d0e`; appeal digest `4e2506f6c7056aae595027c8dcf4f77118612e92ddcfd76b49d5a727833dcc68`; original/appellate `SERIOUS_BREACH`; restriction expiry remained `1793186680` (no restart) |
| Negative controls | outsider publication [`0x387cff63…8aebebb`](https://explorer-studio.genlayer.com/tx/0x387cff637f9e5c1003353c274b57270724eb173b743e6973acec7e2588aebebb); unauthorized/empty vote [`0x502fc8a8…f341b5b`](https://explorer-studio.genlayer.com/tx/0x502fc8a891ca5c7c212e0857b8bd820a95eadc32902419a3f6e418a61f341b5b); duplicate clause [`0x1b018d08…db0bf3`](https://explorer-studio.genlayer.com/tx/0x1b018d087137a29cba361f248c1b12a793df7541a7454a60171eac1eefdb0bf3); unauthorized appeal [`0x56c10a75…f2c485`](https://explorer-studio.genlayer.com/tx/0x56c10a75dad193355135c5f96e2637774ee9418118548bf153a9d11c96f2c485) | Finalized receipts had leader `ERROR` rollbacks; no unauthorized state changes; counts remained stable |

## Final authoritative readback

At the final current-contract read, `get_counts` returned `{"communities":4,"rooms":1,"posts":6,"cases":4}`. Communities 1–3 are active; community 4 is the browser-created `FOUNDING` record. Room 1 was `ACTIVE`, policy version 3, with versions 1–3 preserved and no featured post. Post 1 remained `VISIBLE` under publication-time policy v1 with one challenge; post 4 was hidden under serious case 2; post 5 was hidden under appealed serious case 3 with its restriction expired; post 6 was hidden under case 4 with the original/appellate serious findings preserved and its original restriction expiry unchanged. Case 1 was `CLOSED/NO_VIOLATION`; cases 2–4 were terminal and their evidence/digests remained readable.

## Observable semantic-consensus evidence

The live adjudication receipts exposed finalized `MAJORITY_AGREE` outcomes, leader structured results and validator status/vote metadata. Case 1 exposed `AGREE, AGREE, IDLE, IDLE, AGREE` and `NO_VIOLATION`. Case 2 exposed `AGREE, AGREE, IDLE, IDLE, AGREE` and `SERIOUS_BREACH`. Case 3 exposed `IDLE, AGREE, DISAGREE, AGREE, AGREE` on the appellate reassessment and retained a serious final finding. Case 4 exposed `IDLE, AGREE, AGREE, AGREE, IDLE` on the appellate reassessment and retained a serious final finding. These records demonstrate observable validator participation; StudioNet does not expose every validator's private prompt or reasoning, so none is claimed here. Direct Mode remains the controlled proof for malformed output, prompt injection, irrelevant/fabricated anchors, unsupported severity and disagreement rejection.

## Historical deployment ledgers

The earlier sections are preserved for audit history, including the historical CRLF deployment, earlier contract addresses and the earlier browser-wallet transaction. They are explicitly superseded and must not be substituted for the current address or current source-parity record.

## Superseded previous hardened deployment and lifecycle

This is the final corrected deployment record. It supersedes the older deployment and browser-registration sections below, which remain in this file only as historical evidence. The corrected contract source is commit 4b5f8ea16722c713c2163219c044f000e02b743e.

### Deployment provenance

| Field | Observed value |
| --- | --- |
| Network | GenLayer StudioNet |
| Chain ID | 61999 (0xf22f) |
| RPC | https://studio.genlayer.com/api |
| CLI / SDK | repository-local genlayer 0.39.1 / genlayer-js 1.1.8 |
| Contract | [0xB7c1C9A4f87BC77Df32D28DA5487bf45f2AAa608](https://explorer-studio.genlayer.com/address/0xB7c1C9A4f87BC77Df32D28DA5487bf45f2AAa608) |
| Deployment signer | praest-deployer / 0x0d5540e0ad4b92aa0ad4e5f1b8cd645ee1e363e7 |
| Deployment transaction | [0x6896ffebe39d2f37fbe7d1d1cbfc7a493a9ee3be1fd5552120ed07e03a7db6c0](https://explorer-studio.genlayer.com/tx/0x6896ffebe39d2f37fbe7d1d1cbfc7a493a9ee3be1fd5552120ed07e03a7db6c0) |
| Deployment timestamp | 2026-10-27T21:44:36.204911+00:00 |
| Deployment result | FINALIZED, MAJORITY_AGREE, leader SUCCESS |
| Git commit | 4b5f8ea16722c713c2163219c044f000e02b743e |
| Contract source | 47,060 LF bytes; SHA-256 2d3cb381d73ef3ef4dad05ae49707c5ad4ee943190442269fc905c826bf2cb0b |
| Deployed source | 47,060 decoded bytes; SHA-256 2d3cb381d73ef3ef4dad05ae49707c5ad4ee943190442269fc905c826bf2cb0b |
| Exact parity | byteEqual: true, checked by scripts/verify_deployed_source.mjs with gen_getContractCode |
| CI for final pushed code | [run 40598385068](https://github.com/ometere123/crossrule/actions/runs/40598385068), success, 9/9 jobs |
| Production frontend | https://crossrule.vercel.app, READY deployment dpl_72LgnJ16xeF3eGiwpvdBXajxp19F; the public alias returned HTTP 200 and reads the corrected contract's live lifecycle state |

The deployed-source SHA is intentionally recorded twice only as a provenance check: the repository file and decoded StudioNet response are byte-for-byte equal. The exact verification command was:

    node scripts/verify_deployed_source.mjs contracts/Crossrule.py 0xB7c1C9A4f87BC77Df32D28DA5487bf45f2AAa608 https://studio.genlayer.com/api

Immediate deployment readbacks were get_counts = communities 0, rooms 0, posts 0, cases 0, with empty community, room and case lists.

### Six signing identities

All six encrypted CLI keystores were verified on StudioNet 61999, were distinct, and remain preserved. No private key, mnemonic or password is recorded.

| Role | CLI alias | Public address |
| --- | --- | --- |
| A1 | party_a | 0xac3ac69dc0bde389256dd6748c75817ead9286d9 |
| A2 | walletA | 0x951e6b75530774ff82321a5ae54e14f778f0c855 |
| A3 | walletB | 0xb845a69860ba4cdf19cfdc5afbaf2e20b6be86b0 |
| B1 | conveyance-deployer | 0x21892bba93381d94037fb4aab01cafbdf4453b56 |
| B2 | slash-owner | 0x9dce0dc7005d6b92e03c27640081096cd36dd468 |
| B3 | termsmet-studionet-submitter | 0xb5ecd6dda36b370aca4af5e2005d8e2ae89c6db2 |

The extra applicant was party_b, 0xa7eeae0e93793e3146cb14b0700251b8b0ebadfb. All encrypted keystores remain local and were not imported into the browser.

### Fresh corrected-contract lifecycle

Every transaction below was signed by the stated CLI identity, finalized on StudioNet, and checked against a contract readback. A rollback is retained as negative evidence; a finalized receipt is not described as successful execution when the leader result was ERROR.

| Stage | Transactions | Verified readback |
| --- | --- | --- |
| Community A | [create 0x607b5c4d...01260d](https://explorer-studio.genlayer.com/tx/0x607b5c4d3725c308628e96242b3d674a056f62db781c19fc9d4ac8427201260d), [A2 0xebb0da2e...50301a](https://explorer-studio.genlayer.com/tx/0xebb0da2e202de1e8ae4ec7aa14eaf25bb1cd7b91deb1e1a6011dfeea5e50301a), [A3 0xd9e060a7...c10d07](https://explorer-studio.genlayer.com/tx/0xd9e060a7956456a90b71a9784f2103748b2da59c15561bd5b21a5e5f74c10d07) | Builders Collective, community 1 ACTIVE with three distinct founders |
| Community B | [create 0x553492b1...0ed80b](https://explorer-studio.genlayer.com/tx/0x553492b1c030104b700cdd08ed066ab8aa85a254e547450455ac0ecd8b0ed80b), [B2 0xbc79e057...5dc79a](https://explorer-studio.genlayer.com/tx/0xbc79e057276d93697aebd993218cf268c678d581ecbb7a4d6eb3012ebc5dc79a), [B3 0x6a679db0...ac482](https://explorer-studio.genlayer.com/tx/0x6a679db01f77410b3c82c5ba1b6bb8dad1481e82b809fb74be2aacb6fa9ac482) | Research Forum, community 2 ACTIVE with three distinct founders |
| Admission | [proposal 0x85130e51...eff16f](https://explorer-studio.genlayer.com/tx/0x85130e51722d2215bb1412c50fd3249d201fdcac1a2077d971f9dff482eff16f), [applicant 0x4eebe2d7...8d49f](https://explorer-studio.genlayer.com/tx/0x4eebe2d7ba986cc17276b583113bc14559df4de4518b5dec48f03374c988d49f), [A1 0xa1ec9492...d7e6e1](https://explorer-studio.genlayer.com/tx/0xa1ec9492c0ffa49c3c2b1c2dd20c247c23ca01fa3b11e2ac28face6d5cd7e6e1), [A2 0x1746a7d0...649a02](https://explorer-studio.genlayer.com/tx/0x1746a7d0dfb59f5a5d619e35b34299cfcd3bb922f1d50bb7047b908e21649a02), [finalize 0xcf07e58d...75997](https://explorer-studio.genlayer.com/tx/0xcf07e58d76c7b994d3b357a5f03f9b1ad73de522594caca15d697e642ab75997) | Frozen roster was 3, so 2 approvals met the threshold; only then did community 1 contain 4 members |
| Charter | [proposal 0xf9fbf206...e0c880](https://explorer-studio.genlayer.com/tx/0xf9fbf2064abea27bd1a3c66c946240f515abc7f6ceb4b09a0450eebccde0c880), [A1 0x720bdaaa...d96793](https://explorer-studio.genlayer.com/tx/0x720bdaaa92142dc7838716da322ba8035c5c04331383aa30e88e7b993ad96793), [A2 0x28fbf0c9...1ea9edb](https://explorer-studio.genlayer.com/tx/0x28fbf0c93da59778382630af209c69fbd9f06d5501ff280a52c76bcd31ea9edb), [A3 0x88b27663...f62e9a](https://explorer-studio.genlayer.com/tx/0x88b27663aa50956bcaf4ee26772566e55a543536803852e0b907ebb5b2f62e9a), [finalize 0xf4f86881...52f58f](https://explorer-studio.genlayer.com/tx/0xf4f86881a0f478b8fbd8fc8bd2d331f419f1e93630e882d0a97dfbda5852f58f) | Charter history preserves v1 and v2 |
| Room proposal / expiry control | [proposal 0x3f7fe25c...8d67f](https://explorer-studio.genlayer.com/tx/0x3f7fe25c6dea85433d5a00b78bb26a510f6da6132b12477100c8f7798a68d67f), [counterpart 0xf3322cfa...03ba7](https://explorer-studio.genlayer.com/tx/0xf3322cfab2c6062c23908efdce24634934f977e8fbc3bfb28c9b9bbad4035ba7), [expire 0x356a146c...088c1c6](https://explorer-studio.genlayer.com/tx/0x356a146c830dceee9067bdbf2fceb295cd1aaef329fe381d56d0dda5a088c1c6) | Room 1 rejected after expiry; reservation cleanup released |
| Room 2 bilateral ratification | [proposal 0x10b6c1b2...b8bbf2](https://explorer-studio.genlayer.com/tx/0x10b6c1b2973f922beff0c24f9f260aac8e6ee1d085271758ce54ecffbbb8bbf2), [consent 0x0bf0400e...3c2912](https://explorer-studio.genlayer.com/tx/0x0bf0400eea76c1dc1810f7119f28c9db29f6b2cc550861fc1ae55cfa223c2912), [A1 0xe3e16604...36df9d0](https://explorer-studio.genlayer.com/tx/0xe3e16604d383fcb18f5676bd97ca7cb2533d7cfd51aafa06e89902da136df9d0), [A2 0x097565a0...3d5d0f3](https://explorer-studio.genlayer.com/tx/0x097565a095276f83a35d9f1d6628fbd7444f6c37ffa9423245a3daa953d5d0f3), [A3 0x0a1d1727...0566e1](https://explorer-studio.genlayer.com/tx/0x0a1d172737715c363fd1aae033d058124c7014c315d06e9528c78f1a970566e1), [B1 0x6dc235ea...44acee](https://explorer-studio.genlayer.com/tx/0x6dc235ea053fcc24dfbcb045ef1074a56468e0d417bcabcab3122eb20144acee), [B2 0x384a21ef...5c681](https://explorer-studio.genlayer.com/tx/0x384a21ef57b5ed2eaf1740da479afb28f0cb64d0ab892ae47facfb665095c681), [B3 0xab4c5c62...f8453](https://explorer-studio.genlayer.com/tx/0xab4c5c5b62d763e3dbd00c43df119a40cac557060517dbd279773cec3cff8453), [finalize 0xe4c809ba...7415ba](https://explorer-studio.genlayer.com/tx/0xe4c809ba3423a7834548c4f1505d2016edcbb2d319d05ec152474a7c287415ba) | Room 2 ACTIVE; independent thresholds were A 3/4 and B 3/3; policy v1 |
| Posts and reply | [post 1 0x98db56a1...b330b910](https://explorer-studio.genlayer.com/tx/0x98db56a19aa8fe0d8550f60090c9041ff6762345d111fad235b9bbcbf330b910), [reply 2 0x8375375b...26d33c](https://explorer-studio.genlayer.com/tx/0x8375375bd266639f60a5dd94de266d3b1e310139ee9de326e60f63732426d33c) | Stable IDs 1 and 2, parent relation 2 -> 1, same room |
| Feature / unfeature | [feature proposal 0xaefee80c...2c326](https://explorer-studio.genlayer.com/tx/0xaefee80ce304120ae52cffc60bb5fd537a0a495d55947aa46428fc2c2cc2c326), [feature finalize 0xf15c6610...4eaa0](https://explorer-studio.genlayer.com/tx/0xf15c6610c3932ccb0dcf9aec694c441c11ecd583966c1a72a5f8206ecfe4eaa0), [unfeature proposal 0x3f294484...a6501](https://explorer-studio.genlayer.com/tx/0x3f294484e191d8fbb1b84b4ec115e7b023e54f9ea6c642adf3e02609d3aa6501), [unfeature finalize 0xf2d7a7b8...d3912d](https://explorer-studio.genlayer.com/tx/0xf2d7a7b8ac24802112db06c5a0948d3106eee658d26e2561464098f947d3912d) | featured_post readback 0 -> 1 -> 0 |
| Policy amendment | [proposal 0x3d0526d1...a3f32](https://explorer-studio.genlayer.com/tx/0x3d0526d1496a1f80fadd2fc2ebd10918b289a331855a64f30ce51483a19a3f32), [consent 0xb269d190...240d5](https://explorer-studio.genlayer.com/tx/0xb269d190b113064981d641b56a50c2d73bad965f6d4e9c54da765977dcb240d5), [finalize 0x986290b7...408e7](https://explorer-studio.genlayer.com/tx/0x986290b756b8b8ee6dc9fb26e1b3c588ecffc69ab55e605521a775e4774408e7) | Room 2 active version 2; version 1 remains in policy history |
| Case 1 | [post 3 0x84150b53...7085b](https://explorer-studio.genlayer.com/tx/0x84150b5332b7b9f40fe0c983b0733eb2a0d490e723a03b30fd253cd47fc7085b), [open 0xe13f608a...93567](https://explorer-studio.genlayer.com/tx/0xe13f608a2395980ba9fd4b97ade5c141352094b3ab788e9000c52ba48c893567), [defense 0x42963e32...8c673](https://explorer-studio.genlayer.com/tx/0x42963e32b18394e44bdf25f352c34b9d99a3171648034e83833f7f93b928c673), [freeze 0xee97dbf9...9b976](https://explorer-studio.genlayer.com/tx/0xee97dbf9cbc1d4c93baac729d0c555b6c52030c85f0011eb73c6324c8a79b976), [adjudicate 0x06a4aa93...1428b](https://explorer-studio.genlayer.com/tx/0x06a4aa93fa64840f03e1c1e3909fe548470cdda0107cdbf1ba830cc101b1428b), [close 0x98bdc90c...ed9a9](https://explorer-studio.genlayer.com/tx/0x98bdc90c565084c5a1596caa1d4ee5da0990a222242580439bd28dd6bc9ed9a9) | Digest 1056b1e70b43162a6d153eb0d83b033c0d10bbefbac421b24ad5260f41529cad; leader NO_VIOLATION; post 3 VISIBLE; case CLOSED; no restriction |
| Case 2 and appeal | [post 4 0x6304c968...e6729e](https://explorer-studio.genlayer.com/tx/0x6304c96848c075f8d00bee2d9686a6e792fa82853a062fe843a28643e5e6729e), [open 0xb5b79fde...1fea2](https://explorer-studio.genlayer.com/tx/0xb5b79fded0c2c65b039556ab0f04e85c72452a4e87b9f81faca13c112ab1fea2), [defense 0x237b6aa3...9ba41c](https://explorer-studio.genlayer.com/tx/0x237b6aa3e64a2f1b8c803b249277707894c26c7d59176b51927ede3eb99ba41c), [freeze 0x23484f82...8d0c7f](https://explorer-studio.genlayer.com/tx/0x23484f821b9dbc96b7fffc0369939a5009c87a46813e4fe4d23f66171f8d0c7f), [adjudicate 0x4b52ead8...417cc](https://explorer-studio.genlayer.com/tx/0x4b52ead876fb17c341aa7423b7c41246e25439645d56d4723b6f07aaa13417cc), [appeal 0x58c2152b...69db1](https://explorer-studio.genlayer.com/tx/0x58c2152b719e178b9b17bb0880c900758c11a5401771cb36a8a4e51d46469db1), [response 0x58482e79...f67853](https://explorer-studio.genlayer.com/tx/0x58482e79f49ec28b755d844aa88c9b56d0709ec235c55c9efe9c09111f67853e), [freeze appeal 0x5f74c442...3eeed9](https://explorer-studio.genlayer.com/tx/0x5f74c442f7da53a5497ee68643760c825a43ed26b5be9e119d6dcf62b3deeed9), [adjudicate appeal 0x93fa5ac8...d691e55](https://explorer-studio.genlayer.com/tx/0x93fa5ac8a5c9f013184b6ebc3281feac498cff530db9bd7417e67e219d691e55) | Initial digest 98e76ac57dd352cd6d752a7f4fd476e9474b66ade99e68d16d3c9507584cf78d; appeal digest aec48fd46e37892159414ba87d93585581931e818d4157b279f07b92f83541b8; initial and appellate finding MINOR_BREACH; post remains HIDDEN; case CLOSED; no restriction |

### Final readback

Final views on the corrected contract returned get_counts = communities 2, rooms 2, posts 4, cases 2. Community 1 is Builders Collective ACTIVE with four members and charter versions 1–2. Community 2 is Research Forum ACTIVE with three members and charter version 1. Room 1 is a rejected expired proposal; room 2 is ACTIVE with policy versions 1–2 and no featured post. Posts 1–4 are stable, post 2 replies to post 1, post 3 remains visible after NO_VIOLATION, and post 4 remains hidden after the upheld MINOR_BREACH appeal.

### Observable semantic-consensus evidence

Case 1 finalized with result MAJORITY_AGREE and leader SUCCESS. The leader classification was NO_VIOLATION under clause CITATION with an exact anchor from the frozen post; validator metadata was IDLE, AGREE, AGREE, IDLE, AGREE. Case 2 finalized with MINOR_BREACH under CITATION; the anchor was an exact excerpt from the challenged post and metadata was AGREE, AGREE, IDLE, IDLE, AGREE. The appeal independently finalized with MINOR_BREACH, metadata AGREE, AGREE, AGREE, IDLE, IDLE. StudioNet exposes validator status/vote metadata and structured leader output, not every validator's private prompt or reasoning; no private trace is claimed. Direct Mode remains the controlled proof for malformed output, prompt injection, forged/irrelevant anchors and disagreement rejection.

### Negative live controls

| Control | Transaction | Observed result |
| --- | --- | --- |
| Late vote on expired room 1 | [0xf6968aa7...75034b](https://explorer-studio.genlayer.com/tx/0xf6968aa7a5c73ae3e568945319e39cacc96f1da5f2094abd6f01878f7475034b) | FINALIZED receipt with leader rollback vote expired; room state unchanged |
| Outsider publication | [0x3bfddf3a...eb487a](https://explorer-studio.genlayer.com/tx/0x3bfddf3aa465844bd7195543c608f1d4bea04e2553ce8411ee8ccf67e2eb487a) | FINALIZED receipt with execution rollback room membership required; post count remained 4 |
| Duplicate challenge of post 4 | [0x75922063...f99332](https://explorer-studio.genlayer.com/tx/0x75922063f16e4bd1c096394cfe9a09c49766cf690bcbda132264f83f5cf99332) | FINALIZED receipt with rollback post has already been challenged; case count and post unchanged |

The earlier browser-wallet registration in this file was performed against the superseded contract and is not presented as evidence for the corrected address. It does prove the production EIP-1193 path can request and finalize a real user signature without importing a CLI key; the fresh corrected-contract lifecycle above was signed by six distinct CLI identities.

## Historical pre-hardening deployment and browser check (superseded)

This section is a superseded pre-hardening deployment record retained for historical comparison. It is not evidence for the final product address; use the current final section above.

### Deployment provenance

| Field | Observed value |
| --- | --- |
| Network | GenLayer StudioNet |
| Chain ID | `61999` (`0xf22f`) |
| RPC | `https://studio.genlayer.com/api` |
| CLI / SDK | repository-local `genlayer@0.39.1`, `genlayer-js@1.1.8` |
| Contract | [`0xf9bF16af4253064E349fF0fCfc7472f75c63110e`](https://explorer-studio.genlayer.com/address/0xf9bF16af4253064E349fF0fCfc7472f75c63110e) |
| Deployment signer | A1 / `0xac3ac69dc0bde389256dd6748c75817ead9286d9` |
| Deployment transaction | [`0xde0b737e7d4fb2b1540afaf060b4d80d43ae9687748908866fbd7f2300222951`](https://explorer-studio.genlayer.com/tx/0xde0b737e7d4fb2b1540afaf060b4d80d43ae9687748908866fbd7f2300222951) |
| Deployment timestamp | `2026-10-27T16:22:38.173981+00:00` (receipt `created_at`) |
| Deployment result | `FINALIZED`, `MAJORITY_AGREE`, leader execution `SUCCESS`; validator metadata `AGREE, AGREE, AGREE, AGREE, AGREE` |
| Git commit | `cf96ee8e88ef83d2b5ffc8cbbe9f24b389943dea` |
| Contract source | 44,575 LF bytes; SHA-256 `58f998ff4b8401ecc623d9aa0a934d14352cf6a177f62c43d9c5ad53415b469e` |
| Deployed source | 44,575 decoded bytes; SHA-256 `58f998ff4b8401ecc623d9aa0a934d14352cf6a177f62c43d9c5ad53415b469e` |
| Exact parity | `byteEqual: true`, checked by `scripts/verify_deployed_source.mjs` using `gen_getContractCode` |
| Latest full GitHub CI | [run 40560229019](https://github.com/ometere123/crossrule/actions/runs/40560229019), `success`, 9/9 jobs, exact SHA `601f221dc172f9e8aa7b061252386330c9539be9` |
| Production frontend | [`https://crossrule.vercel.app`](https://crossrule.vercel.app), [READY Vercel deployment `dpl_C48PNMuVsaCa1pdeEHS2SVmvU6gJ`](https://vercel.com/delealufejoel-4184s-projects/crossrule/C48PNMuVsaCa1pdeEHS2SVmvU6gJ), uploaded from exact frontend checkout at Git commit `601f221dc172f9e8aa7b061252386330c9539be9`; verified HTTP 200, production Playwright `10 passed` across desktop/mobile and live counts 2/1/4/6 |
| Production browser wallet | Convert Chrome profile with Rabby injected provider. No CLI key was imported into the browser. A real browser-signed community registration was finalized successfully below; the subsequent founder-consent lifecycle remains in progress. |
| Initial readback | `get_counts = {communities:0, rooms:0, posts:0, cases:0}`; all three list views returned `[]` |

### Fresh browser-wallet verification

This is a new public record appended to the existing source-matched contract. It is intentionally separate from the completed six-CLI-wallet ledger below. The browser wallet signed the transaction through the Convert Chrome profile; no private key was imported into the page.

| Field | Observed value |
| --- | --- |
| Browser profile | Convert Chrome + Rabby injected EIP-1193 provider |
| Founder A / signer | `0x23187BF36c9B935189cDa33DEEEc6912bC2A211B` |
| Founder B | `0x7e2a8d765e0e346C451109eb42D92f61FBdbfd4b` |
| Founder C | `0x1F21Be13E3Fd277C5D3115b7Fb8135de19A427F5` |
| Action | `create_community` — `Browser Accord Guild` |
| Transaction | [`0x10e877c3aeaa11159008aa6d8144f488e6cac28952989098cc3cfbf7e798f173`](https://explorer-studio.genlayer.com/tx/0x10e877c3aeaa11159008aa6d8144f488e6cac28952989098cc3cfbf7e798f173) |
| UI lifecycle | `Submitted — inspect finality` → `Finalized · execution succeeded` |
| Contract readback | Community 3 exists in `FOUNDING` state with the three recorded founder addresses; other two founder consents are still required |

The live page also now rehydrates an already-authorized account with read-only `eth_accounts` after refresh and exposes an explicit disconnect control. Provider permission revocation is attempted when supported; otherwise the app clears its local session and tells the user that extension site access remains wallet-managed.

The historical deployment used CRLF bytes and is retained below for provenance. The current repository enforces LF for `contracts/Crossrule.py` through `.gitattributes`; deployment source retrieval is now an exact-byte check, not normalized-text comparison.

### Six signing identities

All six encrypted CLI keystores existed locally, were checked on StudioNet, were distinct and were preserved. No private key, mnemonic or password is recorded.

| Role | CLI alias | Public address |
| --- | --- | --- |
| A1 | `party_a` | `0xac3ac69dc0bde389256dd6748c75817ead9286d9` |
| A2 | `walletA` | `0x951e6b75530774ff82321a5ae54e14f778f0c855` |
| A3 | `walletB` | `0xb845a69860ba4cdf19cfdc5afbaf2e20b6be86b0` |
| B1 | `conveyance-deployer` | `0x21892bba93381d94037fb4aab01cafbdf4453b56` |
| B2 | `slash-owner` | `0x9dce0dc7005d6b92e03c27640081096cd36dd468` |
| B3 | `termsmet-studionet-submitter` | `0xb5ecd6dda36b370aca4af5e2005d8e2ae89c6db2` |

Extra applicant `party_b` (`0xa7eeae0e93793e3146cb14b0700251b8b0ebadfb`) was used only for explicit admission consent. The wallets remain preserved and were not imported into the browser frontend.

### Fresh lifecycle ledger

Every link below points to the exact StudioNet transaction. Each successful row was checked for finalization, execution result and corresponding contract readback. Failed controls are retained as finalized rollbacks, not treated as rejected signatures.

| Stage | Actor(s) | Action | Finalized transaction(s) | Readback / result |
| --- | --- | --- | --- | --- |
| Community A | A1, A2, A3 | Create and accept `Builders Collective` | [create `0xe61c248f...a0242`](https://explorer-studio.genlayer.com/tx/0xe61c248f54c6777b11b281bf1dfaa3bec54a07f368ffa6d740a7a96ce4ea0242), [A2 `0x3bca551e...3806`](https://explorer-studio.genlayer.com/tx/0x3bca551ee29253416c4b6ed5270502a738ccc23ce94d526548772b3734373806), [A3 `0x4d82ae60...f6f4`](https://explorer-studio.genlayer.com/tx/0x4d82ae602a8dd9674e54849495bbcb65eba79e715d52f1b668667de21526f6f4) | Community 1 `ACTIVE`; three distinct founding consents |
| Community B | B1, B2, B3 | Create and accept `Research Forum` | [create `0xccae16bc...cb27`](https://explorer-studio.genlayer.com/tx/0xccae16bc730d7a996b17adbfe2e98ea573795ba25feafef6c7a02897e9c5cb27), [B2 `0x5a5b1214...cec1`](https://explorer-studio.genlayer.com/tx/0x5a5b12144955fb0fc57479c45045296f49d19c6f0b82d86a33065f70f273cec1), [B3 `0xa47642a1...6adc`](https://explorer-studio.genlayer.com/tx/0xa47642a1b45645145d028542c07e7ad92412881571480438eaaf1367b8bb6adc) | Community 2 `ACTIVE`; three distinct founding consents |
| Admission | A1, applicant, A1/A2 | Propose, consent, vote and finalize `party_b` | [propose `0x8c5531c0...4314`](https://explorer-studio.genlayer.com/tx/0x8c5531c0ff2a92c6d3cb7b690bfc7edc9c87c426d6f55bc705a3d11efd394314), [applicant `0x63e84875...e615`](https://explorer-studio.genlayer.com/tx/0x63e84875838345109d272df800c4c3feedc2aa779043d5d56b99dd38c217e615), [A1 `0x733f3c46...c0aa`](https://explorer-studio.genlayer.com/tx/0x733f3c468ce87b3bbb4d5fa5aa3202ddab8e8e366f572f181a315bff9426c0aa), [A2 `0x5d8e1324...fb26`](https://explorer-studio.genlayer.com/tx/0x5d8e13246b8c4c7adb860b825fdbc9eeeaa48ac493f0126554d2b23d216fbf26), [finalize `0xc597bd65...d92b`](https://explorer-studio.genlayer.com/tx/0xc597bd654facd1391c0de31d437d67aa9fcb31f78aa9842b45a0f14c682fd92b) | The frozen admission roster was 3, so two approvals met `ceil(2×3/3)=2`; only after finalization did the community contain 4 members |
| Charter | A1, A2, A3 | Propose, approve and finalize charter v2 | [proposal `0x56dcb641...f846`](https://explorer-studio.genlayer.com/tx/0x56dcb6415ca7e928e1130372c3bef2dbed94818ae1d9b5207747805fc817f846), [A1 `0x1634230e...e461`](https://explorer-studio.genlayer.com/tx/0x1634230ed19fbe9d9b8aea9b23e1d2b5855f454f9be9d3a00c72f1c65e461), [A3 `0xcc56a073...d2bd`](https://explorer-studio.genlayer.com/tx/0xcc56a0737e2d327c441305468aca5a5d238a94464b4316ea0b33f60e2807d2bd), [A2 `0x2be23381...e4c5`](https://explorer-studio.genlayer.com/tx/0x2be2338132826c5dbb3bb03da351a7642095d8944a9a20c75e9d5c9ed492e4c5), [finalize `0x1df44a89...fa4f3`](https://explorer-studio.genlayer.com/tx/0x1df44a8920a7f053b0a1a1f6e98d4e04ddb4b5994d9e74c03ac9aa1e461fa4f3) | `get_community(1)` preserves charter v1 and v2 |
| Room proposal | A1, B1 | Propose and counterpart-consent `Shared Evidence Chamber` | [proposal `0x1b4162cc...719a`](https://explorer-studio.genlayer.com/tx/0x1b4162cceb7c279db2be053fe18f069f117dc6ec43633e709ca50950914719a9), [B1 consent `0x458f4d2b...afdd`](https://explorer-studio.genlayer.com/tx/0x458f4d2b79b9c2c59720aa6bb11c0fc3fc766e78ba4ddd610eb5ff3ff302afdd) | `CONSENT_PENDING` → bilateral voting; pair reservation established |
| Bilateral ratification | A1/A2/A3, B1/B2 | Independent votes and activation | [A1 `0x91527e61...5be9`](https://explorer-studio.genlayer.com/tx/0x91527e617fa5bfb2b2e5168c40da75e0e80b65b568b49e718aa438ad03b85be9), [A2 `0x7cc395f2...d7fb`](https://explorer-studio.genlayer.com/tx/0x7cc395f2589effba9d317b4d7bb71a5211b0c9c14d7e4dca9f86fccc20e1d7fb), [A3 `0xb8d7cffa...2a86`](https://explorer-studio.genlayer.com/tx/0xb8d7cffa54f944e5d579fff13df0a0ed3d8919274ac91ae41a2d6970c55b2a86), [B1 `0xa28e926d...6497`](https://explorer-studio.genlayer.com/tx/0xa28e926dc40d5214d8a2553dd7e1f5cf7db38d81af649c30cbd512913d1f6497), [B2 `0xc3438ff9...f08c`](https://explorer-studio.genlayer.com/tx/0xc3438ff92918d0b81f5abb049143f3710aa4bd0b84b61aa5a7d3859577c1f08c), [finalize `0xa997d75c...7986`](https://explorer-studio.genlayer.com/tx/0xa997d75cadf0da9d37f4a2c4925c7a57ceb7ff40dbdd90fa8d88d47609067986) | A required 3 of 4; B required 2 of 3; room 1 `ACTIVE`, policy v1 |
| Feature / unfeature | A1/A2/A3, B1/B2 | Feature post 1 then remove feature | [feature proposal `0x8f3094b8...e759`](https://explorer-studio.genlayer.com/tx/0x8f3094b8db53a3e8265e734899bb59a799edd8a02b7276273fba963d61cce759), [feature finalize `0xc217fb66...6c77`](https://explorer-studio.genlayer.com/tx/0xc217fb66407b19dae984d32ceac857c91c91f97b9a0e968e8322372600666c77), [unfeature proposal `0xde90ed19...b203`](https://explorer-studio.genlayer.com/tx/0xde90ed19b5221ae5e7200a8df7e9be08f9ebf7915f51bc2480345999f5ddb203), [unfeature finalize `0xfc654cf7...ab29`](https://explorer-studio.genlayer.com/tx/0xfc654cf7d395b51e704d69554f196a2b6264499f14bb4e9389b3ccd021ceab29) | Readback `featured_post: 0 → 1 → 0`; one community could not complete it alone |
| Case 1 / v1 | A1, B1 | Post, challenge, defense, freeze and adjudicate | [post `0x312cecc9...dc6e`](https://explorer-studio.genlayer.com/tx/0x312cecc9cb6b2285cd6af2c16de12c80e92ed65e09631bbf1d1a868a07eddc6e), [open `0xa1bf8a94...5ddd`](https://explorer-studio.genlayer.com/tx/0xa1bf8a948e61262fe622592f5b410ad442cf05f0ae3c221b39ae67176a335ddd), [defense `0xd4c86685...3923`](https://explorer-studio.genlayer.com/tx/0xd4c86685fdc334da60c2a9725628e3f5f2ea2f244f26d8cfa5bb294ef2d23923), [freeze `0x3d098591...4c5d`](https://explorer-studio.genlayer.com/tx/0x3d0985910bd54955e98a9e497ba4e9949d39883a1d02e9a529e583b00e1b4c5d), [adjudicate `0x0a6ad070...798d`](https://explorer-studio.genlayer.com/tx/0x0a6ad0703d63068a87c13acf3e3babb3ca96d6e99eaaa8f097b894e75467798d) | Digest `5ea21b...acc306`; leader `NO_VIOLATION` under v1; case later closed; post 3 visible |
| Amendment v2 | A1/A2/A3, B1/B2 | Bilaterally amend policy | [proposal `0xd7734dd4...f0c1`](https://explorer-studio.genlayer.com/tx/0xd7734dd47618e2981d85dfa1e648715707f84d910bf654a7311c567ac17af0c1), [consent `0x98102cda...3bee`](https://explorer.studio.genlayer.com/tx/0x98102cdab9300583064a1dfb0c4b68efc57d45b873215a7cb87ef33dff253bee), [finalize `0xcd290ed0...5588`](https://explorer-studio.genlayer.com/tx/0xcd290ed05d6520b205fd77fc2ec1c94087a595af8eba5c457412fe9c74595588) | Readback preserves v1; active policy v2 |
| Case 2 | A2, B2 | Minor breach case | [post `0xa554482a...5b24`](https://explorer-studio.genlayer.com/tx/0xa554482a1628d8b42d033e6dd6ebf4eb7cb0e412084a0a30ea4751338ae85b24), [open `0xd3a5309c...2025`](https://explorer-studio.genlayer.com/tx/0xd3a5309c21a7df19637bd5445e037c17b45cd287abb760864e4709985d282025), [defense `0x27b03739...9112`](https://explorer-studio.genlayer.com/tx/0x27b037393410ad65df0c3971d90dad24a38546da2d98445ade3f64d7c7689112), [freeze `0xf5723e46...05ff`](https://explorer-studio.genlayer.com/tx/0xf5723e4611f4f1788d3a2f31646db95588d8f3893d92c32f26fdbeb668ab05ff), [adjudicate `0x88cad6db...16ab`](https://explorer-studio.genlayer.com/tx/0x88cad6db7c4ccd436d680a4c9d4bc78a1aab33d2b5ad3fd472c14dead53c16ab) | Digest `140ac769...aa40a`; leader `MINOR_BREACH`; post 4 `HIDDEN`; no suspension (minor) |
| Case 3 | A1, B1 | No-violation case with live disagreement metadata | [post `0x52a2e10c...76c9`](https://explorer-studio.genlayer.com/tx/0x52a2e10ca1df4b5d41a10dfbe430d1d32a7a167a4bbb359bad61054a71cc76c9), [open `0x17a6031d...036c`](https://explorer-studio.genlayer.com/tx/0x17a6031d749ce27c5d81e59c4059d8d8103b556614a6bf92f8534e002fb4036c), [defense `0xf1d636ea...a361`](https://explorer-studio.genlayer.com/tx/0xf1d636eabbd29b71a85b5c1aef7fb45d8f09db11b5bfe7c8155408837213a361), [freeze `0x5bf82265...c07a`](https://explorer-studio.genlayer.com/tx/0x5bf82265f5ec69f63b43b5b36b300ca9d0d9f35d2aa57970fc5b6421641fc07a), [adjudicate `0x5c307f73...85d`](https://explorer-studio.genlayer.com/tx/0x5c307f733ad344d10696ffc40a049f63cb47944f1397b6de9d078ba1f6e4585d) | Digest `b951f09e...4ce47`; leader `NO_VIOLATION`; validator metadata `AGREE, DISAGREE, DISAGREE, AGREE, AGREE`; post 5 visible |
| Amendment v3 | A1/A2/A3, B1/B2 | Expire a short proposal, then ratify a practical v3 | [expired proposal `0x1b9a9ce6...0181b`](https://explorer-studio.genlayer.com/tx/0x1b9a9ce6b52f601fef43477209ed9f30015d662f8bae1cd83e9736c04ff0181b), [expire `0x83ad6bd0...11ab`](https://explorer-studio.genlayer.com/tx/0x83ad6bd0faf99423bd3fda501f46a88e305ea52ea8bde960cb749a3dd3c211ab), [v3 proposal `0x9127b5db...7b69`](https://explorer-studio.genlayer.com/tx/0x9127b5db073cfaee377e161c15fbeed6bf5d47ad058f634fd50d968d0e77b769), [v3 consent `0x24e79606...1a0d`](https://explorer-studio.genlayer.com/tx/0x24e79606513fba26ac291048afa0717ec52c63a89dd5b60610a3bcbdb29a1a0d), [v3 finalize `0x7589f47d...0a95`](https://explorer-studio.genlayer.com/tx/0x7589f47d7d660da95d24ee090bec90aa4e7ad7a41b8913cf9c5376f843cd0a95) | Expiry released proposal state; active policy v3 has vote 10m, defense 2m, appeal 10m, suspension 2m |
| Case 4 | A1, B1 | Final live appeal under v3 | [post `0xfa4f3594...38a7`](https://explorer-studio.genlayer.com/tx/0xfa4f3594e09de3f9f0d6ca85f6f69785335606d3b2d8bf5d952f7387ed8386a7), [open `0xd77a00e5...fc8e`](https://explorer-studio.genlayer.com/tx/0xd77a00e5f2001f8703866be32983185258253e46b7c5136e29edb4e33ac9fc8e), [defense `0x23a42baa...6580`](https://explorer-studio.genlayer.com/tx/0x23a42baa05bbabc14861d3ab6942cd812d916d998519378b2d7b52d101416580), [freeze `0xc15272ff...c1bf`](https://explorer-studio.genlayer.com/tx/0xc15272ff08c357e69e30c3d798b621b4ba8c1589393c40d6b05481475f7c1bf3), [adjudicate `0x443d4ebb...8f50`](https://explorer-studio.genlayer.com/tx/0x443d4ebb4e4e89109da58a715e6aa536415d18b0fda575cdfd1045e6aded8f50) | Digest `be014097...d1c6a`; original leader `NO_VIOLATION`; post 6 visible |
| Appeal 4 | B1, A1 | Reporter appeal, author response, freeze and independent reassessment | [appeal `0x35db14bf...7f49`](https://explorer-studio.genlayer.com/tx/0x35db14bff2342ee913167a466282aaafd7482ec8b2d3dd2831533b032cec7f49), [response `0xc5b14160...b261`](https://explorer-studio.genlayer.com/tx/0xc5b14160378ed065e49d215c42c71d0fc4fdd1ac4c9359909755c064d9d8b261), [freeze `0xd888f3a5...1964`](https://explorer-studio.genlayer.com/tx/0xd888f3a5df7149f4fd1ae975a54b45754f12cace5d24f5ef31690a5f5d4c1964), [adjudicate `0x7e26c3bd...13ab6`](https://explorer-studio.genlayer.com/tx/0x7e26c3bdfe03f1df9a5b5eca5c883647892828974e533954e218b7bc17413ab6) | Appeal digest `4bdee8b1...e9149`; original and appellate findings both `NO_VIOLATION`; case 4 `CLOSED`, post 6 `VISIBLE`, no restriction |
| Negative outsider publication | extra outsider `praest-deployer` | Attempt to publish without room membership | [rollback `0x979ce981...b9a4`](https://explorer-studio.genlayer.com/tx/0x979ce981844ae789f52feb50ab6e2c6a689bc5c5e635e2eb144c6d7b2d5ab9a4) | `FINALIZED`, `MAJORITY_AGREE`, execution rollback `room membership required`; `get_counts` remained posts 6 |

### Final readbacks

The final public views returned `get_counts = {communities:2, rooms:1, posts:6, cases:4}`. `list_communities` returned Builders Collective (`ACTIVE`, 4 members) and Research Forum (`ACTIVE`, 3 members). `list_rooms` returned room 1 (`ACTIVE`, communities 1/2, version 3, `post_count:6`, no pending proposal). `list_cases` returned case 1 `CLOSED/NO_VIOLATION`, case 2 `DECIDED/MINOR_BREACH`, case 3 `DECIDED/NO_VIOLATION`, and case 4 `CLOSED/NO_VIOLATION`. `list_posts(1,0,3)` returned IDs 1–3, `list_posts(1,3,3)` returned IDs 4–6, and `list_posts(1,6,3)` returned `[]`; post 4 was `HIDDEN`, posts 3/5/6 were `VISIBLE`.

### Observable semantic consensus

The receipts establish finalized semantic execution and expose leader structured outputs plus validator vote/status metadata. Case 1: `NO_VIOLATION`, `EVIDENCE`, exact frozen-post anchor, validator metadata `AGREE, AGREE, AGREE, IDLE, IDLE`. Case 2: `MINOR_BREACH`, `PROMO`, exact frozen-post anchor, post hidden. Case 3: `NO_VIOLATION`, `PROMO`, validator metadata `AGREE, DISAGREE, DISAGREE, AGREE, AGREE`, post visible. Case 4: original `NO_VIOLATION`, then appellate `NO_VIOLATION` with a distinct materially relevant anchor and metadata `AGREE, IDLE, AGREE, AGREE, DISAGREE`. The protocol does not expose each validator's private prompt or chain-local reasoning; none is claimed here. Direct Mode remains the controlled proof for malformed output, prompt injection, fabricated/irrelevant anchors and disagreement rejection.

### Historical source-provenance note

The superseded deployment recorded below used CRLF bytes (34,759 bytes, SHA-256 `94577d12e28208f33de8365f3cd40c23476617ed234c61a4eedf3ca07221c8ff`) while the then-reviewed Git source was LF. That historical discrepancy is preserved rather than erased. The current deployment is an exact LF byte match as shown above.

## Historical deployment ledger (superseded)

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
