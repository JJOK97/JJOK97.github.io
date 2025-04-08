---
title: "Git Branch 명령어"
description: "여러명이서 Git을 사용하려면 어떻게 할까?"
tags:
  - Dev
  - Git
  - GitHub
  - Collaboration
date: 2025-03-17
lastmod: 2025-03-17
---

**👉 이전 편 : [Git 설치와 기본 명령어](https://jjok97.github.io/dev/git-guide-2)**

Git 브랜치는 여러 명의 개발자가 서로 영향을 주지 않고 동시에 작업을 할 수 있게 하며,
브랜치가 특정 기능이나 이슈에 대응하여 작업을 추적하고 버전 단위로 관리하여 프로젝트 관리와 배포의 안정성을 높여줍니다.
오늘은 주요 명령어가 내용이 많기때문에 먼저 설명드리고 그 아래에 전략을 살펴보도록 하겠습니다.

---

## Git Branch의 주요 명령어

우선 브랜치를 조회하고 생성, 이동을 해보도록 합시다.

1. 브랜치 목록 확인

   ```powershell
   git branch

   -- 원하는 branch가 뜨지않는다?
   git fetch ( 동기화 )
   ```

1. 새로운 브랜치 생성 ( 이동 X )

   ```powershell
   git branch 브랜치명

   ex) git branch feature/signup

   -- 현재 브랜치 (main)
   -- 브랜치 생성
   -- git branch // 브랜치 목록 확인
      main * // 아스타리카는 내가 현재 있는 위치를 뜻합니다.
      feature/signup
   ```

   - 상위 브랜치를 그대로 복사하여 새로운 분기가 생기니, 항상 상위(현재) 브랜치의 위치를 확인합시다.
   - 보통은 main 아래에 develop 브랜치를 분기해서 한 후, 해당 브랜치에서 feature 브랜치를 분기해서 작업을 진행합니다.

1. 해당 브랜치로 이동

   ```powershell
   git checkout 브랜치명

   ex) git checkout feature/signup
   ```

1. 새로운 브랜치로 생성하고 바로 이동

   ```powershell
   git checkout -b 브랜치명

   ex) git checkout -b feature/signup

   -- 현재 브랜치 (main)
   -- 브랜치 생성
   -- git branch // 브랜치 목록 확인
      main
      feature/signup * // 아스타리카는 내가 보고있는 위치를 뜻합니다.
   ```

1. 작업 후 커밋을 해야 로컬에서 생성한 브랜치가 서버로 올라가게 됩니다.

   ```powershell
   -- 파일 작업 이후
   git push origin feature/signup
   ```

   - 절대 **git push origin main**이나 **git push origin develop**하지 말것
   - 담당자는 main과 develop에 Protected 작업을 해줍시다. ( push해도 변경이안됨 )

---

## Pull Request ( == Merge Request )

Pull Request 줄여서 PR은 ( GitLab에서는 MR이라고 합니다. ) 개발과 테스트가 끝난 코드를 실제로 배포되고있는 Main 브랜치나 Release( 배포 ) 브랜치에다가
어떤 작업을 한 커밋인지, 어떤 문제가 발생했었는지, 어떻게 해결을 하였는지 등을 보기 쉽게 기술하여 담당자에게 제출하는 작업입니다.

이 작업을 통해 문제가 발생하더라도 빠르게 추적하여 에러를 해결 할 수 있기 때문에 중요한 Branch에는 필수적인 작업입니다.

그러면 어떻게 PR을 날릴 수 있느냐..

해당 작업은 GitHub 웹페이지에서 진행합니다.
브랜치에서 작업이 완료 한 후 commit을 하게 되면 웹페이지에 PR이 가능한 버튼이 생성이 됩니다.

<img src="static/img/gitguide-1.png" alt="git guide">

해당 버튼을 누르면

<img src="static/img/gitguide-2.png" alt="git guide">

위와 같은 화면이 나오는데 내용은 아래와 같습니다.

1. 내가 작업한 브랜치를 어디로 합치겠냐입니다. 팀이 약속한 컨벤션에 따라 적절한 브랜치를 선택해주세요.
2. 커밋 제목과 내용입니다. 해당 내용도 보고 받아야 주요 내용을 form 형식으로 약속하여 일관된 내용을 받으면 작업의 효율성이 높아집니다.
3. 변경 사항입니다. 해당 기능을 개발하기 위한 모든 변경사항과 contributor를 확인 할 수 있습니다.

그 아래로 스크롤 해보면 수정된 모든 파일을 확인 할 수 있습니다.

<img src="static/img/gitguide-3.png" alt="git guide">

확인이 되었다면 위의 **Create Pull Request**를 눌러봅시다.

그러면 최종 확인 창이 뜨게 됩니다.

여기서 특정한 문제 ( 충돌 문제, Conflict ) 가 발생하지 않는다면 초록색으로 Merge 버튼이 뜨게 됩니다.
만약 팀원이라면 버튼을 누르지 않는 여기까지가 작업 완료입니다.

Create Pull Request 까지 작업을 한 후 팀장님께 PR 날렸습니다~ 라고 보고드리면 됩니다.

<img src="static/img/gitguide-4.png" alt="git guide">

팀장이나 코드 리뷰어는 해당 소소 코드들을 분석하여 Merge할지 반려할지 판단을 하게 됩니다.
최종적으로 안전한 코드라고 판단이 된다면 Merge를 눌러 아래와 같은 화면을 확인합시다.

<img src="static/img/gitguide-5.png" alt="git guide">

---

## Git Branch 전략

Git 전략은 관련된 블로그들이 아주 많이 있는거 같아요.
개발자들이 주로 사용하는 Git 브랜치 전략에 대해서 공유드리고 글 마무리 하도록 하겠습니다.

[git branch 전략](https://devocean.sk.com/blog/techBoardDetail.do?ID=165571&boardType=techBlog)
