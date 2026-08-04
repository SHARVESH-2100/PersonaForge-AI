import { motion } from 'framer-motion';

export function ScenarioPanel({ eyebrow, title, description, children, delay = 0 }) {
  return <motion.section className="scenario-panel" initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} transition={{ duration: .45, delay }}>
    <div className="scenario-panel-head"><span>{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>
    <div className="scenario-panel-body">{children}</div>
  </motion.section>;
}
