import { Memo, MemoFormData } from '@/types/memo';
import { supabase } from './supabase';

export const supabaseUtils = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    // Supabase 클라이언트가 없으면 빈 배열 반환 (로컬스토리지 fallback)
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading memos from Supabase:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error loading memos from Supabase:', error);
      return [];
    }
  },

  // 메모 추가
  addMemo: async (memo: Memo): Promise<Memo | null> => {
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .insert({
          id: memo.id,
          title: memo.title,
          content: memo.content,
          category: memo.category,
          tags: memo.tags,
          created_at: memo.createdAt,
          updated_at: memo.updatedAt,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding memo to Supabase:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error adding memo to Supabase:', error);
      return null;
    }
  },

  // 메모 업데이트
  updateMemo: async (updatedMemo: Memo): Promise<Memo | null> => {
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .update({
          title: updatedMemo.title,
          content: updatedMemo.content,
          category: updatedMemo.category,
          tags: updatedMemo.tags,
          updated_at: updatedMemo.updatedAt,
        })
        .eq('id', updatedMemo.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating memo in Supabase:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating memo in Supabase:', error);
      return null;
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting memo from Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting memo from Supabase:', error);
      return false;
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching memos in Supabase:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error searching memos in Supabase:', error);
      return [];
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return [];
    }

    try {
      let query = supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false });

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error getting memos by category from Supabase:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error getting memos by category from Supabase:', error);
      return [];
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error getting memo by ID from Supabase:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error getting memo by ID from Supabase:', error);
      return null;
    }
  },

  // 모든 메모 삭제
  clearMemos: async (): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase가 설정되지 않았습니다. 로컬스토리지를 사용하세요.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .gte('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('Error clearing memos from Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error clearing memos from Supabase:', error);
      return false;
    }
  },
};