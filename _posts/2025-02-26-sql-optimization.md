---
title: '[SQL] 코드 최적화에 대한 고찰'
excerpt: '오늘의 DB 실수에서 배운 점... DB에서 좋은 코드란 무엇일까?'

categories:
    - TIL
tags:
    - [SQL, Oracle]

# permalink: /Dev/template/
permalink: /til/sql-optimization/

toc: true
toc_sticky: true

date: 2025-02-26
last_modified_at: 2025-02-26
---

## **Keep**

**기초적인 부분이라도 흘려듣지않고 부족했던 부분들을 채워나갔던것!**  
DB공부를 한동안 안했더니 Oracle과 SQL문법들을 많이 까먹엇었는데, 스마트 인재 개발원의 승환쌤의 실습 강의를 통해서 다중 서브쿼리나 DB의 제약조건들에 대해서 다시 한번 이해하게 되었다.

## **Problem**

**한번 더 고민하지 않았던 것..**

강의 중에 실수로 난이도가 조금 어려웠던 문제를 제출해주셨는데, 문제 해석을 제대로 하지않아 엣지 케이스를 발생시키는 풀이를 하였다.

**문제**

> **직원들중 제일 많이 받는 직원이 속한 부서의 급여와 같은 급여를 받는 직원의 이름과 급여를 출력하라!**

나는 이 문제를 단순하게 제일 많이 받는 직원의 같은 부서사람들이라고 판단을 하였고,

```sql
select department_id, first_name, salary
from employees
where department_id in (select department_id
                        from employees
                        where salary = (select max(salary)
                                        from employees));
```

이런식으로 풀이를 하였다.

그러나, **<span style="color: #FFAA33;">실제로 문제를 분석해보면</span>**

1. 직원들중 제일 많이 받는 직원 ( 조건 )
2. 속한 부서의 급여 ( 출력 )
3. 같은 급여를 받는 직원(들) ( 조건 )

으로 해석할수있다.

이 풀이를 코드로 변환해보면

```sql
select first_name, salary
from employees
where salary in (select salary
                 from employees
                 where department_id in (select department_id
                                        from employees
                                        where salary = (select max(salary)
                                                        from employees)));
```

3중 서브쿼리가 됨을 알수있다.

**<span style="color: #FFAA33;">풀이 코드와 나의 코드의 차이는,</span>**

만약 max값과 동일한 사람이 여러명이라고 했을때 나의 코드는 해석이 틀렷기 때문에 가장 높은 급여를 가진 사람의 부서와 부서 내 사람들을 출력 한 반면

풀이코드는 max과 같은 SALARY라면 모든 부서의 직원을 다 출력할수있다는 차이점이 있다.

그러므로 문제를 제대로 이해하지 않은 채 코드를 작성한것이 제대로 문제를 보지 못한 첫번째 원인이였고, 주어진 데이터셋이 표본이 적다보니 너무 단순하게 생각했던점이 두번째 원인이였다.

앞으로 비슷한 유형의 문제들을 많이 풀어보면서 요구사항을 놓치지 않는 능력을 많이 키워야 할 것 같다.

<br>

## **Try**

**Problem으로 부터 얻은 관점**

그래서 나는 **<span style="color: #FFAA33;">더 놓친게 없는가?</span>** 라는 생각을 해보았다.

<br>

**놓친 부분**

1. Null DATA : 실제 DB였다면 NOT NULL 제약조건이 있음이 분명하지만, 교육용 데이터 셋는 그렇지 않다. salary나 department_id가 null일 경우를 고려해봐야 한다.
2. 최고급여를 받는 직원이 여러 부서에 있을 경우? : employees에는 없었지만 충분히 가능성 있는 조건이다 DISTINCT를 활용해서 중복된 직원을 제거해주어야 한다.

<br>

**해당 내용을 적용하여 개선된 코드**

```sql
SELECT first_name, salary
FROM employees
WHERE salary IN (
            SELECT salary
            FROM employees
            WHERE department_id IN (
                        SELECT DISTINCT department_id
                        FROM employees
                        WHERE salary = (
                                    SELECT MAX(salary)
                                    FROM employees
                                    WHERE salary IS NOT NULL
                                )
                        AND department_id IS NOT NULL
            )
);

```

<br>

맞다.. 엣지케이스를 억지로 만들다보니 억지스러운 감이 없지않아 있다.

하지만 **<span style="color: #FFAA33;">실제 DB의 다양한 조건들을 고려</span>**한다면 이런 답을 내려고 고민한 시간은 꽤나 유익한 투자였다.

<br>

조건들은 크게 2가지로 볼수있는데

우선은 데이터 **정합성과 무결성**의 위배이다.

