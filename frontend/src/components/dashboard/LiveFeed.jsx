import { motion } from 'motion/react';
import { Sparkles, Activity } from 'lucide-react';

export function LiveFeed({ messages }) {
  const lastMessage = messages[messages.length - 1];
  return (
    <section className="glass-card live-feed" aria-live="polite" aria-label="Live AI activity feed">
      <div className="section-card-head">
        <div>
          <span className="section-label">Live AI feed</span>
          <h3>Stream of active intelligence</h3>
        </div>
        <Activity size={20} />
      </div>
      <div className="feed-list">
        {messages.map((message, index) => (
          <motion.p key={`${message}-${index}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: index * 0.05 }}>
            <Sparkles size={14} />
            {message}
          </motion.p>
        ))}
      </div>
      <div className="feed-status">
        <span>Latest</span>
        <strong>{lastMessage}</strong>
      </div>
    </section>
  );
}
