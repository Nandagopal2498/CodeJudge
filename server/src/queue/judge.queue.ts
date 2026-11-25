type Task<T> = () => Promise<T>;

export class ConcurrencyQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: Array<{ task: Task<unknown>; resolve: (val: unknown) => void; reject: (err: unknown) => void }> = [];

  constructor(concurrency: number = 2) {
    this.concurrency = concurrency;
  }

  async add<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        task: task as Task<unknown>,
        resolve: resolve as (val: unknown) => void,
        reject
      });
      this.processNext();
    });
  }

  private processNext(): void {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.running++;
    item.task()
      .then((res) => {
        item.resolve(res);
      })
      .catch((err) => {
        item.reject(err);
      })
      .finally(() => {
        this.running--;
        this.processNext();
      });
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  getRunningCount(): number {
    return this.running;
  }
}

// Global queue enforcing max 3-5 concurrent judge jobs across the system (default 3)
export const submissionQueue = new ConcurrencyQueue(3);

// Active judging tracking to enforce max 1 active judging job per user
const activeUsers = new Set<number>();

export function isUserJudging(userId: number): boolean {
  return activeUsers.has(userId);
}

export function setUserJudging(userId: number): void {
  activeUsers.add(userId);
}

export function clearUserJudging(userId: number): void {
  activeUsers.delete(userId);
}
