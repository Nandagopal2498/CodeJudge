import { RawProblemDef } from '../utils/batchRunner.js';

export interface HardProblemDef extends RawProblemDef {
  brute_force_solution?: string;
  brute_force_inputs?: string[];
}

export const hardBatch1Raw: HardProblemDef[] = [
  // Problem 46: Range Sum Query - Mutable
  {
    title: 'Range Sum Query - Mutable',
    slug: 'range-sum-query-mutable',
    difficulty: 'Hard',
    tags: ['Segment Tree', 'Fenwick Tree', 'Arrays'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an integer array `nums` of length `n`, handle multiple queries of the following two types:\n1. `1 index val`: Update the value of `nums[index]` to `val` (0-based index).\n2. `2 left right`: Calculate and print the sum of the elements of `nums` between indices `left` and `right` inclusive (`nums[left] + nums[left + 1] + ... + nums[right]`).',
    input_format: 'The first line contains two integers `n` (array size) and `q` (number of queries).\nThe second line contains `n` space-separated integers representing `nums`.\nThe next `q` lines each represent a query: `1 index val` or `2 left right`.',
    output_format: 'For each query of type 2, print the range sum on a new line.',
    constraints: '• 1 <= n, q <= 10^5\n• -10^9 <= nums[i], val <= 10^9\n• 0 <= index, left <= right < n',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Process dynamic point updates and range sum queries using Fenwick or Segment Tree

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>

using namespace std;

struct FenwickTree {
    int n;
    vector<long long> tree;
    FenwickTree(int n) : n(n), tree(n + 1, 0) {}
    void add(int i, long long delta) {
        for (i++; i <= n; i += i & -i) tree[i] += delta;
    }
    long long query(int i) {
        long long sum = 0;
        for (i++; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
    long long range_query(int l, int r) {
        return query(r) - query(l - 1);
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<long long> nums(n);
    FenwickTree bit(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
        bit.add(i, nums[i]);
    }

    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int idx;
            long long val;
            cin >> idx >> val;
            bit.add(idx, val - nums[idx]);
            nums[idx] = val;
        } else {
            int l, r;
            cin >> l >> r;
            cout << bit.range_query(l, r) << "\\n";
        }
    }
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int idx;
            long long val;
            cin >> idx >> val;
            a[idx] = val;
        } else {
            int l, r;
            cin >> l >> r;
            long long sum = 0;
            for (int i = l; i <= r; i++) sum += a[i];
            cout << sum << "\\n";
        }
    }
    return 0;
}
`,
    brute_force_inputs: [
      '5 3\n1 2 3 4 5\n2 0 4\n1 2 10\n2 1 3',
      '3 4\n10 20 30\n2 0 2\n1 0 -5\n2 0 0\n2 0 2'
    ],
    sample_inputs: [
      { input: '5 3\n1 3 5 7 9\n2 0 2\n1 1 10\n2 1 3', explanation: 'Initial sum [0..2] is 1+3+5 = 9. After updating index 1 to 10, sum [1..3] is 10+5+7 = 22.' },
      { input: '3 3\n1 2 3\n2 0 2\n1 2 -5\n2 0 2', explanation: 'Sum is 6. After setting index 2 to -5, sum is 1+2+(-5) = -2.' },
      { input: '1 2\n10\n2 0 0\n1 0 25', explanation: 'Single element range query returns 10.' }
    ],
    hidden_inputs: [
      '2 3\n10 20\n2 0 1\n1 0 50\n2 0 1',
      '4 5\n0 0 0 0\n2 0 3\n1 1 5\n1 3 10\n2 0 3\n2 2 3',
      '5 4\n-10 -20 -30 -40 -50\n2 0 4\n1 2 30\n2 0 4\n2 2 2',
      '6 6\n1 2 3 4 5 6\n2 1 4\n1 0 100\n1 5 -100\n2 0 5\n1 3 0\n2 2 4',
      '5 5\n1000000000 1000000000 1000000000 1000000000 1000000000\n2 0 4\n1 2 -1000000000\n2 0 4\n1 0 0\n2 0 1',
      '7 4\n5 5 5 5 5 5 5\n2 0 6\n1 3 10\n2 2 4\n2 0 6',
      '4 4\n-5 5 -10 10\n2 0 3\n1 1 -5\n2 0 2\n2 1 3',
      '6 5\n2 4 8 16 32 64\n2 0 5\n1 5 0\n2 0 5\n1 0 0\n2 0 5',
      '8 6\n1 0 1 0 1 0 1 0\n2 0 7\n1 1 1\n1 3 1\n2 0 3\n1 5 1\n2 0 7',
      `100000 10\n${Array.from({ length: 100000 }, (_, i) => i + 1).join(' ')}\n2 0 99999\n1 50000 0\n2 0 99999\n1 0 100000\n2 0 0\n2 99999 99999\n1 99999 0\n2 0 99999\n2 25000 75000\n2 100 200`
    ]
  },

  // Problem 47: Shortest Path in Weighted Graph (Dijkstra)
  {
    title: 'Shortest Path in Weighted Graph',
    slug: 'shortest-path-in-weighted-graph',
    difficulty: 'Hard',
    tags: ['Dijkstra', 'Graph BFS/DFS', 'Heap'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'You are given a directed, weighted graph with `n` vertices labeled from `1` to `n` and `m` edges with non-negative weights. Find the length of the shortest path from vertex `1` to vertex `n`. If no path exists from vertex `1` to vertex `n`, print `-1`.',
    input_format: 'The first line contains two integers `n` (number of vertices) and `m` (number of directed edges).\nThe next `m` lines each contain three integers `u`, `v`, and `w` indicating a directed edge from `u` to `v` with weight `w`.',
    output_format: 'Print a single integer representing the shortest path length from 1 to n, or -1 if unreachable.',
    constraints: '• 2 <= n <= 10^5\n• 0 <= m <= 2 * 10^5\n• 1 <= u, v <= n\n• 0 <= w <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    // TODO: Implement Dijkstra's algorithm to find shortest path from 1 to n

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

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }

    const long long INF = 2e18;
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;

    dist[1] = 0;
    pq.push({0, 1});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;
        if (u == n) break;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            long long w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    cout << (dist[n] == INF ? -1 : dist[n]) << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v; long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }
    const long long INF = 2e18;
    vector<long long> dist(n + 1, INF);
    dist[1] = 0;
    for (int iter = 0; iter < n - 1; iter++) {
        for (int u = 1; u <= n; u++) {
            if (dist[u] == INF) continue;
            for (auto& edge : adj[u]) {
                int v = edge.first; long long w = edge.second;
                if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
            }
        }
    }
    cout << (dist[n] == INF ? -1 : dist[n]) << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '4 4\n1 2 2\n2 4 5\n1 3 1\n3 4 3',
      '3 1\n1 2 5'
    ],
    sample_inputs: [
      { input: '4 4\n1 2 2\n2 4 5\n1 3 1\n3 4 3', explanation: 'Path 1->3->4 has total cost 1 + 3 = 4, which is strictly less than 1->2->4 (cost 7).' },
      { input: '3 1\n1 2 5', explanation: 'Vertex 3 is disconnected and unreachable from 1, returns -1.' },
      { input: '2 1\n1 2 10', explanation: 'Direct edge 1->2 has cost 10.' }
    ],
    hidden_inputs: [
      '2 0\n',
      '3 2\n1 2 10\n2 3 20',
      '4 5\n1 2 1\n2 3 2\n3 4 3\n1 4 10\n2 4 4',
      '5 6\n1 2 4\n1 3 2\n2 3 1\n2 4 5\n3 5 8\n4 5 1',
      '4 3\n1 2 0\n2 3 0\n3 4 0',
      '5 4\n1 2 1000000000\n2 3 1000000000\n3 4 1000000000\n4 5 1000000000',
      '6 6\n1 2 3\n2 3 4\n4 5 2\n5 6 1\n1 4 8\n3 6 15',
      '5 2\n1 2 3\n4 5 6',
      '7 8\n1 2 2\n1 3 4\n2 4 7\n3 5 3\n4 6 1\n5 6 5\n6 7 2\n2 5 1',
      `100000 99999\n${Array.from({ length: 99999 }, (_, i) => `${i + 1} ${i + 2} 10`).join('\n')}`
    ]
  },

  // Problem 48: Course Schedule II (Topological Sort)
  {
    title: 'Course Schedule II',
    slug: 'course-schedule-ii',
    difficulty: 'Hard',
    tags: ['Topological Sort', 'Graph BFS/DFS'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates that you must take course `b` first if you want to take course `a`.\n\nReturn the ordering of courses you should take to finish all courses. If there are multiple valid answers, print the lexicographically smallest order. If it is impossible to finish all courses (due to a cycle), print `IMPOSSIBLE`.',
    input_format: 'The first line contains two integers `numCourses` and `m` (number of prerequisites).\nThe next `m` lines each contain two integers `a` and `b` meaning course `b` is a prerequisite for `a` (directed edge `b -> a`).',
    output_format: 'Print the lexicographically smallest valid topological sequence of courses separated by spaces, or IMPOSSIBLE.',
    constraints: '• 1 <= numCourses <= 10^5\n• 0 <= m <= 2 * 10^5\n• 0 <= a, b < numCourses, a != b\n• All directed edges (b, a) are unique.',
    starter_code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    // TODO: Determine lexicographically smallest topological sort or print IMPOSSIBLE

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

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<vector<int>> adj(n);
    vector<int> inDegree(n, 0);

    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        adj[b].push_back(a);
        inDegree[a]++;
    }

    // Min-heap priority queue for lexicographically smallest order (Kahn's algorithm)
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) pq.push(i);
    }

    vector<int> order;
    while (!pq.empty()) {
        int u = pq.top();
        pq.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            inDegree[v]--;
            if (inDegree[v] == 0) pq.push(v);
        }
    }

    if ((int)order.size() != n) {
        cout << "IMPOSSIBLE\\n";
    } else {
        for (int i = 0; i < n; i++) {
            cout << order[i] << (i + 1 == n ? "" : " ");
        }
        cout << "\\n";
    }
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<int>> adj(n);
    vector<int> inDegree(n, 0);
    for (int i = 0; i < m; i++) {
        int a, b; cin >> a >> b;
        adj[b].push_back(a);
        inDegree[a]++;
    }
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < n; i++) if (inDegree[i] == 0) pq.push(i);
    vector<int> order;
    while (!pq.empty()) {
        int u = pq.top(); pq.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) pq.push(v);
        }
    }
    if ((int)order.size() != n) cout << "IMPOSSIBLE\\n";
    else {
        for (int i = 0; i < n; i++) cout << order[i] << (i + 1 == n ? "" : " ");
        cout << "\\n";
    }
    return 0;
}
`,
    brute_force_inputs: [
      '2 1\n1 0',
      '2 2\n1 0\n0 1'
    ],
    sample_inputs: [
      { input: '2 1\n1 0', explanation: 'Course 0 must be taken before course 1. Order: 0 1.' },
      { input: '4 4\n1 0\n2 0\n3 1\n3 2', explanation: 'Both 0 1 2 3 and 0 2 1 3 are valid, but 0 1 2 3 is lexicographically smaller.' },
      { input: '2 2\n1 0\n0 1', explanation: 'Circular dependency between 0 and 1 makes it IMPOSSIBLE.' }
    ],
    hidden_inputs: [
      '1 0\n',
      '3 0\n',
      '3 2\n1 0\n2 1',
      '3 3\n0 1\n1 2\n2 0',
      '4 2\n2 1\n3 0',
      '5 4\n1 0\n2 0\n3 1\n4 2',
      '6 6\n1 0\n2 0\n3 1\n4 2\n5 3\n5 4',
      '4 4\n1 0\n2 1\n3 2\n0 3',
      '5 3\n4 3\n3 2\n2 1',
      `100000 99999\n${Array.from({ length: 99999 }, (_, i) => `${i + 1} ${i}`).join('\n')}`
    ]
  },

  // Problem 49: Prefix and Suffix Search (Trie)
  {
    title: 'Prefix and Suffix Search',
    slug: 'prefix-and-suffix-search',
    difficulty: 'Hard',
    tags: ['Trie', 'Strings', 'Hashmap'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Design a system that accepts a dictionary of `n` words and answers queries searching for words matching a specified prefix `pref` and suffix `suff`.\n\nFor each query `pref suff`, output the count of words in the dictionary that have `pref` as a prefix and `suff` as a suffix.',
    input_format: 'The first line contains two integers `n` (words in dictionary) and `q` (number of queries).\nThe next `n` lines each contain a single word consisting of lowercase English letters.\nThe following `q` lines each contain two space-separated strings `pref` and `suff`.',
    output_format: 'For each query, print the count of matching dictionary words on a new line.',
    constraints: '• 1 <= n, q <= 50000\n• 1 <= |word| <= 20\n• 1 <= |pref|, |suff| <= 20\n• All characters are lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    // TODO: Process prefix-suffix search queries efficiently

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

// Pair hash for unordered_map
struct PairHash {
    size_t operator()(const pair<string, string>& p) const {
        return hash<string>()(p.first) ^ (hash<string>()(p.second) << 1);
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<string> words(n);
    for (int i = 0; i < n; i++) cin >> words[i];

    // For queries, process directly using string operations or memoization
    unordered_map<pair<string, string>, int, PairHash> memo;

    for (int k = 0; k < q; k++) {
        string pref, suff;
        cin >> pref >> suff;
        auto key = make_pair(pref, suff);
        if (memo.count(key)) {
            cout << memo[key] << "\\n";
            continue;
        }

        int count = 0;
        int pLen = pref.length(), sLen = suff.length();
        for (const string& w : words) {
            int wLen = w.length();
            if (wLen >= pLen && wLen >= sLen) {
                if (w.compare(0, pLen, pref) == 0 && w.compare(wLen - sLen, sLen, suff) == 0) {
                    count++;
                }
            }
        }
        memo[key] = count;
        cout << count << "\\n";
    }
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<string> words(n);
    for (int i = 0; i < n; i++) cin >> words[i];
    while (q--) {
        string pref, suff;
        cin >> pref >> suff;
        int count = 0;
        for (auto& w : words) {
            if (w.size() >= pref.size() && w.size() >= suff.size()) {
                if (w.substr(0, pref.size()) == pref && w.substr(w.size() - suff.size()) == suff) {
                    count++;
                }
            }
        }
        cout << count << "\\n";
    }
    return 0;
}
`,
    brute_force_inputs: [
      '3 2\napple\napplet\naple\napp e\nap le'
    ],
    sample_inputs: [
      { input: '3 2\napple\napplet\naple\napp e\nap le', explanation: '"apple" has prefix "app" and suffix "e" (1 match). "apple" and "aple" both have prefix "ap" and suffix "le" (2 matches).' },
      { input: '2 1\nbanana\nbandana\nba na', explanation: 'Both "banana" and "bandana" match prefix "ba" and suffix "na" (2 matches).' },
      { input: '1 1\ncat\ndog cat', explanation: 'No word starts with "dog", returns 0.' }
    ],
    hidden_inputs: [
      '1 2\nhello\nh o\nhe lo',
      '2 2\ncode\njudge\nco de\nju ge',
      '4 3\na\naa\naaa\naaaa\na a\naa a\na aa',
      '5 2\nabcde\nabc\nab\na\nabcde\na e\nab de',
      '3 3\ntest\ntesting\ntester\nt est\nt ing\nte r',
      '4 2\nprogramming\nprogram\nprogress\nproject\npro m\npro s',
      '5 3\nworld\nword\nworm\nworn\nwork\nw d\nwo rd\nw m',
      '2 2\nxyz\nabc\na c\nx z',
      '3 1\napple\na e',
      `1000 10\n${Array.from({ length: 1000 }, (_, i) => `item${i}tag`).join('\n')}\nitem tag\nitem0 tag\nitem1 tag\nitem999 tag\nit tag\ni g\nit ag\nx y\nitem00 tag\nitem tag`
    ]
  },

  // Problem 50: Minimum Spanning Tree (Kruskal)
  {
    title: 'Minimum Spanning Tree Weight',
    slug: 'minimum-spanning-tree-weight',
    difficulty: 'Hard',
    tags: ['MST', 'Union-Find', 'Greedy', 'Sorting'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an undirected connected weighted graph with `n` vertices labeled `1` to `n` and `m` edges, find the total weight of its Minimum Spanning Tree (MST) using Kruskal\'s or Prim\'s algorithm.',
    input_format: 'The first line contains two integers `n` (number of vertices) and `m` (number of edges).\nThe next `m` lines each contain three integers `u`, `v`, and `w` representing an undirected edge between `u` and `v` with weight `w`.',
    output_format: 'Print a single integer denoting the sum of weights of the minimum spanning tree.',
    constraints: '• 1 <= n <= 10^5\n• n - 1 <= m <= 2 * 10^5\n• 1 <= u, v <= n\n• -10^9 <= w <= 10^9\n• The graph is connected.',
    starter_code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    // TODO: Compute the total weight of the Minimum Spanning Tree

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Edge {
    int u, v;
    long long w;
};

struct DSU {
    vector<int> parent;
    DSU(int n) : parent(n + 1) {
        for (int i = 0; i <= n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    bool unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) {
            parent[root_i] = root_j;
            return true;
        }
        return false;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<Edge> edges(m);
    for (int i = 0; i < m; i++) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
    }

    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
        return a.w < b.w;
    });

    DSU dsu(n);
    long long totalWeight = 0;
    int edgesCount = 0;

    for (const auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            totalWeight += e.w;
            edgesCount++;
            if (edgesCount == n - 1) break;
        }
    }

    cout << totalWeight << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Edge { int u, v; long long w; };
struct DSU {
    vector<int> p;
    DSU(int n): p(n + 1) { for(int i=0; i<=n; i++) p[i]=i; }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra != rb) { p[ra] = rb; return true; }
        return false;
    }
};

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Edge> edges(m);
    for (int i = 0; i < m; i++) cin >> edges[i].u >> edges[i].v >> edges[i].w;
    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a.w < b.w; });
    DSU dsu(n);
    long long ans = 0;
    int cnt = 0;
    for (auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            ans += e.w;
            if (++cnt == n - 1) break;
        }
    }
    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '4 5\n1 2 1\n1 3 4\n2 3 2\n2 4 5\n3 4 3'
    ],
    sample_inputs: [
      { input: '4 5\n1 2 1\n1 3 4\n2 3 2\n2 4 5\n3 4 3', explanation: 'Edges (1, 2, 1), (2, 3, 2), and (3, 4, 3) form the MST with total weight 1 + 2 + 3 = 6.' },
      { input: '3 3\n1 2 5\n2 3 5\n1 3 10', explanation: 'Edges (1, 2) and (2, 3) form MST with total weight 5 + 5 = 10.' },
      { input: '2 1\n1 2 -5', explanation: 'Negative edge weight is preserved: -5.' }
    ],
    hidden_inputs: [
      '1 0\n',
      '3 2\n1 2 10\n2 3 20',
      '4 4\n1 2 1\n2 3 2\n3 4 3\n4 1 4',
      '5 6\n1 2 2\n2 3 3\n3 4 1\n4 5 5\n1 5 10\n2 4 4',
      '5 4\n1 2 -100\n2 3 -200\n3 4 -300\n4 5 -400',
      '6 7\n1 2 5\n2 3 6\n3 4 2\n4 5 8\n5 6 1\n1 6 12\n2 5 7',
      '4 6\n1 2 1\n1 3 1\n1 4 1\n2 3 2\n2 4 2\n3 4 2',
      '5 7\n1 2 1000000000\n2 3 1000000000\n3 4 1000000000\n4 5 1000000000\n1 3 500000000\n2 4 500000000\n3 5 500000000',
      '6 5\n1 2 0\n2 3 0\n3 4 0\n4 5 0\n5 6 0',
      `100000 99999\n${Array.from({ length: 99999 }, (_, i) => `${i + 1} ${i + 2} ${i + 1}`).join('\n')}`
    ]
  }
];
