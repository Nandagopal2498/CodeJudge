import { RawProblemDef } from '../utils/batchRunner.js';

export const batch4Raw: RawProblemDef[] = [
  // Problem 21: Count Elements Greater Than Average
  {
    title: 'Count Elements Greater Than Average',
    slug: 'count-elements-greater-than-average',
    difficulty: 'Easy',
    tags: ['Arrays', 'Math'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of `n` integers, calculate the arithmetic mean (average) of all elements, and count how many elements in the array are strictly greater than this average.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print a single integer representing the count of elements strictly greater than the average.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= a[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // TODO: Count elements strictly greater than the arithmetic mean

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    __int128 totalSum = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        totalSum += a[i];
    }
    // a[i] > totalSum / n  <=>  a[i] * n > totalSum
    int count = 0;
    for (int i = 0; i < n; i++) {
        if ((__int128)a[i] * n > totalSum) {
            count++;
        }
    }
    cout << count << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '5\n1 2 3 4 5', explanation: 'Average is 3. Elements strictly greater than 3 are 4 and 5 (count = 2).' },
      { input: '4\n2 2 2 2', explanation: 'Average is 2. No element is strictly greater than 2 (count = 0).' },
      { input: '1\n100', explanation: 'Average is 100. Count = 0.' }
    ],
    hidden_inputs: [
      '2\n10 20',
      '3\n-10 0 10',
      '4\n-5 -5 -5 10',
      '5\n100 200 300 400 500',
      '6\n1 1 1 1 1 100',
      '5\n-100 -200 -300 -400 -500',
      '4\n1000000000 1000000000 -1000000000 -1000000000',
      '7\n1 2 3 4 5 6 7',
      '8\n0 0 0 0 0 0 0 1',
      `100000\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  },

  // Problem 22: First Unique Character
  {
    title: 'First Unique Character',
    slug: 'first-unique-character',
    difficulty: 'Easy',
    tags: ['Hashmap', 'Strings'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a string `s` consisting of lowercase English letters, find the first non-repeating character in it and print its 0-based index. If no unique character exists, print `-1`.',
    input_format: 'A single line containing the string `s`.',
    output_format: 'Print the 0-based index of the first unique character, or -1 if none exists.',
    constraints: '• 1 <= |s| <= 10^5\n• s consists of only lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    // TODO: Find 0-based index of first non-repeating character, or -1

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    vector<int> freq(26, 0);
    for (char c : s) freq[c - 'a']++;

    int ans = -1;
    for (int i = 0; i < (int)s.length(); i++) {
        if (freq[s[i] - 'a'] == 1) {
            ans = i;
            break;
        }
    }
    cout << ans << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: 'leetcode', explanation: '\'l\' at index 0 does not repeat.' },
      { input: 'loveleetcode', explanation: '\'v\' at index 2 is the first unique character.' },
      { input: 'aabb', explanation: 'Every character repeats, so output is -1.' }
    ],
    hidden_inputs: [
      'a',
      'aa',
      'ab',
      'aba',
      'abacabadaba',
      'abcdefghijklmnopqrstuvwxyz',
      'aabbccddeeffg',
      'z',
      'xyzxyz',
      `${'a'.repeat(50000)}z${'a'.repeat(49999)}`
    ]
  },

  // Problem 23: Sum of Digits
  {
    title: 'Sum of Digits',
    slug: 'sum-of-digits',
    difficulty: 'Easy',
    tags: ['Math', 'Recursion'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a non-negative integer `n`, compute the sum of its decimal digits.\n\nFor example, if `n = 12345`, the sum of digits is `1 + 2 + 3 + 4 + 5 = 15`.',
    input_format: 'A single non-negative integer `n` (given as a string or number).',
    output_format: 'Print the sum of the digits.',
    constraints: '• 0 <= n <= 10^100000 (n can have up to 10^5 digits)',
    starter_code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string n;
    if (!(cin >> n)) return 0;

    // TODO: Calculate the sum of digits of n

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string n;
    if (!(cin >> n)) return 0;

    long long sum = 0;
    for (char c : n) {
        if (c >= '0' && c <= '9') {
            sum += (c - '0');
        }
    }
    cout << sum << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '12345', explanation: '1 + 2 + 3 + 4 + 5 = 15.' },
      { input: '0', explanation: 'Sum of digits of 0 is 0.' },
      { input: '999', explanation: '9 + 9 + 9 = 27.' }
    ],
    hidden_inputs: [
      '1',
      '7',
      '10',
      '100000',
      '1234567890',
      '987654321',
      '5555555555',
      '1000000000000000000',
      '999999999999999999',
      '9'.repeat(100000)
    ]
  },

  // Problem 24: Power of Two
  {
    title: 'Power of Two',
    slug: 'power-of-two',
    difficulty: 'Easy',
    tags: ['Math'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer `n`, determine whether it is a power of two. An integer `n` is a power of two if there exists an integer `x` such that `n == 2^x`.\n\nPrint `YES` if `n` is a power of two, otherwise print `NO`.',
    input_format: 'A single integer `n`.',
    output_format: 'Print `YES` if n is a power of two, otherwise print `NO`.',
    constraints: '• -2^62 <= n <= 2^62',
    starter_code: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long n;
    if (!(cin >> n)) return 0;

    // TODO: Determine if n is a power of two and print YES or NO

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

    if (n > 0 && (n & (n - 1)) == 0) {
        cout << "YES\\n";
    } else {
        cout << "NO\\n";
    }
    return 0;
}
`,
    sample_inputs: [
      { input: '1', explanation: '2^0 = 1, which is a power of two.' },
      { input: '16', explanation: '2^4 = 16, which is a power of two.' },
      { input: '3', explanation: '3 is not a power of two.' }
    ],
    hidden_inputs: [
      '0',
      '-16',
      '-1',
      '2',
      '4',
      '5',
      '1024',
      '2147483648',
      '1000000',
      '4611686018427387904' // 2^62
    ]
  },

  // Problem 25: Min and Max in Array
  {
    title: 'Min and Max in Array',
    slug: 'min-and-max-in-array',
    difficulty: 'Easy',
    tags: ['Arrays'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of `n` integers, find and print the minimum and maximum elements in the array.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print two space-separated integers: the minimum value followed by the maximum value.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= a[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // TODO: Find and print the minimum and maximum elements in a

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    long long minVal = 2e18, maxVal = -2e18;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x < minVal) minVal = x;
        if (x > maxVal) maxVal = x;
    }
    cout << minVal << " " << maxVal << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '6\n3 2 1 56 10000 167', explanation: 'Minimum is 1, maximum is 10000.' },
      { input: '5\n1 345 234 21 56789', explanation: 'Minimum is 1, maximum is 56789.' },
      { input: '1\n42', explanation: 'Single element array: min and max are both 42.' }
    ],
    hidden_inputs: [
      '2\n-10 10',
      '3\n0 0 0',
      '4\n-100 -200 -50 -10',
      '5\n5 4 3 2 1',
      '6\n1 2 3 4 5 6',
      '5\n1000000000 -1000000000 0 500000000 -500000000',
      '7\n-999999999 999999999 42 -42 0 100 -100',
      '8\n10 10 10 10 10 10 10 10',
      '4\n-500 500 -500 500',
      `100000\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  }
];
