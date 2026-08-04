import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, FileText, Share2, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ActionCentre({ checklist }) {
  const [tasks, setTasks] = useState(checklist);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const progress = useMemo(() => Math.round((completedCount / tasks.length) * 100), [completedCount, tasks.length]);

  const toggleTask = (id) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const runNewSimulation = () => {
    setTasks(checklist.map((task) => ({ ...task, completed: false })));
    setStatusMessage('New simulation environment created.');
    window.setTimeout(() => setStatusMessage(''), 2500);
  };

  const exportJson = () => {
    const payload = { checklist: tasks, progress, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'phase-7-action-centre.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setStatusMessage('JSON export ready.');
    window.setTimeout(() => setStatusMessage(''), 2500);
  };

  const downloadPDF = () => {
    const content = `PersonaForge AI - Phase 7 Action Centre\n\nChecklist progress: ${progress}%\n\nTasks:\n${tasks.map((item) => `- ${item.label}: ${item.completed ? 'Completed' : 'Pending'}`).join('\n')}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'phase-7-action-centre.pdf';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setStatusMessage('PDF export generated.');
    window.setTimeout(() => setStatusMessage(''), 2500);
  };

  const shareReport = async () => {
    const message = `PersonaForge AI Phase 7 checklist progress: ${progress}% complete.`;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(message);
      setStatusMessage('Share copy saved to clipboard.');
    } else {
      setStatusMessage('Copy not supported in this browser.');
    }
    window.setTimeout(() => setStatusMessage(''), 2500);
  };

  return (
    <section className="phase7-action-centre" aria-label="Action centre">
      <div className="phase7-action-centre-grid">
        <motion.div className="action-centre-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="action-centre-head">
            <div>
              <span className="label">AI checklist</span>
              <h2>Launch-ready tasks</h2>
            </div>
            <div className="progress-pill">{progress}% complete</div>
          </div>
          <div className="action-progress-bar" aria-hidden="true">
            <motion.span initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          </div>
          <div className="action-list">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className={`action-task ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <span className="task-marker">{task.completed ? <CheckCircle2 size={18} /> : <span />}</span>
                <span>{task.label}</span>
              </button>
            ))}
          </div>
          <div className="action-success-banner">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <strong>Your product is now ready for launch.</strong>
              <p>Apply the final action items and close the loop before your next runway review.</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="action-export-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <span className="label">Export options</span>
          <h2>Save your action plan</h2>
          <p>Keep the AI checklist and launch analysis within your team workflow.</p>

          <div className="export-buttons">
            <button type="button" className="button export primary" onClick={downloadPDF}>
              <Download size={16} /> Download PDF
            </button>
            <button type="button" className="button export" onClick={exportJson}>
              <FileText size={16} /> Export JSON
            </button>
            <button type="button" className="button export" onClick={shareReport}>
              <Share2 size={16} /> Share report
            </button>
            <button type="button" className="button export" onClick={runNewSimulation}>
              <RefreshCw size={16} /> Run new simulation
            </button>
            <button type="button" className="button export" onClick={() => navigate('/dashboard')}>
              <ArrowRight size={16} /> Back to dashboard
            </button>
          </div>

          <AnimatePresence>
            {statusMessage ? (
              <motion.div className="action-status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                {statusMessage}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
