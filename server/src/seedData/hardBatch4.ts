import { HardProblemDef } from './hardBatch1.js';

export const hardBatch4Raw: HardProblemDef[] = [
  // Problem 61: Russian Doll Envelopes (Advanced DP / Binary Search)
  {
    title: 'Russian Doll Envelopes',
    slug: 'russian-doll-envelopes',
    difficulty: 'Hard',
    tags: ['Advanced DP', 'Binary Search', 'Sorting'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'You are given a 2D array of integers `envelopes` where `envelopes[i] = [w_i, h_i]` represents the width and height of an envelope. One envelope can fit into another if and only if both the width and height of one envelope are strictly greater than the other envelope\'s width and height.\n\nReturn the maximum number of envelopes you can Russian doll (i.e., put one inside the other). You cannot rotate an envelope.',
    input_format: 'The first line contains an integer `n`.\nThe next `n` lines each contain two integers `w` and `h`.',
    output_format: 'Print a single integer representing the maximum nesting depth.',
    constraints: '• 1 <= n <= 10^5\n• 1 <= w_i, h_i <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<pair<int, int>> envs(n);
    for (int i = 0; i < n; i++) cin >> envs[i].first >> envs[i].second;

    // TODO: Sort envelopes and find LIS on height in O(n log n)

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

    vector<pair<int, int>> envs(n);
    for (int i = 0; i < n; i++) cin >> envs[i].first >> envs[i].second;

    // Sort width ascending; for equal width, sort height descending
    sort(envs.begin(), envs.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
        if (a.first != b.first) return a.first < b.first;
        return a.second > b.second;
    });

    vector<int> tails;
    for (int i = 0; i < n; i++) {
        int h = envs[i].second;
        auto it = lower_bound(tails.begin(), tails.end(), h);
        if (it == tails.end()) {
            tails.push_back(h);
        } else {
            *it = h;
        }
    }

    cout << tails.size() << "\\n";
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
    vector<pair<int, int>> a(n);
    for (int i = 0; i < n; i++) cin >> a[i].first >> a[i].second;
    sort(a.begin(), a.end(), [](auto& x, auto& y){
        if (x.first != y.first) return x.first < y.first;
        return x.second > y.second;
    });
    vector<int> tails;
    for (auto& p : a) {
        auto it = lower_bound(tails.begin(), tails.end(), p.second);
        if (it == tails.end()) tails.push_back(p.second);
        else *it = p.second;
    }
    cout << tails.size() << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '4\n5 4\n6 4\n6 7\n2 3',
      '3\n1 1\n1 1\n1 1'
    ],
    sample_inputs: [
      { input: '4\n5 4\n6 4\n6 7\n2 3', explanation: 'The maximum nesting is [2, 3] => [5, 4] => [6, 7] (length 3).' },
      { input: '3\n1 1\n1 1\n1 1', explanation: 'Identical envelopes cannot be nested. Answer is 1.' },
      { input: '1\n10 20', explanation: 'Single envelope answer is 1.' }
    ],
    hidden_inputs: [
      '2\n1 2\n2 3',
      '3\n4 5\n4 6\n6 7',
      '5\n2 100\n3 200\n4 300\n5 500\n5 400',
      '6\n1 3\n3 5\n6 7\n6 8\n8 4\n9 5',
      '4\n10 10\n20 20\n30 30\n40 40',
      '5\n5 5\n4 4\n3 3\n2 2\n1 1',
      '6\n1 1\n2 2\n2 3\n3 3\n4 4\n5 5',
      '7\n1 2\n2 3\n3 4\n3 5\n4 5\n5 5\n6 7',
      '5\n1000000000 1000000000\n500000000 500000000\n250000000 250000000\n125000000 125000000\n62500000 62500000',
      `100000\n${Array.from({ length: 100000 }, (_, i) => `${i + 1} ${i + 1}`).join('\n')}`
    ]
  },

  // Problem 62: Distinct Values in Range (Offline Fenwick)
  {
    title: 'Distinct Values in Range',
    slug: 'distinct-values-in-range',
    difficulty: 'Hard',
    tags: ['Fenwick Tree', 'Sorting', 'Arrays'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an array `nums` of `n` integers and `q` offline queries of the form `[left, right]`, determine the number of distinct values in the range `[left, right]` (0-based indexing) for each query.',
    input_format: 'The first line contains two integers `n` (array size) and `q` (number of queries).\nThe second line contains `n` space-separated integers.\nThe next `q` lines each contain two integers `left` and `right`.',
    output_format: 'For each query, print the number of distinct values on a new line.',
    constraints: '• 1 <= n, q <= 10^5\n• 0 <= nums[i] <= 10^9\n• 0 <= left <= right < n',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Answer offline distinct values queries using Fenwick tree

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

struct Query {
    int l, r, id;
};

struct FenwickTree {
    int n;
    vector<int> tree;
    FenwickTree(int n) : n(n), tree(n + 1, 0) {}
    void add(int i, int delta) {
        for (i++; i <= n; i += i & -i) tree[i] += delta;
    }
    int query(int i) {
        int sum = 0;
        for (i++; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    vector<Query> queries(q);
    for (int i = 0; i < q; i++) {
        cin >> queries[i].l >> queries[i].r;
        queries[i].id = i;
    }

    sort(queries.begin(), queries.end(), [](const Query& a, const Query& b) {
        return a.r < b.r;
    });

    FenwickTree bit(n);
    unordered_map<int, int> lastPos;
    vector<int> ans(q);

    int curR = 0;
    for (const auto& qry : queries) {
        while (curR <= qry.r) {
            int val = nums[curR];
            if (lastPos.count(val)) {
                bit.add(lastPos[val], -1);
            }
            bit.add(curR, 1);
            lastPos[val] = curR;
            curR++;
        }
        ans[qry.id] = bit.query(qry.r) - bit.query(qry.l - 1);
    }

    for (int i = 0; i < q; i++) {
        cout << ans[i] << "\\n";
    }
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <unordered_set>

using namespace std;

int main() {
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    while (q--) {
        int l, r;
        cin >> l >> r;
        unordered_set<int> s;
        for (int i = l; i <= r; i++) s.insert(a[i]);
        cout << s.size() << "\\n";
    }
    return 0;
}
`,
    brute_force_inputs: [
      '5 3\n1 2 1 3 4\n0 2\n1 4\n0 4',
      '3 2\n5 5 5\n0 2\n1 1'
    ],
    sample_inputs: [
      { input: '5 3\n1 2 1 3 4\n0 2\n1 4\n0 4', explanation: 'Range [0, 2] contains {1, 2} (2 distinct). Range [1, 4] contains {2, 1, 3, 4} (4 distinct). Range [0, 4] contains 4 distinct.' },
      { input: '3 2\n5 5 5\n0 2\n1 1', explanation: 'All elements are 5, so any range has 1 distinct element.' },
      { input: '1 1\n42\n0 0', explanation: 'Single element is 1 distinct value.' }
    ],
    hidden_inputs: [
      '4 2\n1 2 3 4\n0 3\n1 2',
      '5 3\n1 2 2 1 3\n0 1\n1 3\n0 4',
      '6 4\n10 20 10 30 20 40\n0 2\n1 4\n2 5\n0 5',
      '4 4\n0 0 0 0\n0 0\n0 1\n0 2\n0 3',
      '5 2\n1 10 100 1000 10000\n0 4\n2 3',
      '6 3\n5 4 3 2 1 0\n0 5\n2 4\n1 3',
      '7 4\n1 2 1 2 1 2 1\n0 6\n1 5\n2 3\n0 1',
      '8 3\n100 200 300 100 200 300 400 500\n0 7\n3 6\n1 4',
      '5 2\n1000000000 0 1000000000 0 5\n0 4\n1 3',
      `100000 10\n${Array.from({ length: 100000 }, (_, i) => i % 500).join(' ')}\n0 99999\n0 499\n500 999\n1000 5000\n20000 80000\n10 20\n0 0\n99999 99999\n100 300\n0 1000`
    ]
  },

  // Problem 63: Find Critical Connections in a Network (Tarjan Bridge)
  {
    title: 'Critical Connections in a Network',
    slug: 'critical-connections-in-a-network',
    difficulty: 'Hard',
    tags: ['Graph BFS/DFS', 'Tarjan'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'There are `n` servers numbered from `0` to `n - 1` connected by undirected server-to-server `connections` forming a connected network. A critical connection (bridge) is a connection that, if removed, will make some servers unable to reach some other server.\n\nReturn the total count of critical connections in the network.',
    input_format: 'The first line contains two integers `n` (number of servers) and `m` (number of connections).\nThe next `m` lines each contain two integers `u` and `v` representing a bidirectional cable between `u` and `v`.',
    output_format: 'Print a single integer denoting the number of critical connections (bridges).',
    constraints: '• 2 <= n <= 10^5\n• n - 1 <= m <= 2 * 10^5\n• 0 <= u, v < n, u != v\n• Network is connected with no duplicate edges.',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    // TODO: Find number of critical connections (bridges) using Tarjan's bridge finding algorithm

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

void dfs(int u, int p, int& timer, const vector<vector<int>>& adj, vector<int>& tin, vector<int>& low, int& bridgeCount) {
    tin[u] = low[u] = ++timer;
    for (int v : adj[u]) {
        if (v == p) continue;
        if (tin[v]) {
            low[u] = min(low[u], tin[v]);
        } else {
            dfs(v, u, timer, adj, tin, low, bridgeCount);
            low[u] = min(low[u], low[v]);
            if (low[v] > tin[u]) {
                bridgeCount++;
            }
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> tin(n, 0), low(n, 0);
    int timer = 0, bridgeCount = 0;

    dfs(0, -1, timer, adj, tin, low, bridgeCount);

    cout << bridgeCount << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

void dfs(int u, int p, int& timer, const vector<vector<int>>& adj, vector<int>& tin, vector<int>& low, int& bridges) {
    tin[u] = low[u] = ++timer;
    for (int v : adj[u]) {
        if (v == p) continue;
        if (tin[v]) low[u] = min(low[u], tin[v]);
        else {
            dfs(v, u, timer, adj, tin, low, bridges);
            low[u] = min(low[u], low[v]);
            if (low[v] > tin[u]) bridges++;
        }
    }
}

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    vector<int> tin(n, 0), low(n, 0);
    int timer = 0, bridges = 0;
    dfs(0, -1, timer, adj, tin, low, bridges);
    cout << bridges << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '4 4\n0 1\n1 2\n2 0\n1 3',
      '2 1\n0 1'
    ],
    sample_inputs: [
      { input: '4 4\n0 1\n1 2\n2 0\n1 3', explanation: 'Only edge (1, 3) is a bridge. Count = 1.' },
      { input: '2 1\n0 1', explanation: 'The single edge is a bridge. Count = 1.' },
      { input: '3 3\n0 1\n1 2\n2 0', explanation: 'Cycle has no bridges. Count = 0.' }
    ],
    hidden_inputs: [
      '3 2\n0 1\n1 2',
      '4 3\n0 1\n1 2\n2 3',
      '5 5\n0 1\n1 2\n2 0\n1 3\n3 4',
      '6 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3',
      '5 6\n0 1\n1 2\n2 3\n3 4\n4 0\n1 3',
      '6 7\n0 1\n1 2\n2 0\n2 3\n3 4\n4 5\n5 3',
      '7 6\n0 1\n0 2\n0 3\n0 4\n0 5\n0 6',
      '4 5\n0 1\n1 2\n2 3\n3 0\n0 2',
      '6 5\n0 1\n1 2\n2 3\n3 4\n4 5',
      `10000 10004\n${Array.from({ length: 9999 }, (_, i) => `${i} ${i + 1}`).concat(['0 2', '1 3', '2 4', '3 5', '5000 5002']).join('\n')}`
    ]
  },

  // Problem 64: Maximum Sum of 3 Non-Overlapping Subarrays
  {
    title: 'Maximum Sum of 3 Non-Overlapping Subarrays',
    slug: 'max-sum-3-non-overlapping-subarrays',
    difficulty: 'Hard',
    tags: ['Advanced DP', 'Prefix Sums', 'Arrays'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an integer array `nums` and an integer `k`, find three non-overlapping subarrays of length `k` with maximum total sum. Return the maximum total sum of these three subarrays.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated positive integers.',
    output_format: 'Print a single integer denoting the maximum total sum of the 3 subarrays.',
    constraints: '• 3 * k <= n <= 10^5\n• 1 <= k <= 10^5\n• 1 <= nums[i] <= 10^4',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find maximum total sum of 3 non-overlapping subarrays of length k

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int m = n - k + 1;
    vector<long long> w(m);
    long long curSum = 0;
    for (int i = 0; i < k; i++) curSum += nums[i];
    w[0] = curSum;
    for (int i = k; i < n; i++) {
        curSum += nums[i] - nums[i - k];
        w[i - k + 1] = curSum;
    }

    vector<int> left(m), right(m);
    int bestL = 0;
    for (int i = 0; i < m; i++) {
        if (w[i] > w[bestL]) bestL = i;
        left[i] = bestL;
    }

    int bestR = m - 1;
    for (int i = m - 1; i >= 0; i--) {
        if (w[i] >= w[bestR]) bestR = i;
        right[i] = bestR;
    }

    long long maxSum = 0;
    for (int j = k; j < m - k; j++) {
        int l = left[j - k];
        int r = right[j + k];
        long long total = w[l] + w[j] + w[r];
        maxSum = max(maxSum, total);
    }

    cout << maxSum << "\\n";
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
    for (int i = 0; i < n; i++) cin >> nums[i];
    int m = n - k + 1;
    vector<long long> w(m);
    long long s = 0;
    for (int i = 0; i < k; i++) s += nums[i];
    w[0] = s;
    for (int i = k; i < n; i++) { s += nums[i] - nums[i - k]; w[i - k + 1] = s; }
    vector<int> left(m), right(m);
    int bl = 0;
    for (int i = 0; i < m; i++) { if (w[i] > w[bl]) bl = i; left[i] = bl; }
    int br = m - 1;
    for (int i = m - 1; i >= 0; i--) { if (w[i] >= w[br]) br = i; right[i] = br; }
    long long ans = 0;
    for (int j = k; j < m - k; j++) {
        ans = max(ans, w[left[j - k]] + w[j] + w[right[j + k]]);
    }
    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '8 2\n1 2 1 2 6 7 5 1',
      '6 2\n1 2 1 2 1 2'
    ],
    sample_inputs: [
      { input: '8 2\n1 2 1 2 6 7 5 1', explanation: 'Subarrays [2, 1], [6, 7], and [5, 1] produce total sum 3 + 13 + 6 = 22 (or [1, 2], [6, 7], [5, 1] giving 3 + 13 + 6 = 22).' },
      { input: '6 2\n1 2 1 2 1 2', explanation: '3 subarrays [1, 2], [1, 2], [1, 2] give total sum 9.' },
      { input: '3 1\n10 20 30', explanation: 'Three non-overlapping elements of length 1 sum to 60.' }
    ],
    hidden_inputs: [
      '4 1\n5 10 15 20',
      '6 1\n1 2 3 4 5 6',
      '7 2\n1 3 2 4 1 5 6',
      '9 3\n1 1 1 2 2 2 3 3 3',
      '8 2\n10 1 10 1 10 1 10 1',
      '10 3\n5 1 2 6 8 2 1 7 9 3',
      '7 1\n100 200 300 400 500 600 700',
      '9 2\n4 2 5 1 6 3 7 0 8',
      '8 2\n1000 1000 1000 1000 1000 1000 1000 1000',
      `100000 1000\n${Array.from({ length: 100000 }, () => '10').join(' ')}`
    ]
  },

  // Problem 65: Range Minimum Query (Sparse Table / Segment Tree)
  {
    title: 'Range Minimum Query',
    slug: 'range-minimum-query',
    difficulty: 'Hard',
    tags: ['Segment Tree', 'Arrays'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an array `nums` of `n` integers and `q` queries of the form `[left, right]`, find the minimum element in the subarray `nums[left...right]` (0-based indexing).',
    input_format: 'The first line contains two integers `n` (array size) and `q` (number of queries).\nThe second line contains `n` space-separated integers.\nThe next `q` lines each contain two integers `left` and `right`.',
    output_format: 'For each query, print the minimum value in the range on a new line.',
    constraints: '• 1 <= n, q <= 10^5\n• -10^9 <= nums[i] <= 10^9\n• 0 <= left <= right < n',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Process static range minimum queries using Sparse Table in O(1) per query

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

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    int logN = 0;
    while ((1 << logN) <= n) logN++;

    vector<vector<int>> st(logN, vector<int>(n));
    for (int i = 0; i < n; i++) st[0][i] = a[i];

    for (int j = 1; (1 << j) <= n; j++) {
        for (int i = 0; i + (1 << j) <= n; i++) {
            st[j][i] = min(st[j - 1][i], st[j - 1][i + (1 << (j - 1))]);
        }
    }

    vector<int> lg(n + 1, 0);
    for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;

    while (q--) {
        int l, r;
        cin >> l >> r;
        int len = r - l + 1;
        int k = lg[len];
        int ans = min(st[k][l], st[k][r - (1 << k) + 1]);
        cout << ans << "\\n";
    }
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    while (q--) {
        int l, r; cin >> l >> r;
        int mn = a[l];
        for (int i = l; i <= r; i++) mn = min(mn, a[i]);
        cout << mn << "\\n";
    }
    return 0;
}
`,
    brute_force_inputs: [
      '5 3\n2 5 1 4 9\n0 4\n1 3\n0 1',
      '3 2\n10 10 10\n0 2\n1 1'
    ],
    sample_inputs: [
      { input: '5 3\n2 5 1 4 9\n0 4\n1 3\n0 1', explanation: 'Min in [0, 4] is 1; min in [1, 3] is 1; min in [0, 1] is 2.' },
      { input: '3 2\n10 10 10\n0 2\n1 1', explanation: 'All elements equal 10, minimum is 10.' },
      { input: '1 1\n-7\n0 0', explanation: 'Single element is -7.' }
    ],
    hidden_inputs: [
      '2 2\n5 -5\n0 1\n0 0',
      '4 4\n1 2 3 4\n0 3\n1 3\n2 3\n3 3',
      '5 3\n-10 -20 -30 -40 -50\n0 4\n1 3\n2 2',
      '6 4\n100 50 200 25 300 10\n0 5\n1 4\n2 4\n0 2',
      '5 2\n0 0 0 0 0\n0 4\n1 3',
      '7 4\n5 2 8 1 9 3 7\n0 6\n1 5\n2 4\n4 6',
      '4 2\n1000000000 -1000000000 0 500000000\n0 3\n2 3',
      '8 3\n9 8 7 6 5 4 3 2\n0 7\n2 5\n4 4',
      '5 3\n-5 5 -10 10 -15\n0 4\n1 3\n0 2',
      `100000 10\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}\n0 99999\n10 20\n5000 15000\n20000 80000\n0 0\n99999 99999\n100 500\n1000 2000\n50000 60000\n10000 90000`
    ]
  }
];
