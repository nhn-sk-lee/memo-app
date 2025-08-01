'use client'

import { useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Memo, MEMO_CATEGORIES } from '@/types/memo'

// MDEditor.Markdown을 동적으로 import (SSR 이슈 방지)
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
)

interface MemoViewerProps {
  memo: Memo | null
  isOpen: boolean
  onClose: () => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => void
}

export default function MemoViewer({ memo, isOpen, onClose, onEdit, onDelete }: MemoViewerProps) {
  // ESC 키로 모달 닫기
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  // 키보드 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // 배경 스크롤 방지
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  // 배경 클릭으로 모달 닫기
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 카테고리 색상
  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      idea: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  // 삭제 핸들러
  const handleDelete = () => {
    if (memo && window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      onDelete(memo.id)
      onClose()
    }
  }

  // 편집 핸들러
  const handleEdit = () => {
    if (memo) {
      onEdit(memo)
      onClose()
    }
  }

  if (!isOpen || !memo) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="memo-viewer-title"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideIn">
        {/* 헤더 */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1 mr-4">
            <h2 
              id="memo-viewer-title"
              className="text-xl font-bold text-gray-900 mb-3 leading-tight"
            >
              {memo.title}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(memo.category)}`}
              >
                {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] || memo.category}
              </span>
              <div className="text-sm text-gray-500">
                <div>작성: {formatDate(memo.createdAt)}</div>
                {memo.updatedAt !== memo.createdAt && (
                  <div>수정: {formatDate(memo.updatedAt)}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="모달 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="prose max-w-none">
            <div data-color-mode="light">
              <MDEditor.Markdown 
                source={memo.content} 
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#374151',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}
              />
            </div>
          </div>

          {/* 태그 */}
          {memo.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">태그</h4>
              <div className="flex gap-2 flex-wrap">
                {memo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            편집
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            삭제
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}