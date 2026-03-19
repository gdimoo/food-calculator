const ONE_HOUR_MS = 60 * 60 * 1000;

export class RedSetService {
  private orderLog = new Map<string, number>(); // ip -> timestamp

  canOrder(ip: string): boolean {
    const lastOrderTime = this.orderLog.get(ip);
    if (!lastOrderTime) return true;
    return Date.now() - lastOrderTime >= ONE_HOUR_MS;
  }

  recordOrder(ip: string, timestamp?: number): void {
    this.orderLog.set(ip, timestamp ?? Date.now());
  }
}
