import { motion } from 'framer-motion';

export function SimulatorMetricCard({ label, value, unit, accent }) {
  return (
    <motion.article className="simulator-metric-card" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="simulator-metric-label">{label}</div>
      <div className="simulator-metric-value">
        <motion.strong key={value} animate={{ opacity: [0.6, 1], y: [-6, 0] }} transition={{ duration: 0.35 }}>
          {value}
          <small>{unit}</small>
        </motion.strong>
      </div>
      <div className="simulator-metric-bar">
        <motion.span style={{ background: accent }} initial={{ width: 0 }} animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} transition={{ duration: 0.45, ease: 'easeOut' }} />
      </div>
    </motion.article>
  );
}
