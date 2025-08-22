/**
 * Pagination utility functions
 * @module pagination
 */

import { PAGINATION_CONFIG } from '../constants.js';
import logger from '../logger.js';

/**
 * Calculate pagination information
 * @param {Array} items - Array of items to paginate
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Pagination information object
 */
export const calculatePagination = (items, currentPage = 1, itemsPerPage = PAGINATION_CONFIG.ITEMS_PER_PAGE) => {
  if (!items || !Array.isArray(items)) {
    logger.warn('Invalid items array for pagination', { items });
    return {
      items: [],
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
      startIndex: 0,
      endIndex: 0
    };
  }

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  const paginatedItems = items.slice(startIndex, endIndex);
  
  const paginationInfo = {
    items: paginatedItems,
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
    startIndex: startIndex + 1,
    endIndex
  };

  logger.info('Pagination calculated', { 
    totalItems, 
    totalPages, 
    currentPage: validCurrentPage,
    itemsPerPage 
  });

  return paginationInfo;
};

/**
 * Generate page numbers for pagination display
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} maxDisplay - Maximum number of page buttons to display
 * @returns {Array} Array of page numbers to display
 */
export const generatePageNumbers = (currentPage, totalPages, maxDisplay = PAGINATION_CONFIG.MAX_PAGES_DISPLAY) => {
  if (totalPages <= 0) {
    return [];
  }

  const pages = [];
  const halfDisplay = Math.floor(maxDisplay / 2);
  
  let startPage = Math.max(1, currentPage - halfDisplay);
  let endPage = Math.min(totalPages, startPage + maxDisplay - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxDisplay) {
    startPage = Math.max(1, endPage - maxDisplay + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  logger.info('Page numbers generated', { 
    currentPage, 
    totalPages, 
    pages 
  });

  return pages;
};

/**
 * Get unique customers from transactions with pagination
 * @param {Array} transactions - Array of transaction objects
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Paginated customers information
 */
export const getPaginatedCustomers = (transactions, currentPage = 1, itemsPerPage = PAGINATION_CONFIG.ITEMS_PER_PAGE) => {
  if (!transactions || !Array.isArray(transactions)) {
    logger.warn('Invalid transactions array for customer pagination', { transactions });
    return calculatePagination([], currentPage, itemsPerPage);
  }

  // Get unique customers
  const uniqueCustomers = transactions.reduce((customers, transaction) => {
    const existingCustomer = customers.find(c => c.customerId === transaction.customerId);
    if (!existingCustomer) {
      customers.push({
        customerId: transaction.customerId,
        customerName: transaction.customerName
      });
    }
    return customers;
  }, []);

  logger.info('Unique customers extracted', { 
    totalCustomers: uniqueCustomers.length 
  });

  return calculatePagination(uniqueCustomers, currentPage, itemsPerPage);
};