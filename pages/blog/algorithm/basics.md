알고리즘의 성능을 평가하는 가장 중요한 기준은 **시간복잡도**와 **공간복잡도**입니다. 이 글에서는 Big-O 표기법을 통해 알고리즘의 성능을 어떻게 분석하고 평가하는지 알아보겠습니다.

## 시간복잡도 (Time Complexity)

시간복잡도는 입력 크기에 따른 알고리즘의 실행 시간을 나타냅니다.

### Big-O 표기법의 주요 복잡도 클래스

1. **O(1)** - 상수 시간

```java
public class ArrayOps {
    public static int getFirst(int[] arr) {
        return arr[0];  // 배열 크기와 관계없이 항상 동일한 시간
    }
}
```

2. **O(log n)** - 로그 시간

```java
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = (left + right) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}
```

3. **O(n)** - 선형 시간

```java
public class ArrayUtils {
    public static int findMax(int[] arr) {
        int maxVal = arr[0];
        for (int num : arr) {
            maxVal = Math.max(maxVal, num);
        }
        return maxVal;
    }
}
```

## 공간복잡도 (Space Complexity)

공간복잡도는 알고리즘이 실행될 때 필요한 메모리의 양을 나타냅니다.

> 💡 **참고**: 실제 프로그래밍에서는 시간복잡도가 공간복잡도보다 더 중요하게 고려되는 경우가 많습니다.

### 예시: 재귀와 반복의 공간복잡도 비교

```java
public class Factorial {
    // 재귀 방식 (공간복잡도: O(n))
    public static int factorialRecursive(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorialRecursive(n - 1);
    }

    // 반복 방식 (공간복잡도: O(1))
    public static int factorialIterative(int n) {
        int result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}
```

## 성능 최적화 팁

1. 불필요한 중첩 루프 피하기
2. 적절한 자료구조 선택하기
3. 가능한 경우 이진 검색 활용하기

### 자주 사용되는 자료구조의 시간복잡도

| 자료구조    | 접근 | 검색 | 삽입 | 삭제 |
| ----------- | ---- | ---- | ---- | ---- |
| 배열        | O(1) | O(n) | O(n) | O(n) |
| 연결 리스트 | O(n) | O(n) | O(1) | O(1) |
| 해시 테이블 | O(1) | O(1) | O(1) | O(1) |

## 마무리

알고리즘의 성능을 제대로 이해하고 평가하는 것은 효율적인 프로그램을 작성하는 데 매우 중요합니다. 시간복잡도와 공간복잡도를 고려하여 상황에 맞는 최적의 알고리즘을 선택하세요.
