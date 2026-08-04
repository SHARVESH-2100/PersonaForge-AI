import { motion } from 'framer-motion';

export function ReportInsightSection({ section }) {
  return (
    <motion.section className="phase9-insight-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="insight-card-head">
        <div>
          <span className="label">{section.category}</span>
          <h3>{section.title}</h3>
        </div>
        <strong>{section.confidence}%</strong>
      </div>
      <p>{section.explanation}</p>
      {section.items?.length ? (
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.recommendation ? <div className="insight-action"><strong>Pricing recommendation</strong><p>{section.recommendation}</p></div> : null}
    </motion.section>
  );
}
