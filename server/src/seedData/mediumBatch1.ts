import { RawProblemDef } from '../utils/batchRunner.js';

export const mediumBatch1Raw: RawProblemDef[] = [
  // Problem 26: Subarray Sums Divisible by K
  {
    title: 'Subarray Sums Divisible by K',
    slug: 'subarray-sums-divisible-by-k',
    difficulty: 'Medium',
    tags: ['Prefix Sums', 'Hashmap', 'Math'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer array `nums` of length `n` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.\n\nA subarray is a contiguous part of an array.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers representing `nums`.',
    output_format: 'Print a single integer denoting the number of subarrays divisible by `k`.',
    constraints: '• 1 <= n <= 10^5\n• 2 <= k <= 10^4\n• -10^4 <= nums[i] <= 10^4',
    starter_code: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Compute number of subarrays with sum divisible by k

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    vector<long long> modCount(k, 0);
    modCount[0] = 1;

    long long currentPrefix = 0;
    long long ans = 0;

    for (int i = 0; i < n; i++) {
        long long val;
        cin >> val;
        currentPrefix += val;
        long long rem = ((currentPrefix % k) + k) % k;
        ans += modCount[rem];
        modCount[rem]++;
    }

    cout << ans << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '6 5\n4 5 0 -2 -3 1', explanation: 'There are 7 subarrays with a sum divisible by k = 5: [4, 5, 0, -2, -3], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3].' },
      { input: '1 5\n5', explanation: '[5] has sum 5, divisible by 5 (count = 1).' },
      { input: '4 3\n1 2 3 4', explanation: 'Subarrays [1, 2], [3], [1, 2, 3], [2, 3, 4] have sums divisible by 3 (count = 4).' }
    ],
    hidden_inputs: [
      '1 7\n-7',
      '2 5\n-5 -10',
      '3 2\n1 1 1',
      '4 4\n0 0 0 0',
      '5 10\n100 200 -300 400 500',
      '6 6\n1 2 3 4 5 6',
      '7 3\n-1 -2 -3 1 2 3 0',
      '8 8\n8 -8 16 -16 24 -24 32 -32',
      '5 1000\n-500 500 -1000 1000 0',
      `100000 5\n${Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 5 : -5)).join(' ')}`
    ]
  },

  // Problem 27: Longest Substring Without Repeating Characters
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hashmap', 'Strings'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
    input_format: 'A single line containing the string `s` consisting of printable ASCII characters.',
    output_format: 'Print a single integer representing the length of the longest substring without repeating characters.',
    constraints: '• 0 <= |s| <= 10^5\n• s consists of printable ASCII characters.',
    starter_code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!getline(cin, s)) return 0;

    // TODO: Find length of longest substring without repeating characters

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!getline(cin, s)) return 0;

    vector<int> lastIdx(256, -1);
    int maxLen = 0, start = 0;

    for (int i = 0; i < (int)s.length(); i++) {
        unsigned char c = (unsigned char)s[i];
        if (lastIdx[c] >= start) {
            start = lastIdx[c] + 1;
        }
        lastIdx[c] = i;
        maxLen = max(maxLen, i - start + 1);
    }

    cout << maxLen << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: 'abcabcbb', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 'bbbbb', explanation: 'The answer is "b", with the length of 1.' },
      { input: 'pwwkew', explanation: 'The answer is "wke", with the length of 3. Note "pwke" is a subsequence, not a substring.' }
    ],
    hidden_inputs: [
      ' ',
      'a',
      'abcdef',
      'abba',
      'dvdf',
      'tmmzuxt',
      'aab',
      'thequickbrownfoxjumpsoverthelazydog',
      '1234567890!@#$%^&*()',
      `${'abcdefghij'.repeat(10000)}`
    ]
  },

  // Problem 28: Kth Largest Element in an Array
  {
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-an-array',
    difficulty: 'Medium',
    tags: ['Heap', 'Sorting', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer array `nums` of length `n` and an integer `k`, return the `k`-th largest element in the array.\n\nNote that it is the `k`-th largest element in sorted order, not the `k`-th distinct element.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the `k`-th largest element.',
    constraints: '• 1 <= k <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find the k-th largest element

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    priority_queue<long long, vector<long long>, greater<long long>> minHeap;
    for (int i = 0; i < n; i++) {
        long long val;
        cin >> val;
        minHeap.push(val);
        if ((int)minHeap.size() > k) {
            minHeap.pop();
        }
    }

    cout << minHeap.top() << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '6 2\n3 2 1 5 6 4', explanation: 'Sorted descending: [6, 5, 4, 3, 2, 1]. The 2nd largest is 5.' },
      { input: '9 4\n3 2 3 1 2 4 5 5 6', explanation: 'Sorted descending: [6, 5, 5, 4, 3, 3, 2, 2, 1]. The 4th largest is 4.' },
      { input: '1 1\n42', explanation: 'Only 1 element, 1st largest is 42.' }
    ],
    hidden_inputs: [
      '2 1\n10 20',
      '2 2\n10 20',
      '5 1\n-1 -2 -3 -4 -5',
      '5 5\n-1 -2 -3 -4 -5',
      '7 3\n100 200 100 200 300 300 400',
      '6 3\n0 0 0 0 0 0',
      '8 4\n-1000000000 1000000000 0 -500000000 500000000 10 20 30',
      '5 2\n999999999 999999998 999999997 999999996 999999995',
      '7 7\n7 6 5 4 3 2 1',
      `100000 50000\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  },

  // Problem 29: Daily Temperatures
  {
    title: 'Daily Temperatures',
    slug: 'daily-temperatures',
    difficulty: 'Medium',
    tags: ['Stack', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of integers `temperatures` of length `n`, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`-th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0`.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers representing the daily temperatures.',
    output_format: 'Print the `n` space-separated integers representing waiting days.',
    constraints: '• 1 <= n <= 10^5\n• 30 <= temperatures[i] <= 100',
    starter_code: `#include <iostream>
#include <vector>
#include <stack>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> t(n);
    for (int i = 0; i < n; i++) cin >> t[i];

    // TODO: Calculate warmer days wait array using monotonic stack

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <stack>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> t(n);
    for (int i = 0; i < n; i++) cin >> t[i];

    vector<int> ans(n, 0);
    stack<int> st;

    for (int i = 0; i < n; i++) {
        while (!st.empty() && t[i] > t[st.top()]) {
            int prevIdx = st.top();
            st.pop();
            ans[prevIdx] = i - prevIdx;
        }
        st.push(i);
    }

    for (int i = 0; i < n; i++) {
        cout << ans[i] << (i + 1 == n ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '8\n73 74 75 71 69 72 76 73', explanation: 'After 73 (day 0), warmer 74 is on day 1 (1 day). For 75, warmer 76 is 4 days later.' },
      { input: '4\n30 40 50 60', explanation: 'Strictly increasing temperatures result in 1 for each element except the last.' },
      { input: '3\n30 60 90', explanation: 'Wait 1 day, then 1 day, then 0.' }
    ],
    hidden_inputs: [
      '1\n50',
      '2\n50 40',
      '3\n90 80 70',
      '4\n70 70 70 70',
      '5\n40 50 60 70 80',
      '6\n89 62 70 58 47 47',
      '7\n30 99 30 99 30 99 100',
      '5\n100 100 100 100 100',
      '6\n31 32 33 34 35 36',
      `100000\n${Array.from({ length: 100000 }, (_, i) => 100 - (i % 50)).join(' ')}`
    ]
  },

  // Problem 30: Search in Rotated Sorted Array
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'There is an integer array `nums` sorted in ascending order with distinct values. Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the 0-based index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    input_format: 'The first line contains two integers `n` and `target`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the 0-based index of target, or -1 if not found.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i], target <= 10^9\n• All values of nums are unique.\n• nums is an ascending array that is possibly rotated.',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Perform binary search on rotated sorted array

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
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int low = 0, high = n - 1;
    int ans = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        }

        // Left half is sorted
        if (nums[low] <= nums[mid]) {
            if (target >= nums[low] && target < nums[mid]) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        } else { // Right half is sorted
            if (target > nums[mid] && target <= nums[high]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }

    cout << ans << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '7 0\n4 5 6 7 0 1 2', explanation: 'Target 0 is found at index 4.' },
      { input: '7 3\n4 5 6 7 0 1 2', explanation: 'Target 3 is not present in the array, returns -1.' },
      { input: '1 0\n1', explanation: 'Single element does not match target, returns -1.' }
    ],
    hidden_inputs: [
      '1 5\n5',
      '2 3\n1 3',
      '2 1\n3 1',
      '3 1\n5 1 3',
      '5 1\n4 5 6 1 2',
      '6 8\n4 5 6 7 8 1',
      '6 100\n10 20 30 40 50 5',
      '5 -5\n0 1 2 -10 -5',
      '7 12\n9 10 11 12 1 2 3',
      `100000 42424\n${Array.from({ length: 50000 }, (_, i) => 50000 + i + 1).concat(Array.from({ length: 50000 }, (_, i) => i + 1)).join(' ')}`
    ]
  }
];
