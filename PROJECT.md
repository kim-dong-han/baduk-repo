# PROJECT.md

## Project

바둑 AI 기보 분석 웹서비스의 새로운 프론트엔드 프로젝트다.

이 프로젝트는 기존 Spring Boot + Thymeleaf 프로젝트의 UI를 그대로 이전하는 프로젝트가 아니다.

기존 프로젝트는 기능과 데이터 구조를 이해하기 위한 참고 자료일 뿐이다.

---

## Core Principle

새로운 UI/UX를 처음부터 설계한다.

기존 프로젝트의:

- HTML 구조
- CSS 구조
- JavaScript 구조
- class naming
- DOM 구조
- layout
- spacing
- component structure

를 그대로 복사하거나 계승하지 않는다.

기존 디자인을 "개선"하는 것이 아니라
새로운 제품의 프론트엔드를 설계한다.

---

## Frontend Stack

- React 19
- TypeScript
- Vite
- React Router
- CSS
- REST API
- Vercel

---

## Backend

Backend는 별도의 Spring Boot 프로젝트에서 담당한다.

- Spring Boot
- Java 21
- Spring Security
- JWT
- JPA
- PostgreSQL
- Neon
- Render

Frontend는 Backend의 REST API를 호출한다.

---

## Development Philosophy

기능보다 UI/UX 구조를 먼저 확립한다.

개발 순서는:

1. Design System
2. Layout
3. Components
4. Pages
5. Mock Data
6. UX refinement
7. API integration
8. Authentication
9. Error handling
10. Final QA

이다.

---

## Important Rule

API가 아직 구현되지 않았다는 이유로
UI 구현을 중단하지 않는다.

필요한 경우 Mock Data를 사용한다.

---

## Design Goal

서비스는:

- 현대적
- 차분함
- 신뢰감
- 전문성
- 바둑의 정체성
- 학습 서비스의 친절함

을 동시에 가져야 한다.

"AI가 만든 SaaS 템플릿"처럼 보이지 않아야 한다.

---

## Avoid

- 과도한 카드 UI
- 모든 요소를 둥근 카드로 만드는 디자인
- 지나치게 큰 제목
- 과도한 gradient
- 과도한 shadow
- 의미 없는 아이콘
- 작은 글씨
- 정보 과밀
- dashboard template 느낌
- 기계적인 AI 서비스 느낌
- 기존 게시판 스타일
- 기존 프로젝트의 UI 복사
