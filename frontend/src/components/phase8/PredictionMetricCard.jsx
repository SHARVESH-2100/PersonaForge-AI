import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

function useCountUp(value, duration = 600) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = null;
    const target = Number(value) || 0;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const next = target * progress;
      setCurrent(Number(next.toFixed(target % 1 ? 1 : 0)));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    const id = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(id);
  }, [value, duration]);

  return current;
}

export function PredictionMetricCard({ label, value, unit, trend, positive, accent }) {
  const countValue = useCountUp(value);
  const arrowColor = positive ? '#22c55e' : '#f97316';
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.article className="phase8-prediction-metric" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="prediction-metric-top">
        <span>{label}</span>
        <div className="prediction-trend" style={{ color: arrowColor }}>
          <Icon size={16} />
          <span>{trend}</span>
        </div>
      </div>
      <strong style={{ color: accent }}>
        {countValue}
        {unit}
      </strong>
    </motion.article>
  );
}
