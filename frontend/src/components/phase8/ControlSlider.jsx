import { motion } from 'framer-motion';

export function ControlSlider({ label, description, value, min, max, step, unit, onChange }) {
  return (
    <motion.div className="phase8-control-slider" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="control-header">
        <div>
          <h4>{label}</h4>
          <p>{description}</p>
        </div>
        <strong>
          {unit === '$' ? `$${value}` : unit === 'features' ? `${value} features` : unit === 'weeks' ? `${value} weeks` : unit === 'k' ? `$${value}k` : `${value}`}
        </strong>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="control-scale">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </motion.div>
  );
}
