/**
 * 全局样式定义 - 支持深色/浅色主题
 */

// 主题颜色配置
const themes = {
  dark: {
    bg: 'linear-gradient(to bottom right, #111827, #1f2937, #111827)',
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    textDark: '#6b7280',
    cardBg: 'rgba(31, 41, 55, 0.5)',
    cardFoundationBg: 'linear-gradient(to bottom right, rgba(120, 53, 15, 0.2), rgba(31, 41, 55, 0.5))',
    inputBg: 'rgba(17, 24, 39, 0.5)',
    border: '#4b5563',
    borderLight: 'rgba(55, 65, 81, 0.5)',
    accent: '#fbbf24',
    accentBg: 'rgba(245, 158, 11, 0.2)',
    accentBorder: 'rgba(245, 158, 11, 0.5)',
    modalBg: 'linear-gradient(to bottom right, #1f2937, #111827)',
    overlayBg: 'rgba(0, 0, 0, 0.8)'
  },
  light: {
    bg: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9, #f8fafc)',
    text: '#1f2937',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    textDark: '#9ca3af',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    cardFoundationBg: 'linear-gradient(to bottom right, rgba(251, 191, 36, 0.1), rgba(255, 255, 255, 0.8))',
    inputBg: 'rgba(255, 255, 255, 0.8)',
    border: '#d1d5db',
    borderLight: 'rgba(209, 213, 219, 0.5)',
    accent: '#d97706',
    accentBg: 'rgba(217, 119, 6, 0.1)',
    accentBorder: 'rgba(217, 119, 6, 0.5)',
    modalBg: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
    overlayBg: 'rgba(0, 0, 0, 0.5)'
  }
};

// 生成样式的函数
export const getStyles = (theme = 'dark') => {
  const t = themes[theme];
  
  return {
    // 页面容器
    container: {
      minHeight: '100vh',
      background: t.bg,
      color: t.text,
      padding: '2rem',
      transition: 'all 0.3s ease'
    },
    
    // 内容包装器
    wrapper: { 
      maxWidth: '1024px', 
      margin: '0 auto' 
    },
    
    // 头部区域
    header: { 
      textAlign: 'center', 
      marginBottom: '2rem' 
    },
    
    // 标题样式
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #fbbf24, #f97316)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline'
    },
    
    // 副标题
    subtitle: { 
      color: t.textMuted, 
      fontSize: '0.875rem', 
      marginTop: '0.5rem' 
    },
    
    // 标签页容器
    tabContainer: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      background: t.cardBg,
      padding: '0.25rem',
      borderRadius: '0.5rem'
    },
    
    // 标签页按钮
    tab: (active) => ({
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: active ? t.accentBg : 'transparent',
      color: active ? t.accent : t.textMuted
    }),
    
    // 笔记卡片
    card: (isFoundation) => ({
      background: isFoundation ? t.cardFoundationBg : t.cardBg,
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      border: `1px solid ${t.accentBorder}`,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }),
    
    // 表单标签
    label: { 
      color: t.accent, 
      fontSize: '0.875rem', 
      fontWeight: '500', 
      marginBottom: '0.5rem', 
      display: 'block' 
    },
    
    // 多行文本输入框
    textarea: {
      width: '100%',
      background: t.inputBg,
      border: `1px solid ${t.border}`,
      borderRadius: '0.375rem',
      padding: '0.75rem',
      color: t.text,
      minHeight: '6rem',
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    },
    
    // 单行输入框
    input: {
      width: '100%',
      background: t.inputBg,
      border: `1px solid ${t.border}`,
      borderRadius: '0.375rem',
      padding: '0.75rem',
      color: t.text,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    },
    
    // 下拉选择框
    select: {
      background: t.inputBg,
      border: `1px solid ${t.border}`,
      borderRadius: '0.375rem',
      padding: '0.5rem',
      color: t.text,
      outline: 'none',
      cursor: 'pointer',
      minWidth: '120px',
      transition: 'all 0.3s ease'
    },
    
    // 主按钮
    button: {
      width: '100%',
      background: 'linear-gradient(to right, #f59e0b, #f97316)',
      color: 'white',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '1rem'
    },
    
    // 小按钮
    smallButton: {
      background: t.accentBg,
      color: t.accent,
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'all 0.3s ease'
    },
    
    // 章节标题
    sectionTitle: { 
      color: t.accent, 
      fontWeight: '500', 
      marginBottom: '0.5rem' 
    },
    
    // 正文文本
    text: { 
      color: t.textSecondary, 
      lineHeight: '1.6', 
      whiteSpace: 'pre-wrap' 
    },
    
    // 标签
    tag: {
      display: 'inline-block',
      background: t.accentBg,
      color: t.accent,
      fontSize: '0.875rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      marginRight: '0.5rem'
    },
    
    // 时间显示
    time: { 
      color: t.textDark, 
      fontSize: '0.875rem', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.25rem' 
    },
    
    // 页脚
    footer: { 
      marginTop: '2rem', 
      textAlign: 'center', 
      fontSize: '0.75rem', 
      color: t.textDark 
    },
    
    // 起源笔记标识
    foundationBadge: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem', 
      color: t.accent, 
      fontSize: '0.875rem', 
      marginBottom: '0.75rem' 
    },
    
    // 搜索面板
    searchPanel: {
      background: t.cardBg,
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
      border: `1px solid ${t.borderLight}`,
      transition: 'all 0.3s ease'
    },
    
    // 搜索输入框
    searchInput: {
      flex: 1,
      background: t.inputBg,
      border: `1px solid ${t.border}`,
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
      color: t.text,
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    
    // 分页容器
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '1.5rem',
      flexWrap: 'wrap'
    },
    
    // 分页按钮
    pageButton: (active) => ({
      background: active ? t.accentBg : t.cardBg,
      color: active ? t.accent : t.textMuted,
      border: active ? `1px solid ${t.accentBorder}` : `1px solid ${t.borderLight}`,
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      minWidth: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    }),
    
    // 统计面板
    statsPanel: {
      background: t.cardBg,
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      border: `1px solid ${t.borderLight}`,
      transition: 'all 0.3s ease'
    },
    
    // 统计项
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${t.borderLight}`
    },
    
    // 统计条形图
    statBar: (percentage) => ({
      height: '0.5rem',
      background: 'linear-gradient(to right, #f59e0b, #f97316)',
      borderRadius: '0.25rem',
      width: `${percentage}%`,
      marginTop: '0.25rem'
    }),
    
    // 点赞按钮
    likeButton: (isLiked) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      background: isLiked ? 'rgba(239, 68, 68, 0.2)' : t.cardBg,
      color: isLiked ? '#f87171' : t.textMuted,
      border: isLiked ? '1px solid rgba(239, 68, 68, 0.3)' : `1px solid ${t.borderLight}`,
      borderRadius: '0.375rem',
      padding: '0.5rem 0.875rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    }),
    
    // 弹窗遮罩层
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: t.overlayBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    },
    
    // 弹窗内容
    modalContent: {
      background: t.modalBg,
      borderRadius: '0.75rem',
      padding: '1.5rem',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '80vh',
      overflow: 'auto',
      border: `1px solid ${t.accentBorder}`,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    
    // 弹窗头部
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: `1px solid ${t.borderLight}`
    },
    
    // 主题切换按钮
    themeToggle: {
      background: t.accentBg,
      color: t.accent,
      border: 'none',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    }
  };
};

// 默认导出深色主题（兼容旧代码）
export const styles = getStyles('dark');
