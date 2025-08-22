/**
 * Rewards calculation utility functions
 * @module rewardsCalculator
 */

import { REWARDS_CONFIG } from '../constants.js';
import logger from '../logger.js';

/**
 * Calculate reward points for a single transaction
 * @param {number} amount - Transaction amount in dollars
 * @returns {number} Total reward points earned
 */
export const calculateRewardPoints = (amount) => {
  // Convert to number and validate
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    logger.warn('Invalid transaction amount', { amount });
    return 0;
  }

  let points = 0;

  // Calculate points for amount over $100 (2 points per dollar)
  if (numAmount > REWARDS_CONFIG.THRESHOLD_100) {
    const over100 = numAmount - REWARDS_CONFIG.THRESHOLD_100;
    points += over100 * REWARDS_CONFIG.POINTS_PER_DOLLAR_OVER_100;
    
    // Calculate points for amount between $50-$100 (1 point per dollar)
    const between50And100 = REWARDS_CONFIG.THRESHOLD_100 - REWARDS_CONFIG.THRESHOLD_50;
    points += between50And100 * REWARDS_CONFIG.POINTS_PER_DOLLAR_50_TO_100;
  } 
  // Calculate points for amount between $50-$100 (1 point per dollar)
  else if (numAmount > REWARDS_CONFIG.THRESHOLD_50) {
    const between50And100 = numAmount - REWARDS_CONFIG.THRESHOLD_50;
    points += between50And100 * REWARDS_CONFIG.POINTS_PER_DOLLAR_50_TO_100;
  }

  logger.info('Reward points calculated', { amount: numAmount, points });
  return Math.round(points);
};

/**
 * Calculate total reward points for multiple transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Total reward points
 */
export const calculateTotalRewardPoints = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) {
    logger.warn('Invalid transactions array', { transactions });
    return 0;
  }

  const totalPoints = transactions.reduce((total, transaction) => {
    return total + calculateRewardPoints(transaction.amount);
  }, 0);

  logger.info('Total reward points calculated', { 
    transactionCount: transactions.length, 
    totalPoints 
  });
  
  return totalPoints;
};

/**
 * Calculate reward points by month for a customer
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object with month-year as key and points as value
 */
export const calculateRewardPointsByMonth = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) {
    logger.warn('Invalid transactions array for monthly calculation', { transactions });
    return {};
  }

  const monthlyPoints = {};

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyPoints[monthYear]) {
      monthlyPoints[monthYear] = 0;
    }
    
    monthlyPoints[monthYear] += calculateRewardPoints(transaction.amount);
  });

  logger.info('Monthly reward points calculated', { 
    transactionCount: transactions.length, 
    monthlyPoints 
  });

  return monthlyPoints;
};

/**
 * Add reward points to transaction objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of transaction objects with reward points added
 */
export const addRewardPointsToTransactions = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) {
    logger.warn('Invalid transactions array for adding reward points', { transactions });
    return [];
  }

  return transactions.map(transaction => ({
    ...transaction,
    rewardPoints: calculateRewardPoints(transaction.amount)
  }));
};