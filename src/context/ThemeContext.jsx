/**
 * 主题上下文 - 管理深色/浅色主题切换
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { getStyles } from '../styles/index.js';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 从 localStorage 读取主题，默认深色
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // 根据主题生成样式
  const styles = getStyles(theme);

  // 切换主题
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 保存主题到 localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, styles, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
