import { defineLocale } from './define-locale'

export const ko = defineLocale({
  common: {
    save: '저장',
    cancel: '취소',
    search: 'Search...',
    close: 'Close'
  },
  settings: {
    title: '설정',
    language: '언어',
    languageDescription: 'Clara 인터페이스 언어를 선택하세요.',
    appearance: '테마'
  },
  chat: {
    placeholder: 'Clara에게 메시지 보내기...'
  }
})
