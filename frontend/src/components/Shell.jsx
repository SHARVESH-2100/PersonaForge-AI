import {useEffect, useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {LayoutGrid,Upload,Boxes,Activity,Sparkles,Settings, Bell} from 'lucide-react';
import { API_BASE_URL } from '../config';
const items=[
  ['/workspace','Workspace',LayoutGrid],
  ['/upload','Product upload',Upload],
  ['/products','Saved products',Boxes],
  ['/simulation','Simulation',Activity],
  ['/report','Final report',Sparkles],
];
export function Shell({children}){
  const location=useLocation();
  const [databaseOnline,setDatabaseOnline]=useState(null);
  const title=items.find(([path])=>path===location.pathname)?.[1]||'Workspace';
  useEffect(()=>{fetch(`${API_BASE_URL}/health`).then(r=>setDatabaseOnline(r.ok)).catch(()=>setDatabaseOnline(false));},[]);
  const status=databaseOnline===null?'CHECKING SYSTEM':databaseOnline?'DATABASE CONNECTED':'DATABASE UNAVAILABLE';
  return <div className="app-shell"><aside className="sidebar"><div className="brand">persona<i>forge</i><sup>AI</sup></div><div className="workspace-picker">⌘ &nbsp; Founder workspace &nbsp;⌄</div><nav>{items.map(([path,label,Icon])=><NavLink className="nav-item" to={path} key={path}><Icon size={16}/>{label}</NavLink>)}</nav><div className="side-footer"><button className="nav-item"><Settings size={16}/>Settings</button><div className="profile-dot"/><span>Alex Founder<small>Personal workspace</small></span></div></aside><main className="main-content"><header><div className="crumb">PERSONAFORGE / <b>{title.toUpperCase()}</b></div><div className="status"><i/> {status} <button aria-label="Notifications"><Bell size={15}/></button></div></header>{children}</main></div>}
