import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function Timeline({ events }) {
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let scroll = 0;
    const step = 0.7;
    const interval = setInterval(() => {
      scroll += step;
      if (scroll >= node.scrollHeight - node.clientHeight) {
        scroll = 0;
      }
      node.scrollTop = scroll;
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="timeline-panel glass-card" aria-label="Auto-scrolling timeline">
      <div className="section-card-head">
        <div>
          <span className="section-label">Timeline</span>
          <h3>Simulation milestones</h3>
        </div>
      </div>
      <div className="timeline-list" ref={ref}>
        {events.map((event) => (
          <motion.article key={event.id} className="timeline-item" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="timeline-dot" />
            <div>
              <strong>{event.label}</strong>
              <p>{event.detail}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
