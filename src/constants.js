/**
 * Constants for the rewards program application
 * @module constants
 */

export const REWARDS_CONFIG = {
  POINTS_PER_DOLLAR_OVER_100: 2,
  POINTS_PER_DOLLAR_50_TO_100: 1,
  THRESHOLD_50: 50,
  THRESHOLD_100: 100
};

export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGES_DISPLAY: 5
};

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

export const YEARS = [2025, 2024, 2023, 2022, 2021];

export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/transactions'
};

export const MESSAGES = {
  LOADING: 'Loading transactions...',
  ERROR: 'Error loading transactions. Please try again.',
  NO_TRANSACTIONS: 'No transactions found for the selected period.',
  NO_CUSTOMERS: 'No customers found.',
  SELECT_CUSTOMER: 'Please select a customer to view rewards.',
  SELECT_MONTH: 'Please select a month to view transactions.'
};

export const CSS_CLASSES = {
  CONTAINER: 'rewards-container',
  HEADER: 'rewards-header',
  CUSTOMER_SELECT: 'customer-select',
  FILTERS: 'filters-container',
  MONTH_SELECT: 'month-select',
  YEAR_SELECT: 'year-select',
  REWARDS_SUMMARY: 'rewards-summary',
  TRANSACTIONS_TABLE: 'transactions-table',
  PAGINATION: 'pagination',
  LOADING: 'loading',
  ERROR: 'error',
  NO_DATA: 'no-data'
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD'
};