'use client';
import {useCallback,useEffect,useState} from 'react';
import {ArrowRight,ArrowLeft,BookOpen,CheckCircle2,Handshake,Plus,RefreshCw,Scale,ShieldCheck,Users} from 'lucide-react';
import AppShell,{type Screen} from './AppShell';
import {Empty,Field,Panel,SelectField,Status} from './Forms';
import {connectWallet,isConfigured,readJson,recentTransactions,transactionUrl,write} from '@/lib/chain';
import {EMPTY_COUNTS,formatTime,policyOf,sampleClauses,secondsLeft,threshold,truncate,type Case,type CaseListItem,type Community,type CommunityListItem,type Counts,type CrossrulePost,type Room,type RoomListItem} from '@/lib/types';

type FormState=Record<string,string>;
const initial:FormState={name:'',description:'',charter:'',founderB:'',founderC:'',memberMinutes:'5',
  candidate:'',charterUpdate:'',communityA:'',communityB:'',jointText:'',
  clauses:JSON.stringify(sampleClauses,null,2),voteMinutes:'5',defenseMinutes:'5',appealMinutes:'5',suspensionMinutes:'5',
  postText:'',parent:'0',allegation:'',clause:'',context:'',defense:'',grounds:'',appealResponse:'',featurePost:'0'};
const asNumber=(value:string)=>Number.parseInt(value,10)||0;
const emptyMessage='No records on this contract yet.';

