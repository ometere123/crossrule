'use client';

import {useState, type ReactNode} from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleDot,
  FileCheck2,
  Gavel,
  Handshake,
  Network,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {EXPLORER, isConfigured, NETWORK_ID} from '@/lib/chain';
import {truncate, type CaseListItem, type CommunityListItem, type Counts, type RoomListItem} from '@/lib/types';
import {Empty, Status} from './Forms';

type LandingProps = {
  counts: Counts;
  communities: CommunityListItem[];
  rooms: RoomListItem[];
  cases: CaseListItem[];
  loading: boolean;
  wallet: string;
  error: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onEnter: (screen?: 'overview' | 'communities' | 'create' | 'rooms' | 'cases' | 'audit') => void;
};

function Wordmark({light = false}: {light?: boolean}) {
  return <span className={`landing-wordmark ${light ? 'light' : ''}`}>
    <span className="landing-mark" aria-hidden="true"><Scale size={19}/></span>
    <span>CROSSRULE</span>
  </span>;
}

function SectionKicker({children}: {children: ReactNode}) {
  return <span className="landing-kicker"><span className="kicker-line"/>{children}</span>;
}

function WalletNode({label, side, tone}: {label: string; side: 'a' | 'b'; tone: string}) {
  return <div className={`accord-wallet accord-wallet-${side}`}>
    <span className={`accord-wallet-dot ${tone}`}/>
    <span>{label}</span>
  </div>;
}

function AccordDiagram() {
  const [ratified, setRatified] = useState(true);
  return <div className="accord-diagram-wrap">
    <div className="accord-diagram-head">
      <div><span className="eyebrow">Illustrative governance path</span><strong>Two sides. One ratified accord.</strong></div>
      <span className="pill muted">Not live chain state</span>
    </div>
    <div className={`accord-diagram ${ratified ? 'is-ratified' : ''}`}>
      <div className="accord-side accord-side-a">
        <div className="accord-side-label"><span className="side-seal seal-a">A</span><div><b>Community A</b><span>independent roster</span></div></div>
        <WalletNode label="A1" side="a" tone="copper"/><WalletNode label="A2" side="a" tone="copper"/><WalletNode label="A3" side="a" tone="copper"/>
        <div className="accord-vote"><span>2 / 3 approvals</span><div className="vote-track"><i/><i/><i className="empty-dot"/></div><b>YES</b></div>
      </div>
      <div className="accord-center">
        <svg className="accord-lines" viewBox="0 0 420 250" aria-hidden="true" preserveAspectRatio="none">
          <path d="M10 42 C100 42 125 124 198 124"/>
          <path d="M10 124 C95 124 128 124 198 124"/>
          <path d="M10 206 C100 206 125 124 198 124"/>
          <path d="M410 42 C320 42 295 124 222 124"/>
          <path d="M410 124 C325 124 292 124 222 124"/>
          <path d="M410 206 C320 206 295 124 222 124"/>
        </svg>
        <div className="accord-charter">
          <span className="charter-glyph"><FileCheck2 size={23}/></span>
          <span className="charter-label">JOINT CHARTER</span>
          <strong>{ratified ? 'RATIFIED' : 'IN REVIEW'}</strong>
          <span className="charter-meta">version 01 · both sides consent</span>
        </div>
        <div className="accord-validator"><ShieldCheck size={14}/><span>validator-backed interpretation</span></div>
      </div>
      <div className="accord-side accord-side-b">
        <div className="accord-side-label"><span className="side-seal seal-b">B</span><div><b>Community B</b><span>independent roster</span></div></div>
        <WalletNode label="B1" side="b" tone="teal"/><WalletNode label="B2" side="b" tone="teal"/><WalletNode label="B3" side="b" tone="teal"/>
        <div className="accord-vote"><span>2 / 3 approvals</span><div className="vote-track"><i/><i/><i className="empty-dot"/></div><b>YES</b></div>
      </div>
    </div>
    <div className="accord-controls" role="group" aria-label="Illustration state">
      <button className={!ratified ? 'selected' : ''} onClick={() => setRatified(false)} aria-pressed={!ratified}><CircleDot size={14}/> Independent review</button>
      <button className={ratified ? 'selected' : ''} onClick={() => setRatified(true)} aria-pressed={ratified}><Check size={14}/> Both sides ratify</button>
    </div>
    <p className="accord-caption">The motion is an educational model of the decision boundary. It does not display fabricated votes, balances or cases.</p>
  </div>;
}

