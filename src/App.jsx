/**
 * AI落幕笔记 - 主应用组件
 */
import { useState, useEffect } from 'react';
import { BookOpen, PenLine, Sparkles, Search, BarChart3, Shuffle, Sun, Moon, Clock, LayoutList, Globe, Bookmark } from 'lucide-react';
import { supabase, PAGE_SIZE } from './config/supabase.js';
import { useTheme } from './context/ThemeContext.jsx';
import { useLang } from './context/LanguageContext.jsx';
import { 
  NoteCard, 
  NoteForm, 
  SearchPanel, 
  StatsPanel, 
  RandomModal, 
  Pagination,
  ShareModal,
  TimelineView,
  NoteDetailModal,
  FavoritesModal
} from './components/index.js';

export default function App() {
  // ==================== 主题和语言 ====================
  const { theme, styles, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  
  // ==================== 状态管理 ====================
  const [activeTab, setActiveTab] = useState('read');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ai_model: '', provider: '', summary: '', 
    confusion: '', unsatisfied: '', exploration: '', context: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  
  // 搜索筛选
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  
  // 高亮显示的笔记（从URL参数来）
  const [highlightNoteId, setHighlightNoteId] = useState(null);
  
  // 统计和随机
  const [showStats, setShowStats] = useState(false);
  const [randomNote, setRandomNote] = useState(null);
  const [showRandomModal, setShowRandomModal] = useState(false);
  
  // 分享
  const [shareNote, setShareNote] = useState(null);
  
  // 视图模式：list（列表）或 timeline（时间线）
  const [viewMode, setViewMode] = useState('list');
  
  // 笔记详情弹窗
  const [detailNote, setDetailNote] = useState(null);
  
  // 收藏
  const [showFavorites, setShowFavorites] = useState(false);

  // ==================== 数据加载 ====================
  useEffect(() => { loadNotes(); }, []);
  
  // 检查URL参数，定位到指定笔记
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get('note');
    if (noteId) {
      setHighlightNoteId(noteId);
      setActiveTab('read'); // 确保在阅读页
      // 清除URL参数但不刷新页面
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  // 当笔记加载完成且有高亮ID时，滚动到对应笔记
  useEffect(() => {
    if (highlightNoteId && notes.length > 0 && !loading) {
      // 找到笔记在列表中的位置，计算页码
      const noteIndex = notes.findIndex(n => n.id === highlightNoteId);
      if (noteIndex !== -1) {
        const targetPage = Math.floor(noteIndex / PAGE_SIZE) + 1;
        setCurrentPage(targetPage);
        
        // 延迟滚动，等待页面渲染
        setTimeout(() => {
          const element = document.getElementById(`note-${highlightNoteId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          // 3秒后取消高亮
          setTimeout(() => setHighlightNoteId(null), 3000);
        }, 100);
      }
    }
  }, [highlightNoteId, notes, loading]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      // 起源笔记置顶
      const sorted = (data || []).sort((a, b) => {
        if (a.is_foundation && !b.is_foundation) return -1;
        if (!a.is_foundation && b.is_foundation) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setNotes(sorted);
    } catch (error) {
      console.error('加载笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== 提交笔记 ====================
  const handleSubmit = async () => {
    if (!formData.confusion.trim() || !formData.unsatisfied.trim() || !formData.exploration.trim()) {
      setSubmitStatus('请填写所有必填项');
      return;
    }
    try {
      setSubmitStatus('保存中...');
      const { error } = await supabase.from('notes').insert([{
        ai_model: formData.ai_model.trim() || null,
        provider: formData.provider.trim() || null,
        summary: formData.summary.trim() || null,
        confusion: formData.confusion.trim(),
        unsatisfied: formData.unsatisfied.trim(),
        exploration: formData.exploration.trim(),
        context: formData.context.trim() || null,
        is_foundation: false
      }]);
      if (error) throw error;
      setSubmitStatus('✓ 笔记已保存');
      setFormData({ ai_model: '', provider: '', summary: '', confusion: '', unsatisfied: '', exploration: '', context: '' });
      setTimeout(() => { setSubmitStatus(''); setActiveTab('read'); loadNotes(); }, 1500);
    } catch (error) {
      console.error('保存失败:', error);
      setSubmitStatus('保存失败，请重试');
    }
  };

  // ==================== 点赞功能 ====================
  const getLikedNotes = () => {
    try { return JSON.parse(localStorage.getItem('likedNotes') || '[]'); } 
    catch { return []; }
  };
  
  const isNoteLiked = (noteId) => getLikedNotes().includes(noteId);

  // ==================== 收藏功能 ====================
  const getFavoritedNotes = () => {
    try { return JSON.parse(localStorage.getItem('favoritedNotes') || '[]'); } 
    catch { return []; }
  };
  
  const isNoteFavorited = (noteId) => getFavoritedNotes().includes(noteId);
  
  const handleFavorite = (noteId) => {
    const favoritedNotes = getFavoritedNotes();
    const isFavorited = favoritedNotes.includes(noteId);
    const newFavorited = isFavorited 
      ? favoritedNotes.filter(id => id !== noteId) 
      : [...favoritedNotes, noteId];
    localStorage.setItem('favoritedNotes', JSON.stringify(newFavorited));
    // 强制重新渲染
    setNotes([...notes]);
  };
  
  // 获取收藏的笔记列表
  const getFavoriteNotesList = () => {
    const favoritedIds = getFavoritedNotes();
    return notes.filter(note => favoritedIds.includes(note.id));
  };

  const handleLike = async (noteId, currentLikes) => {
    const likedNotes = getLikedNotes();
    const isLiked = likedNotes.includes(noteId);
    const newLikes = isLiked ? Math.max(0, (currentLikes || 0) - 1) : (currentLikes || 0) + 1;
    
    try {
      const { error } = await supabase.from('notes').update({ likes: newLikes }).eq('id', noteId);
      if (error) throw error;
      
      // 更新本地存储
      const newLiked = isLiked ? likedNotes.filter(id => id !== noteId) : [...likedNotes, noteId];
      localStorage.setItem('likedNotes', JSON.stringify(newLiked));
      
      // 更新状态
      setNotes(prev => prev.map(note => note.id === noteId ? { ...note, likes: newLikes } : note));
      if (randomNote?.id === noteId) setRandomNote(prev => ({ ...prev, likes: newLikes }));
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  // ==================== 筛选和分页 ====================
  const getFilteredNotes = () => {
    return notes.filter(note => {
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const fields = [note.confusion, note.unsatisfied, note.exploration, note.summary, note.context, note.ai_model, note.provider]
          .filter(Boolean).join(' ').toLowerCase();
        if (!fields.includes(keyword)) return false;
      }
      if (filterModel && note.ai_model !== filterModel) return false;
      if (filterProvider && note.provider !== filterProvider) return false;
      return true;
    });
  };

  const clearFilters = () => {
    setSearchKeyword(''); setFilterModel(''); setFilterProvider(''); setCurrentPage(1);
  };

  useEffect(() => { setCurrentPage(1); }, [searchKeyword, filterModel, filterProvider]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==================== 统计 ====================
  const getStats = () => {
    const totalNotes = notes.filter(n => !n.is_foundation).length;
    const modelStats = {}, providerStats = {};
    notes.forEach(note => {
      if (!note.is_foundation) {
        if (note.ai_model) modelStats[note.ai_model] = (modelStats[note.ai_model] || 0) + 1;
        if (note.provider) providerStats[note.provider] = (providerStats[note.provider] || 0) + 1;
      }
    });
    return {
      totalNotes,
      modelStats: Object.entries(modelStats).sort((a, b) => b[1] - a[1]),
      providerStats: Object.entries(providerStats).sort((a, b) => b[1] - a[1])
    };
  };

  // ==================== 随机阅读 ====================
  const pickRandomNote = () => {
    const available = notes.filter(n => !n.is_foundation);
    if (available.length === 0) return;
    
    // 如果只有一条笔记，直接显示
    if (available.length === 1) {
      setRandomNote(available[0]);
      setShowRandomModal(true);
      return;
    }
    
    // 确保不会连续随机到同一条
    let newNote;
    do {
      newNote = available[Math.floor(Math.random() * available.length)];
    } while (randomNote && newNote.id === randomNote.id);
    
    setRandomNote(newNote);
    setShowRandomModal(true);
  };

  // ==================== 计算值 ====================
  const filteredNotes = getFilteredNotes();
  const paginatedNotes = filteredNotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filteredNotes.length / PAGE_SIZE);
  const hasActiveFilters = searchKeyword || filterModel || filterProvider;
  const uniqueModels = [...new Set(notes.map(n => n.ai_model).filter(Boolean))];
  const uniqueProviders = [...new Set(notes.map(n => n.provider).filter(Boolean))];

  // ==================== 渲染 ====================
  return (
    <div style={{ ...styles.container, position: 'relative' }}>
      <div style={styles.wrapper}>
        {/* 头部 */}
        <div style={styles.header}>
          {/* 右上角按钮组 */}
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
            {/* 语言切换 */}
            <button style={styles.themeToggle} onClick={toggleLang} title={lang === 'zh' ? 'Switch to English' : '切换到中文'}>
              <Globe style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            {/* 主题切换 */}
            <button style={styles.themeToggle} onClick={toggleTheme} title={t(theme === 'dark' ? 'switchToLight' : 'switchToDark')}>
              {theme === 'dark' ? <Sun style={{ width: '1.25rem', height: '1.25rem' }} /> : <Moon style={{ width: '1.25rem', height: '1.25rem' }} />}
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles style={{ width: '2rem', height: '2rem', color: '#fbbf24' }} />
            <h1 style={styles.title}>{t('title')}</h1>
          </div>
          <p style={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* 标签页 */}
        <div style={styles.tabContainer}>
          <button style={styles.tab(activeTab === 'read')} onClick={() => setActiveTab('read')}>
            <BookOpen style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>{t('readNotes')}</span>
          </button>
          <button style={styles.tab(activeTab === 'write')} onClick={() => setActiveTab('write')}>
            <PenLine style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>{t('writeNote')}</span>
          </button>
        </div>

        {/* 内容区域 */}
        {activeTab === 'write' ? (
          <NoteForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleSubmit} 
            submitStatus={submitStatus} 
          />
        ) : (
          <div>
            {/* 工具栏 */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              {/* 视图切换 */}
              <div style={{ display: 'flex', gap: '0.25rem', background: styles.tabContainer.background, padding: '0.25rem', borderRadius: '0.375rem' }}>
                <button 
                  style={{ 
                    ...styles.smallButton, 
                    background: viewMode === 'list' ? styles.tab(true).background : 'transparent',
                    color: viewMode === 'list' ? styles.tab(true).color : styles.tab(false).color,
                    padding: '0.375rem 0.75rem'
                  }}
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList style={{ width: '1rem', height: '1rem' }} />
                  <span>{t('list')}</span>
                </button>
                <button 
                  style={{ 
                    ...styles.smallButton, 
                    background: viewMode === 'timeline' ? styles.tab(true).background : 'transparent',
                    color: viewMode === 'timeline' ? styles.tab(true).color : styles.tab(false).color,
                    padding: '0.375rem 0.75rem'
                  }}
                  onClick={() => setViewMode('timeline')}
                >
                  <Clock style={{ width: '1rem', height: '1rem' }} />
                  <span>{t('timeline')}</span>
                </button>
              </div>
              
              {/* 功能按钮 */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={styles.smallButton} onClick={() => setShowFavorites(true)}>
                  <Bookmark style={{ width: '1rem', height: '1rem' }} /><span>{t('favorites')}</span>
                </button>
                <button style={styles.smallButton} onClick={pickRandomNote} disabled={notes.filter(n => !n.is_foundation).length === 0}>
                  <Shuffle style={{ width: '1rem', height: '1rem' }} /><span>{t('random')}</span>
                </button>
                <button style={styles.smallButton} onClick={() => setShowStats(!showStats)}>
                  <BarChart3 style={{ width: '1rem', height: '1rem' }} /><span>{t('stats')}</span>
                </button>
                <button style={styles.smallButton} onClick={() => setShowSearch(!showSearch)}>
                  <Search style={{ width: '1rem', height: '1rem' }} /><span>{t('searchFilter')}</span>
                  {hasActiveFilters && <span style={{ marginLeft: '0.25rem' }}>●</span>}
                </button>
              </div>
            </div>

            {/* 笔记列表 */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>{t('loading')}</div>
            ) : filteredNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                  {hasActiveFilters ? t('noMatch') : t('noNotes')}
                </p>
                {!hasActiveFilters && (
                  <button onClick={() => setActiveTab('write')} style={{ color: '#fbbf24', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    {t('writeFirst')}
                  </button>
                )}
              </div>
            ) : viewMode === 'timeline' ? (
              /* 时间线视图 */
              <TimelineView 
                notes={filteredNotes}
                isNoteLiked={isNoteLiked}
                isNoteFavorited={isNoteFavorited}
                onLike={handleLike}
                onShare={(note) => setShareNote(note)}
                onFavorite={handleFavorite}
                onViewDetail={(note) => setDetailNote(note)}
              />
            ) : (
              /* 列表视图 */
              <>
                {paginatedNotes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    isLiked={isNoteLiked(note.id)} 
                    isFavorited={isNoteFavorited(note.id)}
                    onLike={handleLike} 
                    onShare={(note) => setShareNote(note)}
                    onFavorite={handleFavorite}
                    onViewDetail={(note) => setDetailNote(note)}
                    isHighlighted={note.id === highlightNoteId}
                  />
                ))}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
              </>
            )}
          </div>
        )}

        {/* 页脚 */}
        <div style={styles.footer}>
          <p>{t('footer1')}</p>
          <p style={{ marginTop: '0.25rem' }}>{t('footer2')}</p>
          <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>{t('footer3')}</p>
          <p style={{ marginTop: '1rem', color: '#6b7280', fontStyle: 'italic', maxWidth: '600px', margin: '1rem auto 0' }}>
            {t('footer4')}
          </p>
        </div>
      </div>

      {/* 随机笔记弹窗 */}
      {showRandomModal && (
        <RandomModal
          note={randomNote}
          isLiked={randomNote ? isNoteLiked(randomNote.id) : false}
          onLike={handleLike}
          onClose={() => { setShowRandomModal(false); setRandomNote(null); }}
          onNext={pickRandomNote}
          onShare={(note) => setShareNote(note)}
        />
      )}
      
      {/* 分享弹窗 */}
      {shareNote && (
        <ShareModal
          note={shareNote}
          onClose={() => setShareNote(null)}
        />
      )}
      
      {/* 统计弹窗 */}
      {showStats && <StatsPanel stats={getStats()} onClose={() => setShowStats(false)} />}
      
      {/* 搜索筛选弹窗 */}
      {showSearch && (
        <SearchPanel
          searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword}
          filterModel={filterModel} setFilterModel={setFilterModel}
          filterProvider={filterProvider} setFilterProvider={setFilterProvider}
          uniqueModels={uniqueModels} uniqueProviders={uniqueProviders}
          hasActiveFilters={hasActiveFilters} onClear={clearFilters}
          resultCount={filteredNotes.length}
          onClose={() => setShowSearch(false)}
        />
      )}
      
      {/* 笔记详情弹窗 */}
      {detailNote && (
        <NoteDetailModal
          note={detailNote}
          isLiked={isNoteLiked(detailNote.id)}
          isFavorited={isNoteFavorited(detailNote.id)}
          onLike={handleLike}
          onShare={(note) => setShareNote(note)}
          onFavorite={handleFavorite}
          onClose={() => setDetailNote(null)}
        />
      )}
      
      {/* 收藏列表弹窗 */}
      {showFavorites && (
        <FavoritesModal
          favorites={getFavoriteNotesList()}
          onClose={() => setShowFavorites(false)}
          onViewNote={(note) => { setShowFavorites(false); setDetailNote(note); }}
        />
      )}
    </div>
  );
}
