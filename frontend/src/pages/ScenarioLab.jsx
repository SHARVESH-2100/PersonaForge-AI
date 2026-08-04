import { motion } from 'framer-motion';
import { BrainCircuit, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ScenarioPanel } from '../components/scenario/ScenarioPanel';
import { BusinessControls } from '../components/scenario/ScenarioControls';
import { PredictionEngine } from '../components/scenario/PredictionEngine';
import { DecisionCoach } from '../components/scenario/DecisionCoach';
import { ScenarioProvider } from '../context/ScenarioContext';
import './scenario-lab.css';

function ContainerPlaceholder({ icon: Icon, label, text }) {
  return <div className="scenario-placeholder"><Icon size={18}/><b>{label}</b><span>{text}</span></div>;
}

export default function ScenarioLab() {
  return <ScenarioProvider><section className="page scenario-lab">
    <motion.header className="scenario-header" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
      <div><span className="label">FOUNDER DECISION WORKSPACE</span><h1>Scenario Lab</h1><p>Test business decisions before making them.</p></div>
      <div className="scenario-status"><i/><span>DECISION ENGINE STANDBY</span></div>
    </motion.header>
    <div className="scenario-grid">
      <ScenarioPanel eyebrow="01 / INPUT" title="Business Controls" description="Set the assumptions your decision will be tested against." delay={.05}>
        <BusinessControls />
      </ScenarioPanel>
      <ScenarioPanel eyebrow="02 / SIGNAL" title="Live Business Metrics" description="See the business impact of each scenario as the model responds." delay={.12}>
        <PredictionEngine />
      </ScenarioPanel>
      <ScenarioPanel eyebrow="03 / GUIDANCE" title="AI Decision Coach" description="Turn complex trade-offs into a clear next move." delay={.19}>
        <DecisionCoach />
      </ScenarioPanel>
    </div>
  </section></ScenarioProvider>;
}
