const ONE_HOUR_MS = 60 * 60 * 1000;

export class RedSetService {
  private orderLog = new Map<string, number>(); // ip -> timestamp

  canOrder(ip: string): boolean {
    const lastOrderTime = this.orderLog.get(ip);
    if (!lastOrderTime) return true;
    return Date.now() - lastOrderTime >= ONE_HOUR_MS;
  }

  minutesRemaining(ip: string): number {
    const lastOrderTime = this.orderLog.get(ip);
    if (!lastOrderTime) return 0;
    const elapsed = Date.now() - lastOrderTime;
    return Math.ceil((ONE_HOUR_MS - elapsed) / 60000);
  }

  recordOrder(ip: string, timestamp?: number): void {
    this.orderLog.set(ip, timestamp ?? Date.now());
  }
}
