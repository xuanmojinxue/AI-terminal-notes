/**
 * 收藏列表弹窗组件
 */
import { X, Bookmark, Sparkles, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const formatDate = (timestamp, lang) => {
  const date = new Date(timestamp);
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    month: '2-digit', day: '2-digit'
  });
};

export default function FavoritesModal({ favorites, onClose, onViewNote }) {
  const { styles } = useTheme();
  const { lang, t } = useLang();

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <Bookmark style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontWeight: '500' }}>{t('favorites')} ({favorites.length})</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* 收藏列表 */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              {t('noFavorites')}
            </div>
          ) : (
            favorites.map(note => (
              <div 
                key={note.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  background: styles.card(false).background,
                  borderRadius: '0.5rem',
                  border: styles.card(false).border,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => onViewNote(note)}
              >
                {/* AI模型 */}
                {note.ai_model && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} />
                    <span>{note.ai_model}</span>
                  </div>
                )}
                
                {/* 困惑摘要 */}
                <p style={{ 
                  ...styles.text,
                  fontSize: '0.875rem', 
                  margin: '0 0 0.5rem 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {note.confusion}
                </p>
                
                {/* 时间 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280', fontSize: '0.75rem' }}>
                  <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                  <span>{formatDate(note.created_at, lang)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
