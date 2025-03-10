/**
 * Dependency Injection Container
 *
 * Following Ousterhout's principles:
 * - Better modularity through clean dependency management
 * - Simplifies interfaces by removing direct dependencies
 * - Makes testing easier by allowing dependency substitution
 */

import { logger } from './logger';

/**
 * Factory function type for creating dependencies
 */
export type Factory<T> = (...args: any[]) => T;

/**
 * Options for registering dependencies
 */
export interface RegistrationOptions {
  singleton?: boolean;
  lazy?: boolean;
}

/**
 * Dependency registration record
 */
interface Registration<T = any> {
  factory: Factory<T>;
  singleton: boolean;
  lazy: boolean;
  instance?: T;
}

/**
 * Dependency Injection Container
 */
export class DIContainer {
  private static instance: DIContainer;
  private registrations: Map<string, Registration> = new Map();

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Register a dependency
   */
  public register<T>(
    name: string,
    factory: Factory<T>,
    options: RegistrationOptions = {}
  ): void {
    const { singleton = true, lazy = true } = options;
    
    if (this.registrations.has(name)) {
      logger.warn(`Dependency '${name}' is already registered and will be overwritten`);
    }
    
    this.registrations.set(name, {
      factory,
      singleton,
      lazy
    });
    
    logger.debug(`Registered dependency: ${name}`, { singleton, lazy });
    
    // If not lazy and singleton, create instance immediately
    if (singleton && !lazy) {
      this.resolve(name);
    }
  }

  /**
   * Register a singleton instance directly
   */
  public registerInstance<T>(name: string, instance: T): void {
    this.registrations.set(name, {
      factory: () => instance,
      singleton: true,
      lazy: false,
      instance
    });
    
    logger.debug(`Registered singleton instance: ${name}`);
  }

  /**
   * Resolve a dependency
   */
  public resolve<T>(name: string, ...args: any[]): T {
    const registration = this.registrations.get(name);
    
    if (!registration) {
      throw new Error(`Dependency not registered: ${name}`);
    }
    
    // Return cached instance for singletons
    if (registration.singleton && registration.instance) {
      return registration.instance as T;
    }
    
    // Create new instance
    const instance = registration.factory(...args);
    
    // Cache instance if singleton
    if (registration.singleton) {
      registration.instance = instance;
    }
    
    return instance;
  }

  /**
   * Check if a dependency is registered
   */
  public has(name: string): boolean {
    return this.registrations.has(name);
  }

  /**
   * Remove a dependency
   */
  public remove(name: string): boolean {
    return this.registrations.delete(name);
  }

  /**
   * Get all registered dependency names
   */
  public getRegisteredNames(): string[] {
    return Array.from(this.registrations.keys());
  }

  /**
   * Create child container with parent fallback
   */
  public createChildContainer(): DIContainer {
    const child = new DIContainer();
    const parentResolve = child.resolve.bind(child);
    
    // Override resolve to check parent if dependency not found in child
    child.resolve = function<T>(name: string, ...args: any[]): T {
      if (child.has(name)) {
        return parentResolve(name, ...args);
      }
      return DIContainer.getInstance().resolve<T>(name, ...args);
    };
    
    return child;
  }

  /**
   * Clear all registrations
   */
  public clear(): void {
    this.registrations.clear();
    logger.debug('Dependency container cleared');
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

export default container; 