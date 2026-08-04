import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

const summaryIcons = {
  validation: ArrowUpRight,
  readiness: ShieldCheck,
  confidence: ShieldCheck,
  risk: ShieldCheck
};

export function ExecutiveSummary({ items }) {
  return (
    <section className="section executive-summary" aria-label="Executive summary">
      <div className="section-header">
        <div>
          <p className="section-label">Executive summary</p>
          <h2>High-level intelligence at a glance</h2>
        </div>
      </div>
      <div className="summary-grid">
        {items.map((item) => {
          const Icon = summaryIcons[item.id] || ArrowUpRight;
          return (
            <motion.article key={item.id} className="glass-card summary-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: item.id === 'risk' ? 0.15 : 0 }}>
              <div className="section-card-head">
                <div className="icon-shell" style={{ background: `${item.accent}22`, color: item.accent }}>
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </div>
              <div className="summary-value">
                <strong>{item.value}<small>{item.suffix}</small></strong>
                <p>{item.detail}</p>
              </div>
              <div className="summary-trend">{item.trend}</div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
