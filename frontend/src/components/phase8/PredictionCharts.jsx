import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

export function PredictionCharts({ history }) {
  return (
    <div className="prediction-charts-grid">
      <motion.article className="prediction-chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="chart-card-heading">
          <span>Purchase forecast</span>
          <strong>Scenario momentum</strong>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history} margin={{ top: 16, right: 14, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#ffffff12" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #ffffff18', color: '#fff' }} />
            <Line type="monotone" dataKey="purchaseProbability" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} animationDuration={500} />
          </LineChart>
        </ResponsiveContainer>
      </motion.article>

      <motion.article className="prediction-chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        <div className="chart-card-heading">
          <span>Risk & readiness</span>
          <strong>Launch balance</strong>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={history} margin={{ top: 16, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#ffffff12" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #ffffff18', color: '#fff' }} />
            <Bar dataKey="riskScore" stackId="a" fill="#f97316" radius={[10, 10, 0, 0]} animationDuration={500} />
            <Bar dataKey="launchReadiness" stackId="a" fill="#22c55e" radius={[10, 10, 0, 0]} animationDuration={500} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }} />
          </BarChart>
        </ResponsiveContainer>
      </motion.article>
    </div>
  );
}
