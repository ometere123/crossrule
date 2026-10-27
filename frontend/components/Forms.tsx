'use client';
import type {ReactNode} from 'react';

export function Field({label,value,onChange,placeholder='',type='text',min,max,rows=0,help}: {
  label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;min?:number;max?:number;rows?:number;help?:string;
}) {
  const id='f-'+label.toLowerCase().replace(/[^a-z0-9]/g,'-');
  return <div className="field"><label htmlFor={id}>{label}</label>
    {rows? <textarea id={id} rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={max}/>:
      <input id={id} value={value} onChange={e=>onChange(e.target.value)} type={type} min={min} max={max} placeholder={placeholder} maxLength={type==='number'?undefined:max}/>}
    {help&&<div className="footnote">{help}</div>}
  </div>;
}

export function SelectField({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[]}) {
  const id='s-'+label.toLowerCase().replace(/[^a-z0-9]/g,'-');
  return <div className="field"><label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
  </div>;
}
export function Panel({title,children,aside}:{title:string;children:ReactNode;aside?:ReactNode}) {
  return <section className="panel"><div className="between" style={{marginBottom:17}}><h2 style={{margin:0}}>{title}</h2>{aside}</div>{children}</section>;
}
export function Empty({children}:{children:ReactNode}){return <div className="empty">{children}</div>;}
export function Status({value}:{value:string}) {
  const color=/SERIOUS|HIDDEN|REJECTED|ERROR/.test(value)?'danger':/PENDING|OPEN|RATIFYING|REVIEW|FROZEN|MINOR/.test(value)?'warning':/ACTIVE|CLOSED|VISIBLE|RESTORED|NO_VIOLATION/.test(value)?'':'muted';
  return <span className={`pill ${color}`}>{value.replaceAll('_',' ')}</span>;
}
