import { motion } from 'motion/react';

export function PricingHeatmap({ data }) {
  return (
    <motion.article className="chart-card heatmap-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <div className="chart-card-heading">
        <span>Pricing acceptance</span>
        <strong>Heatmap</strong>
      </div>
      <div className="heatmap-grid">
        <div className="heatmap-row heatmap-header">
          <span>Tier</span>
          {['Very unlikely', 'Unlikely', 'Moderate', 'Likely', 'Very likely'].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        {data.map((row) => (
          <div key={row.tier} className="heatmap-row">
            <span className="tier-label">{row.tier}</span>
            {row.grid.map((value, index) => (
              <span key={index} className="heatmap-cell" style={{ background: `rgba(124, 58, 237, ${0.18 + (value / 100) * 0.52})` }}>
                {value}%
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="chart-note">Pricing acceptance is strongest for Growth and Pro plans.</p>
    </motion.article>
  );
}
