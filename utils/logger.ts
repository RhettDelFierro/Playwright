/**
 * Modular logging system
 * Following Ousterhout's principles:
 * - Single responsibility: Handles only logging concerns
 * - Deep module: Complex logging logic with simple interface
 * - Information hiding: Implementation details hidden from consumers
 */

import fs from 'fs';
import path from 'path';
import config from '../configurations/config';

// Log levels with numeric values for comparison
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Log record structure
export interface LogRecord {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
  source?: string;
}

// Log output target
export type LogTarget = 'console' | 'file' | 'both';

// Logger configuration
export interface LoggerConfig {
  level: LogLevel;
  target: LogTarget;
  filePath?: string;
  includeTimestamp: boolean;
  includeSource: boolean;
  prettyPrint: boolean;
}

/**
 * Logger class that handles logging messages at different levels
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private readonly DEFAULT_LOG_PATH = './logs';

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Set default configuration
    this.config = {
      level: this.getLogLevelFromString(config.midscene.logLevel || 'info'),
      target: 'both',
      filePath: path.join(this.DEFAULT_LOG_PATH, 'test.log'),
      includeTimestamp: true,
      includeSource: true,
      prettyPrint: true
    };

    // Ensure log directory exists
    this.ensureLogDirectoryExists();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Convert string log level to enum
   */
  private getLogLevelFromString(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      case 'none': return LogLevel.NONE;
      default: return LogLevel.INFO;
    }
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectoryExists(): void {
    if (this.config.target === 'file' || this.config.target === 'both') {
      const logDir = path.dirname(this.config.filePath || '');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  /**
   * Configure the logger
   */
  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    this.ensureLogDirectoryExists();
  }

  /**
   * Format a log record
   */
  private formatLogRecord(record: LogRecord): string {
    if (this.config.prettyPrint) {
      let message = '';
      
      if (this.config.includeTimestamp) {
        message += `[${record.timestamp}] `;
      }
      
      message += `${record.level.toUpperCase()}: ${record.message}`;
      
      if (this.config.includeSource && record.source) {
        message += ` (${record.source})`;
      }
      
      if (record.data) {
        message += '\n' + JSON.stringify(record.data, null, 2);
      }
      
      return message;
    } else {
      return JSON.stringify(record);
    }
  }

  /**
   * Write log to appropriate targets
   */
  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    // Skip if log level is lower than configured level
    if (level < this.config.level) {
      return;
    }

    const record: LogRecord = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level].toLowerCase(),
      message,
      data,
      source
    };

    const formattedMessage = this.formatLogRecord(record);

    // Log to console if configured
    if (this.config.target === 'console' || this.config.target === 'both') {
      const consoleMethod = level === LogLevel.ERROR ? console.error :
                          level === LogLevel.WARN ? console.warn :
                          level === LogLevel.INFO ? console.info :
                          console.log;
      
      consoleMethod(formattedMessage);
    }

    // Log to file if configured
    if ((this.config.target === 'file' || this.config.target === 'both') && this.config.filePath) {
      fs.appendFileSync(
        this.config.filePath, 
        formattedMessage + '\n',
        { encoding: 'utf8' }
      );
    }
  }

  /**
   * Log debug message
   */
  public debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  /**
   * Log info message
   */
  public info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source);
  }

  /**
   * Log warning message
   */
  public warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source);
  }

  /**
   * Log error message
   */
  public error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source);
  }

  /**
   * Get caller information for source tracking
   */
  public static getCallerInfo(): string {
    const err = new Error();
    const stack = err.stack?.split('\n');
    
    // Skip first 3 lines (Error, this method, and the logger method)
    const callerLine = stack?.[3] || '';
    const matches = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
    
    if (matches) {
      const [_, functionName, filePath, line, column] = matches;
      const fileName = path.basename(filePath);
      return `${fileName}:${line} (${functionName})`;
    }
    
    return 'unknown';
  }
}

// Singleton instance
export const logger = Logger.getInstance();

// Convenience functions for direct use
export const debug = (message: string, data?: any): void => {
  logger.debug(message, data, Logger.getCallerInfo());
};

export const info = (message: string, data?: any): void => {
  logger.info(message, data, Logger.getCallerInfo());
};

export const warn = (message: string, data?: any): void => {
  logger.warn(message, data, Logger.getCallerInfo());
};

export const error = (message: string, data?: any): void => {
  logger.error(message, data, Logger.getCallerInfo());
};

export default logger; 