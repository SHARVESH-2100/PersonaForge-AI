import { motion } from 'framer-motion';

export function LaunchDetailCard({ item }) {
  return (
    <motion.article className="launch-detail-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.35 }}>
      <div className="detail-card-head">
        <div>
          <span className="label">{item.title}</span>
          <strong>{item.value}</strong>
        </div>
        <span className={`detail-pill ${item.progress >= 75 ? 'strong' : item.progress >= 50 ? 'moderate' : 'caution'}`}>{item.title === 'Risk Level' ? item.value : `${item.progress}%`}</span>
      </div>
      <p>{item.description}</p>
      {item.progress != null ? (
        <div className="detail-progress-bar">
          <span style={{ width: `${item.progress}%` }} />
        </div>
      ) : null}
    </motion.article>
  );
}
