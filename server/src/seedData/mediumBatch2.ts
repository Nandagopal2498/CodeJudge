import { RawProblemDef } from '../utils/batchRunner.js';

export const mediumBatch2Raw: RawProblemDef[] = [
  // Problem 31: Number of Connected Components
  {
    title: 'Number of Connected Components',
    slug: 'number-of-connected-components',
    difficulty: 'Medium',
    tags: ['Graph BFS/DFS', 'Disjoint Set'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'You have a graph of `n` nodes labeled from `0` to `n - 1`. You are given an integer `n` and an array of `m` undirected edges. Print the total number of connected components in the graph.',
    input_format: 'The first line contains two integers `n` (number of vertices) and `m` (number of edges).\nThe following `m` lines each contain two integers `u` and `v` representing an undirected edge.',
    output_format: 'Print a single integer representing the number of connected components.',
    constraints: '• 1 <= n <= 10^5\n• 0 <= m <= 10^5\n• 0 <= u, v < n\n• Graph contains no self-loops or parallel edges.',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    // TODO: Calculate the number of connected components in the undirected graph

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>

using namespace std;

struct DSU {
    vector<int> parent;
    int components;
    DSU(int n) : parent(n), components(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i)
            return i;
        return parent[i] = find(parent[i]);
    }
    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) {
            parent[root_i] = root_j;
            components--;
        }
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    DSU dsu(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        dsu.unite(u, v);
    }

    cout << dsu.components << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '5 3\n0 1\n1 2\n3 4', explanation: 'Component 1: {0, 1, 2}, Component 2: {3, 4}. Total = 2.' },
      { input: '5 2\n0 1\n1 2', explanation: 'Component 1: {0, 1, 2}, Component 2: {3}, Component 3: {4}. Total = 3.' },
      { input: '1 0\n', explanation: 'A single node with no edges forms 1 component.' }
    ],
    hidden_inputs: [
      '2 0\n',
      '2 1\n0 1',
      '4 4\n0 1\n1 2\n2 3\n3 0',
      '6 2\n0 5\n1 4',
      '5 4\n0 1\n1 2\n2 3\n3 4',
      '7 3\n1 2\n3 4\n5 6',
      '8 0\n',
      '6 5\n0 1\n0 2\n0 3\n0 4\n0 5',
      '10 4\n0 9\n1 8\n2 7\n3 6',
      `100000 99999\n${Array.from({ length: 99999 }, (_, i) => `${i} ${i + 1}`).join('\n')}`
    ]
  },

  // Problem 32: Longest Increasing Subsequence Length
  {
    title: 'Longest Increasing Subsequence Length',
    slug: 'longest-increasing-subsequence-length',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Dynamic Programming', 'Arrays'],
    points: 250,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nYou must implement an algorithm with `O(n log n)` runtime complexity.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print a single integer denoting the length of the longest strictly increasing subsequence.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    starter_code: `#include <iostream>
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

    // TODO: Compute LIS length in O(n log n)

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

    vector<long long> tails;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }

    cout << tails.size() << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '8\n10 9 2 5 3 7 101 18', explanation: 'The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.' },
      { input: '6\n0 1 0 3 2 3', explanation: 'The longest increasing subsequence is [0, 1, 2, 3], length 4.' },
      { input: '5\n7 7 7 7 7', explanation: 'Since subsequence must be strictly increasing, length is 1.' }
    ],
    hidden_inputs: [
      '1\n100',
      '2\n1 2',
      '2\n2 1',
      '6\n1 3 6 7 9 4',
      '5\n-5 -4 -3 -2 -1',
      '7\n1 2 1 2 1 2 1',
      '8\n4 10 4 3 8 9 20 15',
      '6\n100 200 50 40 30 20',
      '10\n1 9 2 8 3 7 4 6 5 0',
      `100000\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}`
    ]
  },

  // Problem 33: Maximum Product Subarray
  {
    title: 'Maximum Product Subarray',
    slug: 'maximum-product-subarray',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Arrays'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer array `nums`, find a contiguous non-empty subarray within the array that has the largest product, and return that product.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the maximum product found.',
    constraints: '• 1 <= n <= 10^5\n• -10 <= nums[i] <= 10\n• The product of any prefix or suffix of nums is guaranteed to fit in a 64-bit integer.',
    starter_code: `#include <iostream>
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

    // TODO: Find maximum product of a contiguous subarray

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

    long long max_prod = a[0];
    long long min_prod = a[0];
    long long ans = a[0];

    for (int i = 1; i < n; i++) {
        if (a[i] < 0) {
            swap(max_prod, min_prod);
        }
        max_prod = max(a[i], max_prod * a[i]);
        min_prod = min(a[i], min_prod * a[i]);
        ans = max(ans, max_prod);
    }

    cout << ans << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '4\n2 3 -2 4', explanation: '[2, 3] has the largest product 6.' },
      { input: '3\n-2 0 -1', explanation: 'The result cannot be 2, because [-2, -1] is not a contiguous subarray. Max is 0.' },
      { input: '1\n-5', explanation: 'Only element is -5.' }
    ],
    hidden_inputs: [
      '2\n-2 3',
      '2\n0 2',
      '3\n-2 -3 -4',
      '4\n-1 -2 -3 -4',
      '5\n2 -5 -2 -4 3',
      '6\n0 0 0 0 0 0',
      '5\n-1 0 -2 0 3',
      '7\n1 2 -1 4 -2 0 5',
      '4\n-3 1 -2 0',
      `100000\n${Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 1 : 1)).join(' ')}`
    ]
  },

  // Problem 34: Coin Change Minimum Coins
  {
    title: 'Coin Change Minimum Coins',
    slug: 'coin-change-minimum-coins',
    difficulty: 'Medium',
    tags: ['Dynamic Programming'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.',
    input_format: 'The first line contains two integers `n` (number of coins) and `amount`.\nThe second line contains `n` space-separated integers representing the coin denominations.',
    output_format: 'Print the minimum number of coins, or -1 if impossible.',
    constraints: '• 1 <= n <= 100\n• 1 <= coins[i] <= 10^4\n• 0 <= amount <= 10^5',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, amount;
    if (!(cin >> n >> amount)) return 0;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];

    // TODO: Find fewest coins needed to make up amount, or -1

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

    int n, amount;
    if (!(cin >> n >> amount)) return 0;

    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];

    const int INF = 1e9;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;

    for (int c : coins) {
        for (int i = c; i <= amount; i++) {
            if (dp[i - c] != INF) {
                dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
    }

    cout << (dp[amount] == INF ? -1 : dp[amount]) << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '3 11\n1 2 5', explanation: '11 = 5 + 5 + 1 (3 coins).' },
      { input: '1 3\n2', explanation: 'Amount 3 cannot be formed with only coin 2, returns -1.' },
      { input: '1 0\n1', explanation: 'Amount 0 requires 0 coins.' }
    ],
    hidden_inputs: [
      '1 7\n7',
      '2 6\n1 5',
      '3 6249\n186 419 83',
      '4 100\n1 5 10 25',
      '3 14\n3 7 10',
      '4 9999\n2 4 6 8',
      '5 50\n10 20 30 40 50',
      '3 1000\n7 11 13',
      '5 120\n1 2 5 10 20',
      '5 100000\n1 10 100 1000 10000'
    ]
  },

  // Problem 35: Top K Frequent Elements
  {
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    difficulty: 'Medium',
    tags: ['Heap', 'Hashmap', 'Sorting'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer array `nums` of length `n` and an integer `k`, return the `k` most frequent elements. Print the `k` elements sorted in ascending order.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the `k` elements separated by a space in ascending order.',
    constraints: '• 1 <= k <= number of unique elements <= 10^5\n• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find top k frequent elements and print them sorted ascending

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    unordered_map<long long, int> freq;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        freq[x]++;
    }

    // Min-heap of pair<frequency, value>
    priority_queue<pair<int, long long>, vector<pair<int, long long>>, greater<pair<int, long long>>> minHeap;
    for (auto& entry : freq) {
        minHeap.push({entry.second, entry.first});
        if ((int)minHeap.size() > k) {
            minHeap.pop();
        }
    }

    vector<long long> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top().second);
        minHeap.pop();
    }
    sort(result.begin(), result.end());

    for (int i = 0; i < k; i++) {
        cout << result[i] << (i + 1 == k ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    sample_inputs: [
      { input: '6 2\n1 1 1 2 2 3', explanation: '1 appears 3 times, 2 appears 2 times, 3 appears 1 time. Top 2 are 1 and 2.' },
      { input: '1 1\n1', explanation: 'Only element 1 appears once.' },
      { input: '4 2\n1 2 1 2', explanation: 'Both 1 and 2 have frequency 2, sorted ascending: 1 2.' }
    ],
    hidden_inputs: [
      '3 1\n4 4 4',
      '5 2\n10 10 20 20 20',
      '6 3\n-1 -1 -1 -2 -2 -3',
      '7 1\n0 0 0 1 2 3 4',
      '8 2\n100 200 100 200 100 200 300 400',
      '5 5\n5 4 3 2 1',
      '6 2\n-1000000000 -1000000000 0 0 0 1',
      '8 3\n7 7 7 8 8 9 10 11',
      '5 1\n42 42 42 42 42',
      `100000 2\n${Array.from({ length: 60000 }, () => '1').concat(Array.from({ length: 30000 }, () => '2')).concat(Array.from({ length: 10000 }, () => '3')).join(' ')}`
    ]
  }
];