**정합성**이란, 데이터가 올바르게 유지되며, 원하는 결과를 정확하게 반영하는지를 의미하고, 비슷한 개념으로 데이터의 **무결성**이란, 데이터가 데이터베이스의 제약 조건을 만족하면서 정확하게 저장되고 유지되는 것을 의미한다.

문제에서는 null값이 이미 입력이 되어 있었기 때문에 무결성을 위배했다고 볼 수 있고, 그러므로 Null처리를 하지 않는다면 정합성을 위배했다고 볼 수 있기 때문에, Max(salary) 연산이나 department_id 필터링을 통해 제대로 된 연산을 해주어야 한다.

따라서 조회 시 마다 이런 작업을 하고싶지 않다면, **<span style="color: #FFAA33;">DB를 설계할때 얼마나 자주 조회와 연산을 하는지 등에 따라서 제약조건을 신중히 고려해서 구축</span>**해야한다.

<br>

다음은 **성능 향상**이다.

우리는 개발자로서 항상 마음속에 지니고있어야 하는 생각이 바로 효율과 성능이라고 생각한다. 물론 지금과 같은 데이터와 SQL문으로는 백만분의 1초도 감축을 못하겠지만 그것이나마 줄이려는 의도가 중요하다고 생각한다.

<br>

아무튼.. 성능향상이라고 생각한 이유는

서브쿼리가 3중이여서인데, 쿼리는 결국 전체 결과를 내려면 해당 테이블을 전체를 4번이나 조회를 해야한다. 그러나 한 과정마다 **<span style="color: #FFAA33;">DISTINCT나 IS NOT NULL을 적용해서 데이터셋을 줄여나간다면</span>** 충분히 유의미한 성능향상을 이끌어 낼 수 있으리라 생각했다.

<br>

또한 추가적으로 몰랏던 부분인데,
지금처럼 department_id의 return이 단일인지 다중일지 확실하게 모르는 상황이라고 치면, IN 연산자를 쓰는게 물론 에러를 예방하는데도 중요하지만, 성능 향상에도 좋다고 한다.

<br>

G 선생의 답변으로는

**1. 연산자 사용 시**

**<span style="color: #FFAA33;">하나의 값을 찾은 후 해당 값을 기반으로 비교하는 방식</span>**이므로, 여러 부서가 있다면 **각각 반복적으로 실행** 될 수 있음 → **Nested Loop이 발생**

**2. IN 연산자 사용 시**

RDBMS는 IN 연산자를 사용할 때 인덱스 최적화 및 해시 조인 기법을 활용할수 있다고 한다.
또한 다중 값을 batch로 처리하기 때문에 =을 여러 번 실행하는 것보다 효율적이라고 알려주셧다.

무슨말인지 정말 모르겠지만.. 일단 좋다고하니 알아둬야할거같다.

주요 단어들만 한번 정리하고 회고를 마쳐보자..!

**<font color="#4CAF50">Nested Loop ( 중첩 루프 )</font>**

중첩 루프 조인은 두 개의 테이블을 조인 할 때, 한 테이블을 iteration하면서 다른 테이블과 비교하는 방식이다.
그래서 위와 같은 상황속의 `=` 연산자는 2중 for문을 돌리기 때문에 데이터 양에따라서 성능이 저하된다고 보인다.

**<font color="#4CAF50">해시조인</font>**

**해시 조인**은 데이터베이스에서 두 개의 테이블을 조인할 때 사용하는 알고리즘 중 하나이다.

기본 원리로는 서브쿼리의 결과를 컴퓨터 메모리의 해시 테이블로 변환을 하는것인데, 이때 작은 테이블의 데이터를 키로 해서 Key-Value 형태를 가진 해시 주소를 만들어 준다.

그 후 메인이 되는 테이블에서 데이터를 하나씩 읽으면서, 해시 테이블에서 매칭되는 값을 찾아오는것이다.

_~~해시(Key-Value)에 대해서는 알고리즘을 공부하다가보면 자연스럽게 알게될것이다..!~~_

**<font color="#4CAF50">Batch 처리</font>**

**Batch**란 한번에 여러 개의 데이터를 처리하는 방식이다.

즉, 쿼리를 여러 번 실행하는 대신 한 번에 여러 개의 데이터를 처리하여 성능을 향상시킨다.

근데 batch라는 놈이 어떻게 한번에 여러개의 작업을 처리 할 수 있는 방식에 대해서는 이해를 할 수가 없었다. **데이터 베이스 내부에서 특정 SQL문을 실행할때 자동으로 처리된다거나, JDBC, JPA등의 어플리케이션에서 API를 동해서 자동으로 처리**가 된다고 한다…
