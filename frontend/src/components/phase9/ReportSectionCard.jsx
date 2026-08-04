import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Target, ShieldCheck, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

const iconRegistry = {
  Lightbulb,
  Target,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle
};

export function ReportSectionCard({ section }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconRegistry[section.icon] || Lightbulb;

  return (
    <motion.article className="phase9-section-card" layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} transition={{ duration: 0.35 }}>
      <div className="section-card-head">
        <div className="section-card-icon"><Icon size={20} /></div>
        <div>
          <h3>{section.title}</h3>
          <p>{section.explanation}</p>
        </div>
      </div>

      <div className="section-card-meta">
        <span className="confidence-pill">Confidence {section.confidence}%</span>
        <span className={`priority-pill priority-${section.priority.toLowerCase()}`}>{section.priority}</span>
      </div>

      <button type="button" className="section-toggle" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>
        {expanded ? 'Collapse details' : 'Expand details'}
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div className="section-details" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <p>{section.details}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
