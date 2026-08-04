import { motion } from 'motion/react';

export function PersonaCard({ persona, onSelect }) {
  const initials = persona.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.article className="glass-card persona-card" onClick={() => onSelect(persona)} whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}>
      <div className="persona-avatar">{initials}</div>
      <div className="persona-copy">
        <h3>{persona.name}</h3>
        <p>{persona.profession}</p>
      </div>
      <div className="persona-meta">
        <span>{persona.behaviour}</span>
        <div>
          <strong>{persona.probability}%</strong>
          <small>{persona.confidence}% confidence</small>
        </div>
      </div>
    </motion.article>
  );
}
