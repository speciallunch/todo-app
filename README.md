# 구현 설명

### 구현 구조

- api
  - msw의 data와 통신하는 todo api 구현
- page
  - App 단일 페이지 구조로, Todos 컴포넌트 내부에서 필요한 layout들을 구현
- style
  - MUI를 사용하여 기본 컨트롤 컴포넌트 layout 구현
  - App.css 내부에 스타일 적용

### API 구조

- 제공된 API Spec을 바탕으로, fetch/create/get/update/delete api 구현
- 비동기 상태 관리를 위해 'Tanstack Query'를 사용하였으며, Todo 컴포넌트 내부에서 queryClient를 통해 query 및 mutation 사용
- todos를 가지고 올 때, loading 상태나 error 상황의 경우 list 영역에 표시하도록 구현

### 페이지 구조

- 구현한 레이아웃 구조
  - 제목
  - '캘린더 & input & 추가 버튼' 컨테이너
  - '검색/수정/삭제 & 페이지 사이즈 선택 버튼' 컨테이너
    - 검색 Input에 검색하고자 하는 todo 내용을 입력 시, 검색된 내용과 일치하는 todo만 list에 표시 
    - 수정은 하나의 list item이 선택되었을 때에만 가능
    - 삭제는 하나 이상의 list item이 선택되었을 때에만 가능
  - todo list 컨테이너
    - checkbox & TodoItem으로 이루어진 list item
    - list item이 수정 상태일 경우에는 '완료 여부 버튼/완료 날짜/내용'이 수정 가능하도록 바뀌고, 수정을 완료하면 '확인' 버튼으로 업데이트 요청
    - 3일 이내 및 기한이 지난 todo의 경우에는 list 배경색을 다르게 표현
  - pagination 컨테이너
    - 현재 페이지 및 max 페이지 표시
    - 이전/다음 버튼으로 페이지 이동

### 고려 사항

- todos의 상태관리를 라이브러리 없이 서버 상태와 클라이언트 상태 따로 관리하여 sync를 맞추려고 하니 어려움이 많아 중간에 tanstack query 적용하는 방식으로 수정
- tanstack query를 통해 infinite scroll을 구현하고자 하였으나, api 수정이 필요하는 등의 공수가 있어 pagination 방식으로 구현
- 비교적 단순한 페이지 구조가 예상되어 하나의 Todo 컴포넌트와 내부 TodoItem 컴포넌트 구조로만 구성하였으나, 생각보다 기능 요구사항이 간단하지 않아 컴포넌트 구조 세분화의 필요성이 있음
- 스타일 또한 css보다 scss를 적용하여 구조적으로 세분화의 필요성이 있음 

    



