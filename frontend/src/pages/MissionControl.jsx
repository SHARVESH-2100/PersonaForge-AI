import { useEffect, useState } from 'react';
import { Activity, BrainCircuit, Cpu, Radar, ShieldCheck, Zap } from 'lucide-react';
import { Label, Button } from '../components/Ui';
import './mission-control.css';

const agents=[
  {name:'Persona Synthesiser',role:'Generating behavioural variance',icon:BrainCircuit,color:'violet'},
  {name:'Signal Interpreter',role:'Extracting decision patterns',icon:Radar,color:'teal'},
  {name:'Market Intelligence',role:'Comparing category signals',icon:Activity,color:'yellow'},
  {name:'Safety Observer',role:'Verifying model confidence',icon:ShieldCheck,color:'green'}
];
const events=['Persona group 04 reached consensus','Price acceptance signal recalibrated','New objection cluster identified','Behaviour model confidence increased','Competitive signal archive refreshed'];

export default function MissionControl(){
  const [eventIndex,setEventIndex]=useState(0),[running,setRunning]=useState(true),[elapsed,setElapsed]=useState(42);
  useEffect(()=>{if(!running)return;const id=setInterval(()=>{setElapsed(x=>x+1);setEventIndex(x=>(x+1)%events.length)},2600);return()=>clearInterval(id)},[running]);
  return <section className="page mission-control">
    <div className="mission-hero"><div><Label>MISSION CONTROL / LIVE ORCHESTRATION</Label><h1>The intelligence<br/>behind the signal.</h1><p className="sub">A live operating view of every AI agent turning customer behaviour into a decision you can trust.</p><Button kind={running?'primary':'violet'} onClick={()=>setRunning(x=>!x)}>{running?'Pause system':'Resume system'} <Zap size={13}/></Button></div><div className="mission-status"><i className={running?'live-ring':'live-ring paused'}/><b>{running?'LIVE':'PAUSED'}</b><span>Elapsed {String(Math.floor(elapsed/60)).padStart(2,'0')}:{String(elapsed%60).padStart(2,'0')}</span></div></div>
    <div className="control-grid"><section className="control-panel neural-panel"><div className="panel-head"><Label>BEHAVIOURAL NEURAL MAP</Label><span className="mini-live"><i/> 12,480 NODES ACTIVE</span></div><div className={'neural-map '+(!running?'is-paused':'')}><div className="neural-core"><Cpu size={24}/></div>{Array.from({length:18},(_,i)=><i className="neural-node" key={i} style={{'--x':`${8+(i*37)%84}%`,'--y':`${9+(i*53)%82}%`,'--delay':`${i*.16}s`}}/> )}</div><div className="map-key"><span><i className="key-violet"/>Decision paths</span><span><i className="key-teal"/>High confidence</span><span><i className="key-dim"/>Dormant signal</span></div></section>
      <section className="control-panel activity-panel"><div className="panel-head"><Label>LIVE AI ACTIVITY</Label><span>STREAM_01</span></div><div className="event-stream"><article className="event newest"><i/><div><b>{events[eventIndex]}</b><small>NOW · confidence 94.2%</small></div></article>{events.filter((_,i)=>i!==eventIndex).slice(0,4).map((event,i)=><article className="event" key={event}><i/><div><b>{event}</b><small>{(i+1)*12}s ago · logged</small></div></article>)}</div></section></div>
    <section className="agents-section"><div className="section-row"><div><Label>AI AGENT STATUS</Label><h2>Four systems. One shared truth.</h2></div><span className="mini-live"><i/> ALL AGENTS NOMINAL</span></div><div className="agent-grid">{agents.map(({name,role,icon:Icon,color},i)=><article className="agent-card" key={name}><div className={'agent-icon '+color}><Icon size={18}/></div><div><b>{name}</b><p>{role}</p></div><span className="agent-load">{86-i*7}%</span><div className="agent-bar"><i style={{width:`${86-i*7}%`}}/></div><small><i/> PROCESSING</small></article>)}</div></section>
    <div className="system-grid"><section className="control-panel"><Label>SYSTEM METRICS</Label><div className="system-metrics"><div><span>Inference speed</span><b>84<span>ms</span></b><em>↑ 12% faster</em></div><div><span>Model confidence</span><b>94<span>.2%</span></b><em>↑ stable</em></div><div><span>Signal coverage</span><b>98<span>.6%</span></b><em>↑ 42 segments</em></div></div></section><section className="control-panel"><div className="panel-head"><Label>MISSION TIMELINE</Label><span>SESSION_04</span></div><div className="timeline"><p><i/>Data ingestion <span>Complete</span></p><p><i/>Persona modelling <span>Complete</span></p><p className="current"><i/>Purchase simulation <span>In progress</span></p><p><i/>Decision synthesis <span>Queued</span></p></div></section></div>
  </section>
}
