import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

export function ExportCentre({ actions, footer }) {
  const navigate = useNavigate();

  const handleAction = (action) => {
    const label = action.label;

    if (label === 'Download PDF') {
      window.print();
      toast.success('Print preview opened for the PDF export');
      return;
    }

    if (label === 'Export JSON') {
      const payload = {
        report: 'PersonaForge AI validation report',
        exportedAt: new Date().toISOString(),
        footer,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'personaforge-validation-report.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Validation report exported as JSON');
      return;
    }

    if (label === 'Print Report') {
      window.print();
      toast.success('Print dialog opened');
      return;
    }

    if (label === 'Share Report') {
      const shareText = [footer.generatedBy, footer.simulationTimestamp, footer.personas, footer.simulationConfidence, footer.version].join('\n');

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(shareText).then(() => toast.success('Report summary copied to clipboard')).catch(() => toast.error('Clipboard access was blocked'));
      } else {
        toast.error('Clipboard is unavailable in this browser');
      }
      return;
    }

    if (label === 'Email Report') {
      const subject = encodeURIComponent('PersonaForge AI validation report');
      const body = encodeURIComponent([footer.generatedBy, footer.simulationTimestamp, footer.personas, footer.simulationConfidence, footer.version].join('\n'));
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      toast.success('Email composer opened');
      return;
    }

    if (label === 'Run New Validation') {
      navigate('/upload');
      toast.success('Starting a new validation flow');
      return;
    }

    if (label === 'Back to Dashboard') {
      navigate('/dashboard');
      toast.success('Returning to the dashboard');
      return;
    }

    toast('Action queued for the next step');
  };

  return (
    <motion.section className="phase9-export-centre" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#111111', color: '#f8fafc', border: '1px solid rgba(108, 99, 255, 0.35)' } }} />

      <div className="export-centre-head">
        <div>
          <span className="label">Export centre</span>
          <h3>Save, share or restart this validation.</h3>
        </div>
      </div>

      <div className="export-action-grid">
        {actions.map((action) => (
          <button key={action.label} type="button" className={`export-button ${action.variant || 'secondary'}`} onClick={() => handleAction(action)}>
            {action.label}
          </button>
        ))}
      </div>

      <div className="export-footer">
        <span>{footer.generatedBy}</span>
        <span>{footer.simulationTimestamp}</span>
        <span>{footer.personas}</span>
        <span>{footer.simulationConfidence}</span>
        <span>{footer.version}</span>
      </div>
    </motion.section>
  );
}
