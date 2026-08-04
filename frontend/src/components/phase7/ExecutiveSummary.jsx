import { SummaryCard } from './SummaryCard';

export function ExecutiveSummary({ cards }) {
  return (
    <section className="phase7-executive-summary" aria-label="Phase 7 executive summary">
      <div className="phase7-summary-grid">
        {cards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
