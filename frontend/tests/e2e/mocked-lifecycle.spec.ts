/* eslint-disable @typescript-eslint/no-explicit-any */
import {test,expect,type Page} from '@playwright/test';
import {abi} from 'genlayer-js';
import {bytesToHex,fromRlp,hexToBytes} from 'viem';

// This suite is deliberately a deterministic browser integration harness. It
// exercises the real React screens, calldata path, transaction recovery and
// role changes; it is not presented as StudioNet evidence.
const CONTRACT=process.env.NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS??'';
const A='0x'+'1'.repeat(40);
const B='0x'+'2'.repeat(40);
const A2='0x'+'3'.repeat(40);
const B2='0x'+'4'.repeat(40);
const POLICY={text:'Synthetic evidence-first room policy.',clauses:[
  {id:'PROMO',text:'Unsolicited commercial solicitation is prohibited.',max_severity:'SERIOUS'},
  {id:'EVIDENCE',text:'Technical claims must describe evidence and limitations.',max_severity:'MINOR'}
],vote_minutes:2,defense_minutes:2,appeal_minutes:2,suspension_minutes:2};

type MockState={communities:Record<string,any>[];room:any;posts:Record<string,any>[];cases:Record<string,any>[];writes:number};
function makeState():MockState {
  const community=(id:number,name:string,members:string[])=>({id,name,description:`${name} public description`,status:'ACTIVE',founders:members,accepted:members,members,charters:[{version:1,text:'Evidence-first charter.'}],vote_minutes:2,member_vote:null,charter_vote:null,created_at:1000});
  const room={id:1,a:1,b:2,status:'ACTIVE',version:1,policies:[{version:1,policy:POLICY,ratified_at:1000}],consent:null,vote:null,post_count:1,featured_post:0,feature_vote:null,created_at:1000};
  return {communities:[community(1,'Builders Collective',[A,A2,'0x'+'5'.repeat(40)]),community(2,'Research Forum',[B,B2,'0x'+'6'.repeat(40)])],room,posts:[{id:1,room_id:1,parent_id:0,author:A,body:'A public benchmark discussion with evidence.',status:'VISIBLE',case_id:0,active_case_id:0,challenge_ids:[],challenged_clauses:[],policy_version:1,policy:POLICY,at:1000}],cases:[],writes:0};
}

function decodeCall(data:unknown):{method:string;args:unknown[]} {
  try{
    const outer=fromRlp(String(data) as `0x${string}`) as `0x${string}`[];
    const decoded=abi.calldata.decode(hexToBytes(outer[0])) as Map<string,unknown>;
    return {method:String(decoded.get('method')??''),args:(decoded.get('args') as unknown[]|undefined)??[]};
  }catch{return {method:'',args:[]};}
}
function now(){return Math.floor(Date.now()/1000);}
function applyWrite(state:MockState,method:string,from:string){
  state.writes+=1;
  if(method==='create_community'){
    const id=state.communities.length+1;
    state.communities.push({id,name:'Browser-created community',description:'Synthetic integration record',status:'FOUNDING',founders:[from,A2,B2],accepted:[from],members:[],charters:[{version:1,text:'Synthetic charter.'}],vote_minutes:2,member_vote:null,charter_vote:null,created_at:now()});
  }
  if(method==='publish_post'){
    const id=state.posts.length+1;
    state.posts.push({id,room_id:1,parent_id:0,author:from,body:'Mocked deterministic lifecycle post',status:'VISIBLE',case_id:0,active_case_id:0,challenge_ids:[],challenged_clauses:[],policy_version:1,policy:POLICY,at:now()});
    state.room.post_count=id;
  }
  if(method==='open_case'){
    const post=state.posts.at(-1)!;const id=state.cases.length+1;
    const caseFile={id,post_id:post.id,room_id:1,author:post.author,reporter:from,clause_id:'PROMO',allegation:'Synthetic clause-specific allegation.',post_text:post.body,context:[],policy:POLICY,policy_version:1,defense:'',defense_submitted:false,opened_at:now(),defense_due:now()-1,status:'OPEN',digest:'mock-original-digest',finding:'',decision:null,original_finding:'',original_decision:null,appeal_due:0,appeal:null,sanction_until:0};
    state.cases.push(caseFile);post.status='UNDER_REVIEW';post.case_id=id;post.active_case_id=id;post.challenge_ids=[id];post.challenged_clauses=['PROMO'];
  }
  const current=state.cases.at(-1);
  if(current&&method==='submit_defense'){current.defense='Synthetic defense submitted by the author.';current.defense_submitted=true;}
  if(current&&method==='freeze_case'){current.status='FROZEN';}
  if(current&&method==='adjudicate_case'){current.status='DECIDED';current.finding='NO_VIOLATION';current.decision={finding:'NO_VIOLATION',clause_id:'PROMO',anchor:'Mocked deterministic lifecycle post',reason:'The frozen synthetic post is contextual and does not establish a prohibited solicitation.'};current.original_finding='NO_VIOLATION';current.original_decision=current.decision;current.appeal_due=now()-1;state.posts.find(p=>p.id===current.post_id)!.status='VISIBLE';}
  if(current&&method==='open_appeal'){current.status='APPEAL_OPEN';current.appeal={appellant:current.reporter,grounds:'The first reading should be reconsidered.',response:'',response_submitted:false,response_due:now()-1,status:'OPEN',digest:'',decision:null};}
  if(current&&method==='submit_appeal_response'){current.appeal.response='Synthetic opposing response.';current.appeal.response_submitted=true;}
  if(current&&method==='freeze_appeal'){current.status='APPEAL_FROZEN';current.appeal.status='FROZEN';current.appeal.digest='mock-appeal-digest';}
  if(current&&method==='adjudicate_appeal'){current.status='CLOSED';current.appeal.status='DECIDED';current.appeal.decision={finding:'NO_VIOLATION',clause_id:'PROMO',anchor:'Mocked deterministic lifecycle post',reason:'The appellate reassessment preserves the nonviolation outcome.'};state.posts.find(p=>p.id===current.post_id)!.status='RESTORED';state.posts.find(p=>p.id===current.post_id)!.active_case_id=0;}
}
function readValue(state:MockState,method:string,args:unknown[]):unknown {
  const n=(value:unknown)=>Number(value);
  if(method==='get_counts')return {communities:state.communities.length,rooms:1,posts:state.posts.length,cases:state.cases.length};
  if(method==='list_communities')return state.communities.slice(Math.max(0,n(args[0])-1),Math.max(0,n(args[0])-1)+n(args[1])).map(c=>({id:c.id,name:c.name,description:c.description,status:c.status,member_count:c.members.length}));
  if(method==='list_rooms')return [state.room];
  if(method==='list_cases')return state.cases.map(c=>({id:c.id,post_id:c.post_id,room_id:c.room_id,status:c.status,finding:c.finding,author:c.author}));
  if(method==='get_community')return state.communities.find(c=>c.id===n(args[0]))??'';
  if(method==='get_room')return state.room;
  if(method==='get_post')return state.posts.find(p=>p.id===n(args[0]))??'';
  if(method==='list_posts')return state.posts.slice(n(args[1]),n(args[1])+n(args[2]));
  if(method==='get_case')return state.cases.find(c=>c.id===n(args[0]))??'';
  if(method==='get_restriction')return {suspended:false,entries:[]};
  return '';
}

