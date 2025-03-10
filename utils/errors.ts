/**
 * Error handling system
 * Following Ousterhout's principles:
 * - Define errors out of existence where possible
 * - When errors can't be eliminated, make them obvious
 * - Modular error handling with clear interfaces
 */

import { logger } from './logger';

/**
 * Base error class for application-specific errors
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly details?: any;
  public readonly recoverable: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    options: {
      code?: string;
      details?: any;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code || 'UNKNOWN_ERROR';
    this.details = options.details;
    this.recoverable = options.recoverable ?? false;
    this.timestamp = new Date();
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get error details in a structured format for logging
   */
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      recoverable: this.recoverable,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }
}

/**
 * Navigation-related errors
 */
export class NavigationError extends AppError {
  constructor(
    message: string,
    options: {
      url?: string;
      code?: string;
      details?: any;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message, {
      code: options.code || 'NAVIGATION_ERROR',
      details: {
        url: options.url,
        ...options.details
      },
      recoverable: options.recoverable,
      cause: options.cause
    });
  }
}

/**
 * Element interaction errors
 */
export class ElementError extends AppError {
  constructor(
    message: string,
    options: {
      selector?: string;
      action?: string;
      code?: string;
      details?: any;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message, {
      code: options.code || 'ELEMENT_ERROR',
      details: {
        selector: options.selector,
        action: options.action,
        ...options.details
      },
      recoverable: options.recoverable,
      cause: options.cause
    });
  }
}

/**
 * Authentication-related errors
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string,
    options: {
      username?: string;
      code?: string;
      details?: any;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message, {
      code: options.code || 'AUTHENTICATION_ERROR',
      details: {
        username: options.username,
        ...options.details
      },
      recoverable: options.recoverable,
      cause: options.cause
    });
  }
}

/**
 * Data validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    options: {
      field?: string;
      value?: any;
      code?: string;
      details?: any;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message, {
      code: options.code || 'VALIDATION_ERROR',
      details: {
        field: options.field,
        value: options.value,
        ...options.details
      },
      recoverable: options.recoverable || true,
      cause: options.cause
    });
  }
}

/**
 * API-related errors
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    options: {
      endpoint?: string;
      statusCode?: number;
      code?: string;
      details?: any;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message, {
      code: options.code || 'API_ERROR',
      details: {
        endpoint: options.endpoint,
        statusCode: options.statusCode,
        ...options.details
      },
      recoverable: options.recoverable,
      cause: options.cause
    });
  }
}

/**
 * Configuration-related errors
 */
export class ConfigurationError extends AppError {
  constructor(
    message: string,
    options: {
      setting?: string;
      code?: string;
      details?: any;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message, {
      code: options.code || 'CONFIGURATION_ERROR',
      details: {
        setting: options.setting,
        ...options.details
      },
      recoverable: options.recoverable || false,
      cause: options.cause
    });
  }
}

/**
 * Error handling utility functions
 */

/**
 * Error handler function type
 */
export type ErrorHandler = (error: Error) => Promise<boolean> | boolean;

/**
 * Registry of error handlers
 */
const errorHandlers: ErrorHandler[] = [];

/**
 * Register a new error handler
 * @param handler Handler function
 */
export function registerErrorHandler(handler: ErrorHandler): void {
  errorHandlers.push(handler);
}

/**
 * Default error handler that logs errors
 */
registerErrorHandler((error: Error) => {
  if (error instanceof AppError) {
    logger.error(`${error.name}: ${error.message}`, error.toJSON());
  } else {
    logger.error(`Unhandled error: ${error.message}`, { 
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
  return false; // Continue with other handlers
});

/**
 * Process an error through all registered handlers
 * @param error The error to handle
 * @returns True if error was handled, false otherwise
 */
export async function handleError(error: Error): Promise<boolean> {
  let handled = false;
  
  for (const handler of errorHandlers) {
    try {
      const result = await Promise.resolve(handler(error));
      if (result) {
        handled = true;
        break;
      }
    } catch (handlerError) {
      logger.error('Error in error handler', { handlerError });
    }
  }
  
  return handled;
}

/**
 * Try to run an operation with automatic error handling
 * @param operation The operation to run
 * @param options Error handling options
 * @returns The result of the operation
 */
export async function tryWithErrorHandling<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    errorMessage?: string;
    fallback?: T;
  } = {}
): Promise<T> {
  const { retries = 0, retryDelay = 1000, errorMessage, fallback } = options;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log the error attempt
      logger.warn(
        errorMessage || `Operation failed (attempt ${attempt + 1}/${retries + 1})`,
        { error: lastError }
      );
      
      // Process through error handlers
      const handled = await handleError(lastError);
      
      // If this is the last retry, throw or return fallback
      if (attempt === retries) {
        if (fallback !== undefined) {
          logger.info('Using fallback value after all retries failed');
          return fallback;
        }
        throw lastError;
      }
      
      // Wait before retrying
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  // This should never happen, but TypeScript needs a return
  throw lastError || new Error('Unknown error');
}

/**
 * Create a retry policy for operations
 */
export function createRetryPolicy(options: {
  retries?: number;
  retryDelay?: number;
  shouldRetry?: (error: Error) => boolean;
}) {
  const { retries = 3, retryDelay = 1000, shouldRetry } = options;
  
  return {
    /**
     * Run operation with this retry policy
     */
    run: async <T>(operation: () => Promise<T>, fallback?: T): Promise<T> => {
      return tryWithErrorHandling(operation, {
        retries,
        retryDelay,
        fallback
      });
    }
  };
}

export default {
  AppError,
  NavigationError,
  ElementError,
  AuthenticationError,
  ValidationError,
  ApiError,
  ConfigurationError,
  registerErrorHandler,
  handleError,
  tryWithErrorHandling,
  createRetryPolicy
}; 