function LiveRecord({label, value, tone}: {label: string; value: number; tone: 'copper' | 'teal' | 'ivory'}) {
  return <div className={`live-record ${tone}`}><span>{label}</span><strong>{value}</strong><small>{isConfigured ? 'finalized contract state' : 'awaiting deployment configuration'}</small></div>;
}

export default function LandingPage({counts, communities, rooms, cases, loading, wallet, error, onConnect, onDisconnect, onEnter}: LandingProps) {
  return <main className="landing-page">
    <nav className="landing-nav" aria-label="Public navigation">
      <a href="#top" aria-label="CROSSRULE home"><Wordmark/></a>
      <div className="landing-nav-links">
        <a href="#how-it-works">How it works</a>
        <button onClick={() => onEnter('communities')}>Communities <ArrowUpRight size={13}/></button>
        <button onClick={() => onEnter('rooms')}>Shared rooms <ArrowUpRight size={13}/></button>
        <button onClick={() => onEnter('cases')}>Public cases <ArrowUpRight size={13}/></button>
      </div>
      <div className="landing-nav-actions">
        <button className="landing-enter" onClick={() => onEnter('overview')}>Enter application <ArrowRight size={15}/></button>
        {wallet&&<button className="landing-connect" onClick={onDisconnect}>Disconnect</button>}
        <button className="landing-connect" onClick={onConnect} aria-label={wallet ? 'Reconnect wallet' : 'Connect wallet'}>{wallet ? truncate(wallet) : 'Connect wallet'}</button>
      </div>
    </nav>

    {error&&<div role="alert" className="landing-alert">{error}</div>}
    <section className="landing-hero" id="top">
      <div className="hero-copy">
        <SectionKicker>Social governance protocol · GenLayer StudioNet</SectionKicker>
        <h1>One shared space.<br/><em>No shared authority.</em></h1>
        <p>Two independent communities can agree on rules, govern discussions and resolve disputes without surrendering control to either side.</p>
        <div className="hero-actions"><button className="btn landing-primary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior:'smooth'})}>Explore CROSSRULE <ArrowDownRight size={17}/></button><button className="landing-text-link" onClick={() => onEnter('create')}>Create a community <ArrowRight size={15}/></button></div>
        <div className="hero-proof"><span><span className="proof-dot"/>Contract-authoritative state</span><span><span className="proof-dot teal"/>Independent semantic assessment</span></div>
      </div>
      <AccordDiagram/>
    </section>

    <section className="landing-marquee" aria-label="Protocol principles"><span>SHARED SPACE</span><i>✳</i><span>INDEPENDENT ROSTERS</span><i>✳</i><span>FROZEN EVIDENCE</span><i>✳</i><span>PUBLIC ACCOUNTABILITY</span></section>

    <section className="landing-section problem-section">
      <div className="section-intro"><SectionKicker>The problem</SectionKicker><h2>When one moderator holds the key, every rule is a compromise.</h2></div>
      <div className="problem-grid"><div className="problem-statement"><span className="large-index">01</span><p>Shared spaces often ask communities with different charters to trust a single administrator to define the rules, interpret the edge cases and decide the sanction.</p></div><div className="problem-statement"><span className="large-index">02</span><p>CROSSRULE makes that trust boundary explicit: each community keeps its own membership and both sides must independently approve the same rulebook.</p></div><div className="problem-statement"><span className="large-index">03</span><p>When language becomes subjective, frozen evidence is assessed through GenLayer’s leader-and-validator consensus and preserved as public case history.</p></div></div>
    </section>

    <section className="landing-section accord-section" id="how-it-works">
      <div className="section-intro split-intro"><div><SectionKicker>The bilateral agreement</SectionKicker><h2>Cooperation without surrender.</h2></div><p>A room does not become shared because one community votes loudly. The same policy must reach the two-thirds threshold inside each independent roster.</p></div>
      <div className="principle-rail"><div><span>01</span><b>Separate rosters</b><p>No wallet can vote for both sides of one room.</p></div><div><span>02</span><b>Frozen denominator</b><p>Membership changes cannot rewrite a pending vote.</p></div><div><span>03</span><b>One shared version</b><p>The full policy is ratified and versioned together.</p></div></div>
    </section>

    <section className="landing-section lifecycle-section">
      <div className="section-intro split-intro"><div><SectionKicker>How CROSSRULE works</SectionKicker><h2>A governance path you can follow.</h2></div><p>Every step moves through wallet consent, contract state and public readback. The interface is a window into that record, not an authority above it.</p></div>
      <div className="lifecycle-grid"><div className="lifecycle-step"><span>01</span><Users size={21}/><b>Establish communities</b><p>Founders consent, applicants accept, members vote.</p></div><div className="lifecycle-step"><span>02</span><Handshake size={21}/><b>Ratify rules</b><p>Both communities approve the same bounded clauses.</p></div><div className="lifecycle-step"><span>03</span><BookOpen size={21}/><b>Publish</b><p>Members participate in a shared, auditable room.</p></div><div className="lifecycle-step"><span>04</span><Gavel size={21}/><b>Challenge</b><p>A clause-specific case freezes evidence and defense.</p></div><div className="lifecycle-step"><span>05</span><ShieldCheck size={21}/><b>Consensus</b><p>GenLayer independently checks the semantic finding.</p></div><div className="lifecycle-step"><span>06</span><Scale size={21}/><b>Appeal</b><p>A final application-level reassessment remains on record.</p></div></div>
    </section>

    <section className="landing-section judgment-section">
      <div className="judgment-card"><div className="judgment-orbit orbit-one"/><div className="judgment-orbit orbit-two"/><div className="judgment-core"><ShieldCheck size={30}/><span>CONSENSUS</span></div></div>
      <div className="judgment-copy"><SectionKicker>Independent judgment</SectionKicker><h2>Interpretation is checked, not outsourced.</h2><p>The leader produces a structured finding against the frozen post, cited clause, policy version, context and defense. Independent validators assess the substantive classification, not merely whether the JSON looks valid.</p><div className="judgment-list"><span><Check size={15}/> Four bounded findings</span><span><Check size={15}/> Evidence anchors must come from the post</span><span><Check size={15}/> Disagreement fails honestly</span></div><p className="footnote">StudioNet may expose consensus metadata without publishing every validator’s private reasoning. CROSSRULE does not imply that it does.</p></div>
    </section>

    <section className="landing-section live-section">
      <div className="section-intro split-intro"><div><SectionKicker>Real on-chain activity</SectionKicker><h2>Read the chamber as it is.</h2></div><p>These figures come from the deployed contract when configured. An empty contract is a valid beginning, not a reason to invent momentum.</p></div>
      <div className="live-records"><LiveRecord label="Communities" value={counts.communities} tone="copper"/><LiveRecord label="Shared rooms" value={counts.rooms} tone="teal"/><LiveRecord label="Public cases" value={counts.cases} tone="ivory"/><LiveRecord label="Posts" value={counts.posts} tone="copper"/></div>
      {!isConfigured&&<div className="landing-empty-banner"><Network size={18}/><span><b>Source build</b> — configure the source-matched StudioNet contract address to read public records.</span></div>}
    </section>

    <section className="landing-section records-section">
      <div className="records-column"><div className="section-title-row"><div><SectionKicker>Explore communities</SectionKicker><h2>Independent voices.</h2></div><button className="landing-text-link" onClick={() => onEnter('communities')}>View directory <ArrowRight size={15}/></button></div>{communities.length ? <div className="landing-record-list">{communities.slice(0,3).map(community=><button key={community.id} onClick={() => onEnter('communities')} className="landing-record"><span className="record-index">0{community.id}</span><span><b>{community.name}</b><small>{community.member_count} members · {community.status}</small></span><ChevronRight size={17}/></button>)}</div> : <Empty>{loading ? 'Reading finalized community state…' : 'No communities are recorded yet. Enter the application to found the first community.'}</Empty>}</div>
      <div className="records-column"><div className="section-title-row"><div><SectionKicker>Public casebook</SectionKicker><h2>Decisions remain inspectable.</h2></div><button className="landing-text-link" onClick={() => onEnter('cases')}>Open casebook <ArrowRight size={15}/></button></div>{cases.length ? <div className="landing-record-list">{cases.slice(0,3).map(item=><button key={item.id} onClick={() => onEnter('cases')} className="landing-record"><span className="record-index">C{item.id}</span><span><b>Case #{item.id}</b><small>Post #{item.post_id} · Room #{item.room_id}</small></span><Status value={item.finding || item.status}/></button>)}</div> : <Empty>{loading ? 'Reading finalized case state…' : 'No moderation cases are recorded yet. Public evidence will appear here after a challenge is opened.'}</Empty>}</div>
    </section>

    <section className="landing-section rooms-preview"><div className="rooms-preview-copy"><SectionKicker>Shared rooms</SectionKicker><h2>One room, two authorities, a public history.</h2><p>Rooms become active only after both communities approve the full agreement. Policy versions and featured-post decisions stay available for inspection.</p><button className="landing-text-link" onClick={() => onEnter('rooms')}>Explore shared rooms <ArrowRight size={15}/></button></div><div className="rooms-preview-panel"><div className="mini-room-top"><span className="status-orb"/><span>{rooms.length ? `${rooms.length} recorded room${rooms.length === 1 ? '' : 's'}` : 'No active room yet'}</span><span className="pill muted">StudioNet</span></div><div className="mini-room-line"><span>AGREEMENT</span><b>{rooms.length ? 'Bilateral records available' : 'Waiting for two communities'}</b></div><div className="mini-room-line"><span>HISTORY</span><b>Public by design</b></div><div className="mini-room-line"><span>AUTHORITY</span><b>Shared · never singular</b></div></div></section>

    <section className="landing-cta"><div><SectionKicker>The chamber is open</SectionKicker><h2>Build the agreement your communities can stand behind.</h2></div><div className="hero-actions"><button className="btn landing-primary" onClick={() => onEnter('create')}>Create a community <ArrowRight size={17}/></button><button className="landing-cream-link" onClick={() => onEnter('audit')}>Inspect public records <ArrowUpRight size={15}/></button></div></section>

    <footer className="landing-footer"><div className="footer-brand"><Wordmark light/><p>Shared rules. Independent judgment.</p></div><div className="footer-links"><a href={EXPLORER} target="_blank" rel="noreferrer">Explorer <ArrowUpRight size={13}/></a><a href="https://github.com/ometere123/crossrule" target="_blank" rel="noreferrer">Repository <ArrowUpRight size={13}/></a><a href="https://github.com/ometere123/crossrule#readme" target="_blank" rel="noreferrer">Documentation <ArrowUpRight size={13}/></a><span>StudioNet · {NETWORK_ID}</span></div><div className="footer-contract"><span>Contract</span><a href={EXPLORER} target="_blank" rel="noreferrer">Source-matched deployment</a></div></footer>
  </main>;
}
