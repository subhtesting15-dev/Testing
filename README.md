# Customer Rewards Program

A comprehensive customer rewards program application built with Vanilla JavaScript that calculates and displays reward points based on transaction amounts. The application follows a modern architecture with proper separation of concerns, comprehensive testing, and beautiful UI design.

## 🎯 Features

- **Dynamic Customer Display**: Browse through 20+ customers with pagination
- **Reward Points Calculation**: 
  - 2 points per dollar spent over $100
  - 1 point per dollar spent between $50-$100
  - 0 points for transactions under $50
- **Monthly & Yearly Filtering**: Filter transactions by specific months and years
- **Real-time Calculations**: View reward points per transaction, per month, and totals
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Comprehensive Testing**: 30+ unit tests covering positive and negative scenarios
- **Transaction Logging**: Full logging system using Pino
- **Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewards-program
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
rewards-program/
├── public/
│   ├── data/
│   │   └── transactions.json      # Mock transaction data
│   ├── index.html                 # Main HTML file
│   └── styles.css                 # Application styles
├── src/
│   ├── constants.js               # Application constants
│   ├── logger.js                  # Pino logger configuration
│   ├── rewardsApp.js              # Main application class
│   ├── services/
│   │   └── apiService.js          # API service layer
│   └── utils/
│       ├── rewardsCalculator.js   # Reward calculation logic
│       └── pagination.js          # Pagination utilities
├── tests/
│   └── rewardsCalculator.test.js  # Unit tests
├── server.js                      # Express server
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

## 🏗️ Architecture & Approach

### Design Principles

1. **Separation of Concerns**: Each module has a single responsibility
2. **ES6 Modules**: Modern JavaScript with import/export syntax
3. **No Hard-coded Data**: All static data moved to constants file
4. **Error Handling**: Comprehensive error handling with user-friendly messages
5. **Logging**: Full transaction logging for debugging and monitoring

### Key Components

#### 1. Rewards Calculator (`src/utils/rewardsCalculator.js`)
- **calculateRewardPoints(amount)**: Calculates points for a single transaction
- **calculateTotalRewardPoints(transactions)**: Sums points for multiple transactions
- **calculateRewardPointsByMonth(transactions)**: Groups points by month
- **addRewardPointsToTransactions(transactions)**: Adds points to transaction objects

#### 2. Main Application (`src/rewardsApp.js`)
- **State Management**: Handles application state and user interactions
- **Rendering**: Dynamic HTML generation with proper event handling
- **Data Flow**: Manages data flow between components

#### 3. API Service (`src/services/apiService.js`)
- **Simulated API Calls**: Async operations with loading states
- **Error Handling**: Proper error handling with user feedback
- **Mock Data Integration**: Seamless integration with JSON mock data

#### 4. Pagination (`src/utils/pagination.js`)
- **Dynamic Pagination**: Handles large datasets efficiently
- **Page Navigation**: Smooth navigation between pages
- **Responsive Design**: Adapts to different screen sizes

### Reward Calculation Logic

The application implements the following reward structure:

```
Transaction Amount | Points Earned
------------------|---------------
$0 - $49.99       | 0 points
$50 - $100        | 1 point per dollar over $50
$100+             | 2 points per dollar over $100 + 1 point per dollar $50-$100
```

**Example**: $120 transaction
- $50-$100: 50 × 1 = 50 points
- $100-$120: 20 × 2 = 40 points
- **Total**: 90 points

## 🧪 Testing

### Test Coverage

The application includes comprehensive unit tests with:

- **30+ Test Cases**: Covering all major functions
- **Positive & Negative Tests**: Valid and invalid inputs
- **Edge Cases**: Boundary conditions and error scenarios
- **Fractional Values**: Testing with decimal amounts
- **Null/Undefined Handling**: Robust error handling

### Test Categories

1. **Reward Calculation Tests**
   - Valid transaction amounts
   - Invalid inputs (null, undefined, negative)
   - Fractional amounts
   - Edge cases ($50, $100 thresholds)

2. **Data Processing Tests**
   - Array operations
   - Date filtering
   - Pagination logic
   - Error handling

3. **Integration Tests**
   - API service calls
   - Data transformation
   - State management

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/rewardsCalculator.test.js
```

## 🎨 UI/UX Features

### Design Highlights

- **Modern Gradient Background**: Eye-catching purple-blue gradient
- **Card-based Layout**: Clean, organized customer cards
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adapts to different screen sizes
- **Loading States**: User feedback during data loading
- **Error Handling**: Clear error messages with retry options

### User Experience

1. **Customer Selection**: Click on customer cards to view their data
2. **Filtering**: Use month/year dropdowns to filter transactions
3. **Pagination**: Navigate through large customer lists
4. **Real-time Updates**: See reward calculations instantly
5. **Mobile Friendly**: Touch-friendly interface for mobile devices

## 📊 Data Structure

### Transaction Object
```javascript
{
  customerId: "CUST001",
  customerName: "John Smith",
  transactionId: "TXN001",
  amount: 150.00,
  date: "2025-01-15"
}
```

### Mock Data
- **20 Customers**: Unique customer profiles
- **63 Transactions**: Realistic transaction data
- **3-Month Period**: January to March 2025
- **Varied Amounts**: $45 to $300 per transaction

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### Constants (`src/constants.js`)
- Reward calculation thresholds
- Pagination settings
- API endpoints
- UI messages and CSS classes

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Build
```bash
# Install dependencies
npm install --production

# Start server
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Logging

The application uses Pino for structured logging:

- **Info Logs**: Application events and user actions
- **Warning Logs**: Potential issues and edge cases
- **Error Logs**: Error conditions with context
- **Browser Console**: Client-side logging for debugging

### Log Examples
```javascript
logger.info('Customer selected', { customerId: 'CUST001' });
logger.warn('Invalid transaction amount', { amount: -50 });
logger.error('API call failed', { error: 'Network timeout' });
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test cases for usage examples

---

**Built with ❤️ using Vanilla JavaScript, Express, and Jest**