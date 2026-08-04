import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, ShieldAlert, TrendingUp, Sparkles, Activity } from 'lucide-react';

const priorityStyles = {
  Critical: 'linear-gradient(180deg, #fb7185 0%, #c084fc 100%)',
  High: 'linear-gradient(180deg, #60a5fa 0%, #818cf8 100%)',
  Medium: 'linear-gradient(180deg, #f59e0b 0%, #fb923c 100%)',
  Low: 'linear-gradient(180deg, #22c55e 0%, #86efac 100%)'
};

const iconRegistry = {
  Critical: ShieldAlert,
  High: Zap,
  Medium: TrendingUp,
  Low: Sparkles
};

export function RecommendationCard({ recommendation }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconRegistry[recommendation.priority] || Activity;
  const borderStyle = priorityStyles[recommendation.priority] || priorityStyles.Medium;

  return (
    <motion.article
      className="phase7-recommendation-card"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ borderLeft: `6px solid ${recommendation.accent ?? '#f59e0b'}` }}
    >
      <div className="recommendation-card-header">
        <div className="recommendation-icon" style={{ background: `${recommendation.accent ?? '#ffffff22'}` }}>
          <Icon size={18} />
        </div>
        <div className="recommendation-header-copy">
          <h3>{recommendation.title}</h3>
          <span className={`priority-pill priority-${recommendation.priority.toLowerCase()}`}>{recommendation.priority}</span>
        </div>
      </div>

      <div className="recommendation-metrics">
        <div>
          <label>Impact</label>
          <strong>{recommendation.impact}</strong>
        </div>
        <div>
          <label>Confidence</label>
          <strong>{recommendation.confidence}%</strong>
        </div>
        <div>
          <label>Revenue</label>
          <strong>{recommendation.revenue}</strong>
        </div>
      </div>

      <div className="recommendation-meta">
        <div>
          <label>Difficulty</label>
          <strong>{recommendation.difficulty}</strong>
        </div>
        <div>
          <label>Timeline</label>
          <strong>{recommendation.timeline}</strong>
        </div>
      </div>

      <button
        className="recommendation-toggle"
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide details' : 'View reasoning'}
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            className="recommendation-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div>
              <h4>AI reasoning</h4>
              <p>{recommendation.reasoning}</p>
            </div>
            <div>
              <h4>Suggested next action</h4>
              <p>{recommendation.nextAction}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
