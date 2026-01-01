/**
 * 分页组件
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { styles } = useTheme();
  const { t } = useLang();
  
  if (totalPages <= 1) return null;
  
  return (
    <div style={styles.pagination}>
      {/* 上一页按钮 */}
      <button
        style={styles.pageButton(false)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft style={{ width: '1rem', height: '1rem' }} />
      </button>
      
      {/* 页码按钮 */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page => {
          // 显示第一页、最后一页、当前页及其前后两页
          return page === 1 || 
                 page === totalPages || 
                 Math.abs(page - currentPage) <= 2;
        })
        .map((page, index, arr) => (
          <span key={page}>
            {/* 如果页码不连续，显示省略号 */}
            {index > 0 && page - arr[index - 1] > 1 && (
              <span style={{ color: '#6b7280', padding: '0 0.25rem' }}>...</span>
            )}
            <button
              style={styles.pageButton(currentPage === page)}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </span>
        ))
      }
      
      {/* 下一页按钮 */}
      <button
        style={styles.pageButton(false)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight style={{ width: '1rem', height: '1rem' }} />
      </button>
      
      {/* 页码信息 */}
      <span style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
        {t('page', { current: currentPage, total: totalPages })}
      </span>
    </div>
  );
}
