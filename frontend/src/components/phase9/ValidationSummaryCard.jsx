import { motion } from 'framer-motion';

export function ValidationSummaryCard({ label, value, detail, accent }) {
  return (
    <motion.article className="phase9-summary-card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <div className="summary-card-top">
        <span>{label}</span>
        <strong style={{ color: accent }}>{value}</strong>
      </div>
      <p>{detail}</p>
    </motion.article>
  );
}
