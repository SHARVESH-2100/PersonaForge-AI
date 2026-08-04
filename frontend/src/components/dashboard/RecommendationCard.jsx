import { motion } from 'motion/react';

export function RecommendationCard({ item }) {
  return (
    <motion.article className="glass-card recommendation-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="recommendation-head">
        <span>{item.priority}</span>
        <strong>{item.title}</strong>
      </div>
      <div className="recommendation-grid">
        <div>
          <small>Impact</small>
          <p>{item.impact}</p>
        </div>
        <div>
          <small>Difficulty</small>
          <p>{item.difficulty}</p>
        </div>
        <div>
          <small>Timeline</small>
          <p>{item.timeline}</p>
        </div>
      </div>
      <div className="recommendation-foot">
        <span>{item.revenue} revenue</span>
        <strong>{item.confidence}</strong>
        <button type="button">View details</button>
      </div>
    </motion.article>
  );
}
