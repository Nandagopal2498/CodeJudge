import { RawProblemDef } from '../utils/batchRunner.js';

export const mediumBatch4Raw: RawProblemDef[] = [
  // Problem 41: Merge Intervals
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    tags: ['Sorting', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and print an array of the non-overlapping intervals that cover all the intervals in the input in ascending order by start time.',
    input_format: 'The first line contains an integer `n`.\nThe next `n` lines each contain two integers `start` and `end`.',
    output_format: 'The first line should contain an integer `k` (the count of merged intervals).\nThe next `k` lines each should contain two space-separated integers `start end`.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= start_i <= end_i <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<pair<long long, long long>> intervals(n);
    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;

    // TODO: Merge overlapping intervals and print results

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

    vector<pair<long long, long long>> intervals(n);
    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;

    sort(intervals.begin(), intervals.end());

    vector<pair<long long, long long>> merged;
    for (int i = 0; i < n; i++) {
        if (merged.empty() || merged.back().second < intervals[i].first) {
            merged.push_back(intervals[i]);
        } else {
            merged.back().second = max(merged.back().second, intervals[i].second);
        }
    }

    cout << merged.size() << "\\n";
    for (auto& p : merged) {
        cout << p.first << " " << p.second << "\\n";
    }
    return 0;
}
`,
    sample_inputs: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', explanation: 'Intervals [1, 3] and [2, 6] overlap, merging them into [1, 6]. Result has 3 intervals.' },
      { input: '2\n1 4\n4 5', explanation: 'Intervals [1, 4] and [4, 5] touch at 4, merged into [1, 5].' },
      { input: '1\n10 20', explanation: 'Single interval remains unchanged.' }
    ],
    hidden_inputs: [
      '2\n1 4\n2 3',
      '3\n1 4\n0 2\n3 5',
      '4\n1 4\n5 6\n7 8\n9 10',
      '5\n2 3\n4 5\n6 7\n8 9\n1 10',
      '6\n-10 -5\n-7 0\n1 5\n2 6\n10 12\n11 15',
      '4\n0 0\n0 0\n0 0\n0 0',
      '5\n-100 100\n-50 50\n-25 25\n0 10\n-10 0',
      '6\n1 2\n2 3\n3 4\n4 5\n5 6\n6 7',
      '3\n-1000000000 0\n0 1000000000\n-500000000 500000000',
      `100000\n${Array.from({ length: 100000 }, (_, i) => `${i} ${i + 1}`).join('\n')}`
    ]
  },

  // Problem 42: Jump Game Can Reach End
  {
    title: 'Jump Game Can Reach End',
    slug: 'jump-game-can-reach-end',
    difficulty: 'Medium',
    tags: ['Greedy', 'Dynamic Programming', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'You are given an integer array `nums` of length `n`. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position.\n\nPrint `YES` if you can reach the last index, or `NO` otherwise.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print `YES` if you can reach the last index, otherwise print `NO`.',
    constraints: '• 1 <= n <= 10^5\n• 0 <= nums[i] <= 10^5',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Determine if last index is reachable

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

    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int maxReach = 0;
    bool ok = true;

    for (int i = 0; i < n; i++) {
        if (i > maxReach) {
            ok = false;
            break;
        }
        maxReach = max(maxReach, i + nums[i]);
        if (maxReach >= n - 1) break;
    }

    cout << (ok ? "YES" : "NO") << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '5\n2 3 1 1 4', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
      { input: '5\n3 2 1 0 4', explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.' },
      { input: '1\n0', explanation: 'Already at the last index, answer is YES.' }
    ],
    hidden_inputs: [
      '2\n0 1',
      '2\n1 0',
      '3\n1 0 2',
      '4\n2 0 0 0',
      '5\n1 1 1 1 1',
      '6\n5 4 3 2 1 0',
      '6\n0 1 2 3 4 5',
      '7\n2 5 0 0 0 0 0',
      '5\n2 0 2 0 1',
      `100000\n${Array.from({ length: 100000 }, () => '1').join(' ')}`
    ]
  },

  // Problem 43: Find All Anagrams in a String
  {
    title: 'Find All Anagrams in a String',
    slug: 'find-all-anagrams-in-a-string',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hashmap', 'Strings'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given two strings `s` and `p`, return the number of anagram start indices of `p` in `s`, followed by the list of 0-based start indices on the second line (sorted ascending).',
    input_format: 'The first line contains the string `s`.\nThe second line contains the string `p`.',
    output_format: 'The first line should contain an integer `k` (the count of starting indices).\nThe second line should contain the `k` space-separated indices. If k = 0, print an empty line.',
    constraints: '• 1 <= |s|, |p| <= 10^5\n• s and p consist of lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s, p;
    if (!(cin >> s >> p)) return 0;

    // TODO: Find all start indices of p's anagrams in s

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

    string s, p;
    if (!(cin >> s >> p)) return 0;

    int sLen = (int)s.length(), pLen = (int)p.length();
    vector<int> res;

    if (sLen >= pLen) {
        vector<int> pCount(26, 0), sCount(26, 0);
        for (char c : p) pCount[c - 'a']++;
        for (int i = 0; i < pLen; i++) sCount[s[i] - 'a']++;

        if (pCount == sCount) res.push_back(0);

        for (int i = pLen; i < sLen; i++) {
            sCount[s[i] - 'a']++;
            sCount[s[i - pLen] - 'a']--;
            if (pCount == sCount) {
                res.push_back(i - pLen + 1);
            }
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
      { input: 'cbaebabacd\nabc', explanation: 'The substring with start index = 0 is "cba", which is an anagram of "abc". The substring with start index = 6 is "bac", which is an anagram of "abc".' },
      { input: 'abab\nab', explanation: 'Anagrams start at 0 ("ab"), 1 ("ba"), 2 ("ab"). Total = 3.' },
      { input: 'hello\nworld', explanation: 'No anagram exists, count = 0.' }
    ],
    hidden_inputs: [
      'a\na',
      'a\nb',
      'aa\na',
      'aaaaaaaa\naa',
      'baa\naa',
      'abacbabc\nabc',
      'xyzxyzxyz\nzyx',
      'abcdef\nfedcba',
      'ab\nabc',
      `${'ab'.repeat(50000)}\nab`
    ]
  },

  // Problem 44: Maximum Length of Repeated Subarray
  {
    title: 'Maximum Length of Repeated Subarray',
    slug: 'maximum-length-of-repeated-subarray',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Binary Search', 'Arrays'],
    points: 250,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given two integer arrays `nums1` and `nums2`, return the maximum length of a subarray that appears in both arrays.',
    input_format: 'The first line contains two integers `n` (length of nums1) and `m` (length of nums2).\nThe second line contains `n` space-separated integers for nums1.\nThe third line contains `m` space-separated integers for nums2.',
    output_format: 'Print the maximum length of a repeated subarray.',
    constraints: '• 1 <= n, m <= 2000\n• 0 <= nums1[i], nums2[i] <= 100',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<int> nums1(n), nums2(m);
    for (int i = 0; i < n; i++) cin >> nums1[i];
    for (int i = 0; i < m; i++) cin >> nums2[i];

    // TODO: Compute maximum length of repeated subarray

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

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<int> nums1(n), nums2(m);
    for (int i = 0; i < n; i++) cin >> nums1[i];
    for (int i = 0; i < m; i++) cin >> nums2[i];

    vector<int> dp(m + 1, 0);
    int maxLen = 0;

    for (int i = 1; i <= n; i++) {
        for (int j = m; j >= 1; j--) {
            if (nums1[i - 1] == nums2[j - 1]) {
                dp[j] = dp[j - 1] + 1;
                maxLen = max(maxLen, dp[j]);
            } else {
                dp[j] = 0;
            }
        }
    }

    cout << maxLen << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '5 5\n1 2 3 2 1\n3 2 1 4 7', explanation: 'The repeated subarray with maximum length is [3, 2, 1], length 3.' },
      { input: '5 5\n0 0 0 0 0\n0 0 0 0 0', explanation: 'The entire array matches, length 5.' },
      { input: '3 3\n1 2 3\n4 5 6', explanation: 'No common subarray, length 0.' }
    ],
    hidden_inputs: [
      '1 1\n1\n1',
      '1 1\n1\n2',
      '4 4\n1 2 3 4\n2 3 4 5',
      '5 4\n0 1 1 1 1\n1 0 1 0',
      '6 6\n1 2 3 2 1 4\n2 1 4 1 2 3',
      '5 6\n5 4 3 2 1\n1 2 3 4 5 6',
      '7 7\n10 20 30 40 50 60 70\n20 30 40 50 60 70 80',
      '5 3\n7 8 9 10 11\n9 10 11',
      '6 6\n1 0 1 0 1 0\n0 1 0 1 0 1',
      `2000 2000\n${Array.from({ length: 2000 }, () => '1').join(' ')}\n${Array.from({ length: 2000 }, () => '1').join(' ')}`
    ]
  },

  // Problem 45: Asteroid Collision
  {
    title: 'Asteroid Collision',
    slug: 'asteroid-collision',
    difficulty: 'Medium',
    tags: ['Stack', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'We are given an array `asteroids` of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'The first line should contain an integer `k` (the count of remaining asteroids).\nThe second line should contain the `k` space-separated integers. If k = 0, print an empty line.',
    constraints: '• 2 <= n <= 10^5\n• -1000 <= asteroids[i] <= 1000\n• asteroids[i] != 0',
    starter_code: `#include <iostream>
#include <vector>
#include <stack>
#include <cmath>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // TODO: Simulate asteroid collisions using a stack

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    vector<int> st;

    for (int i = 0; i < n; i++) {
        int val;
        cin >> val;
        bool destroyed = false;

        while (!st.empty() && st.back() > 0 && val < 0) {
            if (st.back() < -val) {
                st.pop_back();
            } else if (st.back() == -val) {
                st.pop_back();
                destroyed = true;
                break;
            } else {
                destroyed = true;
                break;
            }
        }

        if (!destroyed) {
            st.push_back(val);
        }
    }

    cout << st.size() << "\\n";
    for (size_t i = 0; i < st.size(); i++) {
        cout << st[i] << (i + 1 == st.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '3\n5 10 -5', explanation: '10 and -5 collide resulting in 10. 5 and 10 never collide. Remaining: 5 10.' },
      { input: '2\n8 -8', explanation: '8 and -8 collide and explode each other. Remaining: none (k = 0).' },
      { input: '3\n10 2 -5', explanation: '2 and -5 collide resulting in -5. 10 and -5 collide resulting in 10. Remaining: 10.' }
    ],
    hidden_inputs: [
      '2\n-2 -1',
      '2\n1 2',
      '4\n-2 -1 1 2',
      '4\n-2 1 -1 -2',
      '5\n1 -1 2 -2 3',
      '6\n10 20 -20 -10 5 -5',
      '5\n-5 5 -5 5 -5',
      '6\n100 -50 20 -30 10 -5',
      '4\n-1000 1000 -1000 1000',
      `100000\n${Array.from({ length: 50000 }, () => '10').concat(Array.from({ length: 50000 }, () => '-5')).join(' ')}`
    ]
  }
];
