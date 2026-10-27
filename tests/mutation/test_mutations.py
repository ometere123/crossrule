"""Purposeful mutation checks for the highest-risk CROSSRULE invariants.

Each mutant is loaded from an in-memory altered contract source and exercised
by an existing regression scenario. A mutant is killed only when that scenario
detects the changed contract behavior; import or test-runner failures are
reported as harness errors instead of being counted as kills.
"""
import importlib.util
import json
import pathlib
import types
import unittest


BASE_PATH = pathlib.Path(__file__).resolve().parents[1] / "test_contract_offline.py"
CONTRACT_PATH = BASE_PATH.parents[1] / "contracts" / "Crossrule.py"

base_spec = importlib.util.spec_from_file_location("crossrule_mutation_base", BASE_PATH)
assert base_spec and base_spec.loader
base = importlib.util.module_from_spec(base_spec)
base_spec.loader.exec_module(base)
SOURCE = CONTRACT_PATH.read_text(encoding="utf-8")


def mutant_module(name, old, new):
    if SOURCE.count(old) != 1:
        raise AssertionError(f"mutation {name} did not identify exactly one source site")
    source = SOURCE.replace(old, new, 1)
    module = types.ModuleType(f"crossrule_mutant_{name}")
    module.__file__ = str(CONTRACT_PATH)
    exec(compile(source, str(CONTRACT_PATH), "exec"), module.__dict__)
    return module


