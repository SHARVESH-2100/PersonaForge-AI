import { motion } from 'motion/react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

export function CompetitorRadar({ data }) {
  return (
    <motion.article className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div className="chart-card-heading">
        <span>Competitor comparison</span>
        <strong>Radar analysis</strong>
      </div>
      <div className="chart-wrapper radar">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={data} outerRadius="80%">
            <PolarGrid stroke="#ffffff14" radialLines={false} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #fff1', color: '#fff' }} />
            <Radar name="Us" dataKey="us" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
            <Radar name="Rival" dataKey="rival" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.16} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 8 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.article>
  );
}
