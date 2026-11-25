import { RawProblemDef } from '../utils/batchRunner.js';

export const batch3Raw: RawProblemDef[] = [
  // Problem 16: Two Sum II - Input Array Is Sorted
  {
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-ii-sorted',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Arrays'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.\n\nPrint the two 1-based indices `index1` and `index2` (1 <= index1 < index2 <= n) separated by a space. It is guaranteed that exactly one solution exists.',
    input_format: 'The first line contains two integers `n` and `target`.\nThe second line contains `n` space-separated sorted integers.',
    output_format: 'Print two space-separated 1-based indices `index1 index2`.',
    constraints: '• 2 <= n <= 10^5\n• -10^9 <= numbers[i] <= 10^9\n• numbers is sorted in non-decreasing order.\n• Exactly one valid solution exists.',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;
    vector<long long> numbers(n);
    for (int i = 0; i < n; i++) cin >> numbers[i];

    // TODO: Find 1-based indices index1 and index2 such that numbers[index1-1] + numbers[index2-1] == target

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;
    vector<long long> numbers(n);
    for (int i = 0; i < n; i++) cin >> numbers[i];

    int left = 0, right = n - 1;
    while (left < right) {
        long long sum = numbers[left] + numbers[right];
        if (sum == target) {
            cout << (left + 1) << " " << (right + 1) << "\\n";
            return 0;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return 0;
}
`,
    sample_inputs: [
      { input: '4 9\n2 7 11 15', explanation: 'The sum of 2 and 7 is 9. Indices are 1 and 2.' },
      { input: '3 6\n2 3 4', explanation: 'The sum of 2 and 4 is 6. Indices are 1 and 3.' },
      { input: '2 -1\n-1 0', explanation: 'The sum of -1 and 0 is -1. Indices are 1 and 2.' }
    ],
    hidden_inputs: [
      '2 0\n0 0',
      '2 10\n5 5',
      '5 100\n-50 -20 0 50 150',
      '6 0\n-10 -5 -2 2 5 10',
      '5 8\n1 2 4 4 7',
      '4 -10\n-8 -5 -5 -2',
      '6 1000000000\n100 200 500000000 500000000 600000000 700000000',
      '5 14\n1 3 5 9 11',
      '3 2000000000\n1000000000 1000000000 1000000001',
      `100000 100001\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  },

  // Problem 17: Greatest Common Divisor
  {
    title: 'Greatest Common Divisor',
    slug: 'greatest-common-divisor',
    difficulty: 'Easy',
    tags: ['Math', 'Recursion'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given two non-negative integers `a` and `b` (not both zero), compute their Greatest Common Divisor (GCD) using the Euclidean algorithm.',
    input_format: 'A single line containing two space-separated integers `a` and `b`.',
    output_format: 'Print the greatest common divisor of `a` and `b`.',
    constraints: '• 0 <= a, b <= 10^18\n• a and b are not both zero.',
    starter_code: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long a, b;
    if (!(cin >> a >> b)) return 0;

    // TODO: Calculate and print gcd(a, b)

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <numeric>

using namespace std;

long long gcd(long long a, long long b) {
    while (b) {
        a %= b;
        swap(a, b);
    }
    return a;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long a, b;
    if (!(cin >> a >> b)) return 0;
    cout << gcd(a, b) << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '12 18', explanation: 'Divisors of 12: 1,2,3,4,6,12. Divisors of 18: 1,2,3,6,9,18. Common largest is 6.' },
      { input: '101 103', explanation: 'Both are prime, GCD is 1.' },
      { input: '0 45', explanation: 'GCD of 0 and 45 is 45.' }
    ],
    hidden_inputs: [
      '1 1',
      '7 0',
      '24 60',
      '81 27',
      '1000000007 1000000007',
      '1000000000000000000 500000000000000000',
      '123456789 987654321',
      '1000000000000000000 1',
      '4611686018427387904 2305843009213693952',
      '999999999999999989 999999999999999997'
    ]
  },

  // Problem 18: Remove Element
  {
    title: 'Remove Element',
    slug: 'remove-element',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Arrays'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array `nums` of `n` integers and an integer `val`, remove all occurrences of `val` in-place.\n\nPrint the number of remaining elements `k` on the first line, and on the second line print the remaining elements in their relative original order.',
    input_format: 'The first line contains two integers `n` and `val`.\nThe second line contains `n` space-separated integers.',
    output_format: 'The first line should contain an integer `k` (the count of remaining elements).\nThe second line should contain the `k` space-separated integers. If k = 0, print an empty line.',
    constraints: '• 0 <= n <= 10^5\n• -10^9 <= nums[i], val <= 10^9',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long val;
    if (!(cin >> n >> val)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Filter out val and print count and remaining elements

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long val;
    if (!(cin >> n >> val)) return 0;
    vector<long long> res;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x != val) {
            res.push_back(x);
        }
    }
    cout << res.size() << "\\n";
    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i] << (i + 1 == res.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '4 3\n3 2 2 3', explanation: 'Remaining elements after removing 3 are 2, 2 (length 2).' },
      { input: '8 2\n0 1 2 2 3 0 4 2', explanation: 'Elements after removing 2 are 0 1 3 0 4 (length 5).' },
      { input: '1 5\n5', explanation: 'All elements removed, count is 0.' }
    ],
    hidden_inputs: [
      '0 10\n',
      '1 10\n5',
      '3 2\n2 2 2',
      '5 9\n1 2 3 4 5',
      '6 0\n0 -1 0 2 0 -3',
      '5 -5\n-5 -5 -5 5 5',
      '7 100\n100 200 100 300 100 400 100',
      '4 42\n42 1 42 2',
      '6 1000000000\n1000000000 -1000000000 1000000000 0 1000000000 1',
      `100000 1\n${Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 1 : 2)).join(' ')}`
    ]
  },

  // Problem 19: Contains Duplicate
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    tags: ['Hashmap', 'Arrays'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer array `nums`, determine if any value appears at least twice in the array.\n\nPrint `YES` if any value appears at least twice, and print `NO` if every element is distinct.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print `YES` if there is a duplicate, otherwise print `NO`.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <unordered_set>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Determine if nums contains duplicate elements

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    sort(nums.begin(), nums.end());
    bool hasDup = false;
    for (int i = 1; i < n; i++) {
        if (nums[i] == nums[i - 1]) {
            hasDup = true;
            break;
        }
    }
    cout << (hasDup ? "YES" : "NO") << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '4\n1 2 3 1', explanation: '1 appears twice.' },
      { input: '4\n1 2 3 4', explanation: 'All elements are distinct.' },
      { input: '1\n100', explanation: 'A single element has no duplicates.' }
    ],
    hidden_inputs: [
      '2\n1 1',
      '2\n1 2',
      '5\n-1 -2 -3 -4 -1',
      '6\n0 0 0 0 0 0',
      '5\n10 20 30 40 50',
      '7\n1 10 100 1000 10000 100000 10',
      '4\n-1000000000 1000000000 -1000000000 0',
      '6\n9 8 7 6 5 4',
      '8\n5 3 4 2 8 7 1 3',
      `100000\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  },

  // Problem 20: Missing Number
  {
    title: 'Missing Number',
    slug: 'missing-number',
    difficulty: 'Easy',
    tags: ['Arrays', 'Math'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the missing number.',
    constraints: '• 1 <= n <= 10^5\n• All numbers are distinct and in the range [0, n].',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    // TODO: Find the missing number in [0, n]

    return 0;
}
`,
    reference_solution: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long n;
    if (!(cin >> n)) return 0;

    long long expectedSum = n * (n + 1) / 2;
    long long actualSum = 0;
    for (int i = 0; i < n; i++) {
        long long val;
        cin >> val;
        actualSum += val;
    }
    cout << (expectedSum - actualSum) << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '3\n3 0 1', explanation: 'n = 3, range [0,3]. 2 is missing.' },
      { input: '2\n0 1', explanation: 'n = 2, range [0,2]. 2 is missing.' },
      { input: '1\n0', explanation: 'n = 1, range [0,1]. 1 is missing.' }
    ],
    hidden_inputs: [
      '1\n1',
      '2\n2 0',
      '4\n0 1 2 3',
      '4\n4 2 1 0',
      '5\n5 3 2 1 4',
      '9\n9 6 4 2 3 5 7 0 1',
      '6\n6 4 2 0 1 3',
      '8\n0 1 2 3 4 5 6 7',
      '5\n1 2 3 4 5',
      `100000\n${Array.from({ length: 100000 }, (_, i) => (i === 42424 ? 100000 : i)).join(' ')}`
    ]
  }
];
