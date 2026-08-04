import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SimulatorMetricCard } from './SimulatorMetricCard';
import { SlidersHorizontal, Users, Briefcase, BarChart3, Clock } from 'lucide-react';

const audienceOptions = [
  { id: 'founders', label: 'Founders', score: 9 },
  { id: 'designers', label: 'Designers', score: 8 },
  { id: 'freelancers', label: 'Freelancers', score: 7 },
  { id: 'marketers', label: 'Marketers', score: 6 },
  { id: 'consultants', label: 'Consultants', score: 8 }
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function DecisionSimulator() {
  const [price, setPrice] = useState(29);
  const [audience, setAudience] = useState('founders');
  const [features, setFeatures] = useState(8);
  const [budget, setBudget] = useState(70);
  const [timeline, setTimeline] = useState(8);

  const audienceScore = useMemo(() => audienceOptions.find((option) => option.id === audience)?.score || 7, [audience]);

  const metrics = useMemo(() => {
    const probability = Math.round(clamp(68 - price * 0.7 + features * 2.2 + budget * 0.18 + audienceScore * 1.5 - timeline * 0.9, 22, 97));
    const revenue = Number((clamp(2.4 + (100 - price) * 0.05 + features * 0.3 + budget * 0.02 + audienceScore * 0.1 - timeline * 0.05, 0.9, 6.5)).toFixed(1));
    const risk = Math.round(clamp(32 + price * 0.5 - features * 1.1 - budget * 0.11 + timeline * 0.9 - audienceScore * 1.3, 12, 82));
    const marketFit = Math.round(clamp(68 + audienceScore * 2 + features * 1.5 - price * 0.35 + budget * 0.08 - timeline * 0.3, 35, 98));
    const satisfaction = Math.round(clamp(72 - price * 0.3 + features * 1.6 + budget * 0.12 - timeline * 0.35 + audienceScore * 1.4, 36, 97));
    const readiness = Math.round(clamp(60 + features * 1.2 + budget * 0.09 - price * 0.25 + timeline * 0.4 + audienceScore * 1.1, 28, 95));

    return {
      purchaseProbability: probability,
      revenueForecast: revenue,
      riskScore: risk,
      marketFit: marketFit,
      customerSatisfaction: satisfaction,
      launchReadiness: readiness
    };
  }, [price, audienceScore, features, budget, timeline]);

  return (
    <section className="phase7-simulator-section" aria-label="Decision simulator">
      <div className="phase7-simulator-header">
        <div>
          <span className="label">Decision simulator</span>
          <h2>Test different go-to-market strategies in real time</h2>
          <p className="phase7-simulator-copy">Adjust pricing, audience, feature count, budget, and timeline to see how key launch metrics evolve.</p>
        </div>
        <div className="simulator-badge">
          <SlidersHorizontal size={18} />
          <span>Founder mindset</span>
        </div>
      </div>

      <div className="phase7-simulator-grid">
        <motion.div className="simulator-input-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="simulator-control">
            <div className="control-label"><Users size={18} /><span>Product price</span><strong>${price}</strong></div>
            <input type="range" min="9" max="79" value={price} onChange={(event) => setPrice(Number(event.target.value))} />
            <div className="control-scale"><span>Low</span><span>High</span></div>
          </div>

          <div className="simulator-control">
            <div className="control-label"><Briefcase size={18} /><span>Target audience</span><strong>{audienceOptions.find((option) => option.id === audience)?.label}</strong></div>
            <div className="audience-pill-group">
              {audienceOptions.map((option) => (
                <button key={option.id} type="button" className={option.id === audience ? 'active' : ''} onClick={() => setAudience(option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="simulator-control">
            <div className="control-label"><BarChart3 size={18} /><span>Number of features</span><strong>{features}</strong></div>
            <input type="range" min="3" max="14" value={features} onChange={(event) => setFeatures(Number(event.target.value))} />
            <div className="control-scale"><span>Minimal</span><span>Advanced</span></div>
          </div>

          <div className="simulator-control">
            <div className="control-label"><Target size={18} /><span>Marketing budget</span><strong>${budget}k</strong></div>
            <input type="range" min="20" max="120" value={budget} onChange={(event) => setBudget(Number(event.target.value))} />
            <div className="control-scale"><span>Conservative</span><span>Aggressive</span></div>
          </div>

          <div className="simulator-control">
            <div className="control-label"><Clock size={18} /><span>Launch timeline</span><strong>{timeline} weeks</strong></div>
            <input type="range" min="4" max="16" value={timeline} onChange={(event) => setTimeline(Number(event.target.value))} />
            <div className="control-scale"><span>Fast</span><span>Measured</span></div>
          </div>
        </motion.div>

        <motion.div className="simulator-metrics-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <div className="simulator-metrics-grid">
            <SimulatorMetricCard label="Purchase probability" value={metrics.purchaseProbability} unit="%" accent="#7c3aed" />
            <SimulatorMetricCard label="Revenue forecast" value={metrics.revenueForecast} unit="M" accent="#38bdf8" />
            <SimulatorMetricCard label="Risk score" value={metrics.riskScore} unit="%" accent="#f97316" />
            <SimulatorMetricCard label="Market fit" value={metrics.marketFit} unit="%" accent="#22c55e" />
            <SimulatorMetricCard label="Customer satisfaction" value={metrics.customerSatisfaction} unit="%" accent="#8b5cf6" />
            <SimulatorMetricCard label="Launch readiness" value={metrics.launchReadiness} unit="%" accent="#14b8a6" />
          </div>
          <div className="simulator-narrative">
            <p>
              This simulator models how tactical founder choices affect the launch engine. Increase budget and features for higher fit and satisfaction, while watching risk on premium pricing.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
