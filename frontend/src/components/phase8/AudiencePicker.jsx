import { motion } from 'framer-motion';

export function AudiencePicker({ label, description, options, value, onChange }) {
  return (
    <motion.div className="phase8-audience-picker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
      <div className="control-header">
        <div>
          <h4>{label}</h4>
          <p>{description}</p>
        </div>
        <strong>{value}</strong>
      </div>
      <div className="audience-options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={option === value ? 'active' : ''}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
