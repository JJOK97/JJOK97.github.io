---
title: '[Java] Abstract과 Interface의 차이'
excerpt: '상속자들의 오묘한 차이에 대하여'

categories:
    - 개발 기록
tags:
    - [Java, Interface, Abstract]

# permalink: /Dev/template/
permalink: /TIL/interface-abstract/

toc: true
toc_sticky: true

date: 2025-03-15
last_modified_at: 2025-03-15
---

## 추상 클래스: 기본 구현을 제공하는 설계 틀

추상 클래스는 인스턴스화할 수 없지만, 공통된 필드나 메서드를 미리 구현해 두어 여러 하위 클래스들이 이를 상속받아 사용할 수 있도록 합니다.

이 방법은 중복 코드를 줄이고, 공통된 동작을 한 곳에서 관리할 수 있는 장점을 제공합니다.

### 동물 클래스 예시

동물이라는 개념을 예로 들어보면, 모든 동물이 공통으로 가지는 특성(예: 이름, 소리내기)을 추상 클래스로 정의할 수 있습니다.

다음 코드는 동물 클래스의 추상적 설계를 보여줍니다.

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // 각 동물이 구현해야 하는 소리내기 메서드
    public abstract void makeSound();

    // 모든 동물이 공통적으로 사용할 수 있는 기능: 이름 출력
    public void printName() {
        System.out.println("동물의 이름: " + name);
    }
}
```

이 추상 클래스를 상속받아 구체적인 동물 클래스(예: 개, 고양이 등)를 작성하면, 각 동물은 자신만의 소리내기 방식을 구현하면서도 공통 기능은 그대로 사용할 수 있습니다.

### 차량 클래스 예시

또 다른 예로, 다양한 종류의 차량을 다루는 시스템을 생각해 볼 수 있습니다.

차량의 공통 기능(예: 시동 걸기, 정지하기)을 추상 클래스로 구현하면, 각 차량 타입은 고유의 시동 방식만 구현하면 되므로 코드의 중복을 방지할 수 있습니다.

```java
public abstract class Vehicle {
    protected String model;

    public Vehicle(String model) {
        this.model = model;
    }

    // 각 차량이 구현해야 하는 시동 걸기 기능
    public abstract void startEngine();

    // 모든 차량에서 공통적으로 사용할 수 있는 정지 기능
    public void stop() {
        System.out.println(model + " 정지합니다.");
    }
}
```

이처럼 추상 클래스를 활용하면, 공통된 기능은 한 곳에서 관리하고, 각 하위 클래스는 개별 특성만을 집중적으로 구현할 수 있습니다.

### 사용자 인터페이스(UI) 컴포넌트 예시

UI 프레임워크에서도 추상 클래스는 유용하게 사용됩니다

예를 들어, 기본적인 UI 컴포넌트의 공통 속성과 동작(위치 정보, 렌더링 기능 등)을 추상 클래스로 정의하면, 버튼, 텍스트 필드 등 다양한 컴포넌트가 이를 상속받아 개별적인 기능을 추가할 수 있습니다.

```java
public abstract class UIComponent {
    protected int x, y; // 컴포넌트의 위치 정보

    public UIComponent(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // 각 컴포넌트가 직접 구현해야 하는 화면 렌더링 메서드
    public abstract void render();

    // 공통적인 이동 기능
    public void move(int deltaX, int deltaY) {
        x += deltaX;
        y += deltaY;
    }
}
```

이런 설계를 통해 UI 개발 시 공통된 기능은 추상 클래스에서 관리하고, 각 컴포넌트는 고유한 렌더링 방식만 구현하면 되어 효율적인 개발이 가능합니다.

---

## 인터페이스: 규칙을 강제하는 약속

인터페이스는 클래스들이 반드시 지켜야 할 메서드의 시그니처만을 선언해 두어, 각 클래스가 동일한 방식으로 동작하도록 강제합니다.

즉, 인터페이스를 구현하는 클래스들은 정해진 메서드를 반드시 포함해야 하므로, 서로 다른 클래스 간에도 일관된 상호작용을 보장할 수 있습니다.

### 결제 시스템 예시

인터페이스는 클래스들 사이의 일관된 규칙을 강제하여, 다양한 구현체들이 동일한 방식으로 동작할 수 있도록 돕습니다.

예를 들어, 다양한 결제 수단을 지원하는 애플리케이션을 설계할 때, 모든 결제 방식에 대해 공통 규칙을 정의할 수 있습니다.

```java
public interface Payment {
    // 결제 금액을 처리하는 메서드
    void processPayment(double amount);

    // 결제 성공 여부를 반환하는 메서드
    boolean isSuccessful();
}
```

이 인터페이스를 기반으로 신용카드, 계좌이체, 모바일 결제 등 각 결제 방식에 대한 구체적인 구현 클래스를 작성할 수 있습니다.

이처럼 인터페이스를 사용하면 여러 결제 방식 간에 동일한 약속을 유지할 수 있어, 시스템 확장이나 유지보수가 용이해집니다.

### 로그 기록 예시

또 다른 예로, 다양한 로그 기록 방식을 사용하는 시스템을 생각해볼 수 있습니다.

로그 메시지를 기록하는 기본 규칙을 인터페이스로 정의하면, 콘솔, 파일, 혹은 원격 서버에 로그를 남기는 방식에 상관없이 일관된 인터페이스를 제공할 수 있습니다.

```java
public interface Logger {
    // 로그 메시지를 기록하는 메서드
    void log(String message);
}
```

이와 같이 인터페이스를 활용하면, 새로운 로그 방식을 추가할 때 기존 코드에 큰 영향을 주지 않고도 확장이 가능합니다.

---

## 마무리…

인터페이스와 추상 클래스는 각각의 목적에 따라 서로 다른 장점을 제공합니다.

실제 개발 현장에서는 이 두 가지 개념을 상황에 맞게 적절히 활용하는 것이 중요합니다.

각각의 특성을 잘 이해하고 적용한다면, 코드의 유지보수성, 확장성, 그리고 가독성을 모두 향상시킬 수 있을 것입니다.

이 글이 인터페이스와 추상 클래스의 개념을 실제 예시를 통해 이해하는 데 도움이 되기를 바랍니다.
