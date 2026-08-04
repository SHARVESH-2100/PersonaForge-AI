import { motion } from 'framer-motion';

export function MetricCard({ label, value, progress, subtitle, accent }) {
  return (
    <motion.article className="phase8-metric-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="metric-top">
        <span>{label}</span>
        <strong style={{ color: accent }}>{value}</strong>
      </div>
      <p>{subtitle}</p>
      <div className="metric-bar" aria-hidden="true">
        <motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} style={{ background: accent }} />
      </div>
    </motion.article>
  );
}
