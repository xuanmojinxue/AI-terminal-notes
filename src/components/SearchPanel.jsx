/**
 * 搜索筛选面板组件 - 弹窗形式
 */
import { X, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function SearchPanel({ 
  searchKeyword, 
  setSearchKeyword, 
  filterModel, 
  setFilterModel, 
  filterProvider, 
  setFilterProvider,
  uniqueModels,
  uniqueProviders,
  hasActiveFilters,
  onClear,
  resultCount,
  onClose
}) {
  const { styles } = useTheme();
  const { t } = useLang();
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <Search style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontWeight: '500' }}>{t('searchFilter')}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
        
        {/* 关键词搜索 */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            style={{ ...styles.input, width: '100%' }}
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder={t('searchKeyword')}
          />
        </div>
        
        {/* 筛选下拉框 - 右对齐 */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* AI模型筛选 */}
          <select 
            style={styles.select}
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
          >
            <option value="">{t('allModels')}</option>
            {uniqueModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          
          {/* 提供者筛选 */}
          <select 
            style={styles.select}
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
          >
            <option value="">{t('allProviders')}</option>
            {uniqueProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
          
          {/* 清除筛选按钮 */}
          {hasActiveFilters && (
            <button 
              style={{ ...styles.smallButton, background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
              onClick={onClear}
            >
              <X style={{ width: '0.875rem', height: '0.875rem' }} />
              <span>{t('clear')}</span>
            </button>
          )}
        </div>
        
        {/* 搜索结果统计 */}
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>
          {t('foundNotes', { count: resultCount })}
        </div>
      </div>
    </div>
  );
}
