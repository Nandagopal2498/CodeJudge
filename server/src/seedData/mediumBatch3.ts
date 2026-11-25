import { RawProblemDef } from '../utils/batchRunner.js';

export const mediumBatch3Raw: RawProblemDef[] = [
  // Problem 36: Non-overlapping Intervals
  {
    title: 'Non-overlapping Intervals',
    slug: 'non-overlapping-intervals',
    difficulty: 'Medium',
    tags: ['Greedy', 'Sorting'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\nNote that intervals which only touch at a single point (e.g. `[1, 2]` and `[2, 3]`) are non-overlapping.',
    input_format: 'The first line contains an integer `n` (the number of intervals).\nThe next `n` lines each contain two integers `start` and `end`.',
    output_format: 'Print a single integer denoting the minimum intervals to remove.',
    constraints: '• 1 <= n <= 10^5\n• -5 * 10^4 <= start_i < end_i <= 5 * 10^4',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<pair<int, int>> intervals(n);
    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;

    // TODO: Find minimum intervals to remove to eliminate overlaps

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

    vector<pair<int, int>> intervals(n);
    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;

    // Greedy choice: sort by end time
    sort(intervals.begin(), intervals.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
        return a.second < b.second;
    });

    int kept = 0;
    int lastEnd = -2e9;

    for (int i = 0; i < n; i++) {
        if (intervals[i].first >= lastEnd) {
            kept++;
            lastEnd = intervals[i].second;
        }
    }

    cout << (n - kept) << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '4\n1 2\n2 3\n3 4\n1 3', explanation: '[1, 3] can be removed and the rest of the intervals are non-overlapping (1 removal).' },
      { input: '3\n1 2\n1 2\n1 2', explanation: 'You need to remove two [1, 2] to leave one interval.' },
      { input: '3\n1 2\n2 3\n3 4', explanation: 'No intervals need to be removed (0 removals).' }
    ],
    hidden_inputs: [
      '1\n1 10',
      '2\n1 5\n2 3',
      '3\n1 10\n2 8\n3 6',
      '4\n1 100\n11 20\n21 30\n31 40',
      '5\n0 2\n1 3\n2 4\n3 5\n4 6',
      '6\n-10 -5\n-6 0\n0 5\n-8 -2\n1 4\n3 7',
      '5\n1 2\n3 4\n5 6\n7 8\n9 10',
      '7\n1 4\n2 3\n3 5\n4 6\n5 7\n6 8\n7 9',
      '4\n-50 -20\n-30 0\n-10 10\n0 20',
      `100000\n${Array.from({ length: 100000 }, (_, i) => `${i} ${i + 2}`).join('\n')}`
    ]
  },

  // Problem 37: 3Sum Triplet Zero
  {
    title: '3Sum Triplet Zero',
    slug: '3sum-triplet-zero',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Sorting', 'Arrays'],
    points: 250,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an integer array `nums` of length `n`, return the count of distinct triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print a single integer denoting the number of unique triplets summing to 0.',
    constraints: '• 3 <= n <= 3000\n• -10^5 <= nums[i] <= 10^5',
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

    // TODO: Count distinct triplets summing to 0

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

    sort(nums.begin(), nums.end());
    int count = 0;

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            long long sum = (long long)nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                count++;
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++;
                r--;
            } else if (sum < 0) {
                l++;
            } else {
                r--;
            }
        }
    }

    cout << count << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '6\n-1 0 1 2 -1 -4', explanation: 'Unique triplets: [-1, -1, 2] and [-1, 0, 1]. Count = 2.' },
      { input: '3\n0 1 1', explanation: 'No triplet sums to 0. Count = 0.' },
      { input: '3\n0 0 0', explanation: '[0, 0, 0] sums to 0. Count = 1.' }
    ],
    hidden_inputs: [
      '4\n-2 0 1 1',
      '5\n-1 -1 -1 2 2',
      '6\n-5 -2 -1 0 1 2',
      '6\n0 0 0 0 0 0',
      '7\n-3 1 2 -2 0 2 3',
      '8\n-4 -2 -2 -2 0 1 2 2',
      '5\n10 20 -30 0 5',
      '9\n-1 0 1 -2 0 2 -3 0 3',
      '6\n-100000 50000 50000 0 -1 1',
      `3000\n${Array.from({ length: 3000 }, (_, i) => i - 1500).join(' ')}`
    ]
  },

  // Problem 38: Minimum Size Subarray Sum
  {
    title: 'Minimum Size Subarray Sum',
    slug: 'minimum-size-subarray-sum',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Binary Search', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.',
    input_format: 'The first line contains two integers `n` and `target`.\nThe second line contains `n` space-separated positive integers.',
    output_format: 'Print the minimal length of a subarray with sum >= target, or 0 if none exists.',
    constraints: '• 1 <= n <= 10^5\n• 1 <= target <= 10^9\n• 1 <= nums[i] <= 10^4',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find minimal length of subarray with sum >= target

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
    long long target;
    if (!(cin >> n >> target)) return 0;

    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int minLen = 1e9;
    long long curSum = 0;
    int l = 0;

    for (int r = 0; r < n; r++) {
        curSum += nums[r];
        while (curSum >= target) {
            minLen = min(minLen, r - l + 1);
            curSum -= nums[l];
            l++;
        }
    }

    cout << (minLen > n ? 0 : minLen) << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '6 7\n2 3 1 2 4 3', explanation: 'The subarray [4, 3] has the minimal length 2 under the problem constraints.' },
      { input: '3 4\n1 4 4', explanation: 'Subarray [4] has length 1.' },
      { input: '5 11\n1 1 1 1 1', explanation: 'Total sum is 5, cannot reach 11, returns 0.' }
    ],
    hidden_inputs: [
      '1 5\n5',
      '1 10\n5',
      '2 15\n10 10',
      '4 10\n1 2 3 4',
      '5 100\n10 20 30 40 50',
      '6 6\n1 1 1 1 1 1',
      '7 14\n2 1 5 2 3 2 8',
      '5 15\n1 2 3 4 5',
      '6 1000\n10 20 500 500 10 20',
      `100000 500000\n${Array.from({ length: 100000 }, () => '10').join(' ')}`
    ]
  },

  // Problem 39: Number of Islands
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    tags: ['Graph BFS/DFS'],
    points: 250,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    input_format: 'The first line contains two integers `m` and `n`.\nThe next `m` lines each contain a binary string of length `n` containing characters \'0\' and \'1\'.',
    output_format: 'Print a single integer representing the number of islands.',
    constraints: '• 1 <= m, n <= 300\n• grid[i][j] is \'0\' or \'1\'.',
    starter_code: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<string> grid(m);
    for (int i = 0; i < m; i++) cin >> grid[i];

    // TODO: Count number of connected land components (islands)

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

