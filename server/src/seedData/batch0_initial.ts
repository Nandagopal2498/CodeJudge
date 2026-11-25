import { RawProblemDef, compileAndGenerateOutputs } from '../utils/batchRunner.js';
import { SeedProblem } from '../seed.types.js';

const rawBatch0: RawProblemDef[] = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nPrint the 0-based indices separated by a space in ascending order.',
    input_format: 'The first line contains two integers `n` (the size of the array) and `target`.\nThe second line contains `n` space-separated integers representing the array `nums`.',
    output_format: 'Print two space-separated integers representing the indices of the two numbers in ascending order.',
    constraints: '• 2 <= n <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.',
    starter_code: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find two numbers adding up to target and print their indices in ascending order

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int comp = target - nums[i];
        if (seen.find(comp) != seen.end()) {
            int a = seen[comp];
            int b = i;
            if (a > b) swap(a, b);
            cout << a << " " << b << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}
`,
    sample_inputs: [
      {
        input: '4 9\n2 7 11 15',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.'
      },
      {
        input: '3 6\n3 2 4',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return 1 2.'
      }
    ],
    hidden_inputs: [
      '2 6\n3 3',
      '5 100\n10 20 30 70 50',
      '4 -8\n-1 -7 5 3',
      '4 0\n-5 2 5 8',
      '3 2000000000\n1000000000 500 1000000000',
      '6 15\n1 9 4 8 2 14',
      '5 8\n2 2 2 6 2',
      '5 9\n1 2 3 4 5',
      '4 -15\n-10 -2 0 -5',
      // Large case
      `1000 1997\n${Array.from({ length: 1000 }, (_, i) => i + 1).join(' ')}`
    ]
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Array'],
    points: 100,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    input_format: 'The first line contains two integers `n` (the array size) and `target`.\nThe second line contains `n` sorted space-separated integers.',
    output_format: 'Print a single integer representing the 0-based index of target, or -1 if not found.',
    constraints: '• 1 <= n <= 10^5\n• -10^4 <= nums[i], target <= 10^4\n• All the integers in nums are unique.\n• nums is sorted in ascending order.',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Search for target in nums in O(log n)

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int left = 0, right = n - 1;
    int ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << ans << endl;
    return 0;
}
`,
    sample_inputs: [
      {
        input: '6 9\n-1 0 3 5 9 12',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: '6 2\n-1 0 3 5 9 12',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    hidden_inputs: [
      '1 5\n5',
      '1 2\n5',
      '5 -10\n-20 -15 -10 -5 0',
      '5 0\n-20 -15 -10 -5 0',
      '5 -20\n-20 -15 -10 -5 0',
      '8 7\n1 2 3 4 5 6 7 8',
      '8 1\n1 2 3 4 5 6 7 8',
      '8 8\n1 2 3 4 5 6 7 8',
      '8 9\n1 2 3 4 5 6 7 8',
      // Large case
      `10000 7543\n${Array.from({ length: 10000 }, (_, i) => i * 2).join(' ')}`
    ]
  },
  {
    title: 'Minimum Sum (GCD)',
    slug: 'minimum-sum-gcd',
    difficulty: 'Medium',
    tags: ['Math', 'Number Theory', 'Sliding Window'],
    points: 200,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given an integer array `nums` and an integer `k`, find the minimum sum of any non-empty subarray such that the greatest common divisor (GCD) of all elements in the subarray is at least `k`.\n\nIf no such subarray satisfies the criteria, return `-1`.',
    input_format: 'The first line contains two integers `n` (array length) and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print a single integer denoting the minimum sum found, or -1 if no such subarray exists.',
    constraints: '• 1 <= n <= 10^5\n• 1 <= nums[i] <= 10^6\n• 1 <= k <= 10^6',
    starter_code: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find minimum sum of subarray with gcd >= k

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

long long gcd_val(long long a, long long b) {
    while (b) {
        a %= b;
        swap(a, b);
    }
    return a;
}

int main() {
    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    long long min_single = -1;
    for (int i = 0; i < n; i++) {
        if (nums[i] >= k) {
            if (min_single == -1 || nums[i] < min_single) {
                min_single = nums[i];
            }
        }
    }
    cout << min_single << endl;
    return 0;
}
`,
    sample_inputs: [
      {
        input: '4 2\n4 6 8 2',
        explanation: 'Subarray [2] has length 1, gcd(2) = 2 >= 2, and sum = 2.'
      },
      {
        input: '3 4\n3 9 5',
        explanation: 'No element or subarray has gcd >= 4, so return -1.'
      }
    ],
    hidden_inputs: [
      '5 3\n6 9 12 15 3',
      '1 5\n5',
      '1 10\n4',
      '4 5\n10 15 20 25',
      '6 7\n1 2 3 4 5 6',
      '4 1\n5 3 2 8',
      '5 10\n100 200 300 400 500',
      '5 50\n10 20 30 40 50',
      '3 6\n12 18 24',
      // Large case
      `5000 15\n${Array.from({ length: 5000 }, (_, i) => 15 * (i % 10 + 1)).join(' ')}`
    ]
  },
  {
    title: 'Longest Subarray with Sum K',
    slug: 'longest-subarray-with-sum-k',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Table', 'Array'],
    points: 250,
    time_limit: 1500,
    memory_limit: 256,
    description: 'Given an array `nums` of `n` integers and an integer `k`, find the length of the longest subarray that sums to `k`. If no such subarray exists, print `0`.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print a single integer representing the maximum length of a subarray whose sum equals k.',
    constraints: '• 1 <= n <= 10^5\n• -10^5 <= nums[i] <= 10^5\n• -10^9 <= k <= 10^9',
    starter_code: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Find length of longest subarray with sum equal to k

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

int main() {
    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    unordered_map<long long, int> prefix_first;
    prefix_first[0] = -1;
    long long current_sum = 0;
    int max_len = 0;

    for (int i = 0; i < n; i++) {
        current_sum += nums[i];
        long long needed = current_sum - k;
        if (prefix_first.find(needed) != prefix_first.end()) {
            max_len = max(max_len, i - prefix_first[needed]);
        }
        if (prefix_first.find(current_sum) == prefix_first.end()) {
            prefix_first[current_sum] = i;
        }
    }

    cout << max_len << endl;
    return 0;
}
`,
    sample_inputs: [
      {
        input: '5 5\n1 2 3 1 1',
        explanation: 'Subarray [1, 3, 1] from index 2 to 4 or [2, 3] from 1 to 2; the longest subarray is [1, 2, 1, 1] from index 0? For [1, 2, 3, 1, 1], [1, 2, 3] sum is 6, [2, 3] has sum 5 len 2, [3, 1, 1] has sum 5 len 3.'
      },
      {
        input: '4 3\n-1 2 3 -2',
        explanation: 'Subarray [2, 3, -2] has sum 3 with length 3? Let us check: 2 + 3 - 2 = 3. [-1, 2, 3, -2] sum is 2. Subarray [3] has length 1. Subarray [2, 3, -2] has length 3.'
      }
    ],
    hidden_inputs: [
      '3 10\n1 2 3',
      '4 0\n0 0 0 0',
      '5 0\n1 -1 1 -1 1',
      '4 1\n1 1 1 1',
      '6 6\n2 -2 2 -2 6 0',
      '5 15\n1 2 3 4 5',
      '6 4\n-2 -1 2 1 1 3',
      '3 -5\n-1 -2 -2',
      '5 2\n-1 1 -1 1 2',
      // Large case
      `5000 2500\n${Array.from({ length: 5000 }, () => 1).join(' ')}`
    ]
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Dynamic Programming', 'Monotonic Stack'],
    points: 350,
    time_limit: 1000,
    memory_limit: 256,
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` non-negative space-separated integers representing the elevation heights.',
    output_format: 'Print a single integer representing the total amount of trapped rainwater.',
    constraints: '• 1 <= n <= 2 * 10^4\n• 0 <= height[i] <= 10^5',
    starter_code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    // TODO: Calculate trapped rainwater

    return 0;
}
`,
    reference_solution: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    if (n <= 2) {
        cout << 0 << endl;
        return 0;
    }

    int left = 0, right = n - 1;
    long long left_max = 0, right_max = 0;
    long long total_water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= left_max) {
                left_max = height[left];
            } else {
                total_water += left_max - height[left];
            }
            left++;
        } else {
            if (height[right] >= right_max) {
                right_max = height[right];
            } else {
                total_water += right_max - height[right];
            }
            right--;
        }
    }

    cout << total_water << endl;
    return 0;
}
`,
    sample_inputs: [
      {
        input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
        explanation: 'Elevation map [0,1,0,2,1,0,1,3,2,1,2,1] traps 6 units of rain water.'
      },
      {
        input: '6\n4 2 0 3 2 5',
        explanation: 'Elevation map [4,2,0,3,2,5] traps 9 units of rain water.'
      }
    ],
    hidden_inputs: [
      '3\n3 0 3',
      '3\n1 2 3',
      '3\n3 2 1',
      '5\n0 0 0 0 0',
      '1\n5',
      '2\n10 10',
      '6\n5 1 2 1 2 5',
      '7\n2 0 2 0 2 0 2',
      '6\n0 3 0 2 0 4',
      // Large case
      `2000\n${Array.from({ length: 2000 }, (_, i) => (i % 2 === 0 ? 100 : 0)).join(' ')}`
    ]
  }
];

export const batch0Problems: SeedProblem[] = compileAndGenerateOutputs(rawBatch0);
