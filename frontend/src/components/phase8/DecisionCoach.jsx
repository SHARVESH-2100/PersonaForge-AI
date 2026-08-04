import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, Star, Save, Layers, RefreshCcw, Sparkles } from 'lucide-react';

export function DecisionCoach({ insight, recommendation, warning, opportunity, onSave, onCompare, onReset, onGenerate, saved, compared }) {
  return (
    <section className="phase8-coach-panel" aria-label="AI decision coach">
      <div className="coach-head">
        <div>
          <span className="label">AI decision coach</span>
          <h3>Understand the impact of each choice</h3>
        </div>
        <Sparkles size={24} className="coach-head-icon" />
      </div>

      <div className="coach-grid">
        <motion.article className="coach-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.04 }}>
          <div className="coach-card-title">
            <Lightbulb size={18} />
            <h4>Key Insight</h4>
          </div>
          <p>{insight}</p>
        </motion.article>

        <motion.article className="coach-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
          <div className="coach-card-title">
            <TrendingIcon />
            <h4>Recommendation</h4>
          </div>
          <p>{recommendation}</p>
        </motion.article>

        <motion.article className="coach-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>
          <div className="coach-card-title">
            <AlertTriangle size={18} />
            <h4>Warning</h4>
          </div>
          <p>{warning}</p>
        </motion.article>

        <motion.article className="coach-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }}>
          <div className="coach-card-title">
            <Star size={18} />
            <h4>Opportunity</h4>
          </div>
          <p>{opportunity}</p>
        </motion.article>
      </div>

      <div className="coach-actions">
        <button type="button" className={`coach-button ${saved ? 'primary' : 'secondary'}`} onClick={onSave}>
          <Save size={16} />
          {saved ? 'Scenario Saved' : 'Save Scenario'}
        </button>
        <button type="button" className={`coach-button ${compared ? 'primary' : 'secondary'}`} onClick={onCompare}>
          <Layers size={16} />
          {compared ? 'Comparing...' : 'Compare Scenarios'}
        </button>
        <button type="button" className="coach-button secondary" onClick={onReset}>
          <RefreshCcw size={16} />
          Reset Scenario
        </button>
        <button type="button" className="coach-button primary" onClick={onGenerate}>
          <Sparkles size={16} />
          Generate Recommendation
        </button>
      </div>
    </section>
  );
}

function TrendingIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>;
}
