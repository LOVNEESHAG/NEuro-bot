import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function CrisisModal({ isOpen, onClose }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              background: 'var(--surface)', borderRadius: 20, padding: 40, maxWidth: 500,
              width: '100%', textAlign: 'center',
              border: '3px solid var(--danger)',
              boxShadow: '0 20px 60px rgba(230, 57, 70, 0.3)'
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🆘</div>
            <h2 style={{
              fontFamily: 'Lora, serif', color: 'var(--danger)',
              fontSize: '1.5rem', marginBottom: 12
            }}>
              {t('crisis.title')}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.95rem' }}>
              {t('crisis.message', { defaultValue: 'If you or someone you know is in crisis, please reach out immediately:' })}
            </p>

            <div style={{
              display: 'flex', flexDirection: 'column', gap: 12,
              background: 'var(--crisis-helpline-bg)', borderRadius: 12, padding: 20, marginBottom: 24
            }}>
              <HelplineRow emoji="📞" label="iCall" number="9152987821" />
              <HelplineRow emoji="📞" label="Vandrevala Foundation" number="1860-2662-345" />
              <HelplineRow emoji="📞" label="NIMHANS" number="080-46110007" />
              <HelplineRow emoji="🚨" label="Emergency" number="112" />
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%', padding: '14px' }}>
              {t('crisis.close')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HelplineRow({ emoji, label, number }) {
  return (
    <a href={`tel:${number}`} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px', borderRadius: 10, background: 'var(--crisis-helpline-item-bg)',
      textDecoration: 'none', color: 'var(--text-dark)',
      border: '1px solid var(--crisis-helpline-item-border)', transition: 'all 0.2s'
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{emoji}</span>
        <span style={{ fontWeight: 600 }}>{label}</span>
      </span>
      <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '1.1rem' }}>{number}</span>
    </a>
  );
}
