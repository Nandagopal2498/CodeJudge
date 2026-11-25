import { HardProblemDef } from './hardBatch1.js';

export const hardBatch2Raw: HardProblemDef[] = [
  // Problem 51: Largest Rectangle in Histogram
  {
    title: 'Largest Rectangle in Histogram',
    slug: 'largest-rectangle-in-histogram',
    difficulty: 'Hard',
    tags: ['Monotonic Stack', 'Arrays'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an array of integers `heights` representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers representing the bar heights.',
    output_format: 'Print a single integer denoting the maximum area.',
    constraints: '• 1 <= n <= 10^5\n• 0 <= heights[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <stack>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> heights(n);
    for (int i = 0; i < n; i++) cin >> heights[i];

    // TODO: Find the area of the largest rectangle in O(n)

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <stack>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    vector<long long> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];

    stack<int> st;
    long long maxArea = 0;

    for (int i = 0; i <= n; i++) {
        long long curHeight = (i == n ? 0 : h[i]);
        while (!st.empty() && curHeight < h[st.top()]) {
            long long height = h[st.top()];
            st.pop();
            long long width = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }

    cout << maxArea << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    long long maxArea = 0;
    for (int i = 0; i < n; i++) {
        long long minH = h[i];
        for (int j = i; j < n; j++) {
            minH = min(minH, h[j]);
            maxArea = max(maxArea, minH * (j - i + 1));
        }
    }
    cout << maxArea << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '6\n2 1 5 6 2 3',
      '2\n2 4'
    ],
    sample_inputs: [
      { input: '6\n2 1 5 6 2 3', explanation: 'The largest rectangle is formed between heights 5 and 6 with area = 5 * 2 = 10.' },
      { input: '2\n2 4', explanation: 'Area = 4 * 1 = 4.' },
      { input: '1\n100', explanation: 'Area = 100 * 1 = 100.' }
    ],
    hidden_inputs: [
      '3\n2 1 2',
      '4\n1 1 1 1',
      '5\n5 4 3 2 1',
      '5\n1 2 3 4 5',
      '6\n0 0 0 0 0 0',
      '7\n6 2 5 4 5 1 6',
      '5\n1000000000 1000000000 1000000000 1000000000 1000000000',
      '6\n10 0 10 0 10 0',
      '8\n3 6 5 7 4 8 1 0',
      `100000\n${Array.from({ length: 100000 }, () => '1000').join(' ')}`
    ]
  },

  // Problem 52: Sliding Window Maximum (Monotonic Deque)
  {
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    difficulty: 'Hard',
    tags: ['Monotonic Stack/Deque', 'Sliding Window', 'Arrays'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position, return the max sliding window.\n\nPrint the max element of each window separated by spaces.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the `n - k + 1` maximums separated by a space on a single line.',
    constraints: '• 1 <= k <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <deque>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Compute sliding window maximums in O(n) using a monotonic deque

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <deque>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    deque<int> dq;
    vector<long long> result;

    for (int i = 0; i < n; i++) {
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }

        dq.push_back(i);

        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }

    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i] << (i + 1 == result.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i <= n - k; i++) {
        long long mx = a[i];
        for (int j = i; j < i + k; j++) mx = max(mx, a[j]);
        cout << mx << (i + 1 == n - k + 1 ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '8 3\n1 3 -1 -3 5 3 6 7',
      '1 1\n1'
    ],
    sample_inputs: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', explanation: 'Window positions produce maximums: [3, 3, 5, 5, 6, 7].' },
      { input: '1 1\n1', explanation: 'Window size 1 on 1 element returns [1].' },
      { input: '4 2\n4 3 2 1', explanation: 'Descending order windows: [4, 3, 2].' }
    ],
    hidden_inputs: [
      '2 2\n10 20',
      '5 1\n1 2 3 4 5',
      '5 5\n1 2 3 4 5',
      '6 3\n-7 -8 7 5 7 1',
      '7 4\n10 20 10 20 10 20 10',
      '5 3\n-1 -2 -3 -4 -5',
      '6 2\n0 0 0 0 0 0',
      '8 3\n9 8 7 6 5 4 3 2',
      '5 2\n1000000000 -1000000000 1000000000 -1000000000 1000000000',
      `100000 5000\n${Array.from({ length: 100000 }, (_, i) => i % 1000).join(' ')}`
    ]
  },

  // Problem 53: String Matching with KMP
  {
    title: 'Pattern Occurrences Count (KMP)',
    slug: 'pattern-occurrences-count-kmp',
    difficulty: 'Hard',
    tags: ['KMP', 'Strings'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given a text string `text` and a pattern string `pattern`, return the count of occurrences of `pattern` in `text` using the Knuth-Morris-Pratt (KMP) algorithm. Occurrences may overlap.',
    input_format: 'The first line contains the string `text`.\nThe second line contains the string `pattern`.',
    output_format: 'Print a single integer denoting the number of occurrences of pattern in text.',
    constraints: '• 1 <= |pattern| <= |text| <= 10^5\n• text and pattern consist of lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string text, pattern;
    if (!(cin >> text >> pattern)) return 0;

    // TODO: Implement KMP failure function and search to count occurrences

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

vector<int> buildLPS(const string& pat) {
    int m = pat.length();
    vector<int> lps(m, 0);
    int len = 0, i = 1;

    while (i < m) {
        if (pat[i] == pat[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string text, pattern;
    if (!(cin >> text >> pattern)) return 0;

    int n = text.length(), m = pattern.length();
    if (m > n) {
        cout << 0 << "\\n";
        return 0;
    }

    vector<int> lps = buildLPS(pattern);
    int count = 0;
    int i = 0, j = 0;

    while (i < n) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
        }

        if (j == m) {
            count++;
            j = lps[j - 1];
        } else if (i < n && text[i] != pattern[j]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    cout << count << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <string>

using namespace std;

int main() {
    string t, p;
    if (!(cin >> t >> p)) return 0;
    int cnt = 0;
    if (p.size() <= t.size()) {
        for (size_t i = 0; i <= t.size() - p.size(); i++) {
            if (t.substr(i, p.size()) == p) cnt++;
        }
    }
    cout << cnt << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      'ababcababaad\nababa',
      'aaaaa\naaa'
    ],
    sample_inputs: [
      { input: 'ababcababaad\nababa', explanation: '"ababa" appears once starting at index 5.' },
      { input: 'aaaaa\naaa', explanation: '"aaa" appears at indices 0, 1, and 2 (overlapping). Count = 3.' },
      { input: 'hello\nworld', explanation: '"world" is not in "hello", count = 0.' }
    ],
    hidden_inputs: [
      'a\na',
      'a\nb',
      'ababababab\nabab',
      'mississippi\nissi',
      'codejudgecodejudge\njudge',
      'abcdef\nz',
      'aabbaabb\naabb',
      'abcde\nabcdef',
      'abacabadabacaba\nabacaba',
      `${'a'.repeat(100000)}\n${'a'.repeat(1000)}`
    ]
  },

  // Problem 54: Split Array Largest Sum (Binary Search on Answer)
  {
    title: 'Split Array Largest Sum',
    slug: 'split-array-largest-sum',
    difficulty: 'Hard',
    tags: ['Binary Search on Answer', 'Greedy', 'Arrays'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an integer array `nums` and an integer `k`, split the array into `k` non-empty subarrays such that the largest sum of any subarray is minimized.\n\nReturn the minimized largest sum of the split.',
    input_format: 'The first line contains two integers `n` (array length) and `k` (number of splits).\nThe second line contains `n` space-separated non-negative integers.',
    output_format: 'Print a single integer denoting the minimized largest subarray sum.',
    constraints: '• 1 <= k <= n <= 10^5\n• 0 <= nums[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Binary search on the answer to minimize largest split sum

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

bool canSplit(const vector<long long>& nums, int k, long long maxLimit) {
    int splits = 1;
    long long curSum = 0;
    for (long long x : nums) {
        if (curSum + x > maxLimit) {
            splits++;
            curSum = x;
        } else {
            curSum += x;
        }
    }
    return splits <= k;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    vector<long long> nums(n);
    long long low = 0, high = 0;

    for (int i = 0; i < n; i++) {
        cin >> nums[i];
        low = max(low, nums[i]);
        high += nums[i];
    }

    long long ans = high;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (canSplit(nums, k, mid)) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    long long low = 0, high = 0;
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
        low = max(low, nums[i]);
        high += nums[i];
    }
    auto check = [&](long long mid) {
        int cnt = 1;
        long long sum = 0;
        for (auto x : nums) {
            if (sum + x > mid) { cnt++; sum = x; }
            else sum += x;
        }
        return cnt <= k;
    };
    long long ans = high;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (check(mid)) { ans = mid; high = mid - 1; }
        else low = mid + 1;
    }
    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '5 2\n7 2 5 10 8',
      '5 1\n1 2 3 4 5'
    ],
    sample_inputs: [
      { input: '5 2\n7 2 5 10 8', explanation: 'Splitting into [7, 2, 5] and [10, 8] gives sums 14 and 18. Maximum is 18.' },
      { input: '5 1\n1 2 3 4 5', explanation: 'Only 1 split: sum is 15.' },
      { input: '5 5\n1 2 3 4 5', explanation: 'Each element in its own subarray: max is 5.' }
    ],
    hidden_inputs: [
      '1 1\n100',
      '2 1\n10 20',
      '2 2\n10 20',
      '4 2\n1 4 4 4',
      '6 3\n1 2 3 4 5 6',
      '5 2\n0 0 0 0 0',
      '7 3\n10 20 30 40 50 60 70',
      '6 2\n1000000000 1000000000 1000000000 1000000000 1000000000 1000000000',
      '8 4\n5 2 8 1 9 3 7 4',
      `100000 500\n${Array.from({ length: 100000 }, () => '100').join(' ')}`
    ]
  },

  // Problem 55: Maximum XOR of Two Numbers (Trie)
  {
    title: 'Maximum XOR of Two Numbers',
    slug: 'maximum-xor-of-two-numbers',
    difficulty: 'Hard',
    tags: ['Trie', 'Bit Manipulation', 'Arrays'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an integer array `nums`, return the maximum result of `nums[i] XOR nums[j]`, where `0 <= i <= j < n`.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the maximum XOR value.',
    constraints: '• 1 <= n <= 10^5\n• 0 <= nums[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find maximum XOR of any pair using a binary Trie

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct TrieNode {
    TrieNode* children[2] = {nullptr, nullptr};
};

void insert(TrieNode* root, int num) {
    TrieNode* curr = root;
    for (int i = 30; i >= 0; i--) {
        int bit = (num >> i) & 1;
        if (!curr->children[bit]) {
            curr->children[bit] = new TrieNode();
        }
        curr = curr->children[bit];
    }
}

int queryMaxXOR(TrieNode* root, int num) {
    TrieNode* curr = root;
    int maxXor = 0;
    for (int i = 30; i >= 0; i--) {
        int bit = (num >> i) & 1;
        int oppBit = 1 - bit;
        if (curr->children[oppBit]) {
            maxXor |= (1 << i);
            curr = curr->children[oppBit];
        } else if (curr->children[bit]) {
            curr = curr->children[bit];
        } else {
            break;
        }
    }
    return maxXor;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    vector<int> nums(n);
    TrieNode* root = new TrieNode();
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
        insert(root, nums[i]);
    }

    int ans = 0;
    for (int x : nums) {
        ans = max(ans, queryMaxXOR(root, x));
    }

    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    int mx = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            mx = max(mx, a[i] ^ a[j]);
        }
    }
    cout << mx << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '6\n3 10 5 25 2 8',
      '3\n0 0 0'
    ],
    sample_inputs: [
      { input: '6\n3 10 5 25 2 8', explanation: 'The maximum result is 5 XOR 25 = 28.' },
      { input: '2\n14 70', explanation: '14 XOR 70 = 64.' },
      { input: '1\n42', explanation: '42 XOR 42 = 0.' }
    ],
    hidden_inputs: [
      '2\n0 100',
      '3\n1 2 3',
      '4\n8 10 2 4',
      '5\n15 7 3 1 0',
      '6\n100 200 300 400 500 600',
      '5\n1073741823 0 1073741823 0 5',
      '7\n16 32 64 128 256 512 1024',
      '4\n12345 67890 24680 13579',
      '6\n1 2 4 8 16 31',
      `100000\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  }
];
