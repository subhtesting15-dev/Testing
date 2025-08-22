/**
 * Express server for the Rewards Program application
 * @module server
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import logger from './src/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Load transactions data
let transactionsData = [];

/**
 * Load transactions from JSON file
 */
const loadTransactions = async () => {
  try {
    const data = await fs.readFile(join(__dirname, 'public', 'data', 'transactions.json'), 'utf8');
    transactionsData = JSON.parse(data);
    logger.info('Transactions data loaded successfully', { count: transactionsData.length });
  } catch (error) {
    logger.error('Error loading transactions data', { error: error.message });
    throw error;
  }
};

/**
 * Filter transactions by customer ID
 * @param {string} customerId - Customer ID to filter by
 * @returns {Array} Filtered transactions
 */
const filterByCustomer = (customerId) => {
  return transactionsData.filter(transaction => transaction.customerId === customerId);
};

/**
 * Filter transactions by month and year
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Array} Filtered transactions
 */
const filterByMonthYear = (month, year) => {
  return transactionsData.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });
};

// API Routes

/**
 * GET /api/transactions
 * Get all transactions or filter by query parameters
 */
app.get('/api/transactions', (req, res) => {
  try {
    const { customerId, month, year } = req.query;
    let filteredData = [...transactionsData];

    // Filter by customer ID if provided
    if (customerId) {
      filteredData = filterByCustomer(customerId);
      logger.info('Transactions filtered by customer', { customerId, count: filteredData.length });
    }

    // Filter by month and year if provided
    if (month && year) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      filteredData = filterByMonthYear(monthNum, yearNum);
      logger.info('Transactions filtered by month and year', { month: monthNum, year: yearNum, count: filteredData.length });
    }

    // Add artificial delay to simulate API call
    setTimeout(() => {
      res.json(filteredData);
    }, 500);

  } catch (error) {
    logger.error('Error in transactions API', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/customers
 * Get unique customers
 */
app.get('/api/customers', (req, res) => {
  try {
    const uniqueCustomers = transactionsData.reduce((customers, transaction) => {
      const existingCustomer = customers.find(c => c.customerId === transaction.customerId);
      if (!existingCustomer) {
        customers.push({
          customerId: transaction.customerId,
          customerName: transaction.customerName
        });
      }
      return customers;
    }, []);

    logger.info('Customers API called', { count: uniqueCustomers.length });
    res.json(uniqueCustomers);
  } catch (error) {
    logger.error('Error in customers API', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/rewards/:customerId
 * Get reward points for a specific customer
 */
app.get('/api/rewards/:customerId', (req, res) => {
  try {
    const { customerId } = req.params;
    const customerTransactions = filterByCustomer(customerId);
    
    // Calculate reward points
    const totalPoints = customerTransactions.reduce((total, transaction) => {
      let points = 0;
      const amount = transaction.amount;
      
      if (amount > 100) {
        points += (amount - 100) * 2;
        points += 50 * 1; // $50-$100 range
      } else if (amount > 50) {
        points += (amount - 50) * 1;
      }
      
      return total + Math.round(points);
    }, 0);

    logger.info('Rewards API called', { customerId, totalPoints });
    res.json({ customerId, totalPoints, transactionCount: customerTransactions.length });
  } catch (error) {
    logger.error('Error in rewards API', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  logger.warn('404 Not Found', { url: req.url });
  res.status(404).json({ error: 'Not found' });
});

// Start server
const startServer = async () => {
  try {
    await loadTransactions();
    
    app.listen(PORT, () => {
      logger.info('Server started successfully', { 
        port: PORT, 
        environment: process.env.NODE_ENV || 'development' 
      });
      console.log(`🚀 Rewards Program Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();