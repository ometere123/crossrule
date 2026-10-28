export type Vote = {voters_a:string[];voters_b:string[];yes_a:string[];yes_b:string[];no_a:string[];no_b:string[];due:number;data:unknown};
export type MemberVote = {candidate:string;voters:string[];yes:string[];no:string[];accepted:boolean;due:number};
export type CharterVote = {text:string;voters:string[];yes:string[];no:string[];due:number};
export type Community = {id:number;name:string;description:string;status:'FOUNDING'|'ACTIVE';founders:string[];accepted:string[];members:string[];charters:{version:number;text:string}[];vote_minutes:number;member_vote:MemberVote|null;charter_vote:CharterVote|null;created_at:number};
export type Clause = {id:string;text:string;max_severity:'MINOR'|'SERIOUS'};
export type Policy = {text:string;clauses:Clause[];vote_minutes:number;defense_minutes:number;appeal_minutes:number;suspension_minutes:number};
export type RoomConsent = {kind:'INITIAL'|'AMENDMENT';proposer:string;consented_a:boolean;consented_b:boolean;consent_by_a:string;consent_by_b:string;policy:Policy;due:number};
export type Room = {id:number;a:number;b:number;status:'CONSENT_PENDING'|'RATIFYING'|'REJECTED'|'ACTIVE';version:number;policies:{version:number;policy:Policy;ratified_at:number}[];consent:RoomConsent|null;vote:Vote|null;post_count:number;featured_post:number;feature_vote:Vote|null;created_at:number;pending_key?:string;pending_counted?:boolean;isolation_reserved?:boolean};
export type CrossrulePost = {id:number;room_id:number;parent_id:number;author:string;body:string;status:'VISIBLE'|'UNDER_REVIEW'|'HIDDEN'|'RESTORED';case_id:number;active_case_id?:number;challenge_ids?:number[];challenged_clauses?:string[];policy_version?:number;policy?:Policy;at:number};
export type Finding = 'NO_VIOLATION'|'INSUFFICIENT_EVIDENCE'|'MINOR_BREACH'|'SERIOUS_BREACH';
export type Decision = {finding:Finding;clause_id:string;anchor:string;reason:string};
export type Appeal = {appellant:string;grounds:string;response:string;response_submitted:boolean;response_due:number;status:string;digest:string;decision:Decision|null};
export type Case = {id:number;post_id:number;room_id:number;author:string;reporter:string;clause_id:string;allegation:string;post_text:string;context:{id:number;body:string;author:string}[];policy:Policy;policy_version:number;defense:string;defense_submitted:boolean;opened_at:number;defense_due:number;status:string;digest:string;finding:Finding|'';decision:Decision|null;original_finding:Finding|'';original_decision:Decision|null;appeal_due:number;appeal:Appeal|null;sanction_until?:number};
export type Counts = {communities:number;rooms:number;posts:number;cases:number};
export type CommunityListItem = Pick<Community,'id'|'name'|'description'|'status'> & {member_count:number};
export type RoomListItem = Pick<Room,'id'|'a'|'b'|'status'|'version'> & {post_count:number;proposal_pending?:boolean};
export type CaseListItem = Pick<Case,'id'|'post_id'|'room_id'|'status'|'finding'|'author'>;
export const EMPTY_COUNTS: Counts = {communities:0,rooms:0,posts:0,cases:0};
export const sampleClauses: Clause[] = [
  {id:'EVIDENCE-01',text:'Material technical claims must describe their supporting evidence and limitations.',max_severity:'MINOR'},
  {id:'PROMO-02',text:'A post whose primary purpose is unsolicited commercial solicitation violates this room policy. Incidental project references in substantive technical discussion are permitted.',max_severity:'SERIOUS'}
];
export const truncate = (value:string,n=14) => value.length>n?`${value.slice(0,6)}…${value.slice(-4)}`:value;
export const formatTime = (timestamp:number) => timestamp?new Date(timestamp*1000).toLocaleString(): '—';
export function secondsLeft(timestamp:number,now=Date.now()) {return Math.max(0,Math.ceil((timestamp*1000-now)/1000));}
export function threshold(total:number) {return Math.ceil(2*total/3);}
export function policyOf(room:Room):Policy|null {return room.version?room.policies[room.policies.length-1].policy:null;}
