# Playwright Test Framework

This is a Playwright-based test automation framework following the principles from "The Philosophy of Software Design" by John Ousterhout.

## Design Principles Applied

1. **Deep Modules**: Complex functionality with simple interfaces
2. **Information Hiding**: Implementation details hidden from consumers
3. **Strategic Decomposition**: Breaking down complex systems into well-defined components
4. **Designing for the Common Case**: Optimizing for the most frequent use cases
5. **Clear Abstractions**: Well-defined interfaces that hide complexity

## Project Structure

```
├── pageObjects/          # Page object models using class-based approach
│   ├── BasePage.ts       # Base class for all page objects
│   ├── PageFactory.ts    # Factory pattern for page object creation
│   └── RoadToQA/         # Domain-specific page objects
│       ├── SecurityPage.ts # Password authentication page
│       ├── ProductPage.ts  # Product browsing functionality
│       └── CartPage.ts     # Cart management functionality
├── tests/                # Test cases organized by domain
│   └── RoadToQA/         # Tests for RoadToQA website
│       └── Test_Cases/   # Test specifications
│           └── cart.spec.ts # Cart-related test cases
├── configurations/       # Test configuration files
└── playwright.config.ts  # Playwright configuration
```

## Getting Started

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Run with UI: `npm run test:ui`
4. View reports: `npm run report`

## Design Improvements

- **Class-based Page Objects**: Enhanced maintainability and reuse
- **Factory Pattern**: Simplified page object creation
- **Layered Architecture**: Clear separation of concerns
- **Meaningful Abstractions**: Functions named according to business operations
- **Strategic Information Hiding**: Private methods for implementation details

Run `npx playwright codegen https://nectarine-pomegranate-rleh.squarespace.com/retest`

`npx playwright test ./tests/RoadToQA/Test_Cases/cart.spec.ts --debug`

`npx playwright test ./tests/RoadToQA/Test_Cases/cart.spec.ts`