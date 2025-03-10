# Playwright Test Framework with Midscene.js

This is a Playwright-based test automation framework following the principles from "The Philosophy of Software Design" by John Ousterhout, with support for both traditional code-based and natural language AI-powered testing via Midscene.js.

## Design Principles Applied

1. **Deep Modules**: Complex functionality with simple interfaces
2. **Information Hiding**: Implementation details hidden from consumers
3. **Strategic Decomposition**: Breaking down complex systems into well-defined components
4. **Designing for the Common Case**: Optimizing for the most frequent use cases
5. **Clear Abstractions**: Well-defined interfaces that hide complexity

## Project Structure

```
├── pageObjects/                  # Page object models
│   ├── BasePage.ts               # Base class for all traditional page objects
│   ├── PageFactory.ts            # Factory pattern for traditional page object creation
│   ├── RoadToQA/                 # Domain-specific traditional page objects
│   │   ├── SecurityPage.ts       # Password authentication page
│   │   ├── ProductPage.ts        # Product browsing functionality
│   │   └── CartPage.ts           # Cart management functionality
│   └── NaturalLanguage/          # Natural language page objects
│       ├── BasePage.ts           # Base class for natural language page objects
│       ├── PageFactory.ts        # Factory for natural language page objects
│       ├── SecurityPage.ts       # Natural language security page
│       ├── ProductPage.ts        # Natural language product page
│       └── CartPage.ts           # Natural language cart page
├── tests/                        # Test cases organized by domain
│   └── RoadToQA/                 # Tests for RoadToQA website
│       └── Test_Cases/           # Test specifications
│           ├── cart.spec.ts      # Traditional cart test cases
│           └── cart.natural.spec.ts # Natural language cart test cases
├── configurations/               # Test configuration files
├── playwright.config.ts          # Playwright configuration
└── midscene.config.ts            # Midscene.js configuration
```

## Getting Started

1. Install dependencies: `npm install`
2. Run traditional tests: `npm test`
3. Run natural language tests: `npm run test:natural`
4. Run with UI: `npm run test:ui`
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