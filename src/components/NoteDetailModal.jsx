/**
 * 笔记详情弹窗组件
 * 显示完整笔记内容
 */
import { X, Clock, Sparkles, Heart, Share2, Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const formatDate = (timestamp, lang) => {
  const date = new Date(timestamp);
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function NoteDetailModal({ 
  note, 
  isLiked, 
  isFavorited,
  onLike, 
  onShare, 
  onFavorite,
  onClose 
}) {
  const { styles } = useTheme();
  const { lang, t } = useLang();

  if (!note) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '700px', maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontWeight: '500' }}>{note.ai_model || t('viewDetail')}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* 笔记内容区 */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '1rem' }}>
          {/* 标签和时间 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            {note.provider && <span style={styles.tag}>{note.provider}</span>}
            <div style={styles.time}>
              <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
              <span>{formatDate(note.created_at, lang)}</span>
            </div>
          </div>

          {/* 概述 */}
          {note.summary && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={styles.sectionTitle}>{t('summaryLabel')}</h3>
              <p style={styles.text}>{note.summary}</p>
            </div>
          )}

          {/* 困惑 */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={styles.sectionTitle}>{t('confusionLabel')}</h3>
            <p style={styles.text}>{note.confusion}</p>
          </div>

          {/* 不满意 */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={styles.sectionTitle}>{t('unsatisfiedLabel')}</h3>
            <p style={styles.text}>{note.unsatisfied}</p>
          </div>

          {/* 探索 */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={styles.sectionTitle}>{t('explorationLabel')}</h3>
            <p style={styles.text}>{note.exploration}</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(55, 65, 81, 0.5)' }}>
          <button style={styles.likeButton(false)} onClick={() => onShare(note)}>
            <Share2 style={{ width: '1rem', height: '1rem' }} />
          </button>
          <button style={styles.likeButton(isFavorited)} onClick={() => onFavorite(note.id)}>
            <Bookmark style={{ width: '1rem', height: '1rem', fill: isFavorited ? 'currentColor' : 'none' }} />
          </button>
          <button style={styles.likeButton(isLiked)} onClick={() => onLike(note.id, note.likes)}>
            <Heart style={{ width: '1rem', height: '1rem', fill: isLiked ? '#f87171' : 'none' }} />
            <span>{note.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