async function installMock(page:Page,state:MockState){
  await page.route('**/*',async route=>{
    const request=route.request();
    if(request.url().includes('/crossrule-e2e-write')){
      const body=request.postDataJSON() as {method:string;from:string};
      applyWrite(state,body.method,body.from);
      return route.fulfill({status:200,contentType:'application/json',body:'{}'});
    }
    if(!request.url().includes('studio.genlayer.com'))return route.continue();
    const body=request.postDataJSON() as {id:number;method:string;params:any[]};
    if(body.method==='gen_call'){
      const call=decodeCall(body.params?.[0]?.data);const encoded=bytesToHex(abi.calldata.encode(JSON.stringify(readValue(state,call.method,call.args))));
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({jsonrpc:'2.0',id:body.id,result:{data:encoded.slice(2)}})});
    }
    if(body.method==='gen_getTransaction'||body.method==='eth_getTransactionByHash'||body.method==='eth_getTransactionReceipt')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({jsonrpc:'2.0',id:body.id,result:{hash:String(body.params?.[0]??''),status:'FINALIZED',result:'MAJORITY_AGREE',txExecutionResult:'FINISHED_WITH_RETURN'}})});
    if(body.method==='eth_getTransactionCount'||body.method==='eth_estimateGas'||body.method==='eth_gasPrice')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({jsonrpc:'2.0',id:body.id,result:'0x0'})});
    return route.continue();
  });
  await page.addInitScript(()=>{
    let account='0x'+'1'.repeat(40);let sequence=0;const listeners=new Map<string,((value:unknown)=>void)[]>();
    const emit=(event:string,value:unknown)=>(listeners.get(event)??[]).forEach(fn=>fn(value));
    const methodHex=(name:string)=>Array.from(new TextEncoder().encode(name)).map(byte=>byte.toString(16).padStart(2,'0')).join('');
    const names=['create_community','accept_foundership','propose_member','accept_membership','vote_member','finalize_member','propose_charter','vote_charter','finalize_charter','propose_room','consent_room','vote_agreement','finalize_agreement','propose_amendment','propose_feature','vote_feature','finalize_feature','publish_post','open_case','submit_defense','freeze_case','adjudicate_case','open_appeal','submit_appeal_response','freeze_appeal','adjudicate_appeal','close_case'];
    (window as unknown as {__switchAccount:(next:string)=>void}).__switchAccount=(next:string)=>{account=next;emit('accountsChanged',[next]);};
    window.ethereum={request:async({method,params})=>{
      if(method==='eth_accounts'||method==='eth_requestAccounts')return [account];
      if(method==='eth_chainId')return '0xf22f';
      if(method==='wallet_switchEthereumChain')return null;
      if(method==='eth_getTransactionCount'||method==='eth_estimateGas')return '0x0';
      if(method==='eth_sendTransaction'){
        const data=String((params?.[0] as {data?:string})?.data??'').toLowerCase();
        const chosen=names.find(name=>data.includes(methodHex(name)))??'';sequence+=1;
        await fetch('/crossrule-e2e-write',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({method:chosen,from:account})});
        return '0x'+sequence.toString(16).padStart(64,'0');
      }
      throw new Error(`Unmocked provider method ${method}`);
    },on:(event,fn)=>{listeners.set(event,[...(listeners.get(event)??[]),fn]);},removeListener:()=>undefined};
  });
}

