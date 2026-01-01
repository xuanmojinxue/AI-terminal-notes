/**
 * 统计面板组件 - 弹窗形式
 */
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function StatsPanel({ stats, onClose }) {
  const { styles } = useTheme();
  const { t } = useLang();
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div style={styles.modalHeader}>
          <span style={{ color: '#fbbf24', fontWeight: '500' }}>{t('noteStats')}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
        
        {/* 总数 */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fbbf24' }}>
            {stats.totalNotes}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{t('notesCount')}</div>
        </div>
        
        {/* AI模型统计 */}
        {stats.modelStats.length > 0 && (
          <div>
            <h4 style={{ color: '#d1d5db', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              {t('byModel')}
            </h4>
            {stats.modelStats.map(([model, count]) => (
              <div key={model} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#f3f4f6', fontSize: '0.875rem' }}>{model}</span>
                  <span style={{ color: '#fbbf24', fontSize: '0.875rem' }}>{count} {t('notes')}</span>
                </div>
                <div style={styles.statBar((count / stats.totalNotes) * 100)} />
              </div>
            ))}
          </div>
        )}
        
        {stats.modelStats.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem' }}>
            {t('noNotes')}
          </div>
        )}
      </div>
    </div>
  );
}
