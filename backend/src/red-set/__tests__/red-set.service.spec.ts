import { RedSetService } from '../red-set.service';

describe('RedSetService', () => {
  let service: RedSetService;
  const IP_A = '192.168.1.1';
  const IP_B = '192.168.1.2';

  beforeEach(() => {
    service = new RedSetService();
  });

  // ─── ALLOW CASES ─────────────────────────────────────────
  describe('Allow order', () => {
    it('should allow first order from any IP', () => {
      expect(service.canOrder(IP_A)).toBe(true);
    });

    it('should allow different IP to order within same hour', () => {
      service.recordOrder(IP_A);
      expect(service.canOrder(IP_B)).toBe(true);
    });

    it('should allow same IP to order after 1 hour has passed', () => {
      const oneHourAgo = Date.now() - 61 * 60 * 1000; // 61 minutes ago
      service.recordOrder(IP_A, oneHourAgo);
      expect(service.canOrder(IP_A)).toBe(true);
    });

    it('should allow order exactly at 60 minutes boundary', () => {
      const exactly60MinAgo = Date.now() - 60 * 60 * 1000;
      service.recordOrder(IP_A, exactly60MinAgo);
      expect(service.canOrder(IP_A)).toBe(true);
    });
  });

  // ─── DENY CASES ──────────────────────────────────────────
  describe('Deny order', () => {
    it('should deny same IP ordering within 1 hour', () => {
      service.recordOrder(IP_A);
      expect(service.canOrder(IP_A)).toBe(false);
    });

    it('should deny order placed 59 minutes ago', () => {
      const fiftyNineMinAgo = Date.now() - 59 * 60 * 1000;
      service.recordOrder(IP_A, fiftyNineMinAgo);
      expect(service.canOrder(IP_A)).toBe(false);
    });

    it('should deny immediately after ordering', () => {
      service.recordOrder(IP_A);
      expect(service.canOrder(IP_A)).toBe(false);
    });
  });

  // ─── RECORD ORDER ─────────────────────────────────────────
  describe('recordOrder', () => {
    it('should update timestamp when same IP orders again after restriction lifted', () => {
      const oneHourAgo = Date.now() - 61 * 60 * 1000;
      service.recordOrder(IP_A, oneHourAgo);
      expect(service.canOrder(IP_A)).toBe(true);

      service.recordOrder(IP_A);
      expect(service.canOrder(IP_A)).toBe(false);
    });

    it('should track multiple IPs independently', () => {
      service.recordOrder(IP_A);
      service.recordOrder(IP_B);

      expect(service.canOrder(IP_A)).toBe(false);
      expect(service.canOrder(IP_B)).toBe(false);
    });
  });
});
