import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';

const iconMap = {
  focus: Lightbulb,
  pricing: TrendingUp,
  features: Sparkles,
  marketing: ShieldCheck
};

export function DecisionSummary({ items }) {
  return (
    <section className="phase8-decision-summary" aria-label="AI decision summary">
      <div className="summary-head">
        <span className="label">AI decision summary</span>
        <h3>What the model recommends next</h3>
      </div>

      <div className="summary-grid">
        {items.map((item) => {
          const Icon = iconMap[item.id] || Sparkles;
          return (
            <motion.article key={item.id} className="summary-point" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="summary-point-icon">
                <Icon size={18} />
              </div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
