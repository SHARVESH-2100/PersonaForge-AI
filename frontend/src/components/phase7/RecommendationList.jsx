import { RecommendationCard } from './RecommendationCard';

export function RecommendationList({ items }) {
  return (
    <section className="phase7-recommendations-section" aria-label="AI recommendation cards">
      <div className="phase7-recommendations-header">
        <span className="label">Recommendations</span>
        <h2>AI-suggested actions for your launch motion</h2>
      </div>
      <div className="phase7-recommendation-grid">
        {items.map((item) => (
          <RecommendationCard key={item.id} recommendation={item} />
        ))}
      </div>
    </section>
  );
}
