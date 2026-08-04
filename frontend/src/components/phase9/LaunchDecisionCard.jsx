import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

const statusIcon = {
  'Ready to Launch': Rocket,
  'Launch After Improvements': ShieldCheck,
  'Needs More Validation': AlertTriangle,
  'Not Recommended': Clock
};

export function LaunchDecisionCard({ decision, timeline }) {
  const StatusIcon = statusIcon[decision.outcome] || Rocket;

  return (
    <motion.section className="phase9-launch-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="launch-decision-head">
        <div>
          <span className="label">Launch decision</span>
          <h2>{decision.outcome}</h2>
        </div>
        <div className="launch-status-icon"><StatusIcon size={24} /></div>
      </div>

      <p className="launch-decision-copy">{decision.headline}</p>
      <div className="launch-decision-meta">
        <div>
          <span>Confidence</span>
          <strong>{decision.confidence}%</strong>
        </div>
        <div>
          <span>Priority</span>
          <strong>{decision.priority}</strong>
        </div>
      </div>

      <div className="launch-progress-block">
        <span>Readiness score</span>
        <div className="launch-progress-bar"><span style={{ width: `${decision.progress}%` }} /></div>
      </div>

      <p className="launch-decision-detail">{decision.details}</p>

      <div className="launch-timeline">
        <span className="label">Launch timeline</span>
        <div className="launch-timeline-list">
          {timeline.map((item) => (
            <div key={item.label} className={`timeline-step ${item.status}`}>
              <span className="timeline-dot" />
              <div>
                <strong>{item.label}</strong>
                <small>{item.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
