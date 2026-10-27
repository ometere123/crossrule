'use client';
import type {ReactNode} from 'react';
import {Scale,LayoutDashboard,Users,Handshake,FileWarning,History,UserCircle,PlusCircle,Network} from 'lucide-react';
import {NETWORK_ID,isConfigured} from '@/lib/chain';
import {truncate} from '@/lib/types';

export type Screen='overview'|'communities'|'create'|'community'|'collaborate'|'rooms'|'room'|'post'|'cases'|'case'|'activity'|'audit';
const links:{id:Screen;label:string;icon:typeof Scale}[]=[
  {id:'overview',label:'Overview',icon:LayoutDashboard},
  {id:'communities',label:'Communities',icon:Users},
  {id:'rooms',label:'Shared rooms',icon:Handshake},
  {id:'cases',label:'Moderation cases',icon:FileWarning},
  {id:'activity',label:'My activity',icon:UserCircle},
  {id:'audit',label:'Public audit',icon:History}
];
export default function AppShell({screen,navigate,wallet,onConnect,onDisconnect,onHome,children}: {
  screen:Screen;navigate:(id:Screen)=>void;wallet:string;onConnect:()=>void;onDisconnect:()=>void;onHome?:()=>void;children:ReactNode
}){
  return <div className="shell">
    <aside className="sidebar">
      <div className="logo"><span className="logo-mark"><Scale size={24}/></span> CROSSRULE</div>
      <div className="tagline">Shared rules. Independent judgment.</div>
      <nav aria-label="Main navigation">
        {links.map(link=><button key={link.id} onClick={()=>navigate(link.id)} className={`nav-item ${screen===link.id?'active':''}`} aria-current={screen===link.id?'page':undefined}>
          <link.icon size={18}/>{link.label}
        </button>)}
        <button className="nav-item" onClick={()=>navigate('create')}><PlusCircle size={18}/>Create community</button>
      </nav>
      <div className="side-bottom"><div className="row"><Network size={16}/> GenLayer StudioNet · {NETWORK_ID}</div>
        <div>Community moderation and group consensus</div>
        {onHome&&<button className="nav-return" onClick={onHome}>← Public Accord Chamber</button>}
      </div>
    </aside>
    <main className="main">
      <div className="topbar"><div className="row topbar-context"><span className="topbar-kicker">ACCORD CHAMBER</span><span className="pill">GENLAYER SOCIAL</span><span className="pill muted">Community Moderation</span></div>
        <div className="row wallet-actions">
          {wallet&&<button className="btn tiny secondary" onClick={onDisconnect}>Disconnect</button>}
          <button className={`btn ${wallet?'secondary':''}`} onClick={onConnect} aria-label={wallet?'Reconnect wallet':'Connect wallet'}>
            <Network size={15}/>{wallet?truncate(wallet):'Connect wallet'}</button>
        </div>
      </div>
      {onHome&&<button className="workspace-home" onClick={onHome}>← Return to public landing</button>}
      {!isConfigured&&<div className="notice" style={{marginBottom:22}}><strong>Source build · not deployed.</strong> Wallet actions become available when a source-matched StudioNet contract address is configured. No deployment is implied.</div>}
      {children}
    </main>
  </div>;
}
