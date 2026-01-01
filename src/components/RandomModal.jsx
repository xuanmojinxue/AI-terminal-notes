/**
 * 随机笔记弹窗组件
 */
import { Clock, Sparkles, Heart, Shuffle, X, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

/**
 * 格式化时间戳
 */
const formatDate = (timestamp, lang) => {
  const date = new Date(timestamp);
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function RandomModal({ note, isLiked, onLike, onClose, onNext, onShare }) {
  const { styles } = useTheme();
  const { lang, t } = useLang();
  
  if (!note) return null;
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 弹窗头部 */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <Shuffle style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontWeight: '500' }}>{t('randomNote')}</span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
        
        {/* 笔记内容 */}
        <div>
          {/* AI模型 */}
          {note.ai_model && (
            <div style={styles.foundationBadge}>
              <Sparkles style={{ width: '1rem', height: '1rem' }} />
              <span>{note.ai_model}</span>
            </div>
          )}
          
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
          
          {/* 点赞和分享按钮 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            {/* 分享按钮 */}
            <button
              style={styles.likeButton(false)}
              onClick={() => onShare(note)}
            >
              <Share2 style={{ width: '1rem', height: '1rem' }} />
            </button>
            
            {/* 点赞按钮 */}
            <button
              style={styles.likeButton(isLiked)}
              onClick={() => onLike(note.id, note.likes)}
            >
              <Heart 
                style={{ 
                  width: '1rem', 
                  height: '1rem',
                  fill: isLiked ? '#f87171' : 'none'
                }} 
              />
              <span>{note.likes || 0}</span>
            </button>
          </div>
        </div>
        
        {/* 底部按钮 */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(55, 65, 81, 0.5)' }}>
          <button 
            style={{ ...styles.smallButton, flex: 1, justifyContent: 'center' }}
            onClick={onNext}
          >
            <Shuffle style={{ width: '1rem', height: '1rem' }} />
            <span>{t('nextOne')}</span>
          </button>
          <button 
            style={{ ...styles.smallButton, flex: 1, justifyContent: 'center', background: 'rgba(55, 65, 81, 0.5)', color: '#9ca3af' }}
            onClick={onClose}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
