import { HardProblemDef } from './hardBatch1.js';

export const hardBatch3Raw: HardProblemDef[] = [
  // Problem 56: Traveling Salesperson Problem (Bitmask DP)
  {
    title: 'Traveling Salesperson Problem',
    slug: 'traveling-salesperson-problem',
    difficulty: 'Hard',
    tags: ['Bitmask DP', 'Dynamic Programming', 'Graph BFS/DFS'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given `n` cities and an `n x n` cost matrix `dist` where `dist[i][j]` is the cost to travel from city `i` to city `j`, find the minimum cost to visit every city exactly once and return back to the starting city `0`.\n\nYou should use a bitmask DP solution with `O(n^2 * 2^n)` complexity.',
    input_format: 'The first line contains an integer `n` (number of cities).\nThe next `n` lines each contain `n` space-separated integers representing the cost matrix.',
    output_format: 'Print a single integer denoting the minimum total tour cost.',
    constraints: '• 2 <= n <= 16\n• 0 <= dist[i][j] <= 10^6\n• dist[i][i] == 0',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> dist(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> dist[i][j];

    // TODO: Compute minimum TSP Hamiltonian cycle cost using Bitmask DP

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

    vector<vector<int>> dist(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> dist[i][j];

    int fullMask = (1 << n);
    const int INF = 1e9;
    vector<vector<int>> dp(fullMask, vector<int>(n, INF));

    // Starting at city 0 with mask containing {0}
    dp[1][0] = 0;

    for (int mask = 1; mask < fullMask; mask++) {
        for (int u = 0; u < n; u++) {
            if (dp[mask][u] == INF) continue;

            for (int v = 0; v < n; v++) {
                if (!(mask & (1 << v))) {
                    int nextMask = mask | (1 << v);
                    dp[nextMask][v] = min(dp[nextMask][v], dp[mask][u] + dist[u][v]);
                }
            }
        }
    }

    int minCost = INF;
    for (int u = 0; u < n; u++) {
        if (dp[fullMask - 1][u] != INF) {
            minCost = min(minCost, dp[fullMask - 1][u] + dist[u][0]);
        }
    }

    cout << minCost << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> dist(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> dist[i][j];

    vector<int> p(n - 1);
    iota(p.begin(), p.end(), 1);
    int ans = 1e9;
    do {
        int cur = dist[0][p[0]];
        for (size_t i = 0; i < p.size() - 1; i++) cur += dist[p[i]][p[i+1]];
        cur += dist[p.back()][0];
        ans = min(ans, cur);
    } while (next_permutation(p.begin(), p.end()));
    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0',
      '3\n0 1 2\n1 0 3\n2 3 0'
    ],
    sample_inputs: [
      { input: '4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0', explanation: 'Tour 0 -> 1 -> 3 -> 2 -> 0 has cost 10 + 25 + 30 + 15 = 80.' },
      { input: '3\n0 1 2\n1 0 3\n2 3 0', explanation: 'Tour 0 -> 1 -> 2 -> 0 has cost 1 + 3 + 2 = 6.' },
      { input: '2\n0 5\n5 0', explanation: 'Cost 0 -> 1 -> 0 is 5 + 5 = 10.' }
    ],
    hidden_inputs: [
      '2\n0 100\n100 0',
      '3\n0 10 20\n10 0 15\n20 15 0',
      '4\n0 1 2 3\n1 0 4 5\n2 4 0 6\n3 5 6 0',
      '5\n0 2 9 3 6\n2 0 4 3 8\n9 4 0 7 3\n3 3 7 0 4\n6 8 3 4 0',
      '4\n0 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0',
      '5\n0 10 20 30 40\n10 0 15 25 35\n20 15 0 12 22\n30 25 12 0 18\n40 35 22 18 0',
      '6\n0 1 2 3 4 5\n1 0 2 3 4 5\n2 2 0 3 4 5\n3 3 3 0 4 5\n4 4 4 4 0 5\n5 5 5 5 5 0',
      '5\n0 100 200 300 400\n100 0 100 200 300\n200 100 0 100 200\n300 200 100 0 100\n400 300 200 100 0',
      '6\n0 5 10 15 20 25\n5 0 5 10 15 20\n10 5 0 5 10 15\n15 10 5 0 5 10\n20 15 10 5 0 5\n25 20 15 10 5 0',
      `14\n${Array.from({ length: 14 }, (_, i) => Array.from({ length: 14 }, (_, j) => (i === j ? 0 : (Math.abs(i - j) * 7 + (i * j) % 11))).join(' ')).join('\n')}`
    ]
  },

  // Problem 57: Distinct Subsequences (Advanced DP)
  {
    title: 'Distinct Subsequences',
    slug: 'distinct-subsequences',
    difficulty: 'Hard',
    tags: ['Advanced DP', 'Strings'],
    points: 350,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equals `t`.\n\nSince the answer may be very large, print the result modulo `1000000007` (10^9 + 7).',
    input_format: 'The first line contains string `s`.\nThe second line contains string `t`.',
    output_format: 'Print the count modulo 1000000007.',
    constraints: '• 1 <= |s| <= 5000\n• 1 <= |t| <= 5000\n• s and t consist of lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s, t;
    if (!(cin >> s >> t)) return 0;

    // TODO: Compute distinct subsequences of s that equal t modulo 10^9 + 7

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

    int n = s.length(), m = t.length();
    if (m > n) {
        cout << 0 << "\\n";
        return 0;
    }

    const int MOD = 1000000007;
    vector<int> dp(m + 1, 0);
    dp[0] = 1;

    for (int i = 0; i < n; i++) {
        for (int j = m - 1; j >= 0; j--) {
            if (s[i] == t[j]) {
                dp[j + 1] = (dp[j + 1] + dp[j]) % MOD;
            }
        }
    }

    cout << dp[m] << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    string s, t;
    if (!(cin >> s >> t)) return 0;
    int n = s.size(), m = t.size();
    vector<int> dp(m + 1, 0);
    dp[0] = 1;
    for (char c : s) {
        for (int j = m - 1; j >= 0; j--) {
            if (c == t[j]) dp[j + 1] = (dp[j + 1] + dp[j]) % 1000000007;
        }
    }
    cout << dp[m] << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      'rabbbit\nrabbit',
      'babgbag\nbag'
    ],
    sample_inputs: [
      { input: 'rabbbit\nrabbit', explanation: 'There are 3 ways you can generate "rabbit" from "rabbbit".' },
      { input: 'babgbag\nbag', explanation: 'There are 5 ways you can generate "bag" from "babgbag".' },
      { input: 'abc\nd', explanation: '"d" does not appear in "abc", returns 0.' }
    ],
    hidden_inputs: [
      'a\na',
      'a\nb',
      'aaaa\naa',
      'codejudge\ncode',
      'mississippi\nissi',
      'abacabadabacaba\nabacaba',
      'banana\nan',
      'abcdef\nabcdef',
      'zzzzzzzzzz\nzzz',
      `${'a'.repeat(5000)}\n${'a'.repeat(2500)}`
    ]
  },

  // Problem 58: Longest Duplicate Substring (Rolling Hash)
  {
    title: 'Longest Duplicate Substring Length',
    slug: 'longest-duplicate-substring-length',
    difficulty: 'Hard',
    tags: ['Strings', 'Hashing', 'Binary Search on Answer'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given a string `s`, consider all duplicated substrings: substrings of `s` that occur 2 or more times (the occurrences may overlap).\n\nReturn the length of the longest duplicated substring. If no such substring exists, return 0.',
    input_format: 'A single line containing the string `s` consisting of lowercase English letters.',
    output_format: 'Print a single integer denoting the length of the longest duplicate substring.',
    constraints: '• 2 <= |s| <= 10^5\n• s consists of lowercase English letters.',
    starter_code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    // TODO: Find length of longest duplicated substring using Binary Search + Rolling Hash

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <string>
#include <vector>
#include <unordered_set>

using namespace std;

const long long MOD = 1000000007;
const long long BASE = 31;

bool hasDup(const string& s, int len) {
    int n = s.length();
    long long hashVal = 0, power = 1;
    for (int i = 0; i < len; i++) {
        hashVal = (hashVal * BASE + (s[i] - 'a' + 1)) % MOD;
        if (i < len - 1) power = (power * BASE) % MOD;
    }

    unordered_set<long long> seen;
    seen.insert(hashVal);

    for (int i = len; i < n; i++) {
        hashVal = (hashVal - (s[i - len] - 'a' + 1) * power) % MOD;
        if (hashVal < 0) hashVal += MOD;
        hashVal = (hashVal * BASE + (s[i] - 'a' + 1)) % MOD;

        if (seen.count(hashVal)) return true;
        seen.insert(hashVal);
    }
    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    int n = s.length();
    int low = 1, high = n - 1;
    int ans = 0;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (hasDup(s, mid)) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <string>
#include <unordered_set>

using namespace std;

int main() {
    string s;
    if (!(cin >> s)) return 0;
    int n = s.size();
    for (int len = n - 1; len >= 1; len--) {
        unordered_set<string> seen;
        for (int i = 0; i <= n - len; i++) {
            string sub = s.substr(i, len);
            if (seen.count(sub)) {
                cout << len << "\\n";
                return 0;
            }
            seen.insert(sub);
        }
    }
    cout << 0 << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      'banana',
      'abcd'
    ],
    sample_inputs: [
      { input: 'banana', explanation: '"ana" appears twice (length 3).' },
      { input: 'abcd', explanation: 'No substring appears more than once, returns 0.' },
      { input: 'aa', explanation: '"a" appears twice, returns 1.' }
    ],
    hidden_inputs: [
      'abacaba',
      'aaaaa',
      'abcdefgabcdefg',
      'mississippi',
      'xyzxyz',
      'aababa',
      'zxywvt',
      'abracadabra',
      'codejudgecodejudge',
      `${'abcde'.repeat(20000)}`
    ]
  },

  // Problem 59: Shortest Path Visiting All Nodes (BFS with Bitmask)
  {
    title: 'Shortest Path Visiting All Nodes',
    slug: 'shortest-path-visiting-all-nodes',
    difficulty: 'Hard',
    tags: ['Graph BFS/DFS', 'Bitmask DP'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'You have an undirected connected graph of `n` nodes labeled from `0` to `n - 1`. You are given an integer `n` and an array of `m` undirected edges. Return the length of the shortest path that visits every node.\n\nYou may start and stop at any node, you may revisit nodes multiple times, and you may reuse edges.',
    input_format: 'The first line contains two integers `n` (number of nodes) and `m` (number of edges).\nThe next `m` lines each contain two integers `u` and `v` representing an undirected edge.',
    output_format: 'Print a single integer denoting the shortest path length visiting all nodes.',
    constraints: '• 1 <= n <= 12\n• n - 1 <= m <= n * (n - 1) / 2\n• Graph is connected.',
    starter_code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    // TODO: Find shortest path visiting all nodes via BFS state (node, visited_mask)

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

struct State {
    int u, mask, dist;
};

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

    if (n == 1) {
        cout << 0 << "\\n";
        return 0;
    }

    int targetMask = (1 << n) - 1;
    vector<vector<bool>> visited(n, vector<bool>(1 << n, false));
    queue<State> q;

    for (int i = 0; i < n; i++) {
        q.push({i, 1 << i, 0});
        visited[i][1 << i] = true;
    }

    while (!q.empty()) {
        auto [u, mask, dist] = q.front();
        q.pop();

        if (mask == targetMask) {
            cout << dist << "\\n";
            return 0;
        }

        for (int v : adj[u]) {
            int nextMask = mask | (1 << v);
            if (!visited[v][nextMask]) {
                visited[v][nextMask] = true;
                q.push({v, nextMask, dist + 1});
            }
        }
    }

    cout << 0 << "\\n";
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
    if (n == 1) { cout << 0 << "\\n"; return 0; }
    vector<vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    queue<pair<int, int>> q;
    vector<vector<int>> dist(n, vector<int>(1 << n, -1));
    for (int i = 0; i < n; i++) {
        q.push({i, 1 << i});
        dist[i][1 << i] = 0;
    }
    int target = (1 << n) - 1;
    while (!q.empty()) {
        auto [u, mask] = q.front(); q.pop();
        int d = dist[u][mask];
        if (mask == target) { cout << d << "\\n"; return 0; }
        for (int v : adj[u]) {
            int nmask = mask | (1 << v);
            if (dist[v][nmask] == -1) {
                dist[v][nmask] = d + 1;
                q.push({v, nmask});
            }
        }
    }
    return 0;
}
`,
    brute_force_inputs: [
      '4 4\n0 1\n0 2\n0 3\n1 2',
      '4 3\n1 0\n2 0\n3 0'
    ],
    sample_inputs: [
      { input: '4 4\n0 1\n0 2\n0 3\n1 2', explanation: 'One path is [1, 0, 3, 0, 2] with 4 edges.' },
      { input: '4 3\n1 0\n2 0\n3 0', explanation: 'Star graph with center 0 requires 4 moves (e.g. 1-0-2-0-3).' },
      { input: '1 0\n', explanation: 'Single node requires 0 steps.' }
    ],
    hidden_inputs: [
      '2 1\n0 1',
      '3 2\n0 1\n1 2',
      '3 3\n0 1\n1 2\n2 0',
      '5 4\n0 1\n1 2\n2 3\n3 4',
      '5 5\n0 1\n1 2\n2 3\n3 4\n4 0',
      '6 5\n0 1\n0 2\n0 3\n0 4\n0 5',
      '6 7\n0 1\n1 2\n2 3\n3 4\n4 5\n0 3\n2 5',
      '7 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6',
      '8 7\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n0 7',
      '12 11\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6\n6 7\n7 8\n8 9\n9 10\n10 11'
    ]
  },

  // Problem 60: Trapping Rain Water II (2D Heap)
  {
    title: 'Trapping Rain Water II',
    slug: 'trapping-rain-water-ii',
    difficulty: 'Hard',
    tags: ['Heap', 'Graph BFS/DFS', 'Arrays'],
    points: 400,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an `m x n` integer matrix `heightMap` representing the height of each unit cell in a 2D elevation map, return the volume of water it can trap after raining.',
    input_format: 'The first line contains two integers `m` and `n`.\nThe next `m` lines each contain `n` space-separated integers.',
    output_format: 'Print a single integer representing the total trapped water volume.',
    constraints: '• 1 <= m, n <= 200\n• 0 <= heightMap[i][j] <= 2 * 10^4',
    starter_code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<vector<int>> grid(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> grid[i][j];

    // TODO: Calculate 2D trapped water volume using a min-heap from boundaries

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

struct Cell {
    int h, r, c;
    bool operator>(const Cell& o) const {
        return h > o.h;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int m, n;
    if (!(cin >> m >> n)) return 0;

    vector<vector<int>> grid(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> grid[i][j];

    if (m <= 2 || n <= 2) {
        cout << 0 << "\\n";
        return 0;
    }

    priority_queue<Cell, vector<Cell>, greater<Cell>> pq;
    vector<vector<bool>> visited(m, vector<bool>(n, false));

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 || i == m - 1 || j == 0 || j == n - 1) {
                pq.push({grid[i][j], i, j});
                visited[i][j] = true;
            }
        }
    }

    long long trapped = 0;
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};

    while (!pq.empty()) {
        auto [h, r, c] = pq.top();
        pq.pop();

        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d];
            int nc = c + dc[d];

            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
                visited[nr][nc] = true;
                if (grid[nr][nc] < h) {
                    trapped += (h - grid[nr][nc]);
                }
                pq.push({max(h, grid[nr][nc]), nr, nc});
            }
        }
    }

    cout << trapped << "\\n";
    return 0;
}
`,
    brute_force_solution: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<vector<int>> g(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) cin >> g[i][j];
    if (m <= 2 || n <= 2) { cout << 0 << "\\n"; return 0; }
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<tuple<int,int,int>>> pq;
    vector<vector<bool>> vis(m, vector<bool>(n, false));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 || i == m - 1 || j == 0 || j == n - 1) {
                pq.push({g[i][j], i, j});
                vis[i][j] = true;
            }
        }
    }
    long long ans = 0;
    int dr[] = {0,0,1,-1}, dc[] = {1,-1,0,0};
    while (!pq.empty()) {
        auto [h, r, c] = pq.top(); pq.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !vis[nr][nc]) {
                vis[nr][nc] = true;
                if (g[nr][nc] < h) ans += (h - g[nr][nc]);
                pq.push({max(h, g[nr][nc]), nr, nc});
            }
        }
    }
    cout << ans << "\\n";
    return 0;
}
`,
    brute_force_inputs: [
      '3 6\n1 4 3 1 3 2\n3 2 1 3 2 4\n2 3 3 2 3 1',
      '3 3\n12 13 1 12\n13 4 13\n12 13 12'
    ],
    sample_inputs: [
      { input: '3 6\n1 4 3 1 3 2\n3 2 1 3 2 4\n2 3 3 2 3 1', explanation: 'Total trapped water capacity is 4.' },
      { input: '3 3\n3 3 3\n3 1 3\n3 3 3', explanation: 'Center cell is surrounded by walls of height 3, traps 3 - 1 = 2 units.' },
      { input: '2 2\n5 5\n5 5', explanation: 'Boundary only, 0 water trapped.' }
    ],
    hidden_inputs: [
      '1 1\n5',
      '3 3\n1 1 1\n1 1 1\n1 1 1',
      '4 4\n5 5 5 5\n5 2 2 5\n5 2 2 5\n5 5 5 5',
      '4 5\n10 10 10 10 10\n10 5 0 5 10\n10 5 2 5 10\n10 10 10 10 10',
      '5 5\n9 9 9 9 9\n9 1 1 1 9\n9 1 5 1 9\n9 1 1 1 9\n9 9 9 9 9',
      '3 4\n4 4 4 4\n4 1 2 4\n4 4 4 4',
      '6 6\n8 8 8 8 8 8\n8 3 3 3 3 8\n8 3 1 1 3 8\n8 3 1 1 3 8\n8 3 3 3 3 8\n8 8 8 8 8 8',
      '4 4\n12 13 1 12\n13 4 13 12\n13 8 10 12\n12 13 12 12',
      '5 4\n1 2 3 4\n5 0 0 6\n7 0 0 8\n9 10 11 12\n13 14 15 16',
      `200 200\n${Array.from({ length: 200 }, (_, r) => Array.from({ length: 200 }, (_, c) => (r === 0 || r === 199 || c === 0 || c === 199 ? '100' : '10')).join(' ')).join('\n')}`
    ]
  }
];
