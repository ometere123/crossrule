"""Dependency-free tests of actual Crossrule contract logic with a strict GenLayer stub.

This is NOT a replacement for GenVM Direct Mode or live validator evidence.
It runs the same Python contract methods without a network to catch lifecycle bugs.
"""
import importlib.util
import hashlib
import json
import pathlib
import re
import sys
import types
import unittest


class UserError(Exception):
    pass


class Return:
    def __init__(self, value):
        self.calldata = value


class FakeTreeMap(dict):
    @classmethod
    def __class_getitem__(cls, item):
        return cls


class FakePublic:
    @staticmethod
    def write(method):
        return method

    @staticmethod
    def view(method):
        return method


responses = []
prompts = []


def fake_llm(prompt, response_format=None):
    prompts.append(prompt)
    if not responses:
        raise UserError('missing mocked LLM response')
    return responses.pop(0)


def fake_consensus(leader, validator):
    proposed = leader()
    if not validator(Return(proposed)):
        raise UserError('independent validator rejected leader')
    return proposed


class FakeAddress:
    def __init__(self,value):
        if isinstance(value,bytes) and len(value)==20:
            value='0x'+value.hex()
        if not isinstance(value,str) or not re.fullmatch(r'0x[0-9a-fA-F]{40}',value):
            raise ValueError('invalid address')
        self.as_hex=value.lower()

    def __str__(self):
        return self.as_hex


gl = types.SimpleNamespace(
    Contract=object,
    message=types.SimpleNamespace(sender_address='0x'+'1'*40),
    public=FakePublic(),
    nondet=types.SimpleNamespace(exec_prompt=fake_llm),
    vm=types.SimpleNamespace(UserError=UserError, Return=Return, run_nondet_unsafe=fake_consensus),
)
fake_module = types.ModuleType('genlayer')
fake_module.gl, fake_module.TreeMap, fake_module.u32, fake_module.u8, fake_module.Address = gl, FakeTreeMap, int, int, FakeAddress
sys.modules['genlayer'] = fake_module
path = pathlib.Path(__file__).resolve().parents[1]/'contracts'/'Crossrule.py'
spec = importlib.util.spec_from_file_location('crossrule_contract_for_tests', path)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


POST = 'Our 20-contract benchmark includes seeded flaws, methodology and a short note about a premium package.'
CLAUSES = json.dumps([
    {'id':'PROMO','text':'No unsolicited sales pitches; contextual technical links are allowed.','max_severity':'SERIOUS'},
    {'id':'EVIDENCE','text':'Material technical assertions require support.','max_severity':'MINOR'},
])


def finding(label='NO_VIOLATION', clause='PROMO', anchor='20-contract benchmark includes seeded flaws'):
    return {'finding':label,'clause_id':clause,'anchor':anchor,
            'reason':'The frozen post, surrounding context and joint clause support this classification.'}


