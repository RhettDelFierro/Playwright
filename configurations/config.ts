/**
 * Configuration management system
 * Follows Ousterhout's principles of abstraction and composability
 * A deep module that handles all configuration complexity with a simple interface
 */

// Define environment types
export type Environment = 'development' | 'staging' | 'production' | 'test';

// Base configuration interface
export interface BaseConfig {
  baseUrl: string;
  timeouts: {
    defaultTimeout: number;
    navigationTimeout: number;
    actionTimeout: number;
  };
  retries: number;
  screenshots: {
    directory: string;
    takeOnFailure: boolean;
  };
  auth: {
    username?: string;
    password?: string;
    passwordUrl: string;
  };
}

// MidScene-specific configuration
export interface MidsceneConfig {
  enabled: boolean;
  model: string;
  apiKey?: string;
  screenshotOnFailure: boolean;
  detailedReports: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  cacheResponses: boolean;
  responseFormat?: 'json' | 'text';
}

// Complete configuration interface
export interface Config extends BaseConfig {
  environment: Environment;
  headless: boolean;
  midscene: MidsceneConfig;
  parallelTests: boolean;
  workers: number;
  reportPortal: {
    enabled: boolean;
    endpoint?: string;
    projectName?: string;
    launchName?: string;
  };
}

// Environment-specific configurations
const environments: Record<Environment, Partial<Config>> = {
  development: {
    baseUrl: 'https://reed-finch-j8jr.squarespace.com/',
    headless: false,
    timeouts: {
      defaultTimeout: 30000,
      navigationTimeout: 30000,
      actionTimeout: 15000,
    },
    parallelTests: true,
    workers: 4,
  },
  staging: {
    baseUrl: 'https://reed-finch-j8jr.squarespace.com/',
    headless: true,
    timeouts: {
      defaultTimeout: 40000,
      navigationTimeout: 40000,
      actionTimeout: 20000,
    },
    parallelTests: true,
    workers: 4,
  },
  production: {
    baseUrl: 'https://reed-finch-j8jr.squarespace.com/',
    headless: true,
    timeouts: {
      defaultTimeout: 60000,
      navigationTimeout: 60000,
      actionTimeout: 30000,
    },
    parallelTests: false,
    workers: 1,
  },
  test: {
    baseUrl: 'https://reed-finch-j8jr.squarespace.com/',
    headless: true,
    timeouts: {
      defaultTimeout: 10000,
      navigationTimeout: 10000,
      actionTimeout: 5000,
    },
    parallelTests: true,
    workers: 8,
  },
};

// Default configuration
const defaultConfig: Config = {
  environment: process.env.TEST_ENV as Environment || 'development',
  baseUrl: 'https://reed-finch-j8jr.squarespace.com/',
  headless: false,
  timeouts: {
    defaultTimeout: 30000,
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },
  retries: 2,
  screenshots: {
    directory: './screenshots',
    takeOnFailure: true,
  },
  auth: {
    username: 'admin',
    password: 'teziiqa2',
    passwordUrl: 'https://nectarine-pomegranate-rleh.squarespace.com/retest',
  },
  midscene: {
    enabled: true,
    model: process.env.MIDSCENE_MODEL || 'UI-TARS',
    apiKey: process.env.OPENAI_API_KEY || process.env.MIDSCENE_API_KEY,
    screenshotOnFailure: true,
    detailedReports: true,
    logLevel: 'info',
    cacheResponses: true,
    responseFormat: 'json',
  },
  parallelTests: true,
  workers: 4,
  reportPortal: {
    enabled: false,
  },
};

/**
 * Get the configuration for the specified environment
 * @param env Environment to get configuration for
 * @returns Complete configuration object
 */
export function getConfig(env?: Environment): Config {
  const environment = env || process.env.TEST_ENV as Environment || 'development';
  
  // Merge default config with environment-specific config
  return {
    ...defaultConfig,
    ...environments[environment],
    environment,
  };
}

/**
 * Current active configuration
 */
export const config = getConfig();

export default config; 