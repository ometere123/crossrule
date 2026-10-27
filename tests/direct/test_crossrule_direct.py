"""Real genlayer-test Direct Mode tests against the contract source, no RPC/Docker.

The dependency-free offline tests run separately to isolate security regressions.
"""
import json

CONTRACT = "contracts/Crossrule.py"
TEXT = "Our 20-contract benchmark includes seeded flaws, methodology and a short note about a premium package."
CLAUSES = json.dumps([
    {"id": "PROMO", "text": "No unsolicited sales pitches; contextual technical links are allowed.", "max_severity": "SERIOUS"},
    {"id": "EVIDENCE", "text": "Material technical assertions require support.", "max_severity": "MINOR"},
])


def wallet(account):
    return "0x" + bytes(account).hex()


def parsed(data):
    return json.loads(data)


def test_empty_deployment(direct_deploy):
    contract = direct_deploy(CONTRACT)
    assert parsed(contract.get_counts()) == {"communities": 0, "rooms": 0, "posts": 0, "cases": 0}


def test_three_distinct_founders_required(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    direct_vm.sender = direct_accounts[0]
    with direct_vm.expect_revert("three distinct"):
        contract.create_community("Builders", "Technical builders", "Evidence matters", wallet(direct_accounts[0]), wallet(direct_accounts[1]), 2)


def active_communities(contract, vm, accounts):
    vm.sender = accounts[0]
    a = contract.create_community("Builders", "Open tech builders", "Responsible sharing", wallet(accounts[1]), wallet(accounts[2]), 2)
    for idx in (1, 2):
        vm.sender = accounts[idx]
        contract.accept_foundership(a)
    vm.sender = accounts[3]
    b = contract.create_community("Researchers", "Open research community", "Evidence-first review", wallet(accounts[4]), wallet(accounts[5]), 2)
    for idx in (4, 5):
        vm.sender = accounts[idx]
        contract.accept_foundership(b)
    return a, b


def ratified_room(contract, vm, accounts):
    a, b = active_communities(contract, vm, accounts)
    vm.sender = accounts[0]
    rid = contract.propose_room(a, b, "Jointly ratified content standards", CLAUSES, 2, 2, 2, 2)
    for idx in (0, 1, 3, 4):
        vm.sender = accounts[idx]
        contract.vote_agreement(rid, True)
    contract.finalize_agreement(rid)
    return rid


def test_bilateral_consent_and_public_post(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    a, b = active_communities(contract, direct_vm, direct_accounts)
    direct_vm.sender = direct_accounts[0]
    rid = contract.propose_room(a, b, "Jointly ratified standards", CLAUSES, 2, 2, 2, 2)
    for idx in (0, 1, 2):
        direct_vm.sender = direct_accounts[idx]
        contract.vote_agreement(rid, True)
    with direct_vm.expect_revert("vote ongoing"):
        contract.finalize_agreement(rid)
    for idx in (3, 4):
        direct_vm.sender = direct_accounts[idx]
        contract.vote_agreement(rid, True)
    contract.finalize_agreement(rid)
    assert parsed(contract.get_room(rid))["version"] == 1
    direct_vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    assert parsed(contract.get_post(pid))["status"] == "VISIBLE"


def test_nonmember_cannot_post(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    rid = ratified_room(contract, direct_vm, direct_accounts)
    direct_vm.sender = direct_accounts[9]
    with direct_vm.expect_revert("room membership"):
        contract.publish_post(rid, 0, TEXT)


def test_community_member_requires_consent_and_threshold(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    a, _ = active_communities(contract, direct_vm, direct_accounts)
    direct_vm.sender = direct_accounts[0]
    contract.propose_member(a, wallet(direct_accounts[6]))
    for idx in (0, 1):
        direct_vm.sender = direct_accounts[idx]
        contract.vote_member(a, True)
    with direct_vm.expect_revert("vote ongoing"):
        contract.finalize_member(a)
    direct_vm.sender = direct_accounts[6]
    contract.accept_membership(a)
    contract.finalize_member(a)
    assert wallet(direct_accounts[6]) in parsed(contract.get_community(a))["members"]


def test_charter_amendment_is_versioned(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    a, _ = active_communities(contract, direct_vm, direct_accounts)
    direct_vm.sender = direct_accounts[0]
    contract.propose_charter(a, "Updated charter of evidence and technical accountability")
    for idx in (0, 1):
        direct_vm.sender = direct_accounts[idx]
        contract.vote_charter(a, True)
    contract.finalize_charter(a)
    assert [c["version"] for c in parsed(contract.get_community(a))["charters"]] == [1, 2]


def test_feature_vote_requires_bilateral_ratification(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    rid = ratified_room(contract, direct_vm, direct_accounts)
    direct_vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    contract.propose_feature(rid, pid)
    for idx in (0, 1):
        direct_vm.sender = direct_accounts[idx]
        contract.vote_feature(rid, True)
    with direct_vm.expect_revert("vote ongoing"):
        contract.finalize_feature(rid)
    for idx in (3, 4):
        direct_vm.sender = direct_accounts[idx]
        contract.vote_feature(rid, True)
    contract.finalize_feature(rid)
    assert parsed(contract.get_room(rid))["featured_post"] == int(pid)


def test_amended_policy_does_not_rewrite_open_case(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    rid = ratified_room(contract, direct_vm, direct_accounts)
    direct_vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    direct_vm.sender = direct_accounts[3]
    cid = contract.open_case(pid, "PROMO", "Possible promotion based on this text", "[]")
    direct_vm.sender = direct_accounts[0]
    contract.propose_amendment(rid, "Revised shared policy after discussion", CLAUSES, 2, 2, 2, 2)
    for idx in (0, 1, 3, 4):
        direct_vm.sender = direct_accounts[idx]
        contract.vote_agreement(rid, True)
    contract.finalize_agreement(rid)
    assert parsed(contract.get_room(rid))["version"] == 2
    assert parsed(contract.get_case(cid))["policy_version"] == 1


def test_context_injection_rejected(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    rid = ratified_room(contract, direct_vm, direct_accounts)
    direct_vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    direct_vm.sender = direct_accounts[3]
    with direct_vm.expect_revert("invalid context selection"):
        contract.open_case(pid, "PROMO", "Suspected promotion", '[{"fake":"post"}]')


def test_frozen_post_case_consensus_and_appeal(direct_deploy, direct_vm, direct_accounts):
    vm = direct_vm
    vm.warp("2026-10-26T12:00:00+00:00")
    contract = direct_deploy(CONTRACT)
    rid = ratified_room(contract, vm, direct_accounts)
    vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    vm.sender = direct_accounts[3]
    cid = contract.open_case(pid, "PROMO", "This passage looks promotional", "[]")
    assert parsed(contract.get_post(pid))["status"] == "UNDER_REVIEW"
    vm.warp("2026-10-26T12:03:00+00:00")
    contract.freeze_case(cid)
    decision = json.dumps({"finding": "MINOR_BREACH", "clause_id": "PROMO",
        "anchor": "20-contract benchmark includes seeded flaws",
        "reason": "This mention could be a contextual breach of the ratified promotion policy."})
    vm.mock_llm(r"You interpret a JOINTLY RATIFIED", decision)
    contract.adjudicate_case(cid)
    assert parsed(contract.get_post(pid))["status"] == "HIDDEN"
    assert vm.run_validator() is True
    vm.sender = direct_accounts[0]
    contract.open_appeal(cid, "The benchmark context is research, not commercial solicitation")
    vm.warp("2026-10-26T12:06:00+00:00")
    contract.freeze_appeal(cid)
    vm.clear_mocks()
    restore = json.dumps({"finding": "NO_VIOLATION", "clause_id": "PROMO",
        "anchor": "20-contract benchmark includes seeded flaws",
        "reason": "The surrounding methodology and explanatory purpose make this a legitimate benchmark discussion."})
    vm.mock_llm(r"You interpret a JOINTLY RATIFIED", restore)
    contract.adjudicate_appeal(cid)
    assert parsed(contract.get_post(pid))["status"] == "RESTORED"
    record = parsed(contract.get_case(cid))
    assert record["status"] == "CLOSED"
    assert record["original_finding"] == "MINOR_BREACH"
    assert record["finding"] == "NO_VIOLATION"


def test_validator_rejects_classification_disagreement(direct_deploy, direct_vm, direct_accounts):
    vm = direct_vm
    vm.warp("2026-10-26T12:00:00+00:00")
    contract = direct_deploy(CONTRACT)
    rid = ratified_room(contract, vm, direct_accounts)
    vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    vm.sender = direct_accounts[3]
    cid = contract.open_case(pid, "PROMO", "Potential advertising violation", "[]")
    vm.warp("2026-10-26T12:03:00+00:00")
    contract.freeze_case(cid)
    good = {"finding": "NO_VIOLATION", "clause_id": "PROMO",
            "anchor": "20-contract benchmark includes seeded flaws",
            "reason": "This is a research report in context, rather than an advertisement."}
    vm.mock_llm(r"You interpret a JOINTLY RATIFIED", json.dumps(good))
    contract.adjudicate_case(cid)
    vm.clear_mocks()
    bad = dict(good, finding="SERIOUS_BREACH")
    vm.mock_llm(r"You interpret a JOINTLY RATIFIED", json.dumps(bad))
    assert vm.run_validator() is False


def test_wrong_founder_cannot_accept_or_repeat_consent(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    vm = direct_vm
    vm.sender = direct_accounts[0]
    cid = contract.create_community("Builders", "Technical builders", "Evidence matters",
                                    wallet(direct_accounts[1]), wallet(direct_accounts[2]), 2)
    vm.sender = direct_accounts[9]
    with vm.expect_revert("not invited"):
        contract.accept_foundership(cid)
    vm.sender = direct_accounts[1]
    contract.accept_foundership(cid)
    with vm.expect_revert("not invited"):
        contract.accept_foundership(cid)


def test_overlapping_membership_cannot_cross_a_bilateral_boundary(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    vm = direct_vm
    a, b = active_communities(contract, vm, direct_accounts)
    vm.sender = direct_accounts[0]
    contract.propose_member(a, wallet(direct_accounts[6]))
    vm.sender = direct_accounts[6]
    contract.accept_membership(a)
    for idx in (0, 1):
        vm.sender = direct_accounts[idx]
        contract.vote_member(a, True)
    contract.finalize_member(a)
    vm.sender = direct_accounts[3]
    contract.propose_member(b, wallet(direct_accounts[6]))
    vm.sender = direct_accounts[6]
    contract.accept_membership(b)
    for idx in (3, 4):
        vm.sender = direct_accounts[idx]
        contract.vote_member(b, True)
    contract.finalize_member(b)
    vm.sender = direct_accounts[0]
    with vm.expect_revert("wallet represents both"):
        contract.propose_room(a, b, "No overlapping voting identities", CLAUSES, 2, 2, 2, 2)


def test_pending_agreement_keeps_its_original_voter_snapshot(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    vm = direct_vm
    a, b = active_communities(contract, vm, direct_accounts)
    vm.sender = direct_accounts[0]
    rid = contract.propose_room(a, b, "Frozen roster policy", CLAUSES, 2, 2, 2, 2)
    contract.propose_member(a, wallet(direct_accounts[6]))
    vm.sender = direct_accounts[6]
    contract.accept_membership(a)
    for idx in (0, 1):
        vm.sender = direct_accounts[idx]
        contract.vote_member(a, True)
    contract.finalize_member(a)
    vm.sender = direct_accounts[6]
    with vm.expect_revert("voting snapshot"):
        contract.vote_agreement(rid, True)
    for idx in (0, 1, 3, 4):
        vm.sender = direct_accounts[idx]
        contract.vote_agreement(rid, True)
    contract.finalize_agreement(rid)


def test_cross_room_reply_is_rejected_in_direct_mode(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    vm = direct_vm
    a, b = active_communities(contract, vm, direct_accounts)
    vm.sender = direct_accounts[0]
    first = contract.propose_room(a, b, "Room one", CLAUSES, 2, 2, 2, 2)
    second = contract.propose_room(a, b, "Room two", CLAUSES, 2, 2, 2, 2)
    for rid in (first, second):
        for idx in (0, 1, 3, 4):
            vm.sender = direct_accounts[idx]
            contract.vote_agreement(rid, True)
        contract.finalize_agreement(rid)
    vm.sender = direct_accounts[0]
    pid = contract.publish_post(first, 0, TEXT)
    with vm.expect_revert("cross-room"):
        contract.publish_post(second, pid, "This parent is from another room.")


def test_minor_only_clause_rejects_serious_direct_consensus(direct_deploy, direct_vm, direct_accounts):
    vm = direct_vm
    vm.warp("2026-10-26T12:00:00+00:00")
    contract = direct_deploy(CONTRACT)
    a, b = active_communities(contract, vm, direct_accounts)
    minor = json.dumps([{"id": "ONLY-MINOR", "text": "Only ordinary evidence mistakes are minor.", "max_severity": "MINOR"}])
    vm.sender = direct_accounts[0]
    rid = contract.propose_room(a, b, "Minor-only policy", minor, 2, 2, 2, 2)
    for idx in (0, 1, 3, 4):
        vm.sender = direct_accounts[idx]
        contract.vote_agreement(rid, True)
    contract.finalize_agreement(rid)
    vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    vm.sender = direct_accounts[3]
    cid = contract.open_case(pid, "ONLY-MINOR", "The post is alleged to be a serious breach.", "[]")
    vm.warp("2026-10-26T12:03:00+00:00")
    contract.freeze_case(cid)
    serious = json.dumps({"finding": "SERIOUS_BREACH", "clause_id": "ONLY-MINOR",
        "anchor": "20-contract benchmark includes seeded flaws",
        "reason": "The frozen post allegedly violates a clause that only authorizes minor severity."})
    vm.mock_llm(r"You interpret a JOINTLY RATIFIED", serious)
    with vm.expect_revert("not authorized"):
        contract.adjudicate_case(cid)


def test_invalid_clause_and_forged_context_fail_closed(direct_deploy, direct_vm, direct_accounts):
    contract = direct_deploy(CONTRACT)
    vm = direct_vm
    rid = ratified_room(contract, vm, direct_accounts)
    vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    vm.sender = direct_accounts[3]
    with vm.expect_revert("unknown clause"):
        contract.open_case(pid, "NOT-RATIFIED", "Invalid clause reference", "[]")
    with vm.expect_revert("invalid context selection"):
        contract.open_case(pid, "PROMO", "Forged context", '[{"fake":"post"}]')


def test_non_adverse_party_cannot_open_application_appeal(direct_deploy, direct_vm, direct_accounts):
    vm = direct_vm
    vm.warp("2026-10-26T12:00:00+00:00")
    contract = direct_deploy(CONTRACT)
    rid = ratified_room(contract, vm, direct_accounts)
    vm.sender = direct_accounts[0]
    pid = contract.publish_post(rid, 0, TEXT)
    vm.sender = direct_accounts[3]
    cid = contract.open_case(pid, "PROMO", "Possible promotion", "[]")
    vm.warp("2026-10-26T12:03:00+00:00")
    contract.freeze_case(cid)
    decision = json.dumps({"finding": "MINOR_BREACH", "clause_id": "PROMO",
        "anchor": "20-contract benchmark includes seeded flaws",
        "reason": "The frozen passage is a minor breach of the ratified promotion rule."})
    vm.mock_llm(r"You interpret a JOINTLY RATIFIED", decision)
    contract.adjudicate_case(cid)
    vm.sender = direct_accounts[3]
    with vm.expect_revert("adversely affected"):
        contract.open_appeal(cid, "The reporter cannot appeal this author sanction.")
