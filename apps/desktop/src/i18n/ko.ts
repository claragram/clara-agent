import { defineLocale } from './define-locale'

export const ko = defineLocale({
  language: {
    label: '언어',
    description: '데스크톱 인터페이스 언어를 선택하세요.',
    saving: '언어 저장 중…',
    saveError: '언어 업데이트 실패',
    switchTo: '언어 변경',
    searchPlaceholder: '언어 검색…',
    noResults: '언어를 찾을 수 없습니다'
  },
  settings: {
    appearance: {
      title: '테마 및 화면',
      uiScaleTitle: 'UI 배율',
      uiScaleDesc: (percent: number) =>
        `전체 앱의 텍스트와 컨트롤 크기를 조절합니다. 현재: ${percent}%.`
    }
  }
})
