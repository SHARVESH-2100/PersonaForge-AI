import { ExecutiveSummary } from '../components/phase7/ExecutiveSummary';
import { RecommendationList } from '../components/phase7/RecommendationList';
import { DecisionSimulator } from '../components/phase7/DecisionSimulator';
import { ActionCentre } from '../components/phase7/ActionCentre';
import data from '../data/phase7Data.json';

export default function AIRecommendations() {
  return (
    <section className="page phase7-page">
      <header className="phase7-header">
        <span className="label">Phase 7</span>
        <h1>AI Strategic Recommendations</h1>
        <p className="phase7-subtitle">
          Recommendations are generated from thousands of AI personas, scoring product readiness, market fit, business risk, and confidence.
        </p>
      </header>

      <ExecutiveSummary cards={data.summaryCards} />
      <DecisionSimulator />
      <ActionCentre checklist={data.actionChecklist} />
      <RecommendationList items={data.recommendations} />
    </section>
  );
}
