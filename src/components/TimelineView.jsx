/**
 * 时间线视图组件
 * 按时间顺序展示笔记
 */
import { Clock, Sparkles, Heart, Share2, Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

/**
 * 格式化日期为年月
 */
const formatYearMonth = (timestamp, lang) => {
  const date = new Date(timestamp);
  if (lang === 'zh') {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  }
  return date.toLocaleString('en-US', { year: 'numeric', month: 'long' });
};

/**
 * 格式化完整日期
 */
const formatDate = (timestamp, lang) => {
  const date = new Date(timestamp);
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 按年月分组笔记
 */
const groupByMonth = (notes, lang) => {
  const groups = {};
  notes.forEach(note => {
    const key = formatYearMonth(note.created_at, lang);
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
  });
  return Object.entries(groups);
};

export default function TimelineView({ notes, isNoteLiked, isNoteFavorited, onLike, onShare, onFavorite, onViewDetail }) {
  const { styles, theme } = useTheme();
  const { lang, t } = useLang();
  
  // 过滤掉起源笔记，按时间倒序
  const timelineNotes = notes
    .filter(n => !n.is_foundation)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  const groupedNotes = groupByMonth(timelineNotes, lang);
  
  if (timelineNotes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
        {t('noNotes')}
      </div>
    );
  }

  // 时间线样式
  const timelineStyles = {
    container: {
      position: 'relative',
      paddingLeft: '2rem'
    },
    line: {
      position: 'absolute',
      left: '0.5rem',
      top: 0,
      bottom: 0,
      width: '2px',
      background: theme === 'dark' 
        ? 'linear-gradient(to bottom, #fbbf24, #f97316, #fbbf24)' 
        : 'linear-gradient(to bottom, #d97706, #ea580c, #d97706)'
    },
    monthHeader: {
      position: 'relative',
      marginBottom: '1rem',
      marginTop: '1.5rem'
    },
    monthDot: {
      position: 'absolute',
      left: '-1.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      background: 'linear-gradient(to right, #fbbf24, #f97316)',
      border: theme === 'dark' ? '3px solid #111827' : '3px solid #f8fafc'
    },
    monthText: {
      color: styles.sectionTitle.color,
      fontWeight: '600',
      fontSize: '1.125rem'
    },
    noteItem: {
      position: 'relative',
      marginBottom: '1rem'
    },
    noteDot: {
      position: 'absolute',
      left: '-1.5rem',
      top: '1.5rem',
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      background: theme === 'dark' ? '#fbbf24' : '#d97706'
    },
    noteCard: {
      ...styles.card(false),
      marginBottom: 0
    },
    noteHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    noteTime: {
      ...styles.time,
      fontSize: '0.75rem'
    },
    noteContent: {
      color: styles.text.color,
      fontSize: '0.875rem',
      lineHeight: '1.6',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    noteFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: `1px solid ${theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(209, 213, 219, 0.5)'}`
    }
  };

  return (
    <div style={timelineStyles.container}>
      {/* 时间线 */}
      <div style={timelineStyles.line} />
      
      {groupedNotes.map(([month, monthNotes]) => (
        <div key={month}>
          {/* 月份标题 */}
          <div style={timelineStyles.monthHeader}>
            <div style={timelineStyles.monthDot} />
            <span style={timelineStyles.monthText}>{month}</span>
            <span style={{ color: '#9ca3af', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              {t('monthNotes', { count: monthNotes.length })}
            </span>
          </div>
          
          {/* 该月的笔记 */}
          {monthNotes.map(note => (
            <div key={note.id} style={timelineStyles.noteItem}>
              <div style={timelineStyles.noteDot} />
              <div style={{ ...timelineStyles.noteCard, cursor: 'pointer' }} onClick={() => onViewDetail(note)}>
                {/* 头部：AI模型、时间 */}
                <div style={timelineStyles.noteHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {note.ai_model && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: styles.sectionTitle.color }}>
                        <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} />
                        <span style={{ fontSize: '0.875rem' }}>{note.ai_model}</span>
                      </div>
                    )}
                    {note.provider && <span style={styles.tag}>{note.provider}</span>}
                  </div>
                  <div style={timelineStyles.noteTime}>
                    <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                    <span>{formatDate(note.created_at, lang)}</span>
                  </div>
                </div>
                
                {/* 困惑的问题（截取显示） */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: styles.sectionTitle.color, fontSize: '0.75rem' }}>{t('confusionShort')}</span>
                  <p style={timelineStyles.noteContent}>{note.confusion}</p>
                </div>
                
                {/* 底部：点赞、收藏、分享 */}
                <div style={timelineStyles.noteFooter} onClick={e => e.stopPropagation()}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {note.summary ? note.summary.slice(0, 30) + (note.summary.length > 30 ? '...' : '') : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{ ...styles.likeButton(false), padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => onShare(note)}
                    >
                      <Share2 style={{ width: '0.875rem', height: '0.875rem' }} />
                    </button>
                    <button
                      style={{ ...styles.likeButton(isNoteFavorited(note.id)), padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => onFavorite(note.id)}
                    >
                      <Bookmark style={{ width: '0.875rem', height: '0.875rem', fill: isNoteFavorited(note.id) ? 'currentColor' : 'none' }} />
                    </button>
                    <button
                      style={{ ...styles.likeButton(isNoteLiked(note.id)), padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => onLike(note.id, note.likes)}
                    >
                      <Heart 
                        style={{ 
                          width: '0.875rem', 
                          height: '0.875rem',
                          fill: isNoteLiked(note.id) ? '#f87171' : 'none'
                        }} 
                      />
                      <span>{note.likes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
