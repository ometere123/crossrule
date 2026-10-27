"""Dependency-free tests of actual Crossrule contract logic with a strict GenLayer stub.

This is NOT a replacement for GenVM Direct Mode or live validator evidence.
It runs the same Python contract methods without a network to catch lifecycle bugs.
"""
import importlib.util
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


def fake_llm(prompt, response_format=None):
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
        self.clock = 100000
        self.contract._now = lambda: self.clock
        self.wallets = ['0x'+f'{n:040x}' for n in range(1,9)]
        responses.clear()

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

    def proposal(self):
        ca,cb=self.create_communities()
        self.actor(0)
        rid=self.contract.propose_room(ca,cb,'Joint evidence and promotion standards.',CLAUSES,5,5,5,5)
        return ca,cb,rid

    def room(self):
        ca,cb,rid=self.proposal()
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        return rid

    def frozen_case(self, clause='PROMO'):
        rid=self.room()
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

    def test_duplicate_founders_rejected(self):
        self.actor(0)
        with self.assertRaisesRegex(UserError,'three distinct'):
            self.contract.create_community('X','Description','Charter',self.wallets[0],self.wallets[2],5)

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
        rid,pid,cid=self.frozen_case()
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

    def test_fabricated_quote_rejected(self):
        _,_,cid=self.frozen_case()
        self.mock(finding(anchor='An invented sentence with no matching evidence'))
        with self.assertRaisesRegex(UserError,'validator rejected'):
            self.contract.adjudicate_case(cid)

    def test_appeal_reversal_restores_post_and_restriction(self):
        rid,pid,cid=self.frozen_case()
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
        for slot in (0,1,3,4):
            self.actor(slot)
            self.contract.vote_agreement(rid,True)
        self.contract.finalize_agreement(rid)
        self.assertEqual(self.record(self.contract.get_room(rid))['version'],2)
        existing=self.record(self.contract.get_case(cid))
        self.assertEqual(existing['policy_version'],1)
        self.assertEqual(existing['policy'],old)

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
        r2=self.contract.propose_room(ca,cb,'Room two policy',CLAUSES,2,2,2,2)
        for rid in (r1,r2):
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
        after=self.record(self.contract.get_restriction(rid,self.wallets[0]))['entries'][0]['until']
        self.assertEqual(first,after)
        self.assertEqual(self.record(self.contract.get_case(cid))['original_finding'],'SERIOUS_BREACH')


if __name__=='__main__':
    unittest.main()
