
# X 클론코딩

## 사용 기술:
- 코어: React, JavaScript
- 상태관리: React-Query, Recoil
- 스타일링: CSS
- 빌드: Vite
- CI/CD: GitHub Actions
- 배포: Netlify

## 커밋 컨벤션:
- feat (feature): 새로운 기능 추가
- fix (bug fix): 버그 수정
- docs (documentation): 내부 문서 추가/수정
- design : CSS 등 디자인 추가/수정
- style (formatting, missing semi colons, …): 코드 스타일 수정
- refactor: 코드 리팩토링
- test (when adding missing tests): 테스트 추가/수정
- chore (maintain): 빌드 관련 코드 수정
- env: 개발 환경 관련 설정

## Prettier & EsLint:
- EsLint: Airbnb Style Guid
- Prettier: 작은 따옴표, 세미콜론 사용, 들여쓰기 2칸, 한줄에 최대 100줄

## 배포: CI/CD
### Github Action 사용:
Continuous Integration : Dev의 에러가 없을 경우 Master로 자동 통합

### Netlify 사용

Continuous Delivery : Master 브랜치 자동 배포

[![Netlify Status](https://api.netlify.com/api/v1/badges/671e2d79-6b33-4131-ad49-88105ca04129/deploy-status)](https://app.netlify.com/sites/twitter42/deploys)
