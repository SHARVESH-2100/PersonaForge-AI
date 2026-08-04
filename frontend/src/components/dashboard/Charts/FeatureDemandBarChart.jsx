import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function FeatureDemandBarChart({ data }) {
  return (
    <motion.article className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="chart-card-heading">
        <span>Feature Demand</span>
        <strong>Priority signals</strong>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 18, right: 0, left: -6, bottom: 0 }}>
            <CartesianGrid stroke="#ffffff14" vertical={false} />
            <XAxis dataKey="feature" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #fff1', color: '#fff' }} />
            <Bar dataKey="value" fill="#38bdf8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">Demand is strongest for intelligent workflow automation.</p>
    </motion.article>
  );
}