void dfs(int r, int c, int m, int n, vector<string>& grid) {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c, m, n, grid);
    dfs(r - 1, c, m, n, grid);
    dfs(r, c + 1, m, n, grid);
    dfs(r, c - 1, m, n, grid);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int m, n;
    if (!(cin >> m >> n)) return 0;

    vector<string> grid(m);
    for (int i = 0; i < m; i++) cin >> grid[i];

    int islands = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                islands++;
                dfs(i, j, m, n, grid);
            }
        }
    }

    cout << islands << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '4 5\n11110\n11010\n11000\n00000', explanation: 'All land cells are connected to each other, forming 1 island.' },
      { input: '4 5\n11000\n11000\n00100\n00011', explanation: 'There are 3 separate islands.' },
      { input: '1 1\n0', explanation: 'Single water cell has 0 islands.' }
    ],
    hidden_inputs: [
      '1 1\n1',
      '2 2\n00\n00',
      '2 2\n10\n01',
      '3 3\n111\n010\n111',
      '3 4\n1010\n0101\n1010',
      '4 4\n1111\n1001\n1001\n1111',
      '5 5\n01010\n10101\n01010\n10101\n01010',
      '6 6\n111000\n110000\n000110\n000110\n000001\n000011',
      '5 1\n1\n0\n1\n0\n1',
      `300 300\n${Array.from({ length: 300 }, (_, r) => Array.from({ length: 300 }, (_, c) => ((r + c) % 2 === 0 ? '1' : '0')).join('')).join('\n')}`
    ]
  },

  // Problem 40: Fast Modular Exponentiation
  {
    title: 'Fast Modular Exponentiation',
    slug: 'fast-modular-exponentiation',
    difficulty: 'Medium',
    tags: ['Math'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given three integers `a`, `b`, and `m`, compute `(a^b) % m` efficiently using binary exponentiation.\n\nNote that 0^0 = 1.',
    input_format: 'A single line containing three space-separated integers `a`, `b`, and `m`.',
    output_format: 'Print the value of `(a^b) % m`.',
    constraints: '• 0 <= a, b <= 10^18\n• 1 <= m <= 10^9',
    starter_code: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long a, b, m;
    if (!(cin >> a >> b >> m)) return 0;

    // TODO: Compute (a^b) % m in O(log b)

    return 0;
}
`,
    reference_solution: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long a, b, m;
    if (!(cin >> a >> b >> m)) return 0;

    if (m == 1) {
        cout << 0 << "\\n";
        return 0;
    }

    long long res = 1;
    a %= m;

    while (b > 0) {
        if (b & 1) {
            res = (__int128)res * a % m;
        }
        a = (__int128)a * a % m;
        b >>= 1;
    }

    cout << res << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '2 10 1000', explanation: '2^10 = 1024. 1024 % 1000 = 24.' },
      { input: '3 5 7', explanation: '3^5 = 243. 243 % 7 = 5.' },
      { input: '5 0 1000000007', explanation: '5^0 = 1. 1 % 1000000007 = 1.' }
    ],
    hidden_inputs: [
      '0 0 100',
      '0 5 10',
      '10 1 1',
      '7 13 1000000007',
      '123456789 987654321 1000000007',
      '2 62 1000000007',
      '999999999 999999999 1000000000',
      '1000000000000000000 1000000000000000000 998244353',
      '3 1000000000000000000 1000000007',
      '4611686018427387904 4611686018427387904 1000000007'
    ]
  }
];
