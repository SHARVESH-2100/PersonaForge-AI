export const Label=({children})=><div className="label">{children}</div>;
export const Button=({children,kind='',...props})=><button className={'button '+kind} {...props}>{children}</button>;
export function Metric({label,value,accent}){return <div className="metric"><span>{label}</span><b style={{color:accent}}>{value}</b></div>}
