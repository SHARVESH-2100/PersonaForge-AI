import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function RevenueLineChart({ data }) {
  return (
    <motion.article className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
      <div className="chart-card-heading">
        <span>Revenue Forecast</span>
        <strong>Q3 growth</strong>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 30, right: 0, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#ffffff14" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #fff1', color: '#fff' }} />
            <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: '#7c3aed' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">Forecasted revenue is up 38% from the previous quarter.</p>
    </motion.article>
  );
}