MUTATIONS = [
    ("bilateral_threshold", "test_bilateral_majorities_required",
     "return (len(record[\"yes_a\"]) >= self._threshold(record[\"voters_a\"]) and\n                len(record[\"yes_b\"]) >= self._threshold(record[\"voters_b\"]))",
     "return len(record[\"yes_a\"]) >= self._threshold(record[\"voters_a\"])"),
    ("distinct_wallets", "test_existing_overlap_is_rejected_when_pairing_communities",
     "self._require(not set(ra).intersection(rb), \"wallet represents both communities\")",
     "self._require(True, \"wallet represents both communities\")"),
    ("applicant_consent", "test_member_admission_requires_applicant_consent",
     "passed = v[\"accepted\"] and len(v[\"yes\"]) >= self._threshold(v[\"voters\"])",
     "passed = len(v[\"yes\"]) >= self._threshold(v[\"voters\"])"),
    ("voter_snapshot_shape", "test_membership_added_during_pending_vote_does_not_change_snapshot",
     "return {\"voters_a\": ra, \"voters_b\": rb, \"yes_a\": [], \"yes_b\": [],",
     "return {\"voters_a\": list(ra) + [\"0x\" + \"0\" * 40], \"voters_b\": rb, \"yes_a\": [], \"yes_b\": [],"),
    ("duplicate_ballot", "test_double_voting_and_nonmember_rejected",
     "self._require(actor not in record[\"yes_\" + side] and actor not in record[\"no_\" + side], \"already voted\")",
     "self._require(True, \"already voted\")"),
    ("frozen_policy_version", "test_open_case_is_adjudicated_under_its_frozen_policy_version",
     "clause = next(x for x in case[\"policy\"][\"clauses\"] if x[\"id\"] == case[\"clause_id\"])",
     "clause = next(x for x in self._active_policy(room)[\"clauses\"] if x[\"id\"] == case[\"clause_id\"] )"),
    ("ratified_clause_id", "test_invalid_clause_cannot_open_case",
     "self._require(any(x[\"id\"] == clause_id for x in policy[\"clauses\"]), \"unknown clause\")",
     "self._require(True, \"unknown clause\")"),
    ("cross_room_context", "test_context_ids_are_unique_prior_same_room_records",
     "self._require(related[\"room_id\"] == post[\"room_id\"], \"context must belong to room\")",
     "self._require(True, \"context must belong to room\")"),
    ("evidence_digest", "test_frozen_digest_covers_identity_and_evidence_fields",
     "self._require(hashlib.sha256(evidence.encode(\"utf-8\")).hexdigest() == case[\"digest\"],\n                      \"evidence hash mismatch\")",
     "self._require(True, \"evidence hash mismatch\")"),
    ("independent_classification", "test_substantive_validator_disagreement_rejects",
     "return (valid_finding(independent, clause_id, post_text) and\n                    proposed[\"finding\"] == independent[\"finding\"] and\n                    proposed[\"clause_id\"] == independent[\"clause_id\"] and\n                    proposed[\"anchor\"] == independent[\"anchor\"])",
     "return True"),
    ("serious_severity_cap", "test_minor_only_clause_cannot_impose_serious_penalty",
     "self._require(finding != \"SERIOUS_BREACH\" or clause[\"max_severity\"] == \"SERIOUS\",\n                      \"serious finding not authorized by ratified clause\")",
     "self._require(True, \"serious finding not authorized by ratified clause\")"),
    ("posting_restriction", "test_serious_breach_blocks_posting",
     "self._require(not self._restricted(int(rid), self._actor()), \"posting suspension active\")",
     "self._require(True, \"posting suspension active\")"),
    ("appeal_authorization", "test_nonadverse_party_cannot_appeal",
     "self._require(self._actor() == adverse, \"only adversely affected party can appeal\")",
     "self._require(True, \"only adversely affected party can appeal\")"),
    ("one_application_appeal", "test_duplicate_application_appeal_is_rejected",
     "self._require(case[\"status\"] == \"DECIDED\" and case[\"appeal\"] is None and\n                      self._now() <= case[\"appeal_due\"], \"appeal not available\")",
     "self._require(case[\"status\"] in (\"DECIDED\", \"CLOSED\") and (case[\"appeal\"] is None or case[\"status\"] == \"CLOSED\") and\n                      self._now() <= case[\"appeal_due\"], \"appeal not available\")"),
    ("original_decision_history", "test_appeal_reversal_restores_post_and_restriction",
     "case[\"original_decision\"], case[\"original_finding\"] = decision, decision[\"finding\"]",
     "case[\"original_decision\"], case[\"original_finding\"] = None, \"\""),
    ("reversal_restriction_removal", "test_appeal_reversal_restores_post_and_restriction",
     "if finding == \"SERIOUS_BREACH\":",
     "if finding == \"SERIOUS_BREACH\" or original == \"SERIOUS_BREACH\":"),
    ("appeal_suspension_deadline", "test_appeal_upholding_serious_breach_does_not_extend_suspension",
     "existing[\"until\"] if existing else",
     "self._now() + case[\"policy\"][\"suspension_minutes\"] * 60 if existing else"),
    ("appeal_deadline_boundary", "test_appeal_freeze_requires_time_strictly_after_response_deadline",
     "self._require(case[\"status\"] == \"APPEAL_OPEN\" and self._now() > case[\"appeal\"][\"response_due\"],",
     "self._require(case[\"status\"] == \"APPEAL_OPEN\" and self._now() >= case[\"appeal\"][\"response_due\"],"),
    ("counterpart_consent", "test_room_requires_counterpart_consent_before_ratification",
     "self._require(not consent[\"consented_a\"], \"community already consented\")",
     "self._require(True, \"community already consented\")"),
    ("pending_proposal_uniqueness", "test_room_requires_counterpart_consent_before_ratification",
     "self._require(existing_room[\"status\"] not in (\"CONSENT_PENDING\", \"RATIFYING\"),\n                          \"duplicate pending room proposal\")",
     "self._require(True, \"duplicate pending room proposal\")"),
    ("room_consent_expiry_boundary", "test_room_expiry_requires_time_strictly_after_deadline",
     "self._require(self._now() > consent[\"due\"], \"room proposal still active\")",
     "self._require(self._now() >= consent[\"due\"], \"room proposal still active\")"),
    ("pending_capacity_release", "test_successful_ratification_releases_pending_capacity",
     "if room[\"version\"] == 1:\n                # Ratification no longer consumes a bounded pending slot, but\n                # the pair reservation remains authoritative for isolation.\n                self._clear_pending(room)",
     "if False:\n                self._clear_pending(room)"),
    ("reservation_current_roster_release", "test_releasing_reservation_removes_conflict_for_member_admitted_during_vote",
     "current_a = list(self._community(u32(a))[\"members\"])\n        current_b = list(self._community(u32(b))[\"members\"])",
     "current_a = list(ra)\n        current_b = list(rb)"),
    ("reservation_count_on_admission", "test_multiple_reservations_release_one_contribution_at_a_time",
     "self.wallet_conflict_index[key] = str(current + reservations)",
     "self.wallet_conflict_index[key] = str(current + 1)"),
    ("approved_expiry_terminal_transition", "test_approved_ballot_expiry_cannot_overturn_ratification",
     "vote = room[\"vote\"]\n        passed = self._approved(vote)\n        if passed:",
     "vote = room[\"vote\"]\n        passed = False\n        if passed:"),
    ("short_anchor_floor", "test_short_posts_have_adjudicable_full_post_anchors",
     "not (1 <= len(anchor.encode(\"utf-8\")) <= 180)",
     "not (8 <= len(anchor.encode(\"utf-8\")) <= 180)"),
    ("post_continuation", "test_room_posts_continue_beyond_150_and_pages_are_bounded",
     "room[\"post_count\"] += 1",
     "room[\"post_count\"] += 0"),
    ("post_index_integrity", "test_room_posts_continue_beyond_150_and_pages_are_bounded",
     "self.room_post_index[f\"{int(rid)}:{ordinal}\"] = str(int(pid))",
     "self.room_post_index[f\"{int(rid)}:{ordinal}\"] = \"999999\""),
    ("challenge_finality", "test_restoration_does_not_reopen_challenge_or_restore_feature",
     "self._require(post[\"case_id\"] == 0, \"post has already been challenged\")",
     "self._require(True, \"post has already been challenged\")"),
    ("validator_leader_context", "test_validator_prompt_contains_untrusted_leader_proposal",
     "independent = assess(evidence, appeal, proposed)",
     "independent = assess(evidence, appeal)"),
    ("feature_removed_on_moderation", "test_restoration_does_not_reopen_challenge_or_restore_feature",
     "if post[\"status\"] == \"HIDDEN\" and room[\"featured_post\"] == post[\"id\"]:\n            room[\"featured_post\"] = 0",
     "if post[\"status\"] == \"HIDDEN\" and room[\"featured_post\"] == post[\"id\"]:\n            room[\"featured_post\"] = post[\"id\"]"),
]


class SecurityMutations(unittest.TestCase):
    def test_high_risk_mutations_are_killed(self):
        original_module = base.module
        results = []
        try:
            for name, test_name, old, new in MUTATIONS:
                mutant = mutant_module(name, old, new)
                base.module = mutant
                case = base.CrossruleLifecycle(test_name)
                case.setUp()
                try:
                    getattr(case, test_name)()
                except (AssertionError, base.UserError) as exc:
                    results.append((name, "killed", type(exc).__name__))
                except Exception as exc:
                    self.fail(f"{name} caused a harness/runtime error instead of a behavioral assertion: {exc!r}")
                else:
                    results.append((name, "survived", ""))
        finally:
            base.module = original_module
        survivors=[name for name,status,_ in results if status=="survived"]
        print("MUTATION_REPORT=" + json.dumps(results, sort_keys=True))
        self.assertFalse(survivors, f"dangerous mutations survived: {survivors}; results={results}")
        self.assertEqual(len(results),31)
