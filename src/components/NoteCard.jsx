/**
 * 笔记卡片组件
 * 显示单条笔记的内容
 */
import { Clock, Sparkles, Heart, Share2, Bookmark } from 'lucide-react';
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

export default function NoteCard({ note, isLiked, isFavorited, onLike, onShare, onFavorite, onViewDetail, isHighlighted }) {
  const { styles } = useTheme();
  const { lang, t } = useLang();
  
  // 高亮样式
  const highlightStyle = isHighlighted ? {
    boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
    border: '2px solid #fbbf24',
    transition: 'all 0.3s ease'
  } : {};

  return (
    <div 
      id={`note-${note.id}`}
      style={{ ...styles.card(note.is_foundation), ...highlightStyle, cursor: note.is_foundation ? 'default' : 'pointer' }}
      onClick={() => !note.is_foundation && onViewDetail && onViewDetail(note)}
    >
      {/* 笔记头部：AI模型或起源笔记标识 */}
      {note.is_foundation ? (
        <div style={styles.foundationBadge}>
          <Sparkles style={{ width: '1rem', height: '1rem' }} />
          <span>{t('originNote')}</span>
        </div>
      ) : note.ai_model && (
        <div style={styles.foundationBadge}>
          <Sparkles style={{ width: '1rem', height: '1rem' }} />
          <span>{note.ai_model}</span>
        </div>
      )}
      
      {/* 标签和时间 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          {note.is_foundation && note.context && <span style={styles.tag}>{note.context}</span>}
          {!note.is_foundation && note.provider && <span style={styles.tag}>{note.provider}</span>}
        </div>
        <div style={styles.time}>
          <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
          <span>{formatDate(note.created_at, lang)}</span>
        </div>
      </div>
      
      {/* 笔记内容 */}
      <div>
        {/* 概述沟通内容 */}
        {note.summary && (
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={styles.sectionTitle}>{t('summaryLabel')}</h3>
            <p style={styles.text}>{note.summary}</p>
          </div>
        )}
        
        {/* 困惑的问题 */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={styles.sectionTitle}>{t('confusionLabel')}</h3>
          <p style={styles.text}>{note.confusion}</p>
        </div>
        
        {/* 不满意的回答 */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={styles.sectionTitle}>{t('unsatisfiedLabel')}</h3>
          <p style={styles.text}>{note.unsatisfied}</p>
        </div>
        
        {/* 想探索的问题 */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={styles.sectionTitle}>{t('explorationLabel')}</h3>
          <p style={styles.text}>{note.exploration}</p>
        </div>
        
        {/* 起源笔记的特殊消息 */}
        {note.message && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(55, 65, 81, 0.5)' }}>
            <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.75rem', lineHeight: '1.6' }}>{note.message}</p>
          </div>
        )}
        
        {/* 点赞、收藏和分享按钮（起源笔记不显示） */}
        {!note.is_foundation && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(55, 65, 81, 0.5)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}
               onClick={e => e.stopPropagation()}>
            {/* 分享按钮 */}
            <button
              style={styles.likeButton(false)}
              onClick={() => onShare(note)}
            >
              <Share2 style={{ width: '1rem', height: '1rem' }} />
            </button>
            
            {/* 收藏按钮 */}
            <button
              style={styles.likeButton(isFavorited)}
              onClick={() => onFavorite(note.id)}
            >
              <Bookmark style={{ width: '1rem', height: '1rem', fill: isFavorited ? 'currentColor' : 'none' }} />
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
        )}
      </div>
    </div>
  );
}
