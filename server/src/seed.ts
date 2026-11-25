import { db } from './config/db.js';

interface SeedProblem {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  time_limit: number;
  memory_limit: number;
  points: number;
  samples: Array<{ input: string; output: string; explanation?: string }>;
  hidden: Array<{ input: string; output: string }>;
}

const sampleProblems: SeedProblem[] = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nPrint the 0-based indices separated by a space in ascending order.',
    input_format: 'The first line contains two integers `n` (the size of the array) and `target`.\nThe second line contains `n` space-separated integers representing the array `nums`.',
    output_format: 'Print two space-separated integers representing the indices of the two numbers.',
    constraints: '• 2 <= n <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '4 9\n2 7 11 15',
        output: '0 1'
      },
      {
        input: '3 6\n3 2 4',
        output: '1 2'
      }
    ],
    hidden: [
      {
        input: '2 6\n3 3',
        output: '0 1'
      },
      {
        input: '5 100\n10 20 30 70 50',
        output: '2 3'
      }
    ]
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    input_format: 'The first line contains two integers `n` (the array size) and `target`.\nThe second line contains `n` sorted space-separated integers.',
    output_format: 'Print a single integer representing the 0-based index of target, or -1 if not found.',
    constraints: '• 1 <= n <= 10^5\n• -10^4 <= nums[i], target <= 10^4\n• All the integers in nums are unique.\n• nums is sorted in ascending order.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '6 9\n-1 0 3 5 9 12',
        output: '4'
      },
      {
        input: '6 2\n-1 0 3 5 9 12',
        output: '-1'
      }
    ],
    hidden: [
      {
        input: '1 5\n5',
        output: '0'
      },
      {
        input: '1 2\n5',
        output: '-1'
      }
    ]
  },
  {
    title: 'Minimum Sum (GCD)',
    slug: 'minimum-sum-gcd',
    difficulty: 'Medium',
    description: 'Given an integer array `nums` and an integer `k`, find the minimum sum of any non-empty subarray such that the greatest common divisor (GCD) of all elements in the subarray is at least `k`.\n\nIf no such subarray satisfies the criteria, return `-1`.',
    input_format: 'The first line contains two integers `n` (array length) and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print a single integer denoting the minimum sum found, or -1 if no such subarray exists.',
    constraints: '• 1 <= n <= 10^5\n• 1 <= nums[i] <= 10^6\n• 1 <= k <= 10^6',
    time_limit: 1000,
    memory_limit: 256,
    points: 200,
    samples: [
      {
        input: '4 2\n4 6 8 2',
        output: '2'
      },
      {
        input: '3 4\n3 9 5',
        output: '-1'
      }
    ],
    hidden: [
      {
        input: '5 3\n6 9 12 15 3',
        output: '3'
      }
    ]
  },
  {
    title: 'Longest Subarray with Sum K',
    slug: 'longest-subarray-with-sum-k',
    difficulty: 'Medium',
    description: 'Given an array `nums` of `n` integers and an integer `k`, find the length of the longest subarray that sums to `k`. If no such subarray exists, print `0`.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print a single integer representing the maximum length of a subarray whose sum equals k.',
    constraints: '• 1 <= n <= 10^5\n• -10^5 <= nums[i] <= 10^5\n• -10^9 <= k <= 10^9',
    time_limit: 1500,
    memory_limit: 256,
    points: 250,
    samples: [
      {
        input: '5 5\n1 2 3 1 1',
        output: '3'
      },
      {
        input: '4 3\n-1 2 3 -2',
        output: '2'
      }
    ],
    hidden: [
      {
        input: '3 10\n1 2 3',
        output: '0'
      }
    ]
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` non-negative space-separated integers representing the elevation heights.',
    output_format: 'Print a single integer representing the total amount of trapped rainwater.',
    constraints: '• 1 <= n <= 2 * 10^4\n• 0 <= height[i] <= 10^5',
    time_limit: 1000,
    memory_limit: 256,
    points: 350,
    samples: [
      {
        input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
        output: '6'
      },
      {
        input: '6\n4 2 0 3 2 5',
        output: '9'
      }
    ],
    hidden: [
      {
        input: '3\n3 0 3',
        output: '3'
      },
      {
        input: '3\n1 2 3',
        output: '0'
      }
    ]
  },
  {
    title: 'Check Prime Number',
    slug: 'check-prime-number',
    difficulty: 'Easy',
    description: 'Given a positive integer `n`, determine whether it is a prime number. A prime number is a natural number strictly greater than 1 that has no positive divisors other than 1 and itself.\n\nPrint `YES` if `n` is prime, otherwise print `NO`.',
    input_format: 'A single integer `n`.',
    output_format: 'Print `YES` if n is a prime number, else print `NO`.',
    constraints: '• 1 <= n <= 10^9',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '7',
        output: 'YES',
        explanation: '7 is only divisible by 1 and 7, so it is a prime number.'
      },
      {
        input: '1',
        output: 'NO',
        explanation: '1 is not strictly greater than 1, so by definition it is not prime.'
      }
    ],
    hidden: [
      { input: '2', output: 'YES' },
      { input: '4', output: 'NO' },
      { input: '9', output: 'NO' },
      { input: '13', output: 'YES' },
      { input: '97', output: 'YES' },
      { input: '100', output: 'NO' },
      { input: '999999937', output: 'YES' },
      { input: '1000000000', output: 'NO' }
    ]
  },
  {
    title: 'LCM of Two Numbers',
    slug: 'lcm-of-two-numbers',
    difficulty: 'Easy',
    description: 'Given two positive integers `a` and `b`, calculate and print their Least Common Multiple (LCM). The LCM of two integers is the smallest positive integer that is divisible by both `a` and `b`.',
    input_format: 'A single line containing two space-separated integers `a` and `b`.',
    output_format: 'Print a single integer representing the LCM of a and b.',
    constraints: '• 1 <= a, b <= 10^7',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '4 6',
        output: '12',
        explanation: 'Multiples of 4: 4, 8, 12... Multiples of 6: 6, 12... The smallest common multiple is 12.'
      },
      {
        input: '5 7',
        output: '35',
        explanation: 'Since 5 and 7 are coprime, LCM(5, 7) = 5 * 7 = 35.'
      }
    ],
    hidden: [
      { input: '1 1', output: '1' },
      { input: '12 18', output: '36' },
      { input: '10 15', output: '30' },
      { input: '21 6', output: '42' },
      { input: '100 25', output: '100' },
      { input: '999 999', output: '999' },
      { input: '1000000 1', output: '1000000' },
      { input: '123456 654321', output: '26938927488' }
    ]
  },
  {
    title: 'Second Largest Element',
    slug: 'second-largest-element',
    difficulty: 'Easy',
    description: 'Given an array of `n` integers, find the second largest distinct value in the array. If no distinct second largest element exists (e.g. all elements are identical or array size is smaller than 2), print `-1`.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the second largest distinct integer, or -1 if none exists.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '5\n12 35 1 10 34',
        output: '34',
        explanation: 'The largest distinct element is 35, and the second largest distinct element is 34.'
      },
      {
        input: '3\n10 10 10',
        output: '-1',
        explanation: 'All elements are equal, so there is no distinct second largest element.'
      }
    ],
    hidden: [
      { input: '1\n5', output: '-1' },
      { input: '2\n1 2', output: '1' },
      { input: '2\n7 7', output: '-1' },
      { input: '4\n-10 -20 -30 -40', output: '-20' },
      { input: '5\n5 5 4 5 5', output: '4' },
      { input: '6\n100 200 50 200 150 100', output: '150' },
      { input: '5\n-5 -5 -5 -2 -1', output: '-2' },
      { input: '6\n0 0 0 0 0 1', output: '0' }
    ]
  },
  {
    title: 'Count Even and Odd Numbers',
    slug: 'count-even-and-odd-numbers',
    difficulty: 'Easy',
    description: 'Given an array of `n` integers, count how many numbers are even and how many are odd.\n\nPrint the count of even numbers and the count of odd numbers separated by a space.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print two integers separated by a space: the number of even integers followed by the number of odd integers.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '5\n1 2 3 4 5',
        output: '2 3',
        explanation: 'Evens are {2, 4} (count 2), and odds are {1, 3, 5} (count 3).'
      },
      {
        input: '4\n2 4 6 8',
        output: '4 0',
        explanation: 'All 4 numbers are even, 0 are odd.'
      }
    ],
    hidden: [
      { input: '1\n0', output: '1 0' },
      { input: '1\n-3', output: '0 1' },
      { input: '3\n-2 -4 -6', output: '3 0' },
      { input: '3\n-1 1 3', output: '0 3' },
      { input: '6\n0 1 -2 -3 4 -5', output: '3 3' },
      { input: '5\n1000000000 1000000000 1 3 5', output: '2 3' },
      { input: '4\n7 7 7 7', output: '0 4' },
      { input: '5\n12 14 16 18 19', output: '4 1' }
    ]
  },
  {
    title: 'Leap Year Check',
    slug: 'leap-year-check',
    difficulty: 'Easy',
    description: 'Given a year `y`, determine whether it is a leap year in the Gregorian calendar.\nA year is a leap year if:\n1. It is divisible by 4 AND not divisible by 100, OR\n2. It is divisible by 400.\n\nPrint `YES` if `y` is a leap year, otherwise print `NO`.',
    input_format: 'A single integer `y` representing the year.',
    output_format: 'Print `YES` if the year is a leap year, else print `NO`.',
    constraints: '• 1 <= y <= 10^5',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '2024',
        output: 'YES',
        explanation: '2024 is divisible by 4 and not divisible by 100, so it is a leap year.'
      },
      {
        input: '1900',
        output: 'NO',
        explanation: '1900 is divisible by 100 but not by 400, so it is not a leap year.'
      }
    ],
    hidden: [
      { input: '2000', output: 'YES' },
      { input: '2023', output: 'NO' },
      { input: '4', output: 'YES' },
      { input: '100', output: 'NO' },
      { input: '400', output: 'YES' },
      { input: '1600', output: 'YES' },
      { input: '2100', output: 'NO' },
      { input: '2400', output: 'YES' }
    ]
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-from-sorted-array',
    difficulty: 'Easy',
    description: 'Given an integer array `nums` sorted in non-decreasing order, remove the duplicates such that each unique element appears only once.\n\nPrint the count of unique elements in the array.',
    input_format: 'The first line contains an integer `n` representing the size of the array.\nThe second line contains `n` space-separated integers representing the sorted array.',
    output_format: 'Print a single integer representing the count of unique elements.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9\n• nums is sorted in non-decreasing order.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '3\n1 1 2',
        output: '2',
        explanation: 'The unique elements are 1 and 2, so the count is 2.'
      },
      {
        input: '10\n0 0 1 1 1 2 2 3 3 4',
        output: '5',
        explanation: 'The unique elements are 0, 1, 2, 3, and 4, total count is 5.'
      }
    ],
    hidden: [
      { input: '1\n42', output: '1' },
      { input: '5\n7 7 7 7 7', output: '1' },
      { input: '5\n1 2 3 4 5', output: '5' },
      { input: '6\n-10 -10 -5 0 0 5', output: '4' },
      { input: '8\n-3 -2 -2 -1 0 0 0 1', output: '5' },
      { input: '4\n-1000000000 -1000000000 1000000000 1000000000', output: '2' },
      { input: '7\n1 1 1 2 2 2 3', output: '3' },
      { input: '6\n-5 -4 -3 -2 -1 0', output: '6' }
    ]
  },
  {
    title: 'Move Zeroes',
    slug: 'move-zeroes',
    difficulty: 'Easy',
    description: 'Given an integer array `nums`, move all `0`\'s to the end of it while maintaining the relative order of the non-zero elements.\n\nPrint the resulting array elements separated by a single space.',
    input_format: 'The first line contains an integer `n` representing the number of elements.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the elements of the modified array separated by a single space.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '5\n0 1 0 3 12',
        output: '1 3 12 0 0',
        explanation: 'Non-zero elements 1, 3, 12 maintain their relative order and all 0s are moved to the end.'
      },
      {
        input: '1\n0',
        output: '0',
        explanation: 'A single 0 remains unchanged.'
      }
    ],
    hidden: [
      { input: '4\n1 2 3 4', output: '1 2 3 4' },
      { input: '4\n0 0 0 0', output: '0 0 0 0' },
      { input: '6\n0 0 1 0 2 0', output: '1 2 0 0 0 0' },
      { input: '5\n-1 0 -2 0 3', output: '-1 -2 3 0 0' },
      { input: '2\n0 5', output: '5 0' },
      { input: '2\n5 0', output: '5 0' },
      { input: '7\n4 0 5 0 0 6 7', output: '4 5 6 7 0 0 0' },
      { input: '1\n99', output: '99' }
    ]
  },
  {
    title: 'Reverse Words in a Sentence',
    slug: 'reverse-words-in-a-sentence',
    difficulty: 'Easy',
    description: 'Given a sentence consisting of space-separated words, reverse the order of the words.\n\nPrint the words in reversed order separated by a single space.',
    input_format: 'A single line of text containing words separated by single spaces.',
    output_format: 'Print the sentence with the word order reversed.',
    constraints: '• 1 <= length of sentence <= 10^5\n• Sentence contains alphanumeric characters and spaces.\n• Words are separated by single spaces without leading or trailing spaces.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: 'the sky is blue',
        output: 'blue is sky the',
        explanation: 'The order of words is reversed from last to first.'
      },
      {
        input: 'hello world',
        output: 'world hello',
        explanation: 'The two words are swapped.'
      }
    ],
    hidden: [
      { input: 'codejudge', output: 'codejudge' },
      { input: 'a b c d e', output: 'e d c b a' },
      { input: 'one two three', output: 'three two one' },
      { input: 'quick brown fox jumps', output: 'jumps fox brown quick' },
      { input: 'yes no', output: 'no yes' },
      { input: 'first second third fourth fifth', output: 'fifth fourth third second first' },
      { input: 'I love competitive programming', output: 'programming competitive love I' },
      { input: '123 456 789', output: '789 456 123' }
    ]
  },
  {
    title: 'Roman to Integer',
    slug: 'roman-to-integer',
    difficulty: 'Easy',
    description: 'Given a Roman numeral `s`, convert it to an integer.\n\nRoman numerals are represented by seven different symbols: `I` (1), `V` (5), `X` (10), `L` (50), `C` (100), `D` (500), and `M` (1000).\n\nSubtraction rules apply when a smaller numeral precedes a larger numeral (e.g., `IV` = 4, `IX` = 9, `XL` = 40, `XC` = 90, `CD` = 400, `CM` = 900).',
    input_format: 'A single string `s` containing a valid Roman numeral.',
    output_format: 'Print a single integer representing the converted value.',
    constraints: '• 1 <= s.length <= 15\n• s contains only the characters (\'I\', \'V\', \'X\', \'L\', \'C\', \'D\', \'M\').\n• Guaranteed that s is a valid Roman numeral in the range [1, 3999].',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: 'III',
        output: '3',
        explanation: 'III = 1 + 1 + 1 = 3.'
      },
      {
        input: 'LVIII',
        output: '58',
        explanation: 'L = 50, V = 5, III = 3, so 50 + 5 + 3 = 58.'
      }
    ],
    hidden: [
      { input: 'IV', output: '4' },
      { input: 'IX', output: '9' },
      { input: 'MCMXCIV', output: '1994' },
      { input: 'I', output: '1' },
      { input: 'XL', output: '40' },
      { input: 'XC', output: '90' },
      { input: 'CD', output: '400' },
      { input: 'MMMCMXCIX', output: '3999' }
    ]
  },
  {
    title: 'Armstrong Number',
    slug: 'armstrong-number',
    difficulty: 'Easy',
    description: 'An Armstrong number (also known as a narcissistic number) is a positive integer that is equal to the sum of its own digits each raised to the power of the total number of digits `k`.\n\nPrint `YES` if `n` is an Armstrong number, otherwise print `NO`.',
    input_format: 'A single positive integer `n`.',
    output_format: 'Print `YES` if n is an Armstrong number, else print `NO`.',
    constraints: '• 1 <= n <= 10^8',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '153',
        output: 'YES',
        explanation: '153 has 3 digits: 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.'
      },
      {
        input: '123',
        output: 'NO',
        explanation: '1^3 + 2^3 + 3^3 = 1 + 8 + 27 = 36 != 123.'
      }
    ],
    hidden: [
      { input: '1', output: 'YES' },
      { input: '9', output: 'YES' },
      { input: '10', output: 'NO' },
      { input: '370', output: 'YES' },
      { input: '371', output: 'YES' },
      { input: '407', output: 'YES' },
      { input: '1634', output: 'YES' },
      { input: '9474', output: 'YES' },
      { input: '54748', output: 'YES' }
    ]
  },
  {
    title: 'Merge Two Sorted Arrays',
    slug: 'merge-two-sorted-arrays',
    difficulty: 'Easy',
    description: 'You are given two sorted integer arrays `a` of size `n` and `b` of size `m`. Merge the two arrays into a single sorted array in non-decreasing order.\n\nPrint all the elements of the merged sorted array separated by a single space.',
    input_format: 'The first line contains two integers `n` and `m`.\nThe second line contains `n` space-separated integers representing array `a`.\nThe third line contains `m` space-separated integers representing array `b`.',
    output_format: 'Print the elements of the merged sorted array separated by a single space.',
    constraints: '• 0 <= n, m <= 10^5\n• 1 <= n + m <= 10^5\n• -10^9 <= a[i], b[j] <= 10^9\n• Arrays a and b are sorted in non-decreasing order.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '3 3\n1 2 3\n2 5 6',
        output: '1 2 2 3 5 6',
        explanation: 'Merging [1, 2, 3] and [2, 5, 6] produces [1, 2, 2, 3, 5, 6].'
      },
      {
        input: '1 1\n1\n2',
        output: '1 2',
        explanation: 'Merging [1] and [2] gives [1, 2].'
      }
    ],
    hidden: [
      { input: '1 0\n5', output: '5' },
      { input: '0 1\n8', output: '8' },
      { input: '3 3\n-5 0 2\n-3 1 4', output: '-5 -3 0 1 2 4' },
      { input: '4 2\n1 3 5 7\n2 4', output: '1 2 3 4 5 7' },
      { input: '3 3\n2 2 2\n2 2 2', output: '2 2 2 2 2 2' },
      { input: '2 3\n-100 100\n-50 0 50', output: '-100 -50 0 50 100' },
      { input: '4 4\n10 20 30 40\n1 2 3 4', output: '1 2 3 4 10 20 30 40' },
      { input: '3 3\n1 4 7\n2 3 9', output: '1 2 3 4 7 9' }
    ]
  },
  {
    title: 'Count Set Bits',
    slug: 'count-set-bits',
    difficulty: 'Easy',
    description: 'Given a non-negative integer `n`, count the number of set bits (1s) in its binary representation.\n\nPrint the total number of 1s in the binary form of `n`.',
    input_format: 'A single non-negative integer `n`.',
    output_format: 'Print a single integer representing the count of set bits.',
    constraints: '• 0 <= n <= 10^18',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '11',
        output: '3',
        explanation: '11 in binary is 1011, which contains 3 ones.'
      },
      {
        input: '128',
        output: '1',
        explanation: '128 in binary is 10000000, which contains 1 one.'
      }
    ],
    hidden: [
      { input: '0', output: '0' },
      { input: '1', output: '1' },
      { input: '2', output: '1' },
      { input: '3', output: '2' },
      { input: '7', output: '3' },
      { input: '15', output: '4' },
      { input: '1023', output: '10' },
      { input: '1000000000000000000', output: '13' }
    ]
  },
  {
    title: 'Majority Element',
    slug: 'majority-element',
    difficulty: 'Easy',
    description: 'Given an array `nums` of size `n`, find the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times.\n\nYou may assume that the majority element always exists in the array.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the majority element.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9\n• The majority element is guaranteed to exist.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '3\n3 2 3',
        output: '3',
        explanation: '3 appears 2 times, which is more than 3/2 = 1.'
      },
      {
        input: '7\n2 2 1 1 1 2 2',
        output: '2',
        explanation: '2 appears 4 times, which is more than 7/2 = 3.'
      }
    ],
    hidden: [
      { input: '1\n100', output: '100' },
      { input: '2\n-5 -5', output: '-5' },
      { input: '5\n6 6 6 7 7', output: '6' },
      { input: '5\n1 2 1 1 3', output: '1' },
      { input: '9\n3 3 4 2 4 4 2 4 4', output: '4' },
      { input: '6\n0 0 0 0 1 2', output: '0' },
      { input: '7\n-1 -1 -1 -1 2 3 4', output: '-1' },
      { input: '5\n1000000000 1000000000 1000000000 2 3', output: '1000000000' }
    ]
  },
  {
    title: 'Rotate Array by K',
    slug: 'rotate-array-by-k',
    difficulty: 'Easy',
    description: 'Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.\n\nPrint the rotated array elements separated by a single space.',
    input_format: 'The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print the rotated array elements separated by a single space.',
    constraints: '• 1 <= n <= 10^5\n• 0 <= k <= 10^9\n• -10^9 <= nums[i] <= 10^9',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '7 3\n1 2 3 4 5 6 7',
        output: '5 6 7 1 2 3 4',
        explanation: 'Rotate 1 step: 7 1 2 3 4 5 6\nRotate 2 steps: 6 7 1 2 3 4 5\nRotate 3 steps: 5 6 7 1 2 3 4'
      },
      {
        input: '4 2\n-1 -100 3 99',
        output: '3 99 -1 -100',
        explanation: 'Rotate 1 step: 99 -1 -100 3\nRotate 2 steps: 3 99 -1 -100'
      }
    ],
    hidden: [
      { input: '1 5\n10', output: '10' },
      { input: '5 0\n1 2 3 4 5', output: '1 2 3 4 5' },
      { input: '5 5\n1 2 3 4 5', output: '1 2 3 4 5' },
      { input: '4 1\n10 20 30 40', output: '40 10 20 30' },
      { input: '6 4\n1 2 3 4 5 6', output: '3 4 5 6 1 2' },
      { input: '3 10\n1 2 3', output: '3 1 2' },
      { input: '5 7\n-5 0 5 -10 10', output: '-10 10 -5 0 5' },
      { input: '2 1\n8 9', output: '9 8' }
    ]
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nPrint the maximum profit you can achieve from this transaction. If you cannot achieve any profit, print `0`.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers representing stock prices.',
    output_format: 'Print a single integer representing the maximum profit or 0.',
    constraints: '• 1 <= n <= 10^5\n• 0 <= prices[i] <= 10^9',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '6\n7 1 5 3 6 4',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.'
      },
      {
        input: '5\n7 6 4 3 1',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.'
      }
    ],
    hidden: [
      { input: '1\n10', output: '0' },
      { input: '2\n1 5', output: '4' },
      { input: '2\n5 1', output: '0' },
      { input: '5\n2 4 1 7 5', output: '6' },
      { input: '6\n3 2 6 5 0 3', output: '4' },
      { input: '4\n10 10 10 10', output: '0' },
      { input: '5\n100 20 50 10 60', output: '50' },
      { input: '6\n1 2 3 4 5 6', output: '5' }
    ]
  },
  {
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    description: 'Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, print an empty line.',
    input_format: 'The first line contains an integer `n` representing the number of strings.\nThe next `n` lines each contain a single non-empty string.',
    output_format: 'Print the longest common prefix string, or an empty line if no common prefix exists.',
    constraints: '• 1 <= n <= 10^4\n• 0 <= length of each string <= 200\n• Strings consist of only lowercase English letters.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '3\nflower\nflow\nflight',
        output: 'fl',
        explanation: 'The longest common prefix among the three strings is "fl".'
      },
      {
        input: '3\ndog\nracecar\ncar',
        output: '',
        explanation: 'There is no common prefix among the input strings.'
      }
    ],
    hidden: [
      { input: '1\nalone', output: 'alone' },
      { input: '2\na\na', output: 'a' },
      { input: '2\nab\na', output: 'a' },
      { input: '3\ninterspecies\ninterstellar\ninterstate', output: 'inters' },
      { input: '4\nthrone\nthrone\nthrone\nthrone', output: 'throne' },
      { input: '3\nprefix\ncode\njudge', output: '' },
      { input: '2\ncat\ndog', output: '' },
      { input: '3\napple\napplet\napplication', output: 'appl' }
    ]
  },
  {
    title: 'Plus One',
    slug: 'plus-one',
    difficulty: 'Easy',
    description: 'You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the `i`-th digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0\'s.\n\nIncrement the large integer by one and print the resulting array of digits separated by a single space.',
    input_format: 'The first line contains an integer `n` representing the number of digits.\nThe second line contains `n` space-separated integers representing the digits.',
    output_format: 'Print the resulting digits separated by a single space.',
    constraints: '• 1 <= n <= 10^5\n• 0 <= digits[i] <= 9\n• digits does not contain any leading 0\'s, except for the number 0 itself.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '3\n1 2 3',
        output: '1 2 4',
        explanation: 'The array represents the integer 123. Incrementing by one gives 123 + 1 = 124.'
      },
      {
        input: '4\n4 3 2 1',
        output: '4 3 2 2',
        explanation: '4321 + 1 = 4322.'
      }
    ],
    hidden: [
      { input: '1\n9', output: '1 0' },
      { input: '1\n0', output: '1' },
      { input: '3\n9 9 9', output: '1 0 0 0' },
      { input: '2\n1 9', output: '2 0' },
      { input: '5\n1 0 0 0 0', output: '1 0 0 0 1' },
      { input: '4\n8 9 9 9', output: '9 0 0 0' },
      { input: '6\n9 9 9 9 9 9', output: '1 0 0 0 0 0 0' },
      { input: '5\n2 4 6 8 0', output: '2 4 6 8 1' }
    ]
  },
  {
    title: 'Pangram Check',
    slug: 'pangram-check',
    difficulty: 'Easy',
    description: 'A pangram is a sentence where every letter of the English alphabet appears at least once.\n\nGiven a string `sentence` containing English letters and spaces, return `YES` if `sentence` is a pangram, or `NO` otherwise (case-insensitive).',
    input_format: 'A single line of string `sentence`.',
    output_format: 'Print `YES` if the sentence is a pangram, else print `NO`.',
    constraints: '• 1 <= sentence.length <= 10^5\n• sentence contains only English letters (uppercase or lowercase) and whitespace.',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: 'The quick brown fox jumps over the lazy dog',
        output: 'YES',
        explanation: 'The sentence contains at least one of every letter from a to z.'
      },
      {
        input: 'codejudge online judge',
        output: 'NO',
        explanation: 'The sentence does not contain all letters of the alphabet.'
      }
    ],
    hidden: [
      { input: 'abcdefghijklmnopqrstuvwxyz', output: 'YES' },
      { input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', output: 'YES' },
      { input: 'Pack my box with five dozen liquor jugs', output: 'YES' },
      { input: 'Sphinx of black quartz judge my vow', output: 'YES' },
      { input: 'Hello World', output: 'NO' },
      { input: 'abcdefghijklmnopqrstuvwxy', output: 'NO' },
      { input: 'bcdefghijklmnopqrstuvwxyz', output: 'NO' },
      { input: 'Two driven jocks help fax my big quiz', output: 'YES' }
    ]
  },
  {
    title: 'Perfect Number',
    slug: 'perfect-number',
    difficulty: 'Easy',
    description: 'A perfect number is a positive integer that is equal to the sum of its positive proper divisors, that is, sum of its positive divisors excluding the number itself.\n\nGiven an integer `n`, return `YES` if `n` is a perfect number, otherwise return `NO`.',
    input_format: 'A single integer `n`.',
    output_format: 'Print `YES` if n is a perfect number, else print `NO`.',
    constraints: '• 1 <= n <= 10^8',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '28',
        output: 'YES',
        explanation: '28 = 1 + 2 + 4 + 7 + 14.'
      },
      {
        input: '7',
        output: 'NO',
        explanation: 'Proper divisors of 7 are only {1}. 1 != 7.'
      }
    ],
    hidden: [
      { input: '1', output: 'NO' },
      { input: '6', output: 'YES' },
      { input: '12', output: 'NO' },
      { input: '496', output: 'YES' },
      { input: '8128', output: 'YES' },
      { input: '2', output: 'NO' },
      { input: '100', output: 'NO' },
      { input: '33550336', output: 'YES' }
    ]
  },
  {
    title: 'Check if Array Is Sorted',
    slug: 'check-if-array-is-sorted',
    difficulty: 'Easy',
    description: 'Given an array `nums` of `n` integers, determine if the array is sorted in non-decreasing order.\n\nPrint `YES` if the array is sorted in non-decreasing order, otherwise print `NO`.',
    input_format: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    output_format: 'Print `YES` if the array is sorted in non-decreasing order, else print `NO`.',
    constraints: '• 1 <= n <= 10^5\n• -10^9 <= nums[i] <= 10^9',
    time_limit: 1000,
    memory_limit: 256,
    points: 100,
    samples: [
      {
        input: '5\n1 2 3 4 5',
        output: 'YES',
        explanation: 'The array elements are strictly increasing.'
      },
      {
        input: '5\n1 3 2 4 5',
        output: 'NO',
        explanation: 'Element 3 is followed by 2, which violates non-decreasing order.'
      }
    ],
    hidden: [
      { input: '1\n100', output: 'YES' },
      { input: '4\n5 5 5 5', output: 'YES' },
      { input: '2\n10 5', output: 'NO' },
      { input: '2\n5 10', output: 'YES' },
      { input: '6\n-10 -5 0 2 2 10', output: 'YES' },
      { input: '5\n1 2 3 5 4', output: 'NO' },
      { input: '6\n-5 -6 -7 0 1 2', output: 'NO' },
      { input: '7\n1 2 4 8 16 32 64', output: 'YES' }
    ]
  }
];

export function seedProblemsIfEmpty(): void {
  const insertProblem = db.prepare(`
    INSERT INTO problems (title, slug, difficulty, description, input_format, output_format, constraints, time_limit, memory_limit, points)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTestCase = db.prepare(`
    INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
    VALUES (?, ?, ?, ?)
  `);

  const checkProblem = db.prepare('SELECT id FROM problems WHERE slug = ?');

  const transaction = db.transaction(() => {
    for (const p of sampleProblems) {
      const existing = checkProblem.get(p.slug) as { id: number } | undefined;
      if (existing) {
        continue;
      }

      const info = insertProblem.run(
        p.title,
        p.slug,
        p.difficulty,
        p.description,
        p.input_format,
        p.output_format,
        p.constraints,
        p.time_limit,
        p.memory_limit,
        p.points
      );
      const problemId = Number(info.lastInsertRowid);

      for (const sample of p.samples) {
        insertTestCase.run(problemId, sample.input, sample.output, 1);
      }

      for (const hidden of p.hidden) {
        insertTestCase.run(problemId, hidden.input, hidden.output, 0);
      }
    }
  });

  transaction();
}
