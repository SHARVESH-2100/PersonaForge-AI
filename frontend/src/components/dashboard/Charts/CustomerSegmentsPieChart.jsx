import { motion } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export function CustomerSegmentsPieChart({ data }) {
  return (
    <motion.article className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
      <div className="chart-card-heading">
        <span>Customer segments</span>
        <strong>Audience composition</strong>
      </div>
      <div className="chart-wrapper pie">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #fff1', color: '#fff' }} />
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color ?? '#7c3aed'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        {data.map((entry) => (
          <div key={entry.name} className="legend-item">
            <span style={{ background: entry.color ?? '#7c3aed' }} />
            {entry.name}
          </div>
        ))}
      </div>
    </motion.article>
  );
}
