import { motion } from 'motion/react';

export function RiskCard({ risk }) {
  return (
    <motion.article className="glass-card risk-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="risk-head">
        <span>{risk.title}</span>
        <strong>{risk.tag}</strong>
      </div>
      <div className="risk-meter">
        <div className="risk-meter-bar" style={{ width: `${risk.score}%`, background: risk.color }} />
      </div>
      <div className="risk-detail">
        <strong>{risk.score}%</strong>
        <p>{risk.detail}</p>
      </div>
    </motion.article>
  );
}
