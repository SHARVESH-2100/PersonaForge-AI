import{useEffect,useState}from'react';
import axios from'axios';
import{PRODUCTS_API_URL}from'../config';
import{simulationMessages}from'../data/simulationData';

const INITIAL_VISIBLE=6;
const HISTORY_LIMIT=16;

export function useSimulation(product){
  const[running,setRunning]=useState(true),[speed,setSpeed]=useState(1);
  const[pool,setPool]=useState(simulationMessages);
  const[items,setItems]=useState(simulationMessages.slice(0,INITIAL_VISIBLE));
  const[cursor,setCursor]=useState(INITIAL_VISIBLE);
  const[processed,setProcessed]=useState(1284);
  const[typing,setTyping]=useState(false);
  const[aggregate,setAggregate]=useState(null);
  const[dataStatus,setDataStatus]=useState('');

  useEffect(()=>{
    if(!product?.id)return;
    let cancelled=false;
    setDataStatus('Generating live simulation…');
    axios.post(`${PRODUCTS_API_URL}${product.id}/simulate`)
      .then(r=>{
        if(cancelled)return;
        const sim=(r.data.simulation||[]).filter(x=>x&&x.text);
        if(sim.length){
          setPool(sim);
          setItems(sim.slice(0,INITIAL_VISIBLE));
          setCursor(INITIAL_VISIBLE);
          setAggregate(r.data.aggregate);
          setDataStatus('');
        }else{
          setDataStatus('Falling back to sample simulation.');
        }
      })
      .catch(()=>{if(!cancelled)setDataStatus('Falling back to sample simulation.');});
    return()=>{cancelled=true};
  },[product?.id]);

  useEffect(()=>{
    if(!running||!pool.length)return;
    const delay=3000/speed;
    const id=setInterval(()=>{
      setTyping(true);
      setTimeout(()=>{
        setItems(x=>{const next=pool[cursor%pool.length];return next?[...x.slice(-(HISTORY_LIMIT-1)),next]:x});
        setCursor(x=>x+1);
        setProcessed(x=>x+1);
        setTyping(false);
      },Math.max(300,850/speed));
    },delay);
    return()=>clearInterval(id);
  },[running,speed,cursor,pool]);

  const total=items.length;
  const counts={positive:items.filter(x=>x.sentiment==='positive').length,neutral:items.filter(x=>x.sentiment==='neutral').length,negative:items.filter(x=>x.sentiment==='negative').length};
  const shares={
    positive:Math.round(counts.positive/Math.max(total,1)*100),
    neutral:Math.round(counts.neutral/Math.max(total,1)*100),
    negative:Math.round(counts.negative/Math.max(total,1)*100),
  };
  const avgConfidence=Math.round(items.reduce((a,b)=>a+(b.confidence||0),0)/Math.max(total,1));

  const fallbackAggregate=aggregate!==null?aggregate:Math.round(pool.filter(x=>x.sentiment==='positive').length/Math.max(pool.length,1)*100);

  return{
    running,setRunning,speed,setSpeed,items,processed,typing,
    aggregate:fallbackAggregate,
    shares,counts,avgConfidence,
    dataStatus,
    restart:()=>{setItems(pool.slice(0,INITIAL_VISIBLE));setCursor(INITIAL_VISIBLE);setProcessed(1284)},
  };
}
