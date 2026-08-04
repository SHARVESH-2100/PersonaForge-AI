import { motion } from 'framer-motion';

export function ControlSelect({ label, description, options, value, onChange }) {
  return (
    <motion.div className="phase8-control-select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
      <div className="control-header">
        <div>
          <h4>{label}</h4>
          <p>{description}</p>
        </div>
        <strong>{value}</strong>
      </div>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </motion.div>
  );
}
