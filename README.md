# Playwright Test Framework with Advanced Modularity

This is a highly modular Playwright-based test automation framework following the principles from "The Philosophy of Software Design" by John Ousterhout, with support for both traditional code-based and natural language AI-powered testing via Midscene.js.

## Design Principles Applied

1. **Deep Modules**: Complex functionality with simple interfaces
2. **Information Hiding**: Implementation details hidden from consumers
3. **Strategic Decomposition**: Breaking down complex systems into well-defined components
4. **Designing for the Common Case**: Optimizing for the most frequent use cases
5. **Clear Abstractions**: Well-defined interfaces that hide complexity
6. **Error Handling**: Define errors out of existence where possible
7. **Dependency Management**: Clean dependency injection for better modularity

## Advanced Architecture

### Component-Based Design
The framework uses a component-based architecture where UI elements are represented as modular, reusable components:
- **Component Composition**: UI elements are composed of specialized components (Button, Input, Dropdown)
- **Interface Simplicity**: Components provide simple interfaces while handling complex functionality

### Dependency Injection
- **DIContainer**: A central dependency container that manages component instantiation
- **Singleton Management**: Handles lifecycle of singleton vs. transient objects
- **Testability**: Makes testing easier by allowing dependency substitution

### Cross-Cutting Concerns
- **Logging System**: Centralized, configurable logging
- **Error Management**: Comprehensive error handling with specialized error types
- **Configuration Management**: Environment-specific configuration

### Test Data Management
- **Data Store**: Centralized test data management
- **Data-Driven Testing**: Support for data-driven test cases
- **Dynamic Data Generation**: Utilities for generating dynamic test data

## Project Structure

```
├── configurations/           # Configuration management
│   └── config.ts             # Environment-specific configuration
├── pageObjects/              # Page object models
│   ├── BasePage.ts           # Traditional base page class
│   ├── EnhancedBasePage.ts   # Component-based base page class
│   ├── components/           # Reusable UI components
│   │   ├── UIComponent.ts    # Base UI component class
│   │   ├── Button.ts         # Button component
│   │   ├── Input.ts          # Input component
│   │   └── Dropdown.ts       # Dropdown component
│   ├── RoadToQA/             # Traditional page objects
│   ├── enhanced/             # Enhanced component-based page objects
│   └── NaturalLanguage/      # Natural language page objects
├── testData/                 # Test data management
│   └── index.ts              # Data store and utilities
├── tests/                    # Test cases
│   └── RoadToQA/
│       └── Test_Cases/
│           ├── cart.spec.ts          # Traditional tests
│           ├── cart.natural.spec.ts  # Natural language tests
│           └── cart.enhanced.spec.ts # Component-based tests
├── utils/                    # Utilities and cross-cutting concerns
│   ├── di-container.ts       # Dependency injection container
│   ├── errors.ts             # Error handling system
│   └── logger.ts             # Logging system
├── playwright.config.ts      # Playwright configuration
├── midscene.config.ts        # Midscene.js configuration
└── package.json              # Project dependencies
```

## Advanced Usage

### Component-Based Page Objects
```typescript
// Create a button component
const addToCartButton = createButton(page, 'button[aria-label="Add To Cart"]', {
  name: 'Add To Cart Button',
  waitForEnabled: true
});

// Use the component
await addToCartButton.click();
```

### Error Handling with Retry Logic
```typescript
import { tryWithErrorHandling } from './utils/errors';

await tryWithErrorHandling(
  async () => await productPage.addItemToCart('Product Name', 'Large', '2'),
  { 
    retries: 2,
    retryDelay: 1000,
    errorMessage: 'Failed to add product to cart'
  }
);
```

### Dependency Injection
```typescript
import { container } from './utils/di-container';

// Register a dependency
container.register('productPage', (page) => new ProductPage(page));

// Resolve a dependency
const productPage = container.resolve('productPage', page);
```

### Test Fixtures and Context
```typescript
// Define test context and fixtures
const test = baseTest.extend<TestContext>({
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  }
});

// Use in tests
test('Add product to cart', async ({ productPage }) => {
  await productPage.addItemToCart('Product', 'Medium', '1');
});
```

## Getting Started

1. Install dependencies: `npm install`
2. Run traditional tests: `npm test`
3. Run enhanced tests: `npm run test:enhanced`
4. Run natural language tests: `npm run test:natural`
5. View reports: `npm run report`

## Natural Language Testing with Midscene.js

This project supports natural language testing via Midscene.js, which allows writing tests in plain English. Key benefits include:

- **Improved Readability**: Tests are written in natural language, making them accessible to non-technical stakeholders
- **Visual Testing**: Easily verify visual aspects like colors and layout
- **AI-Powered Assertions**: Use AI to validate complex conditions without brittle selectors
- **Reduced Maintenance**: Tests are less tied to implementation details
- **Same Design Principles**: Maintains the same software design principles in a natural language context

### Example Natural Language Test

```typescript
test('As a Buyer I want to add items to the cart', async ({ page, ai, aiAssert }) => {
  // Use natural language to navigate and interact
  await ai('Navigate to the homepage');
  await ai('Click on the "Shop neutrals" link');
  await ai('Click on the product named "Arlie Dress"');
  await ai('Select the first size option from the dropdown menu');
  await ai('Set the quantity to 1');
  await ai('Click the "Add To Cart" button');
  
  // Use natural language assertions
  await aiAssert('Check that the cart contains the Arlie Dress product');
});
```

## Design Improvements

- **Class-based Page Objects**: Enhanced maintainability and reuse
- **Factory Pattern**: Simplified page object creation
- **Layered Architecture**: Clear separation of concerns
- **Meaningful Abstractions**: Functions named according to business operations
- **Strategic Information Hiding**: Private methods for implementation details
- **Natural Language Interface**: AI-powered natural language testing

## Running Tests

Traditional tests:
```
npx playwright test ./tests/RoadToQA/Test_Cases/cart.spec.ts
```

Natural language tests:
```
npx playwright test ./tests/RoadToQA/Test_Cases/cart.natural.spec.ts --config=midscene.config.ts
```