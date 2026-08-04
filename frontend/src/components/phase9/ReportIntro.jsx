import { motion } from 'framer-motion';

export function ReportIntro({ title, subtitle }) {
  return (
    <motion.header className="phase9-intro" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <span className="label">FINAL VALIDATION REPORT</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </motion.header>
  );
}
