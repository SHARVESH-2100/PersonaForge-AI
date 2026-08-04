import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

function useCountUp(target, decimals = 0, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const startValue = 0;
    const endValue = Number(target) || 0;
    const frame = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const next = startValue + (endValue - startValue) * progress;
      setValue(Number(next.toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [target, decimals, duration]);

  return value;
}

export function MetricCard({ title, value, unit, trend, trendLabel, sparkline, accent, Icon }) {
  const count = useCountUp(value, unit === '%' ? 0 : value % 1 ? 1 : 0);
  const formatted = `${count}${unit}`;
  const positive = !trend.startsWith('-');

  return (
    <motion.article className="glass-card metric-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="metric-head">
        <div className="metric-icon" style={{ background: `${accent}22`, color: accent }}>
          {Icon && <Icon size={18} />}
        </div>
        <div>
          <p className="metric-label">{title}</p>
          <strong>{formatted}</strong>
        </div>
      </div>
      <div className="metric-sparkline" aria-hidden="true">
        {sparkline.map((point, index) => (
          <span key={index} style={{ height: `${Math.max(point, 8)}%`, background: accent }} />
        ))}
      </div>
      <div className="metric-foot">
        <span className={positive ? 'trend-up' : 'trend-down'}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
        </span>
        <small>{trendLabel}</small>
      </div>
    </motion.article>
  );
}
