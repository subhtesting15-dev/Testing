/**
 * Main Rewards Application Class
 * @module rewardsApp
 */

import { 
  MONTHS, 
  YEARS, 
  MESSAGES, 
  CSS_CLASSES,
  PAGINATION_CONFIG 
} from './constants.js';
import { 
  calculateRewardPoints, 
  calculateTotalRewardPoints, 
  calculateRewardPointsByMonth,
  addRewardPointsToTransactions 
} from './utils/rewardsCalculator.js';
import { 
  fetchTransactions, 
  fetchCustomerTransactions, 
  fetchTransactionsByMonthYear 
} from './services/apiService.js';
import { 
  calculatePagination, 
  generatePageNumbers,
  getPaginatedCustomers 
} from './utils/pagination.js';
import logger from './logger.js';

/**
 * Main Rewards Application Class
 */
export class RewardsApp {
  constructor() {
    this.transactions = [];
    this.customers = [];
    this.selectedCustomer = null;
    this.selectedMonth = null;
    this.selectedYear = new Date().getFullYear();
    this.currentPage = 1;
    this.isLoading = false;
    this.error = null;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      logger.info('Initializing Rewards Application');
      this.render();
      await this.loadTransactions();
    } catch (error) {
      logger.error('Error initializing application', { error: error.message });
      this.handleError(error);
    }
  }

  /**
   * Load transactions from API
   */
  async loadTransactions() {
    try {
      this.setLoading(true);
      this.transactions = await fetchTransactions();
      this.customers = this.getUniqueCustomers();
      this.render();
    } catch (error) {
      logger.error('Error loading transactions', { error: error.message });
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get unique customers from transactions
   * @returns {Array} Array of unique customer objects
   */
  getUniqueCustomers() {
    const uniqueCustomers = this.transactions.reduce((customers, transaction) => {
      const existingCustomer = customers.find(c => c.customerId === transaction.customerId);
      if (!existingCustomer) {
        customers.push({
          customerId: transaction.customerId,
          customerName: transaction.customerName
        });
      }
      return customers;
    }, []);

    return uniqueCustomers.sort((a, b) => a.customerName.localeCompare(b.customerName));
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.isLoading = loading;
    this.render();
  }

  /**
   * Handle errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    this.error = error.message;
    this.render();
  }

  /**
   * Select a customer
   * @param {string} customerId - Customer ID
   */
  async selectCustomer(customerId) {
    try {
      this.selectedCustomer = customerId;
      this.selectedMonth = null;
      this.currentPage = 1;
      
      logger.info('Customer selected', { customerId });
      this.render();
    } catch (error) {
      logger.error('Error selecting customer', { customerId, error: error.message });
      this.handleError(error);
    }
  }

  /**
   * Select month and year filter
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   */
  async selectMonthYear(month, year) {
    try {
      this.selectedMonth = month;
      this.selectedYear = year;
      this.currentPage = 1;
      
      logger.info('Month and year selected', { month, year });
      this.render();
    } catch (error) {
      logger.error('Error selecting month/year', { month, year, error: error.message });
      this.handleError(error);
    }
  }

  /**
   * Change page
   * @param {number} page - Page number
   */
  changePage(page) {
    this.currentPage = page;
    logger.info('Page changed', { page });
    this.render();
  }

  /**
   * Get filtered transactions for selected customer
   * @returns {Array} Filtered transactions
   */
  getFilteredTransactions() {
    if (!this.selectedCustomer) {
      return [];
    }

    let filtered = this.transactions.filter(t => t.customerId === this.selectedCustomer);

    if (this.selectedMonth && this.selectedYear) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() + 1 === this.selectedMonth && 
               date.getFullYear() === this.selectedYear;
      });
    }

    return filtered;
  }

  /**
   * Get customer transactions for the last 3 months
   * @returns {Array} Customer transactions for last 3 months
   */
  getLastThreeMonthsTransactions() {
    if (!this.selectedCustomer) {
      return [];
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return this.transactions.filter(t => {
      if (t.customerId !== this.selectedCustomer) return false;
      const transactionDate = new Date(t.date);
      return transactionDate >= threeMonthsAgo;
    });
  }

  /**
   * Render the application
   */
  render() {
    const container = document.getElementById('app');
    if (!container) {
      logger.error('App container not found');
      return;
    }

    container.innerHTML = this.generateHTML();
    this.attachEventListeners();
  }

  /**
   * Generate HTML for the application
   * @returns {string} HTML string
   */
  generateHTML() {
    return `
      <div class="${CSS_CLASSES.CONTAINER}">
        <header class="${CSS_CLASSES.HEADER}">
          <h1>Customer Rewards Program</h1>
        </header>
        
        ${this.renderLoadingState()}
        ${this.renderErrorState()}
        ${this.renderCustomerSelection()}
        ${this.renderFilters()}
        ${this.renderRewardsSummary()}
        ${this.renderTransactionsTable()}
        ${this.renderPagination()}
      </div>
    `;
  }

  /**
   * Render loading state
   * @returns {string} Loading HTML
   */
  renderLoadingState() {
    if (!this.isLoading) return '';
    
    return `
      <div class="${CSS_CLASSES.LOADING}">
        <div class="spinner"></div>
        <p>${MESSAGES.LOADING}</p>
      </div>
    `;
  }

  /**
   * Render error state
   * @returns {string} Error HTML
   */
  renderErrorState() {
    if (!this.error) return '';
    
    return `
      <div class="${CSS_CLASSES.ERROR}">
        <p>${this.error}</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }

  /**
   * Render customer selection
   * @returns {string} Customer selection HTML
   */
  renderCustomerSelection() {
    const paginatedCustomers = getPaginatedCustomers(this.customers, this.currentPage);
    
    return `
      <div class="customer-section">
        <h2>Select Customer</h2>
        <div class="customer-grid">
          ${paginatedCustomers.items.map(customer => `
            <div class="customer-card ${this.selectedCustomer === customer.customerId ? 'selected' : ''}" 
                 data-customer-id="${customer.customerId}">
              <h3>${customer.customerName}</h3>
              <p>ID: ${customer.customerId}</p>
            </div>
          `).join('')}
        </div>
        ${this.renderCustomerPagination(paginatedCustomers)}
      </div>
    `;
  }

  /**
   * Render customer pagination
   * @param {Object} paginationInfo - Pagination information
   * @returns {string} Pagination HTML
   */
  renderCustomerPagination(paginationInfo) {
    if (paginationInfo.totalPages <= 1) return '';

    const pageNumbers = generatePageNumbers(paginationInfo.currentPage, paginationInfo.totalPages);

    return `
      <div class="${CSS_CLASSES.PAGINATION}">
        ${paginationInfo.hasPrevPage ? 
          `<button class="page-btn" data-page="${paginationInfo.currentPage - 1}">Previous</button>` : ''}
        
        ${pageNumbers.map(page => `
          <button class="page-btn ${page === paginationInfo.currentPage ? 'active' : ''}" 
                  data-page="${page}">${page}</button>
        `).join('')}
        
        ${paginationInfo.hasNextPage ? 
          `<button class="page-btn" data-page="${paginationInfo.currentPage + 1}">Next</button>` : ''}
      </div>
    `;
  }

  /**
   * Render filters
   * @returns {string} Filters HTML
   */
  renderFilters() {
    if (!this.selectedCustomer) return '';

    return `
      <div class="${CSS_CLASSES.FILTERS}">
        <h3>Filter by Month & Year</h3>
        <div class="filter-controls">
          <select id="monthSelect" class="${CSS_CLASSES.MONTH_SELECT}">
            <option value="">All Months</option>
            ${MONTHS.map(month => `
              <option value="${month.value}" ${this.selectedMonth === month.value ? 'selected' : ''}>
                ${month.label}
              </option>
            `).join('')}
          </select>
          
          <select id="yearSelect" class="${CSS_CLASSES.YEAR_SELECT}">
            ${YEARS.map(year => `
              <option value="${year}" ${this.selectedYear === year ? 'selected' : ''}>
                ${year}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `;
  }

  /**
   * Render rewards summary
   * @returns {string} Rewards summary HTML
   */
  renderRewardsSummary() {
    if (!this.selectedCustomer) return '';

    const customerTransactions = this.getLastThreeMonthsTransactions();
    const monthlyPoints = calculateRewardPointsByMonth(customerTransactions);
    const totalPoints = calculateTotalRewardPoints(customerTransactions);

    return `
      <div class="${CSS_CLASSES.REWARDS_SUMMARY}">
        <h3>Rewards Summary (Last 3 Months)</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <h4>Total Points</h4>
            <p class="points">${totalPoints}</p>
          </div>
          ${Object.entries(monthlyPoints).map(([monthYear, points]) => {
            const [year, month] = monthYear.split('-');
            const monthName = MONTHS[parseInt(month) - 1]?.label || month;
            return `
              <div class="summary-item">
                <h4>${monthName} ${year}</h4>
                <p class="points">${points}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render transactions table
   * @returns {string} Transactions table HTML
   */
  renderTransactionsTable() {
    if (!this.selectedCustomer) return '';

    const filteredTransactions = this.getFilteredTransactions();
    const transactionsWithPoints = addRewardPointsToTransactions(filteredTransactions);

    if (transactionsWithPoints.length === 0) {
      return `
        <div class="${CSS_CLASSES.NO_DATA}">
          <p>${MESSAGES.NO_TRANSACTIONS}</p>
        </div>
      `;
    }

    return `
      <div class="transactions-section">
        <h3>Transactions ${this.selectedMonth ? `(${MONTHS[this.selectedMonth - 1]?.label} ${this.selectedYear})` : '(All)'}</h3>
        <div class="${CSS_CLASSES.TRANSACTIONS_TABLE}">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Reward Points</th>
              </tr>
            </thead>
            <tbody>
              ${transactionsWithPoints.map(transaction => `
                <tr>
                  <td>${transaction.transactionId}</td>
                  <td>${new Date(transaction.date).toLocaleDateString()}</td>
                  <td>$${transaction.amount.toFixed(2)}</td>
                  <td>${transaction.rewardPoints}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /**
   * Render pagination
   * @returns {string} Pagination HTML
   */
  renderPagination() {
    return '';
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Customer selection
    document.querySelectorAll('.customer-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const customerId = e.currentTarget.dataset.customerId;
        this.selectCustomer(customerId);
      });
    });

    // Pagination
    document.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.currentTarget.dataset.page);
        this.changePage(page);
      });
    });

    // Month filter
    const monthSelect = document.getElementById('monthSelect');
    if (monthSelect) {
      monthSelect.addEventListener('change', (e) => {
        const month = e.target.value ? parseInt(e.target.value) : null;
        this.selectMonthYear(month, this.selectedYear);
      });
    }

    // Year filter
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        const year = parseInt(e.target.value);
        this.selectMonthYear(this.selectedMonth, year);
      });
    }
  }
}