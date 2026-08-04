import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

const iconRegistry = {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Sparkles
};

function useCountUp(target, unit, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    const end = Number(target) || 0;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const nextValue = end * progress;
      setValue(Number(nextValue.toFixed(0)));
      if (progress < 1) window.requestAnimationFrame(step);
    };

    const id = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(id);
  }, [target, duration]);

  return value;
}

export function SummaryCard({ card }) {
  const Icon = iconRegistry[card.icon] || ShieldCheck;
  const animatedValue = useCountUp(card.value, card.unit);

  return (
    <motion.article
      className="glass-card phase7-summary-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: [0, 1], y: [8, -6, 0] }}
      transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
    >
      <div className="summary-card-top">
        <div className="summary-icon" style={{ background: `${card.accent}22`, color: card.accent }}>
          <Icon size={20} />
        </div>
        <span>{card.title}</span>
      </div>
      <div className="summary-card-body">
        <strong>{animatedValue}{card.unit}</strong>
        <p>{card.detail}</p>
      </div>
      <div className="summary-card-footer">
        <span>{card.trend}</span>
      </div>
    </motion.article>
  );
}
