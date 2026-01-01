/**
 * 分享弹窗组件
 * 支持链接分享和卡片图片分享
 */
import { useState, useRef } from 'react';
import { X, Link, Image, Check, Download, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function ShareModal({ note, onClose }) {
  const { styles } = useTheme();
  const { lang, t } = useLang();
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef(null);

  if (!note) return null;

  // 生成分享链接
  const shareUrl = `${window.location.origin}?note=${note.id}`;

  // 复制链接
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // 生成卡片图片并下载
  const generateImage = async () => {
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#111827',
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `ai-note-${note.id.slice(0, 8)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Generate image failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  // 格式化时间
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div style={styles.modalHeader}>
          <span style={{ color: '#fbbf24', fontWeight: '500' }}>{t('shareNote')}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* 链接分享 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#d1d5db' }}>
            <Link style={{ width: '1rem', height: '1rem' }} />
            <span>{t('linkShare')}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={shareUrl}
              readOnly
              style={{ ...styles.input, flex: 1, fontSize: '0.75rem' }}
            />
            <button
              onClick={copyLink}
              style={{
                ...styles.smallButton,
                background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: copied ? '#4ade80' : '#fbbf24',
                minWidth: '80px',
                justifyContent: 'center'
              }}
            >
              {copied ? <><Check style={{ width: '1rem', height: '1rem' }} /> {t('copied')}</> : t('copyLink')}
            </button>
          </div>
        </div>

        {/* 卡片图片分享 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#d1d5db' }}>
            <Image style={{ width: '1rem', height: '1rem' }} />
            <span>{t('cardImage')}</span>
          </div>
          
          {/* 预览卡片 */}
          <div 
            ref={cardRef}
            style={{
              background: 'linear-gradient(to bottom right, #1f2937, #111827)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '1rem',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {/* 标题 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: '#fbbf24' }} />
              <span style={{ color: '#fbbf24', fontWeight: '500' }}>{t('title')}</span>
              <span style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: 'auto' }}>
                {formatDate(note.created_at)}
              </span>
            </div>

            {/* AI模型和提供者 */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {note.ai_model && <span style={styles.tag}>{note.ai_model}</span>}
              {note.provider && <span style={styles.tag}>{note.provider}</span>}
            </div>

            {/* 概述沟通内容 */}
            {note.summary && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{t('summaryLabel').replace('：', '')}</div>
                <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {note.summary}
                </p>
              </div>
            )}

            {/* 困惑的问题 */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{t('confusionLabel').replace('：', '')}</div>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {note.confusion}
              </p>
            </div>

            {/* 不满意的回答 */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{t('unsatisfiedLabel').replace('：', '')}</div>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {note.unsatisfied}
              </p>
            </div>

            {/* 想探索的 */}
            <div>
              <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{t('explorationLabel').replace('：', '')}</div>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {note.exploration}
              </p>
            </div>

            {/* 底部 */}
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(55, 65, 81, 0.5)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '0.625rem' }}>{t('witnessTag')}</span>
              <span style={{ color: '#f87171', fontSize: '0.75rem' }}>❤ {note.likes || 0}</span>
            </div>
          </div>

          {/* 下载按钮 */}
          <button
            onClick={generateImage}
            disabled={generating}
            style={{
              ...styles.button,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: generating ? 0.6 : 1
            }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} />
            {generating ? t('generating') : t('downloadCard')}
          </button>
        </div>
      </div>
    </div>
  );
}
