import { RawProblemDef } from '../utils/batchRunner.js';

export const batch2Raw: RawProblemDef[] = [
  // Problem 11: Valid Anagram
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    tags: ['Hashmap', 'Strings'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given two strings `s` and `t`, determine if `t` is an anagram of `s`. An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.\n\nPrint `YES` if `t` is an anagram of `s`, or `NO` otherwise.',
    input_format: 'The first line contains string `s`.\nThe second line contains string `t`.',
    output_format: 'Print `YES` if `t` is an anagram of `s`, otherwise print `NO`.',
    constraints: '• 1 <= |s|, |t| <= 10^5\n• s and t consist of lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s, t;
    if (!(cin >> s >> t)) return 0;

    // TODO: Check if t is an anagram of s

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

    string s, t;
    if (!(cin >> s >> t)) return 0;

    if (s.length() != t.length()) {
        cout << "NO\\n";
        return 0;
    }
    vector<int> count(26, 0);
    for (char c : s) count[c - 'a']++;
    for (char c : t) count[c - 'a']--;
    for (int x : count) {
        if (x != 0) {
            cout << "NO\\n";
            return 0;
        }
    }
    cout << "YES\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: 'anagram\nnagaram', explanation: 'Both strings have the exact same character frequencies.' },
      { input: 'rat\ncar', explanation: 'Characters differ (\'r\', \'a\', \'t\' vs \'c\', \'a\', \'r\').' },
      { input: 'listen\nsilent', explanation: '"silent" rearranged forms "listen".' }
    ],
    hidden_inputs: [
      'a\na',
      'a\nb',
      'ab\nba',
      'abc\nabd',
      'aaabbb\nbbbaaa',
      'aabbcc\nabcabc',
      'hello\nworld',
      'abcde\nedcba',
      'abcdefghijklmnopqrstuvwxyz\nzydxwvutsrqponmlkjihgfedcba',
      `${'a'.repeat(50000)}${'b'.repeat(50000)}\n${'b'.repeat(50000)}${'a'.repeat(50000)}`
    ]
  },

  // Problem 12: Count Vowels and Consonants
  {
    title: 'Count Vowels and Consonants',
    slug: 'count-vowels-and-consonants',
    difficulty: 'Easy',
    tags: ['Strings'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a string `s` of lowercase English letters, count the total number of vowels and consonants in `s`. The vowels are `a`, `e`, `i`, `o`, `u`. Any other letter is a consonant.',
    input_format: 'A single line containing the string `s`.',
    output_format: 'Print two space-separated integers: the count of vowels followed by the count of consonants.',
    constraints: '• 1 <= |s| <= 10^5\n• s contains only lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    // TODO: Count vowels and consonants in s

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

    int vowels = 0, consonants = 0;
    for (char c : s) {
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        } else {
            consonants++;
        }
    }
    cout << vowels << " " << consonants << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: 'hello', explanation: 'Vowels: \'e\', \'o\' (2); Consonants: \'h\', \'l\', \'l\' (3).' },
      { input: 'aeiou', explanation: 'All 5 characters are vowels.' },
      { input: 'rhythm', explanation: 'All 6 characters are consonants.' }
    ],
    hidden_inputs: [
      'a',
      'b',
      'xyz',
      'queue',
      'strength',
      'abracadabra',
      'facetious',
      'bcdfg',
      'aeioup',
      `${'a'.repeat(40000)}${'z'.repeat(60000)}`
    ]
  },

  // Problem 13: Factorial Calculation
  {
    title: 'Factorial Calculation',
    slug: 'factorial-calculation',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer `n`, compute its factorial `n!`. Since the answer can be large, print the result modulo `1000000007` (10^9 + 7). By definition, 0! = 1.',
    input_format: 'A single integer `n`.',
    output_format: 'Print the value of `n! % 1000000007`.',
    constraints: '• 0 <= n <= 10^5',
    starter_code: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    // TODO: Compute n! modulo 1000000007

    return 0;
}
`,
    reference_solution: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    const long long MOD = 1000000007;
    long long ans = 1;
    for (int i = 1; i <= n; i++) {
        ans = (ans * i) % MOD;
    }
    cout << ans << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '0', explanation: '0! = 1.' },
      { input: '5', explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.' },
      { input: '10', explanation: '10! = 3628800.' }
    ],
    hidden_inputs: [
      '1',
      '2',
      '3',
      '7',
      '15',
      '25',
      '100',
      '1000',
      '50000',
      '100000'
    ]
  },

  // Problem 14: Fibonacci Number
  {
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math', 'Dynamic Programming'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'The Fibonacci numbers form a sequence where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n >= 2.\n\nGiven `n`, compute F(n) modulo `1000000007` (10^9 + 7).',
    input_format: 'A single integer `n`.',
    output_format: 'Print F(n) modulo 1000000007.',
    constraints: '• 0 <= n <= 10^5',
    starter_code: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    // TODO: Compute F(n) modulo 1000000007

    return 0;
}
`,
    reference_solution: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    if (n == 0) {
        cout << 0 << "\\n";
        return 0;
    }
    const long long MOD = 1000000007;
    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long long c = (a + b) % MOD;
        a = b;
        b = c;
    }
    cout << b << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '2', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
      { input: '4', explanation: 'F(4) = 3.' },
      { input: '0', explanation: 'F(0) = 0.' }
    ],
    hidden_inputs: [
      '1',
      '3',
      '5',
      '10',
      '30',
      '100',
      '500',
      '2000',
      '50000',
      '100000'
    ]
  },

  // Problem 15: Sort an Array
  {
    title: 'Sort an Array',
    slug: 'sort-an-array',
    difficulty: 'Easy',
    tags: ['Sorting', 'Arrays'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of `n` integers, sort the array in non-decreasing (ascending) order and print the sorted elements.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the sorted array elements separated by a space on a single line.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= a[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // TODO: Sort the array in non-decreasing order

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
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    sort(a.begin(), a.end());
    for (int i = 0; i < n; i++) {
        cout << a[i] << (i + 1 == n ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '5\n5 2 3 1 4', explanation: 'Sorted order: 1 2 3 4 5.' },
      { input: '4\n5 1 1 2', explanation: 'Array with duplicate elements: 1 1 2 5.' },
      { input: '1\n-9', explanation: 'Single element is already sorted.' }
    ],
    hidden_inputs: [
      '2\n10 -10',
      '3\n0 0 0',
      '5\n-5 -2 -8 -1 -3',
      '6\n1 2 3 4 5 6',
      '6\n6 5 4 3 2 1',
      '7\n100 -200 300 -400 500 -600 700',
      '8\n42 42 42 42 42 42 42 42',
      '5\n1000000000 -1000000000 0 500000000 -500000000',
      '9\n9 1 8 2 7 3 6 4 5',
      `100000\n${Array.from({ length: 100000 }, (_, i) => 100000 - i).join(' ')}`
    ]
  }
];
