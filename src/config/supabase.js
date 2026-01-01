/**
 * Supabase 配置文件
 */
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 每页显示的笔记数量
export const PAGE_SIZE = 10;
