---
title: '[SQL] DB 권한 관리와 프로젝트 적용 가이드'
excerpt: 'DCL 사용법과 팀 협업 컨벤션에 대해서 알아보자...'

categories:
    - TIL
tags:
    - [SQL, Oracle]

# permalink: /Dev/template/
permalink: /til/oracle-db-permission/

toc: true
toc_sticky: true

date: 2025-02-27
last_modified_at: 2025-02-27
---

## **Keep**

오늘은 프로젝트에서 그렇게 자주 사용하지 않는 개념들임에도 불구하고 집중을 깨지않고 수업을 잘 따라갔다…

또 이번주 초까지만 해도 일주일만에 오라클을 끝낼수있나? 생각이 들었는데, 4일이 채 안되서 끝난거보면서 우리반 분들 수준이 다들 높구나라고 알게되었다.

그리고 어제 회고록이 수업에서 방향도 많이 엇나가고 난해한 내용이였지만 몇몇 분들이 봐주시고 유익했다고 해서 기분이 좀 좋았다..ㅎ🤭

회고록도 처음 써보지만 나에게 도움이 꽤 많이 되고있있다.

나는 난생 처음 보는 단어고 개념이라고 생각했었는데, SQLD랑 각종 DB 개념에 잔뜩 나오더라 ㅋㅋㅋㅠ

그래서 앞으로도 나를위해서 또는 이 글을 읽을 누군가를 위해서 체력 되는한 최대한 열심히 쓰자라는 목표를 가지게 되었다..!!

## **Problem**

오늘 배웠던 개념들은 처음 DB를 배울때 엄청 머리싸매면서 외웠었는데, 이후로 사용할 일이 전혀 없었더니 싹 다 까먹어서 다들 뉘신지.. 상태였다.

잠시나마 나중에 프로젝트하면 뭐하지~ 이런 생각을 했던거에 대해서 반성을 하게 되었고, 어떻게 하지에 대해서 공부를 많이 해야함을 느꼈다.

특히 DCL과 관련된 부분들은 팀장으로써 프로젝트 환경 설정 할때 많이 사용을 할테니, 주요 코드들은 수업 해주실때 바로바로 외워야 겠다고 생각이 들었다.

**프로젝트시 사용 할 수 있는 유저 생성과 권한 부여**

1. **사용자 계정 생성**

    ```sql
    CREATE USER 'jsock414'@'%' IDENTIFIED BY 'password';
    ```

    - %는 모든 ip에서 접속 가능하게 하겠다는 뜻이다.
    - 특정 IP에만 부여하고 싶으면 %자리에 `192.168.1.%` 등으로 작성하면 된다.

    <br>

2. **기본 권한 부여 ( 테이블 조작, CRUD 작업 가능 )**

    생성한 유저에게 테이블을 조작 할 수 있는 권한을 주어야한다.

    보통은 **안정성을 위해 CREATE만 부여하는것을 권장**한다고 한다.

    ```sql
    GRANT CREATE ON project_db.* TO 'jsock414@'%';
    ```

    - project_db.\*는 project_db의 모든 테이블에 CRUD 작업을 가능케 하겠다는 뜻이다.

    <br>

    팀 단위가 소규모이고 팀원들을 믿는다면 전체 권한을 다 부여해보자.

    ```sql
    GRANT CREATE, ALTER, DROP ON project_db.* TO 'jsock414'@'%';
    ```

    <br>

    아래의 코드는 테이블 내부의 데이터를 조회, 삽입, 수정 삭제를 각각 부여한 코드이다.

    ```sql
    GRANT SELECT, INSERT, UPDATE, DELETE ON project_db.* TO 'jsock414'@'%';
    ```

    <br>

    마지막으로 부여해줄 권한은 저장 프로시저이다.

    저장 프로시저란 누군가가 정의해둔 SQL문을 함수로 만들어서 어딘가에 저장해 두는데, 이 저장한 함수를 사용 할 수 있는 권한을 준다는 것이다.

    아마 사용할일이 앞으로도 많지않을꺼같아서 무조건 적용해보고싶다 아니면 넘어가도 될꺼같다.

    ```sql
    GRANT EXECUTE ON project_db.* TO 'jsock414'@'%';
    ```

    <br>

    만약에 테이블과 관련된 **모든 작업을 할 수 있는 권한을** **부여**하겠다면 아래와 같은 코드를 사용하면 되겠다.

    ```sql
    GRANT ALL PRIVILEGES ON project_db.* TO 'jsock414'@'%';
    ```

    <br>

    또한 부여한 권한을 확인하는 방법은 SHOW를 사용한다.

    ```sql
    SHOW GRANTS FOR 'jsock414'@'%';
    ```

    <br>

