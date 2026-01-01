/**
 * 笔记表单组件
 * 用于提交新笔记
 */
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function NoteForm({ formData, setFormData, onSubmit, submitStatus }) {
  const { styles } = useTheme();
  const { t } = useLang();
  
  return (
    <div style={styles.card(false)}>
      {/* AI模型输入 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={styles.label}>{t('aiModel')}</label>
        <input
          style={styles.input}
          type="text"
          value={formData.ai_model}
          onChange={(e) => setFormData({...formData, ai_model: e.target.value})}
          placeholder={t('aiModelPlaceholder')}
        />
      </div>
      
      {/* 提供者输入 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={styles.label}>{t('provider')}</label>
        <input
          style={styles.input}
          type="text"
          value={formData.provider}
          onChange={(e) => setFormData({...formData, provider: e.target.value})}
          placeholder={t('providerPlaceholder')}
        />
      </div>
      
      {/* 概述沟通内容 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={styles.label}>{t('summary')}</label>
        <textarea
          style={styles.textarea}
          value={formData.summary}
          onChange={(e) => setFormData({...formData, summary: e.target.value})}
          placeholder={t('summaryPlaceholder')}
        />
      </div>
      
      {/* 困惑的问题（必填） */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={styles.label}>{t('confusion')} *</label>
        <textarea
          style={styles.textarea}
          value={formData.confusion}
          onChange={(e) => setFormData({...formData, confusion: e.target.value})}
        />
      </div>
      
      {/* 不满意的回答（必填） */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={styles.label}>{t('unsatisfied')} *</label>
        <textarea
          style={styles.textarea}
          value={formData.unsatisfied}
          onChange={(e) => setFormData({...formData, unsatisfied: e.target.value})}
        />
      </div>
      
      {/* 想探索的问题（必填） */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={styles.label}>{t('exploration')} *</label>
        <textarea
          style={styles.textarea}
          value={formData.exploration}
          onChange={(e) => setFormData({...formData, exploration: e.target.value})}
        />
      </div>
      
      {/* 提交状态提示 */}
      {submitStatus && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          background: submitStatus.includes('✓') ? 'rgba(34, 197, 94, 0.2)' : 
                     submitStatus.includes('保存中') || submitStatus.includes('Saving') ? 'rgba(59, 130, 246, 0.2)' : 
                     'rgba(239, 68, 68, 0.2)',
          color: submitStatus.includes('✓') ? '#4ade80' : 
                 submitStatus.includes('保存中') || submitStatus.includes('Saving') ? '#60a5fa' : 
                 '#f87171'
        }}>
          {submitStatus}
        </div>
      )}
      
      {/* 提交按钮 */}
      <button style={styles.button} onClick={onSubmit}>{t('saveNote')}</button>
    </div>
  );
}
