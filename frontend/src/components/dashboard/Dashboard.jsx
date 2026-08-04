import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, DollarSign, Users, Tag, Sparkles, ShieldAlert, Smile } from 'lucide-react';
import { ExecutiveSummary } from './ExecutiveSummary';
import { MetricCard } from './MetricCard';
import { PersonaCard } from './PersonaCard';
import { RiskCard } from './RiskCard';
import { RecommendationCard } from './RecommendationCard';
import { LiveFeed } from './LiveFeed';
import { Timeline } from './Timeline';
import { PurchaseGauge, RevenueLineChart, FeatureDemandBarChart, CustomerSegmentsPieChart, PricingHeatmap, SentimentDonutChart, CompetitorRadar } from './Charts';
import {
  executiveSummary,
  kpiCards,
  chartData,
  personas,
  painAnalysis,
  marketOpportunity,
  risks,
  recommendations,
  liveFeedMessages,
  timelineEvents
} from '../../data/dashboardData.json';

const iconMap = {
  ShoppingCart,
  DollarSign,
  Users,
  Tag,
  Sparkles,
  ShieldAlert,
  Smile
};

export default function Dashboard() {
  const [feed, setFeed] = useState(liveFeedMessages.slice(0, 4));
  const [selectedPersona, setSelectedPersona] = useState(null);

  useEffect(() => {
    let index = 4;
    const interval = setInterval(() => {
      setFeed((current) => {
        const next = [...current.slice(-4), liveFeedMessages[index % liveFeedMessages.length]];
        index += 1;
        return next;
      });
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="dashboard-header">
        <div>
          <span className="section-label">AI intelligence dashboard</span>
          <h1>Turn premium signal into confident launch motion.</h1>
          <p className="page-copy">A modern command center designed for founders and product teams to see the strongest customer signals clearly.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <ExecutiveSummary items={executiveSummary} />

          <section className="section">
            <div className="section-card-head">
              <div>
                <span className="section-label">KPI cards</span>
                <h3>Performance and momentum</h3>
              </div>
            </div>
            <div className="kpi-grid">
              {kpiCards.map((item) => {
                const Icon = iconMap[item.icon] || ShoppingCart;
                return <MetricCard key={item.id} Icon={Icon} {...item} />;
              })}
            </div>
          </section>

          <section className="chart-grid">
            <PurchaseGauge data={chartData.probability} />
            <RevenueLineChart data={chartData.revenue} />
            <FeatureDemandBarChart data={chartData.demand} />
            <CustomerSegmentsPieChart
              data={chartData.segments.map((item, index) => ({
                ...item,
                color: ['#7c3aed', '#38bdf8', '#22c55e', '#f97316', '#a855f7'][index]
              }))}
            />
            <PricingHeatmap data={chartData.pricingHeatmap} />
            <SentimentDonutChart data={chartData.sentiment} />
            <CompetitorRadar data={chartData.competitor} />
          </section>

          <section className="section">
            <div className="section-card-head">
              <div>
                <span className="section-label">Customer intelligence</span>
                <h3>Personas driving your decisions</h3>
              </div>
            </div>
            <div className="persona-grid">
              {personas.map((persona) => (
                <PersonaCard key={persona.id} persona={persona} onSelect={setSelectedPersona} />
              ))}
            </div>
          </section>

          <div className="dual-grid">
            <section className="section pain-analysis">
              <div className="section-card-head">
                <div>
                  <span className="section-label">Pain point analysis</span>
                  <h3>Objections and demand</h3>
                </div>
              </div>
              <div className="analysis-grid">
                <div>
                  <h4>Top objections</h4>
                  {painAnalysis.objections.map((item) => (
                    <div key={item.label} className="progress-item">
                      <div className="progress-head">
                        <span>{item.label}</span>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="progress-bar"><span style={{ width: `${item.value}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4>Most requested features</h4>
                  {painAnalysis.requests.map((item) => (
                    <div key={item.label} className="progress-item">
                      <div className="progress-head">
                        <span>{item.label}</span>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="progress-bar"><span style={{ width: `${item.value}%`, background: '#7c3aed' }} /></div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4>Customer complaints</h4>
                  {painAnalysis.complaints.map((item) => (
                    <div key={item.label} className="progress-item">
                      <div className="progress-head">
                        <span>{item.label}</span>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="progress-bar"><span style={{ width: `${item.value}%`, background: '#f97316' }} /></div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4>Loved features</h4>
                  {painAnalysis.loved.map((item) => (
                    <div key={item.label} className="progress-item">
                      <div className="progress-head">
                        <span>{item.label}</span>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="progress-bar"><span style={{ width: `${item.value}%`, background: '#22c55e' }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section market-opportunity">
              <div className="section-card-head">
                <div>
                  <span className="section-label">Market opportunity</span>
                  <h3>Where the growth is strongest</h3>
                </div>
              </div>
              <div className="market-grid">
                {marketOpportunity.map((item) => (
                  <article key={item.id} className="glass-card opportunity-card">
                    <strong>{item.value}</strong>
                    <span>{item.title}</span>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="section risk-analysis">
            <div className="section-card-head">
              <div>
                <span className="section-label">Risk analysis</span>
                <h3>Signal quality across the launch</h3>
              </div>
            </div>
            <div className="risk-grid">
              {risks.map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </div>
          </section>

          <section className="section recommendations-section">
            <div className="section-card-head">
              <div>
                <span className="section-label">AI recommendation preview</span>
                <h3>Top actions to accelerate growth</h3>
              </div>
            </div>
            <div className="recommendations-grid">
              {recommendations.map((item) => (
                <RecommendationCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        <aside className="dashboard-sidebar-panel">
          <LiveFeed messages={feed} />
          <Timeline events={timelineEvents} />
        </aside>
      </div>

      {selectedPersona ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Persona details">
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPersona(null)} aria-label="Close persona details">
              ×
            </button>
            <div className="modal-header">
              <h2>{selectedPersona.name}</h2>
              <p>{selectedPersona.profession}</p>
            </div>
            <div className="modal-content">
              <div>
                <p><strong>Buying behaviour</strong></p>
                <p>{selectedPersona.behaviour}</p>
              </div>
              <div>
                <p><strong>Purchase probability</strong></p>
                <p>{selectedPersona.probability}%</p>
              </div>
              <div>
                <p><strong>Confidence</strong></p>
                <p>{selectedPersona.confidence}%</p>
              </div>
              <div>
                <p><strong>Trigger</strong></p>
                <p>{selectedPersona.trigger}</p>
              </div>
              <div>
                <p><strong>Objection</strong></p>
                <p>{selectedPersona.objection}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </motion.section>
  );
}
