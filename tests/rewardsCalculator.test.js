/**
 * Unit tests for rewards calculator
 * @module rewardsCalculator.test
 */

import { 
  calculateRewardPoints, 
  calculateTotalRewardPoints, 
  calculateRewardPointsByMonth,
  addRewardPointsToTransactions 
} from '../src/utils/rewardsCalculator.js';

describe('Rewards Calculator', () => {
  describe('calculateRewardPoints', () => {
    // Positive test cases
    test('should calculate 90 points for $120 transaction (2x$20 + 1x$50)', () => {
      const result = calculateRewardPoints(120);
      expect(result).toBe(90);
    });

    test('should calculate 50 points for $100 transaction (1x$50)', () => {
      const result = calculateRewardPoints(100);
      expect(result).toBe(50);
    });

    test('should calculate 25 points for $75 transaction (1x$25)', () => {
      const result = calculateRewardPoints(75);
      expect(result).toBe(25);
    });

    test('should calculate 0 points for $45 transaction (below $50 threshold)', () => {
      const result = calculateRewardPoints(45);
      expect(result).toBe(0);
    });

    test('should calculate 250 points for $200 transaction (2x$100 + 1x$50)', () => {
      const result = calculateRewardPoints(200);
      expect(result).toBe(250);
    });

    test('should calculate 150 points for $150 transaction (2x$50 + 1x$50)', () => {
      const result = calculateRewardPoints(150);
      expect(result).toBe(150);
    });

    // Test with fractional values
    test('should calculate 90.5 points for $120.25 transaction and round to 91', () => {
      const result = calculateRewardPoints(120.25);
      expect(result).toBe(91);
    });

    test('should calculate 25.75 points for $75.75 transaction and round to 26', () => {
      const result = calculateRewardPoints(75.75);
      expect(result).toBe(26);
    });

    test('should calculate 251 points for $200.50 transaction (2x$100.50 + 1x$50)', () => {
      const result = calculateRewardPoints(200.50);
      expect(result).toBe(251);
    });

    // Negative test cases
    test('should return 0 for negative amount', () => {
      const result = calculateRewardPoints(-50);
      expect(result).toBe(0);
    });

    test('should return 0 for zero amount', () => {
      const result = calculateRewardPoints(0);
      expect(result).toBe(0);
    });

    test('should return 0 for null amount', () => {
      const result = calculateRewardPoints(null);
      expect(result).toBe(0);
    });

    test('should return 0 for undefined amount', () => {
      const result = calculateRewardPoints(undefined);
      expect(result).toBe(0);
    });

    test('should calculate 50 points for string amount "100"', () => {
      const result = calculateRewardPoints('100');
      expect(result).toBe(50);
    });

    test('should return 0 for empty string amount', () => {
      const result = calculateRewardPoints('');
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalRewardPoints', () => {
    // Positive test cases
    test('should calculate total points for multiple transactions', () => {
      const transactions = [
        { amount: 120 },
        { amount: 75 },
        { amount: 200 }
      ];
      const result = calculateTotalRewardPoints(transactions);
      expect(result).toBe(90 + 25 + 250); // 365
    });

    test('should calculate total points for transactions with fractional values', () => {
      const transactions = [
        { amount: 120.25 },
        { amount: 75.75 },
        { amount: 200.50 }
      ];
      const result = calculateTotalRewardPoints(transactions);
      expect(result).toBe(91 + 26 + 251); // 368
    });

    test('should return 0 for empty transactions array', () => {
      const result = calculateTotalRewardPoints([]);
      expect(result).toBe(0);
    });

    // Negative test cases
    test('should return 0 for null transactions', () => {
      const result = calculateTotalRewardPoints(null);
      expect(result).toBe(0);
    });

    test('should return 0 for undefined transactions', () => {
      const result = calculateTotalRewardPoints(undefined);
      expect(result).toBe(0);
    });

    test('should return 0 for non-array transactions', () => {
      const result = calculateTotalRewardPoints('not an array');
      expect(result).toBe(0);
    });

    test('should handle transactions with invalid amounts', () => {
      const transactions = [
        { amount: 120 },
        { amount: null },
        { amount: -50 },
        { amount: 75 }
      ];
      const result = calculateTotalRewardPoints(transactions);
      expect(result).toBe(90 + 0 + 0 + 25); // 115
    });
  });

  describe('calculateRewardPointsByMonth', () => {
    // Positive test cases
    test('should calculate points by month correctly', () => {
      const transactions = [
        { amount: 120, date: '2025-01-15' },
        { amount: 75, date: '2025-01-22' },
        { amount: 200, date: '2025-02-10' },
        { amount: 150, date: '2025-02-28' }
      ];
      const result = calculateRewardPointsByMonth(transactions);
      expect(result).toEqual({
        '2025-01': 115, // 90 + 25
        '2025-02': 400  // 200 + 150
      });
    });

    test('should handle transactions with fractional amounts', () => {
      const transactions = [
        { amount: 120.25, date: '2025-01-15' },
        { amount: 75.75, date: '2025-01-22' },
        { amount: 200.50, date: '2025-02-10' }
      ];
      const result = calculateRewardPointsByMonth(transactions);
      expect(result).toEqual({
        '2025-01': 117, // 91 + 26
        '2025-02': 251  // 200.50 + 75.75
      });
    });

    test('should return empty object for empty transactions', () => {
      const result = calculateRewardPointsByMonth([]);
      expect(result).toEqual({});
    });

    // Negative test cases
    test('should return empty object for null transactions', () => {
      const result = calculateRewardPointsByMonth(null);
      expect(result).toEqual({});
    });

    test('should return empty object for undefined transactions', () => {
      const result = calculateRewardPointsByMonth(undefined);
      expect(result).toEqual({});
    });

    test('should return empty object for non-array transactions', () => {
      const result = calculateRewardPointsByMonth('not an array');
      expect(result).toEqual({});
    });

    test('should handle transactions with invalid dates', () => {
      const transactions = [
        { amount: 120, date: '2025-01-15' },
        { amount: 75, date: 'invalid-date' },
        { amount: 200, date: '2025-02-10' }
      ];
      const result = calculateRewardPointsByMonth(transactions);
      // Should still work with valid dates
      expect(result['2025-01']).toBe(90);
      expect(result['2025-02']).toBe(250);
    });
  });

  describe('addRewardPointsToTransactions', () => {
    // Positive test cases
    test('should add reward points to transactions', () => {
      const transactions = [
        { transactionId: 'TXN001', amount: 120 },
        { transactionId: 'TXN002', amount: 75 },
        { transactionId: 'TXN003', amount: 200 }
      ];
      const result = addRewardPointsToTransactions(transactions);
      expect(result).toEqual([
        { transactionId: 'TXN001', amount: 120, rewardPoints: 90 },
        { transactionId: 'TXN002', amount: 75, rewardPoints: 25 },
        { transactionId: 'TXN003', amount: 200, rewardPoints: 250 }
      ]);
    });

    test('should handle transactions with fractional amounts', () => {
      const transactions = [
        { transactionId: 'TXN001', amount: 120.25 },
        { transactionId: 'TXN002', amount: 75.75 }
      ];
      const result = addRewardPointsToTransactions(transactions);
      expect(result).toEqual([
        { transactionId: 'TXN001', amount: 120.25, rewardPoints: 91 },
        { transactionId: 'TXN002', amount: 75.75, rewardPoints: 26 }
      ]);
    });

    test('should return empty array for empty transactions', () => {
      const result = addRewardPointsToTransactions([]);
      expect(result).toEqual([]);
    });

    // Negative test cases
    test('should return empty array for null transactions', () => {
      const result = addRewardPointsToTransactions(null);
      expect(result).toEqual([]);
    });

    test('should return empty array for undefined transactions', () => {
      const result = addRewardPointsToTransactions(undefined);
      expect(result).toEqual([]);
    });

    test('should return empty array for non-array transactions', () => {
      const result = addRewardPointsToTransactions('not an array');
      expect(result).toEqual([]);
    });

    test('should handle transactions with invalid amounts', () => {
      const transactions = [
        { transactionId: 'TXN001', amount: 120 },
        { transactionId: 'TXN002', amount: null },
        { transactionId: 'TXN003', amount: -50 }
      ];
      const result = addRewardPointsToTransactions(transactions);
      expect(result).toEqual([
        { transactionId: 'TXN001', amount: 120, rewardPoints: 90 },
        { transactionId: 'TXN002', amount: null, rewardPoints: 0 },
        { transactionId: 'TXN003', amount: -50, rewardPoints: 0 }
      ]);
    });
  });
});