/**
 * Test Data Management System
 * 
 * Modular approach to managing test data following Ousterhout's principles:
 * - Information hiding: Test data details are encapsulated
 * - Composability: Data can be combined for different test scenarios
 * - Deep modules: Complex data handling with simple interfaces
 */

import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

// User data interfaces
export interface User {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Product data interfaces
export interface Product {
  name: string;
  price: string;
  description: string;
  collection: string;
  sizes: string[];
  colors: string[];
}

// Address data interface
export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Payment data interface
export interface PaymentInfo {
  cardType: 'visa' | 'mastercard' | 'amex';
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nameOnCard: string;
}

// Complete customer data
export interface Customer {
  user: User;
  address: Address;
  paymentInfo: PaymentInfo;
}

/**
 * Data Store class to manage various test data entities
 * This provides a centralized interface for all test data
 */
class DataStore {
  private static instance: DataStore;
  private data: Record<string, any> = {};

  private constructor() {
    this.initializeData();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  /**
   * Initialize with default data and load data from files
   */
  private initializeData(): void {
    this.loadPredefinedProducts();
    this.loadPredefinedUsers();
    this.generateDynamicData();
  }

  /**
   * Load predefined products from JSON file if exists
   */
  private loadPredefinedProducts(): void {
    try {
      const productsPath = path.resolve(__dirname, './products.json');
      if (fs.existsSync(productsPath)) {
        const productsData = fs.readFileSync(productsPath, 'utf-8');
        this.data.products = JSON.parse(productsData);
      } else {
        this.data.products = [
          {
            name: 'Starry Onesie',
            price: '$24.99',
            description: 'Comfortable baby onesie with star pattern',
            collection: 'Shop neutrals',
            sizes: ['0–3M', '3–6M', '6–12M'],
            colors: ['beige', 'light blue']
          },
          {
            name: 'Arlie Dress',
            price: '$59.99',
            description: 'Beautiful dress for special occasions',
            collection: 'Shop neutrals',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['cream', 'light pink']
          },
          {
            name: 'Neutral Set',
            price: '$39.99',
            description: 'Matching neutral colored set for toddlers',
            collection: 'New Arrivals',
            sizes: ['2-3Y', '3-4Y', '4-5Y'],
            colors: ['beige', 'gray']
          }
        ];
      }
    } catch (error) {
      console.error('Error loading product data:', error);
      this.data.products = [];
    }
  }

  /**
   * Load predefined users from JSON file if exists
   */
  private loadPredefinedUsers(): void {
    try {
      const usersPath = path.resolve(__dirname, './users.json');
      if (fs.existsSync(usersPath)) {
        const usersData = fs.readFileSync(usersPath, 'utf-8');
        this.data.users = JSON.parse(usersData);
      } else {
        this.data.users = {
          admin: {
            username: 'admin',
            password: 'teziiqa2',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User'
          },
          customer: {
            username: 'customer',
            password: 'password123',
            email: 'customer@example.com',
            firstName: 'John',
            lastName: 'Doe'
          }
        };
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.data.users = {};
    }
  }

  /**
   * Generate dynamic data using faker
   */
  private generateDynamicData(): void {
    this.data.dynamicCustomers = Array.from({ length: 5 }, () => this.generateCustomer());
  }

  /**
   * Generate a random customer with address and payment information
   */
  public generateCustomer(): Customer {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      user: {
        username: faker.internet.userName({ firstName, lastName }),
        password: faker.internet.password(),
        email: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName
      },
      address: {
        streetAddress: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'United States'
      },
      paymentInfo: {
        cardType: 'visa',
        cardNumber: faker.finance.creditCardNumber({ issuer: 'visa' }),
        expiryMonth: String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0'),
        expiryYear: String(faker.number.int({ min: new Date().getFullYear() + 1, max: new Date().getFullYear() + 5 })),
        cvv: faker.finance.creditCardCVV(),
        nameOnCard: `${firstName} ${lastName}`
      }
    };
  }

  /**
   * Get product by name
   */
  public getProductByName(name: string): Product | undefined {
    return this.data.products.find((product: Product) => product.name === name);
  }

  /**
   * Get products by collection
   */
  public getProductsByCollection(collection: string): Product[] {
    return this.data.products.filter((product: Product) => product.collection === collection);
  }

  /**
   * Get user by role
   */
  public getUserByRole(role: string): User {
    return this.data.users[role];
  }

  /**
   * Get random customer
   */
  public getRandomCustomer(): Customer {
    const randomIndex = Math.floor(Math.random() * this.data.dynamicCustomers.length);
    return this.data.dynamicCustomers[randomIndex];
  }

  /**
   * Get all products
   */
  public getAllProducts(): Product[] {
    return this.data.products;
  }
}

// Export the DataStore singleton instance
export const dataStore = DataStore.getInstance();

/**
 * Convenience functions for common test data operations
 */

export function getProduct(name: string): Product | undefined {
  return dataStore.getProductByName(name);
}

export function getProductsByCollection(collection: string): Product[] {
  return dataStore.getProductsByCollection(collection);
}

export function getUser(role: string): User {
  return dataStore.getUserByRole(role);
}

export function getRandomCustomer(): Customer {
  return dataStore.getRandomCustomer();
}

export function generateCustomer(): Customer {
  return dataStore.generateCustomer();
}

export default dataStore; 