/**
 * API service for handling transaction data
 * @module apiService
 */

import logger from '../logger.js';
import { API_ENDPOINTS, MESSAGES } from '../constants.js';

/**
 * Simulate API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch transactions from the API
 * @returns {Promise<Array>} Promise that resolves to array of transactions
 */
export const fetchTransactions = async () => {
  try {
    logger.info('Fetching transactions from API');
    
    // Simulate API delay
    await delay(1000);
    
    const response = await fetch(API_ENDPOINTS.TRANSACTIONS);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const transactions = await response.json();
    
    logger.info('Transactions fetched successfully', { 
      count: transactions.length 
    });
    
    return transactions;
  } catch (error) {
    logger.error('Error fetching transactions', { error: error.message });
    throw new Error(MESSAGES.ERROR);
  }
};

/**
 * Fetch transactions for a specific customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} Promise that resolves to array of customer transactions
 */
export const fetchCustomerTransactions = async (customerId) => {
  try {
    logger.info('Fetching customer transactions', { customerId });
    
    // Simulate API delay
    await delay(800);
    
    const response = await fetch(`${API_ENDPOINTS.TRANSACTIONS}?customerId=${customerId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const transactions = await response.json();
    
    logger.info('Customer transactions fetched successfully', { 
      customerId, 
      count: transactions.length 
    });
    
    return transactions;
  } catch (error) {
    logger.error('Error fetching customer transactions', { 
      customerId, 
      error: error.message 
    });
    throw new Error(MESSAGES.ERROR);
  }
};

/**
 * Fetch transactions for a specific month and year
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<Array>} Promise that resolves to array of filtered transactions
 */
export const fetchTransactionsByMonthYear = async (month, year) => {
  try {
    logger.info('Fetching transactions by month and year', { month, year });
    
    // Simulate API delay
    await delay(600);
    
    const response = await fetch(`${API_ENDPOINTS.TRANSACTIONS}?month=${month}&year=${year}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const transactions = await response.json();
    
    logger.info('Month-year transactions fetched successfully', { 
      month, 
      year, 
      count: transactions.length 
    });
    
    return transactions;
  } catch (error) {
    logger.error('Error fetching month-year transactions', { 
      month, 
      year, 
      error: error.message 
    });
    throw new Error(MESSAGES.ERROR);
  }
};