export default function CrossruleApp(){
  const [screen,setScreen]=useState<Screen>('overview');
  const [wallet,setWallet]=useState('');
  const [counts,setCounts]=useState<Counts>(EMPTY_COUNTS);
  const [communities,setCommunities]=useState<CommunityListItem[]>([]);
  const [rooms,setRooms]=useState<RoomListItem[]>([]);
  const [cases,setCases]=useState<CaseListItem[]>([]);
  const [community,setCommunity]=useState<Community|null>(null);
  const [room,setRoom]=useState<Room|null>(null);
  const [post,setPost]=useState<CrossrulePost|null>(null);
  const [caseFile,setCaseFile]=useState<Case|null>(null);
  const [roomPosts,setRoomPosts]=useState<CrossrulePost[]>([]);
  const [form,setForm]=useState<FormState>(initial);
  const [working,setWorking]=useState(false);
  const [loading,setLoading]=useState(false);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [tx,setTx]=useState('');
  const [roomTab,setRoomTab]=useState<'discussion'|'rules'|'governance'>('discussion');
  const [postOffset,setPostOffset]=useState(0);
  const [now,setNow]=useState(0);
  const value=(key:string)=>form[key]??'';
  const change=(key:string,val:string)=>setForm(prev=>({...prev,[key]:val}));
  const open=(next:Screen)=>{setScreen(next);setError('');setNotice('');window.scrollTo({top:0,behavior:'smooth'});};

  const refresh=useCallback(async()=>{
    if(!isConfigured)return;
    setLoading(true);
    try{
      const c=await readJson<Counts>('get_counts');
      setCounts(c);
      const [communityList,roomList,caseList]=await Promise.all([
        c.communities?readJson<CommunityListItem[]>('list_communities',[Math.max(1,c.communities-19),Math.min(20,c.communities)]):Promise.resolve([]),
        c.rooms?readJson<RoomListItem[]>('list_rooms',[Math.max(1,c.rooms-19),Math.min(20,c.rooms)]):Promise.resolve([]),
        c.cases?readJson<CaseListItem[]>('list_cases',[Math.max(1,c.cases-19),Math.min(20,c.cases)]):Promise.resolve([])
      ]);
      setCommunities(communityList.reverse());setRooms(roomList.reverse());setCases(caseList.reverse());
    }catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{void Promise.resolve().then(refresh);},[refresh]);
  useEffect(()=>{
    void Promise.resolve().then(()=>setNow(Date.now()));
    const id=window.setInterval(()=>setNow(Date.now()),15000);
    return()=>window.clearInterval(id);
  },[]);
  useEffect(()=>{
    if(!isConfigured)return;
    let alive=true;
    const load=async()=>{
      try{
        if(screen==='community'&&community){const data=await readJson<Community>('get_community',[community.id]);if(alive)setCommunity(data);}
        if((screen==='room'||screen==='post')&&room){
          const data=await readJson<Room>('get_room',[room.id]);
          const posts=await readJson<CrossrulePost[]>('list_posts',[room.id,postOffset,20]);
          if(alive){setRoom(data);setRoomPosts(posts);}
        }
        if(screen==='post'&&post){const data=await readJson<CrossrulePost>('get_post',[post.id]);if(alive)setPost(data);}
        if(screen==='case'&&caseFile){const data=await readJson<Case>('get_case',[caseFile.id]);if(alive)setCaseFile(data);}
      }catch(e){if(alive)setError(e instanceof Error?e.message:String(e));}
    };
    void load();return()=>{alive=false;};
    // Selected record identifiers, not object identity, control detail fetches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screen,community?.id,room?.id,post?.id,caseFile?.id,postOffset]);

  async function send(method:string,args:unknown[]){
    setError('');setNotice('');setTx('');setWorking(true);
    try{
      if(!wallet)throw new Error('Connect a StudioNet wallet first.');
      const hash=await write(method,args,wallet,setTx);
      setNotice(`${method.replaceAll('_',' ')} finalized successfully.`);
      await refresh();
      if(community){const next=await readJson<Community>('get_community',[community.id]);setCommunity(next);}
      if(room){const next=await readJson<Room>('get_room',[room.id]);setRoom(next);}
      if(post){const next=await readJson<CrossrulePost>('get_post',[post.id]);setPost(next);}
      if(caseFile){const next=await readJson<Case>('get_case',[caseFile.id]);setCaseFile(next);}
      return hash;
    }catch(e){setError(e instanceof Error?e.message:String(e));return '';}
    finally{setWorking(false);}
  }
  const act=(method:string,args:unknown[],label:string)=>
    <button className="btn" disabled={!wallet||!isConfigured||working} onClick={()=>void send(method,args)}>{working?'Tracking…':label}</button>;
  const mini=(method:string,args:unknown[],label:string)=>
    <button className="btn tiny secondary" disabled={!wallet||!isConfigured||working} onClick={()=>void send(method,args)}>{label}</button>;
  async function chooseCommunity(id:number){
    if(!isConfigured)return;
    try{setCommunity(await readJson<Community>('get_community',[id]));open('community');}
    catch(e){setError(String(e));}
  }
  async function chooseRoom(id:number){
    if(!isConfigured)return;
    try{setRoom(await readJson<Room>('get_room',[id]));setPostOffset(0);setRoomTab('discussion');open('room');}
    catch(e){setError(String(e));}
  }
  async function choosePost(id:number){
    try{setPost(await readJson<CrossrulePost>('get_post',[id]));open('post');}
    catch(e){setError(String(e));}
  }
  async function chooseCase(id:number){
    try{setCaseFile(await readJson<Case>('get_case',[id]));open('case');}
    catch(e){setError(String(e));}
  }
  async function showOlder(which:'communities'|'rooms'|'cases'){
    const existing=which==='communities'?communities:which==='rooms'?rooms:cases;
    const oldest=existing.at(-1)?.id??1;
    if(!isConfigured||oldest<=1)return;
    const start=Math.max(1,oldest-20);
    const count=oldest-start;
    setLoading(true);
    try{
      if(which==='communities'){
        const batch=await readJson<CommunityListItem[]>('list_communities',[start,count]);
        setCommunities(prev=>[...prev,...batch.reverse()]);
      }else if(which==='rooms'){
        const batch=await readJson<RoomListItem[]>('list_rooms',[start,count]);
        setRooms(prev=>[...prev,...batch.reverse()]);
      }else{
        const batch=await readJson<CaseListItem[]>('list_cases',[start,count]);
        setCases(prev=>[...prev,...batch.reverse()]);
      }
    }catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setLoading(false);}
  }
  const policy=room?policyOf(room):null;
  const times=(deadline:number)=><span className="small muted" title={formatTime(deadline)}>Due {formatTime(deadline)} ({Math.ceil(secondsLeft(deadline,now)/60)} min left)</span>;

  return <AppShell screen={screen} navigate={open} wallet={wallet} onConnect={()=>void connectWallet().then(setWallet).catch(e=>setError(String(e)))}>
    {loading&&<div className="small muted row"><RefreshCw size={14}/> Refreshing finalized chain state…</div>}
    {error&&<div role="alert" className="notice error" style={{marginBottom:16}}>{error}</div>}
    {notice&&<div role="status" className="notice" style={{marginBottom:16}}>{notice}</div>}
    {tx&&<div className="notice" style={{marginBottom:16}}>Transaction: <a href={transactionUrl(tx)} target="_blank" rel="noreferrer" className="address">{truncate(tx,26)}</a>. Do not resubmit while its outcome is unknown.</div>}

    {screen==='overview'&&<>
      <section className="hero"><span className="eyebrow">The collaboration layer for communities</span>
        <h1>Different communities.<br/><span className="gradient-text">One shared agreement.</span></h1>
        <p>Co-govern public discussions without handing control to one moderator. Ratify shared rules, challenge decisions, and rely on independently checked GenLayer adjudication.</p>
        <div className="row" style={{marginTop:27,flexWrap:'wrap'}}><button className="btn" onClick={()=>open('create')}><Plus size={17}/>Create a community</button>
          <button className="btn secondary" onClick={()=>open('communities')}>Explore communities <ArrowRight size={15}/></button></div>
      </section>
      <div className="grid3 section"><div className="panel"><div className="muted small">Registered communities</div><div className="stats">{counts.communities}</div></div>
        <div className="panel"><div className="muted small">Shared rooms</div><div className="stats">{counts.rooms}</div></div>
        <div className="panel"><div className="muted small">Public cases</div><div className="stats">{counts.cases}</div></div></div>
      <div className="section grid3"><div className="panel"><Users color="var(--mint)"/><h3 style={{marginTop:15}}>Independent communities</h3><p className="muted small">Each community keeps its own charter and member roster.</p></div>
        <div className="panel"><Handshake color="var(--purple)"/><h3 style={{marginTop:15}}>Bilateral consent</h3><p className="muted small">Both sides ratify exactly the same joint policy.</p></div>
        <div className="panel"><Scale color="var(--gold)"/><h3 style={{marginTop:15}}>Enforceable rulings</h3><p className="muted small">Validators examine frozen evidence before moderation state changes.</p></div></div>
      <div className="section grid2"><Panel title="Latest communities">{communities.length?communities.slice(0,4).map(c=><button key={c.id} className="item between" style={{width:'100%',textAlign:'left'}} onClick={()=>void chooseCommunity(c.id)}><span><b>{c.name}</b><span className="muted small"> · {c.member_count} members</span></span><ArrowRight size={16}/></button>):<Empty>{emptyMessage}</Empty>}</Panel>
        <Panel title="Latest cases">{cases.length?cases.slice(0,4).map(c=><button key={c.id} className="item between" style={{width:'100%',textAlign:'left'}} onClick={()=>void chooseCase(c.id)}><span>Case #{c.id} · Post #{c.post_id}</span><Status value={c.status}/></button>):<Empty>{emptyMessage}</Empty>}</Panel></div>
    </>}

    {screen==='communities'&&<><div className="section-head"><div><span className="eyebrow">Independent governance</span><h2>Communities</h2></div><button className="btn" onClick={()=>open('create')}><Plus size={15}/>Create community</button></div>
      <div className="grid2">{communities.map(c=><button key={c.id} className="panel" style={{textAlign:'left'}} onClick={()=>void chooseCommunity(c.id)}><div className="between"><h2>{c.name}</h2><Status value={c.status}/></div><p className="muted">{c.description}</p><div className="between small"><span>{c.member_count} members</span><span className="row">View community <ArrowRight size={15}/></span></div></button>)}</div>{!communities.length&&<Empty>{emptyMessage}</Empty>}{(communities.at(-1)?.id??1)>1&&<button className="btn ghost" onClick={()=>void showOlder('communities')} disabled={loading}>Load older communities</button>}</>}

    {screen==='create'&&<><div className="section-head"><div><span className="eyebrow">Step one</span><h2>Found a community</h2></div></div>
      <div className="grid2"><Panel title="Community registration">
        <Field label="Community name" value={value('name')} onChange={v=>change('name',v)} max={72}/>
        <Field label="Description" value={value('description')} onChange={v=>change('description',v)} rows={3} max={360}/>
        <Field label="Initial charter" value={value('charter')} onChange={v=>change('charter',v)} rows={6} max={3000} help="Published publicly. Its first version cannot be edited in place."/>
        <Field label="Founding wallet B" value={value('founderB')} onChange={v=>change('founderB',v)} placeholder="0x…"/>
        <Field label="Founding wallet C" value={value('founderC')} onChange={v=>change('founderC',v)} placeholder="0x…"/>
        <Field label="Membership and charter voting (minutes)" value={value('memberMinutes')} onChange={v=>change('memberMinutes',v)} type="number" min={2} max={10080}/>
        {act('create_community',[value('name'),value('description'),value('charter'),value('founderB'),value('founderC'),asNumber(value('memberMinutes'))],'Register community')}
      </Panel><Panel title="Founding rules"><div className="stack muted prose"><p>Three distinct wallet addresses must consent to the founding registration. The initiating wallet is the first founder.</p><p>The community becomes active after the other two founders explicitly accept.</p><p>Subsequent admissions and charter changes require a two-thirds membership vote. The founder does not receive an admin override.</p><p>For a short live test, a five-minute voting period is supported. The period remains contract-enforced.</p></div></Panel></div>
    </>}

    {screen==='community'&&community&&<>
      <div className="section-head"><div><button className="btn ghost tiny" onClick={()=>open('communities')}><ArrowLeft size={14}/>All communities</button>
        <h2 style={{marginTop:15}}>{community.name}</h2><div className="muted">{community.description}</div></div><Status value={community.status}/></div>
      <div className="grid2"><Panel title="Membership and founding">
        <p className="small muted">Community #{community.id} · {community.members.length} members · required threshold {threshold(community.members.length)||2}</p>
        <div className="divider"/><h3>Founding wallets</h3>{community.founders.map(a=><div key={a} className="between item"><span className="address">{truncate(a,22)}</span>
          <span className={`pill ${community.accepted.includes(a)?'':'warning'}`}>{community.accepted.includes(a)?'Accepted':'Pending'}</span></div>)}
        {community.status==='FOUNDING'&&mini('accept_foundership',[community.id],'Accept my founding invitation')}
        {community.status==='ACTIVE'&&<><div className="divider"/><h3>Member roster</h3>{community.members.map(a=><div key={a} className="item address">{a}</div>)}</>}
      </Panel><Panel title="Admission governance">
        {community.member_vote?<><div className="item"><b>Applicant: </b><span className="address">{truncate(community.member_vote.candidate,22)}</span><div className="footnote">{times(community.member_vote.due)}</div>
          <div className="row" style={{marginTop:10}}><span className="pill">{community.member_vote.yes.length}/{threshold(community.member_vote.voters.length)} approvals</span><span className="pill muted">Applicant {community.member_vote.accepted?'accepted':'not yet accepted'}</span></div></div>
          <div className="row" style={{flexWrap:'wrap'}}>{mini('accept_membership',[community.id],'Accept invitation')}{mini('vote_member',[community.id,true],'Approve')}{mini('vote_member',[community.id,false],'Reject')}{mini('finalize_member',[community.id],'Finalize vote')}</div>
        </>:<><Field label="New member wallet" value={value('candidate')} onChange={v=>change('candidate',v)} placeholder="0x…"/>
          {act('propose_member',[community.id,value('candidate')],'Propose admission')}</>}
      </Panel></div>
      <div className="section grid2"><Panel title="Published charter versions">
        {community.charters.map(ch=><div key={ch.version} className="item"><div className="between"><b>Charter version {ch.version}</b><BookOpen size={16}/></div><p className="prose small">{ch.text}</p></div>)}
      </Panel><Panel title="Charter amendment">
        {community.charter_vote?<><div className="item"><b>Proposed revision</b><p className="prose small">{community.charter_vote.text}</p>
          <span className="pill">{community.charter_vote.yes.length}/{threshold(community.charter_vote.voters.length)} approvals</span><div className="footnote">{times(community.charter_vote.due)}</div></div>
          <div className="row" style={{flexWrap:'wrap'}}>{mini('vote_charter',[community.id,true],'Approve')}{mini('vote_charter',[community.id,false],'Reject')}{mini('finalize_charter',[community.id],'Finalize charter')}</div>
        </>:<><Field label="Replacement charter text" value={value('charterUpdate')} onChange={v=>change('charterUpdate',v)} rows={6} max={3000}/>{act('propose_charter',[community.id,value('charterUpdate')],'Propose new charter')}</>}
      </Panel></div>
      <div className="section"><button className="btn secondary" onClick={()=>{change('communityA',String(community.id));open('collaborate');}}><Handshake size={16}/>Propose collaboration</button></div>
    </>}

    {screen==='collaborate'&&<><div className="section-head"><div><span className="eyebrow">Joint governance</span><h2>Propose a shared room</h2></div></div>
      <div className="grid2"><Panel title="Communities and agreement">
        <SelectField label="Community A" value={value('communityA')} onChange={v=>change('communityA',v)} options={[{value:'',label:'Select community'},...communities.map(c=>({value:String(c.id),label:`#${c.id} ${c.name}`}))]}/>
        <SelectField label="Community B" value={value('communityB')} onChange={v=>change('communityB',v)} options={[{value:'',label:'Select partner'},...communities.map(c=>({value:String(c.id),label:`#${c.id} ${c.name}`}))]}/>
        <Field label="Joint agreement text" value={value('jointText')} onChange={v=>change('jointText',v)} rows={7} max={3000} help="The text governs both communities; changes require new bilateral approval."/>
        <Field label="Clause definitions (JSON)" value={value('clauses')} onChange={v=>change('clauses',v)} rows={9} max={3900} help="1–6 clauses, each with id, text and max_severity of MINOR or SERIOUS."/>
      </Panel><Panel title="Ratified timing policy">
        <p className="muted small">Every value is in minutes, from 2 to 10,080 (seven days). These values are included in the exact policy both communities approve.</p>
        <div className="form-grid"><Field label="Voting window" value={value('voteMinutes')} onChange={v=>change('voteMinutes',v)} type="number" min={2} max={10080}/>
          <Field label="Author defense" value={value('defenseMinutes')} onChange={v=>change('defenseMinutes',v)} type="number" min={2} max={10080}/>
          <Field label="Case appeal" value={value('appealMinutes')} onChange={v=>change('appealMinutes',v)} type="number" min={2} max={10080}/>
          <Field label="Serious-breach suspension" value={value('suspensionMinutes')} onChange={v=>change('suspensionMinutes',v)} type="number" min={2} max={10080}/></div>
        <div className="notice" style={{marginBottom:16}}>The five-minute examples are for rapid live testing. Short windows can expire during protocol consensus or finalization delays. Use a longer period for real communities.</div>
        {act('propose_room',[asNumber(value('communityA')),asNumber(value('communityB')),value('jointText'),value('clauses'),asNumber(value('voteMinutes')),asNumber(value('defenseMinutes')),asNumber(value('appealMinutes')),asNumber(value('suspensionMinutes'))],'Submit shared-room proposal')}
      </Panel></div>
    </>}

    {screen==='rooms'&&<><div className="section-head"><div><span className="eyebrow">Bilateral spaces</span><h2>Shared rooms</h2></div><button className="btn" onClick={()=>open('collaborate')}><Plus size={15}/>New collaboration</button></div>
      <div className="grid2">{rooms.map(r=><button key={r.id} className="panel" style={{textAlign:'left'}} onClick={()=>void chooseRoom(r.id)}><div className="between"><h2>Room #{r.id}</h2><Status value={r.status}/></div>
        <p className="muted">Community #{r.a} × Community #{r.b}</p><div className="between small"><span>Agreement v{r.version}</span><span>{r.post_count} posts <ArrowRight size={14} style={{display:'inline'}}/></span></div></button>)}</div>{!rooms.length&&<Empty>{emptyMessage}</Empty>}{(rooms.at(-1)?.id??1)>1&&<button className="btn ghost" onClick={()=>void showOlder('rooms')} disabled={loading}>Load older rooms</button>}</>}

    {screen==='room'&&room&&<><div className="section-head"><div><button className="btn tiny ghost" onClick={()=>open('rooms')}><ArrowLeft size={14}/>All rooms</button>
      <h2 style={{marginTop:15}}>Community #{room.a} × Community #{room.b}</h2><p className="muted small">Room #{room.id} · Policy version {room.version} · {room.posts.length} posts</p></div><Status value={room.status}/></div>
      {room.vote&&<Panel title={room.version?'Pending policy amendment':'Joint ratification'}>
        <p className="prose">{(room.vote.data as {text:string}).text}</p>
        <div className="grid2"><div className="item"><b>Community A</b><div className="stats">{room.vote.yes_a.length}/{threshold(room.vote.voters_a.length)}</div></div>
          <div className="item"><b>Community B</b><div className="stats">{room.vote.yes_b.length}/{threshold(room.vote.voters_b.length)}</div></div></div>
        <p>{times(room.vote.due)}</p><div className="row" style={{flexWrap:'wrap'}}>{mini('vote_agreement',[room.id,true],'Approve agreement')}{mini('vote_agreement',[room.id,false],'Reject')}{mini('finalize_agreement',[room.id],'Finalize ratification')}</div>
      </Panel>}
      {room.status==='ACTIVE'&&<><div className="tabs" role="tablist" aria-label="Room sections">
        {(['discussion','rules','governance'] as const).map(tab=><button key={tab} role="tab" aria-selected={roomTab===tab} className={roomTab===tab?'selected':''} onClick={()=>setRoomTab(tab)}>{tab[0].toUpperCase()+tab.slice(1)}</button>)}
      </div>
      {roomTab==='discussion'&&<div className="grid2 discussion-grid"><div className="stack"><Panel title="Publish in this room">
        <Field label="Your public contribution" value={value('postText')} onChange={v=>change('postText',v)} rows={5} max={1200}/>
        <Field label="Reply to post ID (0 for a new thread)" value={value('parent')} onChange={v=>change('parent',v)} type="number" min={0}/>
        {act('publish_post',[room.id,asNumber(value('parent')),value('postText')],'Publish on-chain')}
        <div className="footnote">Immutable after submission. Posted data remains publicly inspectable even if moderated.</div>
      </Panel><Panel title="Discussion feed" aside={<span className="pill">{room.posts.length} posts</span>}>
        {roomPosts.length?roomPosts.map(p=><button key={p.id} className="item" style={{width:'100%',textAlign:'left'}} onClick={()=>void choosePost(p.id)}>
          <div className="between"><span className="address">{truncate(p.author,19)}</span><Status value={p.status}/></div>
          <p className="prose">{p.status==='HIDDEN'?'This post is hidden from the official feed. Public chain records remain available.':p.body}</p>
          <div className="between small muted"><span>#{p.id}{p.parent_id?` · Reply to #${p.parent_id}`:''}{room.featured_post===p.id?' · Featured':''}</span><span>{formatTime(p.at)}</span></div>
        </button>):<Empty>No posts yet. Publish the first discussion.</Empty>}
        <div className="row">{postOffset>0&&<button className="btn tiny ghost" onClick={()=>setPostOffset(Math.max(0,postOffset-20))}>Previous</button>}
          {room.posts.length>postOffset+20&&<button className="btn tiny ghost" onClick={()=>setPostOffset(postOffset+20)}>Next</button>}</div>
      </Panel></div><div className="stack"><Panel title="Room constitution"><span className="pill">Ratified v{room.version}</span><p className="prose small">{policy?.text}</p><button className="btn secondary tiny" onClick={()=>setRoomTab('rules')}>Read all clauses <ArrowRight size={14}/></button></Panel>
        <Panel title="Featured discussion"><p className="small muted">Featured posts require independent approval by both communities.</p>
          <div className="item">{room.featured_post?`Post #${room.featured_post}`:'No post currently featured'}</div>
          {room.feature_vote&&<p className="small">Pending candidate #{String(room.feature_vote.data)} · {times(room.feature_vote.due)}</p>}
          <Field label="Feature post ID (0 to unfeature)" value={value('featurePost')} onChange={v=>change('featurePost',v)} type="number" min={0}/>
          <div className="row" style={{flexWrap:'wrap'}}>{mini('propose_feature',[room.id,asNumber(value('featurePost'))],'Propose feature')}
            {room.feature_vote&&<>{mini('vote_feature',[room.id,true],'Approve')}{mini('vote_feature',[room.id,false],'Reject')}{mini('finalize_feature',[room.id],'Finalize')}</>}</div>
        </Panel></div></div>}
      {roomTab==='rules'&&<div className="grid2"><Panel title={`Joint agreement · v${room.version}`}><p className="prose">{policy?.text}</p>
        {policy?.clauses.map(c=><div className="item" key={c.id}><div className="between"><b>{c.id}</b><span className="pill">Max: {c.max_severity}</span></div><p className="prose small">{c.text}</p></div>)}
      </Panel><Panel title="Time policy and version archive"><div className="stack small">
        <div className="between"><span>Ratification</span><b>{policy?.vote_minutes} min</b></div>
        <div className="between"><span>Author defense</span><b>{policy?.defense_minutes} min</b></div>
        <div className="between"><span>Appeals</span><b>{policy?.appeal_minutes} min</b></div>
        <div className="between"><span>Serious suspension</span><b>{policy?.suspension_minutes} min</b></div></div><div className="divider"/>
        {room.policies.map(entry=><div className="item" key={entry.version}>Policy v{entry.version} · {formatTime(entry.ratified_at)}</div>)}
      </Panel></div>}
      {roomTab==='governance'&&<div className="grid2"><Panel title="Agreement amendment"><p className="muted small">A proposal does not replace the governing policy until both sides ratify it.</p>
        <Field label="New joint agreement" value={value('jointText')} onChange={v=>change('jointText',v)} rows={6} max={3000}/>
        <Field label="New clauses (JSON)" value={value('clauses')} onChange={v=>change('clauses',v)} rows={8} max={3900}/>
        <div className="form-grid">{(['voteMinutes','defenseMinutes','appealMinutes','suspensionMinutes'] as const).map((key,i)=><Field key={key} label={['Vote minutes','Defense minutes','Appeal minutes','Suspension minutes'][i]} value={value(key)} onChange={v=>change(key,v)} type="number" min={2} max={10080}/>)}</div>
        {act('propose_amendment',[room.id,value('jointText'),value('clauses'),asNumber(value('voteMinutes')),asNumber(value('defenseMinutes')),asNumber(value('appealMinutes')),asNumber(value('suspensionMinutes'))],'Propose amendment')}
      </Panel><Panel title="Governance guarantees"><div className="stack muted prose"><p>Exactly two communities govern this room. Wallets must belong to only one of their voting rosters.</p><p>A two-thirds approval threshold applies separately to each voter snapshot.</p><p>Charter and timing amendments never retroactively modify already opened cases.</p><p>No platform administrator can override these rules.</p></div></Panel></div>}
      </>}
    </>}

    {screen==='post'&&post&&<><div className="section-head"><div><button className="btn tiny ghost" onClick={()=>open('room')}><ArrowLeft size={14}/>Room discussion</button>
      <h2 style={{marginTop:15}}>Post #{post.id}</h2><p className="muted small">{post.author} · {formatTime(post.at)}</p></div><Status value={post.status}/></div>
      <div className="grid2"><Panel title="Published contribution"><p className="prose">{post.body}</p>
        <div className="divider"/><div className="between"><span className="small muted">Room #{post.room_id} · Parent #{post.parent_id||'none'}</span>{post.case_id?<button className="btn secondary tiny" onClick={()=>void chooseCase(post.case_id)}>Inspect case #{post.case_id}</button>:<span className="pill">No case</span>}</div>
        <div className="footnote">This is an immutable public on-chain record. Hiding from a room feed is not deletion.</div>
      </Panel><Panel title="Challenge under a shared rule">
        {post.case_id?<div className="notice">This post already has a case. Reports cannot be duplicated. Open case #{post.case_id} to review its evidence and outcome.</div>:<>
          <SelectField label="Applicable clause" value={value('clause')} onChange={v=>change('clause',v)} options={[{value:'',label:'Select clause'},...(policy?.clauses??[]).map(c=>({value:c.id,label:`${c.id} — ${c.text.slice(0,65)}`}))]}/>
          <Field label="Your evidence-grounded allegation" value={value('allegation')} onChange={v=>change('allegation',v)} rows={6} max={1200}/>
          <Field label="Context post IDs (comma separated, up to 3)" value={value('context')} onChange={v=>change('context',v)} placeholder="12, 13" help="Only earlier posts within this room; their original text is frozen with the case."/>
          {act('open_case',[post.id,value('clause'),value('allegation'),JSON.stringify(value('context').trim()?value('context').split(',').map(s=>asNumber(s.trim())):[])],'Submit rule challenge')}
          <p className="footnote">A report marks the post under review, but it does not automatically impose a sanction.</p>
        </>}
      </Panel></div>
    </>}

    {screen==='cases'&&<><div className="section-head"><div><span className="eyebrow">Independent adjudication</span><h2>Moderation cases</h2></div></div>
      <div className="grid2">{cases.map(c=><button key={c.id} className="panel" style={{textAlign:'left'}} onClick={()=>void chooseCase(c.id)}>
        <div className="between"><h2>Case #{c.id}</h2><Status value={c.status}/></div>
        <p className="muted small">Post #{c.post_id} · Room #{c.room_id}</p><div className="between"><span className="address">{truncate(c.author)}</span>{c.finding&&<Status value={c.finding}/>}</div>
      </button>)}</div>{!cases.length&&<Empty>{emptyMessage}</Empty>}{(cases.at(-1)?.id??1)>1&&<button className="btn ghost" onClick={()=>void showOlder('cases')} disabled={loading}>Load older cases</button>}</>}

    {screen==='case'&&caseFile&&<><div className="section-head"><div><button className="btn tiny ghost" onClick={()=>open('cases')}><ArrowLeft size={14}/>All cases</button>
      <h2 style={{marginTop:15}}>Case #{caseFile.id}</h2><div className="row"><span className="muted small">Post #{caseFile.post_id} · Rule {caseFile.clause_id} · Agreement v{caseFile.policy_version}</span></div></div><Status value={caseFile.status}/></div>
      <div className="grid2"><div className="stack"><Panel title="Frozen case evidence">
        <div className="item"><div className="between"><b>Challenged post</b><span className="address">{truncate(caseFile.author)}</span></div><p className="prose">{caseFile.post_text}</p></div>
        <div className="item"><b>Reporter allegation</b><p className="prose small">{caseFile.allegation}</p><span className="address muted">{truncate(caseFile.reporter,25)}</span></div>
        <div className="item"><b>Author response</b><p className="prose small">{caseFile.defense||'No formal response submitted.'}</p></div>
        {caseFile.context.map(c=><div className="item" key={c.id}><b>Context post #{c.id}</b><p className="prose small">{c.body}</p></div>)}
        <div className="item"><b>Governing clause</b><p className="prose small">{caseFile.policy.clauses.find(c=>c.id===caseFile.clause_id)?.text}</p></div>
        {caseFile.digest&&<div className="item"><b>Original frozen evidence · SHA-256</b><div className="address muted" style={{marginTop:8}}>{caseFile.digest}</div></div>}
        <p className="footnote">Evidence frozen as an auditable case snapshot. Other versions of community rules do not retroactively apply.</p>
      </Panel>
      {caseFile.decision&&<Panel title="Consensus-backed ruling"><Status value={caseFile.finding}/>
        <p className="prose" style={{marginTop:16}}>{caseFile.decision.reason}</p><div className="item"><span className="muted small">Cited original passage:</span><p className="prose">“{caseFile.decision.anchor}”</p></div>
        <div className="footnote">The UI displays finalized contract state only. A transaction that merely entered the protocol queue is not a final ruling.</div>
      </Panel>}
      {caseFile.appeal?.decision&&caseFile.original_decision&&<Panel title="Original ruling · permanently retained"><Status value={caseFile.original_finding}/>
        <p className="prose small" style={{marginTop:12}}>{caseFile.original_decision.reason}</p>
        <div className="footnote">This first ruling remains recorded separately even when the appeal changes the current outcome.</div>
      </Panel>}
      </div><div className="stack"><Panel title="Case lifecycle">
        <div className="timeline"><span>Open</span><span>Defense</span><span>Frozen evidence</span><span>Consensus</span><span>Appeal</span><span>Closed</span></div>
        <div className="divider"/>
        <div className="small muted">Opened {formatTime(caseFile.opened_at)}</div>
        {caseFile.status==='OPEN'&&<><p>{times(caseFile.defense_due)}</p><Field label="Author's formal defense" value={value('defense')} onChange={v=>change('defense',v)} rows={4} max={1200}/>
          <div className="row" style={{flexWrap:'wrap'}}>{mini('submit_defense',[caseFile.id,value('defense')],'Submit defense')}{mini('freeze_case',[caseFile.id],'Freeze after deadline')}</div></>}
        {caseFile.status==='FROZEN'&&<><p className="muted small">The evidence is frozen and ready for substantive validator assessment.</p>{act('adjudicate_case',[caseFile.id],'Request GenLayer adjudication')}</>}
        {caseFile.status==='DECIDED'&&<><p>{times(caseFile.appeal_due)}</p>
          <Field label="Appeal grounds" value={value('grounds')} onChange={v=>change('grounds',v)} rows={4} max={1200}/>
          <div className="row" style={{flexWrap:'wrap'}}>{mini('open_appeal',[caseFile.id,value('grounds')],'Appeal ruling')}{mini('close_case',[caseFile.id],'Close after deadline')}</div></>}
        {caseFile.status==='APPEAL_OPEN'&&<><p>{times(caseFile.appeal?.response_due||0)}</p><div className="item"><b>Appellant&apos;s grounds</b><p className="prose small">{caseFile.appeal?.grounds}</p></div>
          <Field label="Opposing party response" value={value('appealResponse')} onChange={v=>change('appealResponse',v)} rows={4} max={1200}/>
          <div className="row" style={{flexWrap:'wrap'}}>{mini('submit_appeal_response',[caseFile.id,value('appealResponse')],'Respond to appeal')}{mini('freeze_appeal',[caseFile.id],'Freeze after deadline')}</div></>}
        {caseFile.status==='APPEAL_FROZEN'&&act('adjudicate_appeal',[caseFile.id],'Request appeal adjudication')}
        {caseFile.status==='CLOSED'&&<div className="notice"><CheckCircle2 size={17}/> This application case is closed. Its public evidence and ruling are retained.</div>}
      </Panel><Panel title="Appeal record"><div className="item">{caseFile.appeal?<><div className="between"><b>Reconsideration</b><Status value={caseFile.appeal.status}/></div>
          <p className="prose small">{caseFile.appeal.grounds}</p>{caseFile.appeal.digest&&<div className="address muted" title="Frozen appeal SHA-256 digest">{caseFile.appeal.digest}</div>}{caseFile.appeal.decision&&<><div className="divider"/><Status value={caseFile.appeal.decision.finding}/><p>{caseFile.appeal.decision.reason}</p></>}</>:<p className="muted small">No application appeal recorded.</p>}</div>
      </Panel></div></div>
    </>}

    {screen==='activity'&&<><div className="section-head"><div><span className="eyebrow">Your workspace</span><h2>My activity</h2></div></div>
      <div className="grid2"><Panel title="Connected wallet"><div className="address">{wallet||'Not connected'}</div>
        <p className="muted small">Wallet addresses identify contract participants, not unique real-world people.</p>
        <div className="divider"/><h3>Community directory</h3><p className="muted small">Browse groups here; listed groups are not necessarily your memberships.</p>
        {communities.map(c=><button key={c.id} className="item between" style={{width:'100%'}} onClick={()=>void chooseCommunity(c.id)}><span>{c.name}</span><ArrowRight size={14}/></button>)}
      </Panel><Panel title="Recent signed transactions"><p className="muted small">Stored locally in this browser to resume inspection after navigation.</p>
        {recentTransactions().filter(t=>!wallet||t.wallet===wallet).map(t=><a key={t.hash} className="item between" href={transactionUrl(t.hash)} target="_blank" rel="noreferrer"><span><b>{t.method.replaceAll('_',' ')}</b><br/><span className="address muted">{truncate(t.hash,23)}</span></span><ArrowRight size={14}/></a>)}
      </Panel></div>
    </>}

    {screen==='audit'&&<><div className="section-head"><div><span className="eyebrow">Tamper-evident history</span><h2>Public audit trail</h2></div></div>
      <div className="notice">Crossrule&apos;s official outcomes come from finalized contract state. Agreements, case evidence and historical findings remain publicly inspectable even when content is hidden from the ordinary discussion feed.</div>
      <div className="section grid2"><Panel title="Ratified rooms and versions">{rooms.map(r=><button className="item between" style={{width:'100%'}} key={r.id} onClick={()=>void chooseRoom(r.id)}><span>Room #{r.id} · v{r.version}</span><Status value={r.status}/></button>)}{!rooms.length&&<Empty>No shared agreements yet.</Empty>}</Panel>
        <Panel title="Moderation records">{cases.map(c=><button className="item between" style={{width:'100%'}} key={c.id} onClick={()=>void chooseCase(c.id)}><span>Case #{c.id} · Post #{c.post_id}</span><Status value={c.finding||c.status}/></button>)}{!cases.length&&<Empty>No case records yet.</Empty>}</Panel></div>
      <div className="row" style={{flexWrap:'wrap'}}>{(rooms.at(-1)?.id??1)>1&&<button className="btn ghost tiny" onClick={()=>void showOlder('rooms')} disabled={loading}>Load older agreement history</button>}{(cases.at(-1)?.id??1)>1&&<button className="btn ghost tiny" onClick={()=>void showOlder('cases')} disabled={loading}>Load older cases</button>}</div>
      <div className="section panel"><div className="row"><ShieldCheck color="var(--mint)"/><b>Trust boundary</b></div><p className="muted prose">This application cannot establish that a wallet is a unique human or erase public blockchain content. It enforces the ratified rules within Crossrule itself, not on unrelated social platforms. Network protocol appeals and contract-level case appeals are distinct.</p></div>
    </>}
    <footer className="section small muted between" style={{borderTop:'1px solid var(--line)',paddingTop:22,flexWrap:'wrap'}}>
      <span>Crossrule · Built for GenLayer StudioNet · Public evidence, bilateral governance</span>
      <button className="btn ghost tiny" onClick={()=>void refresh()}><RefreshCw size={13}/>Refresh finalized data</button>
    </footer>
  </AppShell>;
}