3. **추가적으로 고려해봐야 하는 부분**

    DB를 담당한 운영자라면 DELETE를 REVOKE하는것에 대해서 고려를 많이 해야하는것 같다.

    어떻게보면 협업의 효율을 저해 할 수 있지만, 그만큼 또 안전하다는거니까 팀원들을 잘 설득해보자.

    ```sql
    REVOKE DELETE ON project_db.* FROM 'jsock414'@'%';
    ```

    <br>

    마지막으로 전해주고 싶은건 협업시에 필요한 마음가짐, 팀 컨벤션이다.

    실제 현업에서 사용하는 컨벤션을 가져오고싶어서 몇몇의 기업을 조사를 해보았다.

    <br>

    1. **GOOGLE**

        **최소 권한 원칙** : 팀원이 직접 DROP이나 ALTER 같은 명령어를 사용하지 않도록 제한

    2. **ORACLE**

        **공용 계정 관리 및 보안** : 하나의 공용 계정 사용, project_user를 만들어서 관리하되, 비밀번호 공유 시 보안 유의

    3. **SAP**

        **운영 환경에서는 DELETE 권한 제한** : 실수로 데이터 삭제하는 문제 방지

    4. **Neflix**

        **필요한 경우만 CREATE / EXECUTE 허용** : 테이블을 변경하는 작업이 꼭 필요할 때만 테이블 생성과, 프로시저 호출 기능 사용

    <br>

## **Try**

오늘 배운 Rownum을 바탕으로 프로그래머스의 문제를 하나 실습해보았다.

**문제 바로가기**

[오랜 기간 보호한 동물(1)](https://school.programmers.co.kr/learn/courses/30/lessons/59044)

해당 문제는 프로그래머스의 3레벨 문제로 Oracle로 풀이를 할 시, 랭크를 매기지 못하면 풀지 못하는 문제이다.

문제는 아래와 같다.

> 아직 입양을 못 간 동물 중, 가장 오래 보호소에 있었던 동물 3마리의 이름과 보호 시작일을 조회하는 SQL문을 작성해주세요. 이때 결과는 보호 시작일 순으로 조회해야 합니다.

**문제 풀이 방법**

1. **이름과 보호 시작일 조회** → SELECT NAME, DATETIME
2. **입양을 못 간 동물 찾기** → LEFT JOIN AIIMAL_OUTS + WHERE AO.ANIMAL_ID IS NULL
3. **보호 시작일 기준 정렬** → ORDER BY AI.DATETIME ASC
4. **상위 3개만 조회** → WHERE ROWNUM ≤ 3

로직 자체는 무난한 문제였지만 ORACLE의 ROWNUM에 익숙하지 않은 상태였다면 심히 당황했을 문제이다.

또한 새로운 조회 방식도 한번 찾아봤는데,

**FETCH**라는 TOP-N 문법이 있었다.

**ROWNUM과 기술적인 차이점으로는**

ROWNUM은 실행 순서상 먼저 필터링 후 정렬 가능하지만, FETCH는 ORDER BY 이후에 위치하며, 정렬 후 필터링 한다.

효율적인 방법으로는 ROWNUM이 효율적이나, **FETCH가 더욱 직관적이고 안전**하다고 할 수 있다.

그리고 FETCH는 ORACLE 12C 이상에서 지원한다는 특징이 있다.

fetch를 활용한 문제 풀이이

```sql
SELECT I.NAME, I.DATETIME
FROM ANIMAL_INS I LEFT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.ANIMAL_ID IS NULL
ORDER BY I.DATETIME ASC
FETCH FIRST 3 ROWS ONLY;
```

FETCH FIRST에는 ROWS ONLY 말고도 WITH TIES를 사용한다거나 OFFSET이라는 페이징 처리 기능이 있으니 실습때 더욱 활용해보도록 하자..!
