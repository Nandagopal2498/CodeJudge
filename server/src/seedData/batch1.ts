import { RawProblemDef } from '../utils/batchRunner.js';

export const batch1Raw: RawProblemDef[] = [
  // Problem 6: Palindrome Check
  {
    title: 'Palindrome Check',
    slug: 'palindrome-check',
    difficulty: 'Easy',
    tags: ['Strings', 'Two Pointers'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a string `s`, determine whether it is a palindrome. A string is a palindrome if it reads the same forward and backward.\n\nPrint `YES` if `s` is a palindrome, or `NO` otherwise.',
    input_format: 'A single non-empty line containing the string `s` consisting of lowercase English letters.',
    output_format: 'Print `YES` if the string is a palindrome, otherwise print `NO`.',
    constraints: '• 1 <= |s| <= 10^5\n• s contains only lowercase English letters (\'a\'-\'z\').',
    starter_code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    // TODO: Determine if s is a palindrome and print YES or NO

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    int left = 0, right = (int)s.length() - 1;
    bool isPal = true;
    while (left < right) {
        if (s[left] != s[right]) {
            isPal = false;
            break;
        }
        left++;
        right--;
    }
    cout << (isPal ? "YES" : "NO") << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: 'racecar', explanation: '"racecar" reads identically forwards and backwards.' },
      { input: 'algorithm', explanation: '"algorithm" reversed is "mihtrogla", which does not match.' },
      { input: 'noon', explanation: '"noon" is an even-length palindrome.' }
    ],
    hidden_inputs: [
      'a',
      'ab',
      'aa',
      'aba',
      'abab',
      'abcddcba',
      'abacaba',
      'abcdefghihgfedcba',
      'abcdefgh',
      `${'a'.repeat(50000)}${'b'.repeat(50000)}`,
      `${'a'.repeat(50000)}${'b'.repeat(1)}${'a'.repeat(50000)}`
    ]
  },

  // Problem 7: Maximum Subarray Sum
  {
    title: 'Maximum Subarray Sum',
    slug: 'maximum-subarray-sum',
    difficulty: 'Easy',
    tags: ['Arrays', 'Dynamic Programming'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of `n` integers, find the contiguous non-empty subarray with the maximum possible sum, and print that maximum sum.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers representing the array.',
    output_format: 'Print a single integer representing the maximum subarray sum.',
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

    // TODO: Calculate the maximum subarray sum

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
    long long curr = 0, maxSum = -2e18;
    for (int i = 0; i < n; i++) {
        long long val;
        cin >> val;
        if (i == 0) {
            curr = val;
            maxSum = val;
        } else {
            curr = max(val, curr + val);
            maxSum = max(maxSum, curr);
        }
    }
    cout << maxSum << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '8\n-2 -3 4 -1 -2 1 5 -3', explanation: 'Subarray [4, -1, -2, 1, 5] yields the maximum sum of 7.' },
      { input: '4\n-1 -2 -3 -4', explanation: 'When all elements are negative, the single element [-1] gives the maximum sum -1.' },
      { input: '5\n1 2 3 4 5', explanation: 'All positive numbers sum up to 15.' }
    ],
    hidden_inputs: [
      '1\n42',
      '1\n-999999999',
      '2\n-100 100',
      '5\n0 0 0 0 0',
      '6\n10 -20 30 -10 40 -5',
      '6\n-5 -2 -8 -1 -9 -3',
      '5\n1000000000 1000000000 1000000000 1000000000 1000000000',
      '8\n2 -1 2 -1 2 -1 2 -1',
      '7\n-2 1 -3 4 -1 2 1',
      `100000\n${Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 10 : -5)).join(' ')}`
    ]
  },

  // Problem 8: Valid Parentheses Sequence
  {
    title: 'Valid Parentheses Sequence',
    slug: 'valid-parentheses-sequence',
    difficulty: 'Easy',
    tags: ['Stack', 'Strings'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a string `s` containing only the characters `(`, `)`, `{`, `}`, `[`, and `]`, determine if the string represents a valid balanced parentheses sequence.\n\nA string is valid if every open bracket is closed by the same type of bracket in the correct order, and every close bracket has a matching open bracket.',
    input_format: 'A single line containing the bracket string `s`.',
    output_format: 'Print `VALID` if the sequence is balanced, otherwise print `INVALID`.',
    constraints: '• 1 <= |s| <= 10^5\n• s contains only characters \'(\', \')\', \'{\', \'}\', \'[\', \']\'.',
    starter_code: `#include <iostream>
#include <string>
#include <stack>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    // TODO: Determine if s is a valid parentheses sequence

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>
#include <stack>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    stack<char> st;
    bool ok = true;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) {
                ok = false;
                break;
            }
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                ok = false;
                break;
            }
        }
    }
    if (!st.empty()) ok = false;
    cout << (ok ? "VALID" : "INVALID") << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '()[]{}', explanation: 'All opening brackets are closed in proper order.' },
      { input: '([)]', explanation: 'The brackets are interleaved incorrectly.' },
      { input: '{[()]}', explanation: 'Properly nested brackets of all types.' }
    ],
    hidden_inputs: [
      '(',
      ')',
      '()',
      '([])',
      '(((',
      '([]){}',
      '{[(])}',
      '{{[[(())]]}}',
      '()()()()()()()()()',
      `(${'[]'.repeat(49998)})`
    ]
  },

  // Problem 9: Single Number
  {
    title: 'Single Number',
    slug: 'single-number',
    difficulty: 'Easy',
    tags: ['Arrays', 'Math'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a non-empty array of `n` integers where every element appears exactly twice except for one element which appears exactly once, find and print that single element.',
    input_format: 'The first line contains an odd integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the unique integer that appears once.',
    constraints: '• 1 <= n <= 10^5\n• n is odd.\n• -10^9 <= a[i] <= 10^9\n• Exactly one element appears once; all other elements appear twice.',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    // TODO: Find the element that appears once

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
    if (!(cin >> n)) return 0;

    long long ans = 0;
    for (int i = 0; i < n; i++) {
        long long val;
        cin >> val;
        ans ^= val;
    }
    cout << ans << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '3\n2 2 1', explanation: '2 appears twice, 1 appears once.' },
      { input: '5\n4 1 2 1 2', explanation: '1 and 2 appear twice, 4 appears once.' },
      { input: '1\n99', explanation: 'The single element is 99.' }
    ],
    hidden_inputs: [
      '1\n0',
      '3\n-5 10 -5',
      '5\n-1000000000 0 -1000000000 0 777',
      '7\n1 2 3 4 3 2 1',
      '5\n999 888 999 777 888',
      '9\n10 20 30 40 50 40 30 20 10',
      '3\n-2147483648 -2147483648 42',
      '5\n100 200 300 100 200',
      '7\n5 5 6 6 7 7 8',
      `99999\n${Array.from({ length: 49999 }, (_, i) => `${i + 1} ${i + 1}`).join(' ')} 999999999`
    ]
  },

  // Problem 10: Reverse an Array
  {
    title: 'Reverse an Array',
    slug: 'reverse-an-array',
    difficulty: 'Easy',
    tags: ['Arrays', 'Two Pointers'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of `n` integers, print the elements of the array in reverse order (from the last element to the first element).',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the `n` integers reversed on a single line, separated by spaces.',
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

    // TODO: Output array elements in reverse order

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
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    for (int i = n - 1; i >= 0; i--) {
        cout << a[i] << (i == 0 ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '4\n1 2 3 4', explanation: 'Elements reversed: 4 3 2 1.' },
      { input: '5\n10 20 30 40 50', explanation: 'Elements reversed: 50 40 30 20 10.' },
      { input: '1\n7', explanation: 'Single element reversed is itself: 7.' }
    ],
    hidden_inputs: [
      '1\n-100',
      '2\n5 9',
      '3\n0 0 0',
      '4\n-1 -2 -3 -4',
      '5\n1 1 1 1 1',
      '6\n100 200 -300 400 -500 600',
      '7\n9 8 7 6 5 4 3',
      '8\n1000000000 -1000000000 500000000 -500000000 0 1 2 3',
      '4\n-999999999 999999999 0 42',
      `100000\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  }
];
