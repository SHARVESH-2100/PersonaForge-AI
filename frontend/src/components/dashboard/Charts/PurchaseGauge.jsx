import { motion } from 'motion/react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export function PurchaseGauge({ data }) {
  return (
    <motion.article className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="chart-card-heading">
        <span>Purchase Probability</span>
        <strong>{data[0].value}%</strong>
      </div>
      <div className="chart-wrapper gauge">
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart cx="50%" cy="60%" innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar minAngle={15} dataKey="value" cornerRadius={16} fill="#7c3aed" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">Confidence is high for the upcoming launch window.</p>
    </motion.article>
  );
}
