import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// 환경변수 확인 및 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 디버깅을 위한 환경변수 값 출력
console.log('🔍 환경변수 디버깅:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음');

// 환경변수가 설정되지 않은 경우 에러 메시지와 함께 null 클라이언트 생성
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️  Supabase 환경변수가 설정되지 않았습니다.');
  console.error('다음 환경변수를 .env.local 파일에 설정해주세요:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  console.error('🔧 임시로 로컬스토리지를 사용합니다.');
} else {
  console.log('✅ Supabase 환경변수가 정상적으로 설정되었습니다!');
}

// Supabase 클라이언트 생성 (환경변수가 없어도 에러 방지)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;