test.describe('deterministic signed governance and moderation workflow',()=>{
  test.skip(!CONTRACT,'requires the configured contract build used by the browser CI job');
  test('persists sequential write state across roles and appellate closure',async({page})=>{
    const state=makeState();await installMock(page,state);await page.goto('/');
    await page.getByRole('button',{name:'Connect wallet'}).click();
    await expect(page.getByRole('button',{name:'Reconnect wallet'})).toContainText('0x1111');
    await page.getByRole('button',{name:'Shared rooms',exact:true}).click();
    await page.getByRole('button',{name:'Room #1'}).click();
    await page.getByLabel('Your public contribution').fill('Mocked deterministic lifecycle post');
    const publish=page.getByRole('button',{name:'Publish on-chain'});
    await publish.scrollIntoViewIfNeeded();
    await page.evaluate(()=>window.scrollBy(0,500));
    await publish.press('Enter');
    await expect(page.getByText(/finalized successfully with a successful contract execution/)).toBeVisible();
    await page.evaluate((next)=>{(window as unknown as {__switchAccount:(account:string)=>void}).__switchAccount(next);},B);
    await expect(page.getByRole('button',{name:'Reconnect wallet'})).toContainText('0x2222');
    await page.getByRole('button',{name:/Mocked deterministic lifecycle post/}).press('Enter');
    await page.getByLabel('Applicable clause').selectOption('PROMO');
    await page.getByLabel('Your evidence-grounded allegation').fill('This is a deterministic clause-specific challenge.');
    await page.getByRole('button',{name:'Submit rule challenge'}).press('Enter');
    await expect(page.getByText('A challenge is currently active.')).toBeVisible();

    await page.getByRole('button',{name:'Moderation cases'}).press('Enter');
    await page.getByRole('button',{name:'Case #1'}).press('Enter');
    await page.evaluate(()=>{(window as unknown as {__switchAccount:(next:string)=>void}).__switchAccount('0x'+'1'.repeat(40));});
    await page.getByLabel("Author's formal defense").fill('The post is a synthetic public test record.');
    await page.getByRole('button',{name:'Submit defense'}).press('Enter');
    await expect(page.getByText(/submit defense finalized successfully/)).toBeVisible();
    const freezeCase=page.getByRole('button',{name:'Freeze after deadline'});
    await expect(freezeCase).toBeEnabled();
    await freezeCase.press('Enter');
    await expect(page.getByText(/freeze case finalized successfully/)).toBeVisible();
    await page.getByRole('button',{name:'Request GenLayer adjudication'}).press('Enter');
    await expect(page.getByText('Consensus-backed ruling')).toBeVisible();

    await page.evaluate(()=>{(window as unknown as {__switchAccount:(next:string)=>void}).__switchAccount('0x'+'2'.repeat(40));});
    await page.getByLabel('Appeal grounds').fill('The synthetic context should remain nonviolating.');
    await page.getByRole('button',{name:'Appeal ruling'}).press('Enter');
    await expect(page.getByText(/open appeal finalized successfully/)).toBeVisible();
    await page.evaluate(()=>{(window as unknown as {__switchAccount:(next:string)=>void}).__switchAccount('0x'+'1'.repeat(40));});
    await page.getByLabel('Opposing party response').fill('The author response is recorded.');
    await page.getByRole('button',{name:'Respond to appeal'}).press('Enter');
    await expect(page.getByText(/submit appeal response finalized successfully/)).toBeVisible();
    const freezeAppeal=page.getByRole('button',{name:'Freeze after deadline'});
    await expect(freezeAppeal).toBeEnabled();
    await freezeAppeal.press('Enter');
    await expect(page.getByText(/freeze appeal finalized successfully/)).toBeVisible();
    await page.getByRole('button',{name:'Request appeal adjudication'}).press('Enter');
    await expect(page.getByText('This application case is closed.')).toBeVisible();
    expect(state.writes).toBeGreaterThanOrEqual(9);
  });
});