class CrossruleLifecycle(unittest.TestCase):
    def setUp(self):
        self.contract = module.Crossrule()
        self.contract.communities, self.contract.rooms = FakeTreeMap(), FakeTreeMap()
        self.contract.posts, self.contract.cases, self.contract.restrictions = FakeTreeMap(), FakeTreeMap(), FakeTreeMap()
        self.contract.restriction_until_index = FakeTreeMap()
        self.contract.room_post_index = FakeTreeMap()
        self.contract.community_partner_index = FakeTreeMap()
        self.contract.pair_reservation_counts = FakeTreeMap()
        self.contract.wallet_conflict_index = FakeTreeMap()
        self.contract.pending_room_pairs = FakeTreeMap()
        self.contract.pending_room_count = 0
        self.clock = 100000
        self.contract._now = lambda: self.clock
        self.wallets = ['0x'+f'{n:040x}' for n in range(1,9)]
        responses.clear()
        prompts.clear()

    def actor(self, slot):
        gl.message.sender_address = self.wallets[slot]

    def create_communities(self):
        self.actor(0)
        ca = self.contract.create_community('Builders','Open technical builders','Prototype demonstrations are allowed.',
                                            self.wallets[1],self.wallets[2],5)
        for slot in (1,2):
            self.actor(slot)
            self.contract.accept_foundership(ca)
        self.actor(3)
        cb = self.contract.create_community('Researchers','Open technical research','Claims require support.',
                                            self.wallets[4],self.wallets[5],5)
        for slot in (4,5):
            self.actor(slot)
            self.contract.accept_foundership(cb)
        return ca,cb

    def proposal(self, suspension=5):
        ca,cb=self.create_communities()
        self.actor(0)
        rid=self.contract.propose_room(ca,cb,'Joint evidence and promotion standards.',CLAUSES,5,5,5,suspension)
        self.actor(3)
        self.contract.consent_room(rid)
        return ca,cb,rid

    def room(self, suspension=5):
        ca,cb,rid=self.proposal(suspension)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        return rid

    def frozen_case(self, clause='PROMO', suspension=5):
        rid=self.room(suspension)
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,clause,'The premium-package mention may be soliciting purchases.','[]')
        self.clock=self.record(self.contract.get_case(cid))['defense_due']+1
        self.contract.freeze_case(cid)
        return rid,pid,cid

    @staticmethod
    def record(raw):
        return json.loads(raw)

    def mock(self, *values):
        responses.extend(json.dumps(value) for value in values)

    def test_empty_deployment(self):
        self.assertEqual(self.record(self.contract.get_counts())['cases'],0)

    def test_room_requires_counterpart_consent_before_ratification(self):
        ca,cb=self.create_communities()
        self.actor(0)
        rid=self.contract.propose_room(ca,cb,'Consent-gated room',CLAUSES,5,5,5,5)
        self.assertEqual(self.record(self.contract.get_room(rid))['status'],'CONSENT_PENDING')
        before=self.contract.room_count
        with self.assertRaisesRegex(UserError,'duplicate pending'):
            self.contract.propose_room(ca,cb,'Duplicate pending room',CLAUSES,5,5,5,5)
        self.assertEqual(self.contract.room_count,before)
        with self.assertRaisesRegex(UserError,'community already consented'):
            self.contract.consent_room(rid)
        self.actor(3)
        self.contract.consent_room(rid)
        room=self.record(self.contract.get_room(rid))
        self.assertEqual(room['status'],'RATIFYING')
        self.assertEqual(len(room['vote']['voters_a']),3)

    def test_expired_counterpart_consent_frees_pending_capacity(self):
        ca,cb=self.create_communities()
        self.actor(0)
        rid=self.contract.propose_room(ca,cb,'Expiring room',CLAUSES,2,2,2,2)
        due=self.record(self.contract.get_room(rid))['consent']['due']
        self.clock=due+1
        self.contract.expire_room_proposal(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['status'],'REJECTED')
        self.assertEqual(self.contract.pending_room_count,0)
        self.actor(0)
        replacement=self.contract.propose_room(ca,cb,'Replacement room',CLAUSES,2,2,2,2)
        self.assertNotEqual(rid,replacement)

    def test_room_expiry_requires_time_strictly_after_deadline(self):
        ca,cb=self.create_communities()
        self.actor(0)
        rid=self.contract.propose_room(ca,cb,'Boundary room',CLAUSES,2,2,2,2)
        due=self.record(self.contract.get_room(rid))['consent']['due']
        self.clock=due
        with self.assertRaisesRegex(UserError,'still active'):
            self.contract.expire_room_proposal(rid)

    def test_successful_ratification_releases_pending_capacity(self):
        rid=self.room()
        self.assertEqual(self.contract.pending_room_count,0)
        self.actor(0)
        replacement=self.contract.propose_room(1,2,'Replacement room',CLAUSES,5,5,5,5)
        self.assertNotEqual(rid,replacement)

    def test_admission_conflict_lookup_does_not_scan_historical_rooms(self):
        ca,cb,rid=self.proposal()
        self.clock=self.record(self.contract.get_room(rid))['vote']['due']+1
        self.contract.finalize_agreement(rid)
        for _ in range(200):
            self.actor(0)
            old=self.contract.propose_room(ca,cb,'Rejected historical proposal',CLAUSES,2,2,2,2)
            self.actor(3)
            self.contract.consent_room(old)
            self.clock=self.record(self.contract.get_room(old))['vote']['due']+1
            self.contract.expire_room_proposal(old)
        calls=[]
        original=self.contract._room
        self.contract._room=lambda number: (calls.append(number), original(number))[1]
        self.assertFalse(self.contract._admission_conflicts_with_room(ca,self.wallets[6]))
        self.assertEqual(calls,[])

    def test_duplicate_founders_rejected(self):
        self.actor(0)
        with self.assertRaisesRegex(UserError,'three distinct'):
            self.contract.create_community('X','Description','Charter',self.wallets[0],self.wallets[2],5)

    def test_address_arguments_accept_runtime_address_objects(self):
        self.assertEqual(self.contract._address(FakeAddress(self.wallets[1])), self.wallets[1])

    def test_bilateral_majorities_required(self):
        _,_,rid=self.proposal()
        for slot in (0,1,2):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        with self.assertRaisesRegex(UserError,'vote ongoing'):
            self.contract.finalize_agreement(rid)
        for slot in (3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['status'],'ACTIVE')

    def test_double_voting_and_nonmember_rejected(self):
        _,_,rid=self.proposal()
        self.actor(0)
        self.contract.vote_agreement(rid,True)
        with self.assertRaisesRegex(UserError,'already voted'):
            self.contract.vote_agreement(rid,False)
        self.actor(7)
        with self.assertRaisesRegex(UserError,'voting snapshot'):
            self.contract.vote_agreement(rid,True)

    def test_expired_proposal_rejected(self):
        _,_,rid=self.proposal()
        self.clock=self.record(self.contract.get_room(rid))['vote']['due']+1
        self.contract.finalize_agreement(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['status'],'REJECTED')

    def test_nonmember_cannot_publish(self):
        rid=self.room()
        self.actor(7)
        with self.assertRaisesRegex(UserError,'membership required'):
            self.contract.publish_post(rid,0,POST)
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'VISIBLE')

    def test_challenge_does_not_instantly_hide(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','A contextual promotion challenge.','[]')
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'UNDER_REVIEW')
        with self.assertRaisesRegex(UserError,'still active'):
            self.contract.freeze_case(cid)

    def test_no_violation_leaves_post_visible(self):
        _,pid,cid=self.frozen_case()
        self.mock(finding(),finding())
        self.contract.adjudicate_case(cid)
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'VISIBLE')

    def test_serious_breach_blocks_posting(self):
        rid,pid,cid=self.frozen_case(suspension=10)
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_case(cid)
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'HIDDEN')
        self.actor(0)
        with self.assertRaisesRegex(UserError,'suspension active'):
            self.contract.publish_post(rid,0,POST)

    def test_minor_only_clause_cannot_impose_serious_penalty(self):
        _,_,cid=self.frozen_case('EVIDENCE')
        self.mock(finding('SERIOUS_BREACH','EVIDENCE'),finding('SERIOUS_BREACH','EVIDENCE'))
        with self.assertRaisesRegex(UserError,'not authorized'):
            self.contract.adjudicate_case(cid)

    def test_substantive_validator_disagreement_rejects(self):
        _,_,cid=self.frozen_case()
        self.mock(finding('SERIOUS_BREACH'),finding('NO_VIOLATION'))
        with self.assertRaisesRegex(UserError,'validator rejected'):
            self.contract.adjudicate_case(cid)

    def test_material_anchor_disagreement_rejects(self):
        _,_,cid=self.frozen_case()
        self.mock(finding(anchor='20-contract benchmark includes seeded flaws'),
                  finding(anchor='premium package'))
        with self.assertRaisesRegex(UserError,'validator rejected'):
            self.contract.adjudicate_case(cid)

    def test_validator_prompt_contains_untrusted_leader_proposal(self):
        _,_,cid=self.frozen_case()
        self.mock(finding(),finding())
        self.contract.adjudicate_case(cid)
        self.assertGreaterEqual(len(prompts),2)
        self.assertIn('LEADER_PROPOSAL=',prompts[1])
        self.assertIn('untrusted candidate',prompts[1])

    def test_fabricated_quote_rejected(self):
        _,_,cid=self.frozen_case()
        self.mock(finding(anchor='An invented sentence with no matching evidence'))
        with self.assertRaisesRegex(UserError,'validator rejected'):
            self.contract.adjudicate_case(cid)

    def test_appeal_reversal_restores_post_and_restriction(self):
        rid,pid,cid=self.frozen_case(suspension=10)
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_case(cid)
        self.actor(0)
        self.contract.open_appeal(cid,'The case omitted the substantive benchmark methodology.')
        self.actor(3)
        self.contract.submit_appeal_response(cid,'The promotion is nevertheless commercially prominent.')
        self.clock=self.record(self.contract.get_case(cid))['appeal']['response_due']+1
        self.contract.freeze_appeal(cid)
        self.mock(finding(),finding())
        self.contract.adjudicate_appeal(cid)
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'RESTORED')
        history=self.record(self.contract.get_case(cid))
        self.assertEqual(history['original_finding'],'SERIOUS_BREACH')
        self.assertEqual(history['finding'],'NO_VIOLATION')
        self.assertEqual(history['original_decision']['finding'],'SERIOUS_BREACH')
        self.actor(0)
        self.assertFalse(self.record(self.contract.get_restriction(rid,self.wallets[0]))['suspended'])
        self.assertEqual(self.record(self.contract.get_restriction(rid,self.wallets[0]))['entries'],[])

    def test_restoration_does_not_reopen_challenge_or_restore_feature(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.contract.propose_feature(rid,pid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_feature(rid,True)
        self.contract.finalize_feature(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['featured_post'],pid)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','Possible promotion','[]')
        self.clock=self.record(self.contract.get_case(cid))['defense_due']+1
        self.contract.freeze_case(cid)
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        self.actor(0)
        self.contract.open_appeal(cid,'The benchmark is contextual research.')
        self.clock=self.record(self.contract.get_case(cid))['appeal']['response_due']+1
        self.contract.freeze_appeal(cid)
        self.mock(finding(),finding())
        self.contract.adjudicate_appeal(cid)
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'RESTORED')
        self.assertEqual(self.record(self.contract.get_room(rid))['featured_post'],0)
        self.actor(3)
        with self.assertRaisesRegex(UserError,'already been challenged'):
            self.contract.open_case(pid,'PROMO','A second challenge','[]')
        self.actor(0)
        self.contract.propose_feature(rid,pid)

    def test_nonadverse_party_cannot_appeal(self):
        _,_,cid=self.frozen_case()
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        self.actor(3)
        with self.assertRaisesRegex(UserError,'adversely affected'):
            self.contract.open_appeal(cid,'Reporter wants to appeal successful complaint.')

    def test_duration_range_enforced(self):
        self.actor(0)
        with self.assertRaisesRegex(UserError,'duration must be'):
            self.contract.create_community('X','Description','Charter',self.wallets[1],self.wallets[2],1)

    def test_member_admission_requires_applicant_consent(self):
        ca,_=self.create_communities()
        self.actor(0)
        self.contract.propose_member(ca,self.wallets[6])
        for slot in (0,1):
            self.actor(slot)
            self.contract.vote_member(ca,True)
        with self.assertRaisesRegex(UserError,'vote ongoing'):
            self.contract.finalize_member(ca)
        self.actor(6)
        self.contract.accept_membership(ca)
        self.contract.finalize_member(ca)
        self.assertIn(self.wallets[6],self.record(self.contract.get_community(ca))['members'])

    def test_charter_is_versioned_and_requires_vote(self):
        ca,_=self.create_communities()
        self.actor(0)
        self.contract.propose_charter(ca,'New charter: benchmark claims include reproducible evidence.')
        self.contract.vote_charter(ca,True)
        with self.assertRaisesRegex(UserError,'vote ongoing'):
            self.contract.finalize_charter(ca)
        self.actor(1)
        self.contract.vote_charter(ca,True)
        self.contract.finalize_charter(ca)
        versions=self.record(self.contract.get_community(ca))['charters']
        self.assertEqual([v['version'] for v in versions],[1,2])

    def test_feature_requires_both_sides_two_thirds(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.contract.propose_feature(rid,pid)
        for slot in (0,1):
            self.actor(slot)
            self.contract.vote_feature(rid,True)
        with self.assertRaisesRegex(UserError,'vote ongoing'):
            self.contract.finalize_feature(rid)
        for slot in (3,4):
            self.actor(slot)
            self.contract.vote_feature(rid,True)
        self.contract.finalize_feature(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['featured_post'],pid)

    def test_amendment_does_not_mutate_existing_case_policy(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','Possible solicitation.','[]')
        old=self.record(self.contract.get_case(cid))['policy']
        self.actor(0)
        self.contract.propose_amendment(rid,'New version is stronger on transparent disclosures.',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(rid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['version'],2)
        existing=self.record(self.contract.get_case(cid))
        self.assertEqual(existing['policy_version'],1)
        self.assertEqual(existing['policy'],old)

    def test_open_case_is_adjudicated_under_its_frozen_policy_version(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','Possible solicitation.','[]')
        self.actor(0)
        minor_clause=json.dumps([{'id':'PROMO','text':'A later policy narrows the allowed severity.','max_severity':'MINOR'}])
        self.contract.propose_amendment(rid,'Later policy',minor_clause,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(rid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.clock=self.record(self.contract.get_case(cid))['defense_due']+1
        self.contract.freeze_case(cid)
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_case(cid)
        self.assertEqual(self.record(self.contract.get_case(cid))['policy_version'],1)
        self.assertEqual(self.record(self.contract.get_case(cid))['finding'],'SERIOUS_BREACH')

    def test_insufficient_evidence_preserves_visible_post(self):
        _,pid,cid=self.frozen_case()
        self.mock(finding('INSUFFICIENT_EVIDENCE'),finding('INSUFFICIENT_EVIDENCE'))
        self.contract.adjudicate_case(cid)
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'VISIBLE')

    def test_minor_breach_hides_without_suspending(self):
        rid,pid,cid=self.frozen_case()
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        self.assertEqual(self.record(self.contract.get_post(pid))['status'],'HIDDEN')
        self.assertFalse(self.record(self.contract.get_restriction(rid,self.wallets[0]))['suspended'])

    def test_serious_suspension_expires(self):
        rid,_,cid=self.frozen_case()
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_case(cid)
        until=self.record(self.contract.get_restriction(rid,self.wallets[0]))['entries'][0]['until']
        self.clock=until+1
        self.actor(0)
        self.contract.publish_post(rid,0,POST)

    def test_late_appeal_is_rejected(self):
        _,_,cid=self.frozen_case()
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        due=self.record(self.contract.get_case(cid))['appeal_due']
        self.clock=due+1
        self.actor(0)
        with self.assertRaisesRegex(UserError,'appeal not available'):
            self.contract.open_appeal(cid,'Very late submission.')

    def test_duplicate_application_appeal_is_rejected(self):
        ca,cb=self.create_communities()
        self.actor(0)
        rid=self.contract.propose_room(ca,cb,'Longer appeal window',CLAUSES,5,2,10,5)
        self.actor(3)
        self.contract.consent_room(rid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','Please reconsider this case.','[]')
        self.clock=self.record(self.contract.get_case(cid))['defense_due']+1
        self.contract.freeze_case(cid)
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        self.actor(0)
        self.contract.open_appeal(cid,'Please reconsider the frozen context.')
        self.clock=self.record(self.contract.get_case(cid))['appeal']['response_due']+1
        self.contract.freeze_appeal(cid)
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_appeal(cid)
        with self.assertRaisesRegex(UserError,'appeal not available'):
            self.contract.open_appeal(cid,'A second application appeal.')

    def test_appeal_freeze_requires_time_strictly_after_response_deadline(self):
        _,_,cid=self.frozen_case()
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        self.actor(0)
        self.contract.open_appeal(cid,'Please reconsider the frozen context.')
        due=self.record(self.contract.get_case(cid))['appeal']['response_due']
        self.clock=due
        with self.assertRaisesRegex(UserError,'still active'):
            self.contract.freeze_appeal(cid)
        self.clock=due+1
        self.contract.freeze_appeal(cid)

    def test_only_author_may_submit_defense(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','Suspected solicitation.','[]')
        with self.assertRaisesRegex(UserError,'author only'):
            self.contract.submit_defense(cid,'A forged author response.')

    def test_reply_must_remain_in_its_room(self):
        ca,cb=self.create_communities()
        self.actor(0)
        r1=self.contract.propose_room(ca,cb,'Room one policy',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(r1)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(r1,True)
        self.contract.finalize_agreement(r1)
        self.actor(0)
        r2=self.contract.propose_room(ca,cb,'Room two policy',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(r2)
        for rid in (r1,r2):
            if self.record(self.contract.get_room(rid))["vote"] is None:
                continue
            for slot in (0,1,3,4):
                self.actor(slot)
                self.contract.vote_agreement(rid,True)
            self.contract.finalize_agreement(rid)
        self.actor(0)
        pid=self.contract.publish_post(r1,0,POST)
        with self.assertRaisesRegex(UserError,'cross-room'):
            self.contract.publish_post(r2,pid,'Attempt to bypass room reply rule.')

    def test_malformed_context_list_fails_closed(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        with self.assertRaisesRegex(UserError,'invalid context selection'):
            self.contract.open_case(pid,'PROMO','A contextual promotion challenge.','[{"unexpected":"object"}]')

    def test_appeal_upholding_serious_breach_does_not_extend_suspension(self):
        rid,pid,cid=self.frozen_case()
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_case(cid)
        first=self.record(self.contract.get_restriction(rid,self.wallets[0]))['entries'][0]['until']
        self.actor(0)
        self.contract.open_appeal(cid,'The commercial context deserves reconsideration.')
        self.clock=self.record(self.contract.get_case(cid))['appeal']['response_due']+1
        self.contract.freeze_appeal(cid)
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_appeal(cid)
        key=self.contract._restriction_key(rid,self.wallets[0])
        # The original five-minute window has elapsed by the time the appeal
        # response window closes. The stored current index must retain that
        # original expiry rather than starting a new suspension clock.
        self.assertLessEqual(int(self.contract.restriction_until_index[key]),first)
        self.assertEqual(self.record(self.contract.get_restriction(rid,self.wallets[0]))['entries'],[])
        self.assertEqual(self.record(self.contract.get_case(cid))['original_finding'],'SERIOUS_BREACH')

    def test_releasing_reservation_removes_conflict_for_member_admitted_during_vote(self):
        ca,cb,rid=self.proposal()
        self.actor(0)
        self.contract.propose_member(ca,self.wallets[6])
        self.actor(6)
        self.contract.accept_membership(ca)
        for slot in (0,1):
            self.actor(slot)
            self.contract.vote_member(ca,True)
        self.contract.finalize_member(ca)
        self.assertTrue(self.contract._admission_conflicts_with_room(cb,self.wallets[6]))
        self.clock=self.record(self.contract.get_room(rid))['vote']['due']+1
        self.contract.expire_room_proposal(rid)
        self.assertFalse(self.contract._admission_conflicts_with_room(cb,self.wallets[6]))
        self.assertEqual(self.contract.wallet_conflict_index[self.contract._conflict_key(self.wallets[6],cb)],'0')

    def test_multiple_reservations_release_one_contribution_at_a_time(self):
        ca,cb=self.create_communities()
        self.actor(0)
        first=self.contract.propose_room(ca,cb,'First room',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(first)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(first,True)
        self.contract.finalize_agreement(first)
        self.actor(0)
        second=self.contract.propose_room(ca,cb,'Second room',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(second)
        self.actor(0)
        self.contract.propose_member(ca,self.wallets[6])
        self.actor(6)
        self.contract.accept_membership(ca)
        for slot in (0,1):
            self.actor(slot)
            self.contract.vote_member(ca,True)
        self.contract.finalize_member(ca)
        key=self.contract._conflict_key(self.wallets[6],cb)
        self.assertEqual(self.contract.wallet_conflict_index[key],'2')
        self.clock=self.record(self.contract.get_room(second))['vote']['due']+1
        self.contract.expire_room_proposal(second)
        self.assertEqual(self.contract.wallet_conflict_index[key],'1')
        self.assertTrue(self.contract._admission_conflicts_with_room(cb,self.wallets[6]))

    def test_approved_ballot_expiry_cannot_overturn_ratification(self):
        _,_,rid=self.proposal()
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.clock=self.record(self.contract.get_room(rid))['vote']['due']+1
        self.contract.expire_room_proposal(rid)
        room=self.record(self.contract.get_room(rid))
        self.assertEqual(room['status'],'ACTIVE')
        self.assertEqual(room['version'],1)

    def test_approved_amendment_expiry_cannot_overturn_version_two(self):
        rid=self.room()
        self.actor(0)
        self.contract.propose_amendment(rid,'Second ratified policy',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(rid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.clock=self.record(self.contract.get_room(rid))['vote']['due']+1
        self.contract.expire_room_proposal(rid)
        room=self.record(self.contract.get_room(rid))
        self.assertEqual(room['status'],'ACTIVE')
        self.assertEqual(room['version'],2)

    def test_short_posts_have_adjudicable_full_post_anchors(self):
        rid=self.room()
        self.actor(0)
        posts=[self.contract.publish_post(rid,0,body) for body in ('x','é','🙂','abcdefg')]
        cases=[]
        self.actor(3)
        for pid,body in zip(posts,('x','é','🙂','abcdefg')):
            cases.append(self.contract.open_case(pid,'PROMO','A short post challenge.','[]'))
        self.clock=max(self.record(self.contract.get_case(cid))['defense_due'] for cid in cases)+1
        for cid,body in zip(cases,('x','é','🙂','abcdefg')):
            self.contract.freeze_case(cid)
            self.mock(finding(anchor=body),finding(anchor=body))
            self.contract.adjudicate_case(cid)
            self.assertEqual(self.record(self.contract.get_case(cid))['finding'],'NO_VIOLATION')

    def test_long_posts_reject_trivial_single_byte_anchor(self):
        self.assertFalse(module.valid_finding(
            finding(anchor='x'), 'PROMO', 'A long x publication with more than one clause-relevant sentence.'))
        self.assertTrue(module.valid_finding(
            finding(anchor='clause-relevant sentence'), 'PROMO',
            'A long publication with more than one clause-relevant sentence.'))

    def test_policy_is_frozen_on_publication_not_case_open(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        published=self.record(self.contract.get_post(pid))
        self.assertEqual(published['policy_version'],1)
        self.actor(0)
        self.contract.propose_amendment(rid,'A later policy',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(rid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','A post-publication challenge.','[]')
        case=self.record(self.contract.get_case(cid))
        self.assertEqual(case['policy_version'],1)
        self.assertEqual(case['policy'],published['policy'])

    def test_clause_aware_serial_challenges_prevent_first_reporter_capture(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        first=self.contract.open_case(pid,'PROMO','First reporter selects one clause.','[]')
        self.clock=self.record(self.contract.get_case(first))['defense_due']+1
        self.contract.freeze_case(first)
        self.mock(finding('NO_VIOLATION','PROMO'),finding('NO_VIOLATION','PROMO'))
        self.contract.adjudicate_case(first)
        self.clock=self.record(self.contract.get_case(first))['appeal_due']+1
        self.contract.close_case(first)
        self.actor(4)
        second=self.contract.open_case(pid,'EVIDENCE','A distinct clause remains reportable.','[]')
        post=self.record(self.contract.get_post(pid))
        self.assertEqual(post['challenge_ids'],[first,second])
        self.assertEqual(post['challenged_clauses'],['PROMO','EVIDENCE'])
        with self.assertRaisesRegex(UserError,'already been challenged under this clause'):
            self.contract.open_case(pid,'EVIDENCE','Duplicate clause report.','[]')

    def test_upheld_breach_blocks_later_clause_challenge(self):
        rid,pid,cid=self.frozen_case('PROMO')
        self.mock(finding('MINOR_BREACH','PROMO'),finding('MINOR_BREACH','PROMO'))
        self.contract.adjudicate_case(cid)
        self.clock=self.record(self.contract.get_case(cid))['appeal_due']+1
        self.contract.close_case(cid)
        self.actor(4)
        with self.assertRaisesRegex(UserError,'upheld breach'):
            self.contract.open_case(pid,'EVIDENCE','Contradictory second report.','[]')

    def test_restriction_index_accepts_more_than_32_current_cases(self):
        rid,_,cid=self.frozen_case(suspension=10)
        key=self.contract._restriction_key(rid,self.wallets[0])
        seeded=[{'case_id':1000+i,'until':self.clock+600+i} for i in range(32)]
        self.contract.restrictions[key]=self.contract._dump(seeded)
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_case(cid)
        current=self.record(self.contract.get_restriction(rid,self.wallets[0]))
        self.assertTrue(current['suspended'])
        self.assertEqual(len(current['entries']),33)
        self.assertEqual(current['entries'][-1]['case_id'],cid)

    def test_current_restriction_lookup_does_not_read_case_history(self):
        rid,pid,cid=self.frozen_case()
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_case(cid)
        original_case=self.contract._case
        self.contract._case=lambda number: (_ for _ in ()).throw(AssertionError('historical case scan'))
        self.assertTrue(self.contract._restricted(rid,self.wallets[0]))
        self.contract._case=original_case

    def test_wrong_wallet_cannot_accept_foundership_or_repeat_consent(self):
        self.actor(0)
        cid=self.contract.create_community('Builders','Description','Charter',self.wallets[1],self.wallets[2],5)
        self.actor(7)
        with self.assertRaisesRegex(UserError,'not invited'):
            self.contract.accept_foundership(cid)
        self.actor(1)
        self.contract.accept_foundership(cid)
        with self.assertRaisesRegex(UserError,'not invited'):
            self.contract.accept_foundership(cid)
        self.assertEqual(self.record(self.contract.get_community(cid))['status'],'FOUNDING')

    def test_existing_overlap_is_rejected_when_pairing_communities(self):
        ca,cb=self.create_communities()
        self.actor(0)
        self.contract.propose_member(ca,self.wallets[6])
        self.actor(6)
        self.contract.accept_membership(ca)
        for slot in (0,1):
            self.actor(slot)
            self.contract.vote_member(ca,True)
        self.contract.finalize_member(ca)
        self.actor(3)
        self.contract.propose_member(cb,self.wallets[6])
        self.actor(6)
        self.contract.accept_membership(cb)
        for slot in (3,4):
            self.actor(slot)
            self.contract.vote_member(cb,True)
        self.contract.finalize_member(cb)
        self.actor(0)
        with self.assertRaisesRegex(UserError,'wallet represents both'):
            self.contract.propose_room(ca,cb,'No overlap',CLAUSES,5,5,5,5)

    def test_overlap_admission_is_rejected_after_room_creation_and_while_pending(self):
        ca,cb,rid=self.proposal()
        self.actor(3)
        self.contract.propose_member(cb,self.wallets[0])
        self.actor(0)
        with self.assertRaisesRegex(UserError,'overlap bilateral'):
            self.contract.accept_membership(cb)
        self.actor(3)
        self.clock=self.record(self.contract.get_community(cb))['member_vote']['due']+1
        self.contract.finalize_member(cb)
        record=self.record(self.contract.get_community(cb))
        self.assertIsNone(record['member_vote'])
        self.assertNotIn(self.wallets[0],record['members'])
        self.assertEqual(self.record(self.contract.get_room(rid))['status'],'RATIFYING')

    def test_membership_added_during_pending_vote_does_not_change_snapshot(self):
        ca,cb,rid=self.proposal()
        self.actor(0)
        self.contract.propose_member(ca,self.wallets[6])
        self.actor(6)
        self.contract.accept_membership(ca)
        for slot in (0,1):
            self.actor(slot)
            self.contract.vote_member(ca,True)
        self.contract.finalize_member(ca)
        vote=self.record(self.contract.get_room(rid))['vote']
        self.assertEqual(len(vote['voters_a']),3)
        self.assertNotIn(self.wallets[6],vote['voters_a'])
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['status'],'ACTIVE')

    def test_clause_schema_is_canonical_bounded_and_strict(self):
        ca,cb=self.create_communities()
        self.actor(0)
        clauses=json.dumps([{'id':'  RULE  ','text':'  A bounded rule.  ','max_severity':'MINOR'}])
        rid=self.contract.propose_room(ca,cb,'Joint text',clauses,5,5,5,5)
        self.actor(3)
        self.contract.consent_room(rid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        policy=self.record(self.contract.get_room(rid))['policies'][0]['policy']
        self.assertEqual(policy['clauses'][0],{'id':'RULE','text':'A bounded rule.','max_severity':'MINOR'})
        self.assertEqual(self.contract._clauses(json.loads(clauses))[0]['id'], 'RULE')
        self.actor(0)
        with self.assertRaisesRegex(UserError,'bad clause'):
            self.contract.propose_amendment(rid,'Bad',json.dumps([{'id':'X','text':'ok','max_severity':'MINOR','extra':1}]),5,5,5,5)
        with self.assertRaisesRegex(UserError,'duplicate/invalid'):
            self.contract.propose_amendment(rid,'Bad',json.dumps([{'id':'X','text':'ok','max_severity':['SERIOUS']}]),5,5,5,5)
        with self.assertRaisesRegex(UserError,'invalid clause text'):
            self.contract.propose_amendment(rid,'Bad',json.dumps([{'id':'X','text':'é'*276,'max_severity':'MINOR'}]),5,5,5,5)

    def test_invalid_clause_cannot_open_case(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        with self.assertRaisesRegex(UserError,'unknown clause'):
            self.contract.open_case(pid,'NOT-RATIFIED','A claim','[]')

    def test_exact_deadline_allows_defense_but_not_freeze(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','A claim','[]')
        due=self.record(self.contract.get_case(cid))['defense_due']
        self.clock=due
        self.actor(0)
        self.contract.submit_defense(cid,'A timely formal defense.')
        with self.assertRaisesRegex(UserError,'still active'):
            self.contract.freeze_case(cid)
        self.clock=due+1
        self.contract.freeze_case(cid)

    def test_duplicate_defense_and_late_defense_are_rejected(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','A claim','[]')
        self.actor(0)
        self.contract.submit_defense(cid,'First defense.')
        with self.assertRaisesRegex(UserError,'defense window closed'):
            self.contract.submit_defense(cid,'Replacement defense.')
        self.clock=self.record(self.contract.get_case(cid))['defense_due']+1
        with self.assertRaisesRegex(UserError,'defense window closed'):
            self.contract.submit_defense(cid,'Late defense.')

    def test_context_ids_are_unique_prior_same_room_records(self):
        ca,cb=self.create_communities()
        self.actor(0)
        r1=self.contract.propose_room(ca,cb,'Room one',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(r1)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(r1,True)
        self.contract.finalize_agreement(r1)
        self.actor(0)
        r2=self.contract.propose_room(ca,cb,'Room two',CLAUSES,2,2,2,2)
        self.actor(3)
        self.contract.consent_room(r2)
        for rid in (r1,r2):
            if self.record(self.contract.get_room(rid))["vote"] is None:
                continue
            for slot in (0,1,3,4):
                self.actor(slot)
                self.contract.vote_agreement(rid,True)
            self.contract.finalize_agreement(rid)
        self.actor(0)
        other=self.contract.publish_post(r2,0,POST)
        target=self.contract.publish_post(r1,0,POST)
        self.actor(3)
        with self.assertRaisesRegex(UserError,'context must belong'):
            self.contract.open_case(target,'PROMO','Cross-room context',json.dumps([other]))
        with self.assertRaisesRegex(UserError,'invalid context selection'):
            self.contract.open_case(target,'PROMO','Duplicate context',json.dumps([1,1]))

    def test_frozen_digest_covers_identity_and_evidence_fields(self):
        rid,pid,cid=self.frozen_case()
        record=self.record(self.contract.get_case(cid))
        digest=record['digest']
        evidence=self.contract._evidence(record)
        self.assertEqual(hashlib.sha256(evidence.encode('utf-8')).hexdigest(),digest)
        record['reporter']=self.wallets[4]
        self.assertNotEqual(hashlib.sha256(self.contract._evidence(record).encode('utf-8')).hexdigest(),digest)
        record['reporter']=self.wallets[3]
        record['allegation']='A materially different allegation.'
        self.assertNotEqual(hashlib.sha256(self.contract._evidence(record).encode('utf-8')).hexdigest(),digest)
        stored=self.record(self.contract.get_case(cid))
        stored['allegation']='tampered after freeze'
        self.contract.cases[cid]=self.contract._dump(stored)
        with self.assertRaisesRegex(UserError,'evidence hash mismatch'):
            self.contract.adjudicate_case(cid)

    def test_unicode_normalization_is_byte_distinct_in_canonical_json(self):
        composed={'text':'é'}
        decomposed={'text':'e\u0301'}
        self.assertNotEqual(self.contract._dump(composed),self.contract._dump(decomposed))
        self.assertNotEqual(hashlib.sha256(self.contract._dump(composed).encode('utf-8')).hexdigest(),
                            hashlib.sha256(self.contract._dump(decomposed).encode('utf-8')).hexdigest())

    def test_hidden_post_cannot_complete_pending_feature_vote(self):
        ca,cb=self.create_communities()
        self.actor(0)
        rid=self.contract.propose_room(ca,cb,'Joint evidence and promotion standards.',CLAUSES,10,2,5,5)
        self.actor(3)
        self.contract.consent_room(rid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.contract.propose_feature(rid,pid)
        self.actor(3)
        cid=self.contract.open_case(pid,'PROMO','Possible promotion','[]')
        self.clock=self.record(self.contract.get_case(cid))['defense_due']+1
        self.contract.freeze_case(cid)
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_feature(rid,True)
        self.contract.finalize_feature(rid)
        room=self.record(self.contract.get_room(rid))
        self.assertEqual(room['featured_post'],0)
        self.assertIsNone(room['feature_vote'])

    def test_feature_and_unfeature_are_bilateral(self):
        rid=self.room()
        self.actor(0)
        pid=self.contract.publish_post(rid,0,POST)
        self.contract.propose_feature(rid,pid)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_feature(rid,True)
        self.contract.finalize_feature(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['featured_post'],pid)
        self.actor(0)
        self.contract.propose_feature(rid,0)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_feature(rid,True)
        self.contract.finalize_feature(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['featured_post'],0)

    def test_room_and_wallet_restrictions_are_independent(self):
        ca,cb=self.create_communities()
        self.actor(0)
        r1=self.contract.propose_room(ca,cb,'Room one',CLAUSES,2,2,2,10)
        self.actor(3)
        self.contract.consent_room(r1)
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(r1,True)
        self.contract.finalize_agreement(r1)
        self.actor(0)
        r2=self.contract.propose_room(ca,cb,'Room two',CLAUSES,2,2,2,10)
        self.actor(3)
        self.contract.consent_room(r2)
        for rid in (r1,r2):
            if self.record(self.contract.get_room(rid))["vote"] is None:
                continue
            for slot in (0,1,3,4):
                self.actor(slot)
                self.contract.vote_agreement(rid,True)
            self.contract.finalize_agreement(rid)
        self.actor(0)
        p1=self.contract.publish_post(r1,0,POST)
        p2=self.contract.publish_post(r2,0,POST)
        self.actor(3)
        c1=self.contract.open_case(p1,'PROMO','Case one','[]')
        c2=self.contract.open_case(p2,'PROMO','Case two','[]')
        due=max(self.record(self.contract.get_case(c1))['defense_due'],self.record(self.contract.get_case(c2))['defense_due'])
        self.clock=due+1
        self.contract.freeze_case(c1)
        self.contract.freeze_case(c2)
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'),finding(),finding())
        self.contract.adjudicate_case(c1)
        self.contract.adjudicate_case(c2)
        self.actor(0)
        self.contract.open_appeal(c1,'The first case should be reconsidered.')
        self.clock=self.record(self.contract.get_case(c1))['appeal']['response_due']+1
        self.contract.freeze_appeal(c1)
        self.mock(finding('SERIOUS_BREACH'),finding('SERIOUS_BREACH'))
        self.contract.adjudicate_appeal(c1)
        self.assertTrue(self.record(self.contract.get_restriction(r1,self.wallets[0]))['suspended'])
        self.assertFalse(self.record(self.contract.get_restriction(r2,self.wallets[0]))['suspended'])
        with self.assertRaisesRegex(UserError,'suspension active'):
            self.contract.publish_post(r1,0,POST)
        self.contract.publish_post(r2,0,POST)

    def test_case_appeal_response_authorization_and_single_use(self):
        rid,pid,cid=self.frozen_case()
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_case(cid)
        self.actor(0)
        self.contract.open_appeal(cid,'Reconsider the context.')
        self.actor(0)
        with self.assertRaisesRegex(UserError,'appeal response unavailable'):
            self.contract.submit_appeal_response(cid,'I am not the respondent.')
        self.actor(3)
        self.contract.submit_appeal_response(cid,'The complaint remains valid.')
        with self.assertRaisesRegex(UserError,'appeal response unavailable'):
            self.contract.submit_appeal_response(cid,'Replacement response.')
        self.clock=self.record(self.contract.get_case(cid))['appeal']['response_due']+1
        self.contract.freeze_appeal(cid)
        self.mock(finding('MINOR_BREACH'),finding('MINOR_BREACH'))
        self.contract.adjudicate_appeal(cid)
        self.assertEqual(self.record(self.contract.get_case(cid))['status'],'CLOSED')

    def test_room_posts_continue_beyond_150_and_pages_are_bounded(self):
        rid=self.room()
        self.actor(0)
        ids=[self.contract.publish_post(rid,0,POST) for _ in range(300)]
        self.assertEqual(ids[0],1)
        self.assertEqual(ids[149],150)
        self.assertEqual(ids[-1],300)
        first=self.record(self.contract.list_posts(rid,0,20))
        middle=self.record(self.contract.list_posts(rid,140,20))
        last=self.record(self.contract.list_posts(rid,280,20))
        self.assertEqual([p['id'] for p in first],[*range(1,21)])
        self.assertEqual([p['id'] for p in middle],[*range(141,161)])
        self.assertEqual([p['id'] for p in last],[*range(281,301)])
        self.assertEqual(self.record(self.contract.list_posts(rid,300,20)),[])
        with self.assertRaisesRegex(UserError,'invalid post cursor'):
            self.contract.list_posts(rid,301,20)
        with self.assertRaisesRegex(UserError,'page size'):
            self.contract.list_posts(rid,0,21)


if __name__=='__main__':
    unittest.main()
