import { Layout } from 'app/layout/layout.types';
import { environment } from 'environments/environment';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string }[];

// ApiConfig
const devApiConfig: ApiConfig = {
  baseUrl: 'https://api.pre-prod.ecommify.io/v1',
  serviceUrl: 'https://service.pre-prod.ecommify.io',
  serviceUrlv1: 'https://service.pre-prod.ecommify.io/api/v1',
  //   baseUrl: 'v1',
};

const prodApiConfig: ApiConfig = {
  baseUrl: 'https://api.ecommify.io/v1',
  serviceUrl: 'https://service.pre-prod.ecommify.io',
  serviceUrlv1: 'https://service.pre-prod.ecommify.io/api/v1',
};

const getApiConfig = (): ApiConfig =>
  environment.production ? prodApiConfig : devApiConfig;

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig {
  layout: Layout;
  scheme: Scheme;
  screens: Screens;
  theme: Theme;
  themes: Themes;
  apiConfig: ApiConfig;
}

export interface ApiConfig {
  baseUrl: string;
  serviceUrl: string;
  serviceUrlv1: string;
}
/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 *
 * "Screens" are carried over to the BreakpointObserver for accessing them within
 * components, and they are required.
 *
 * "Themes" are required for Tailwind to generate themes.
 */
export const appConfig: AppConfig = {
  layout: 'modern',
  scheme: 'light',
  screens: {
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1440px',
  },
  theme: 'theme-default',
  themes: [
    {
      id: 'theme-default',
      name: 'Default',
    },
    {
      id: 'theme-brand',
      name: 'Brand',
    },
    {
      id: 'theme-teal',
      name: 'Teal',
    },
    {
      id: 'theme-rose',
      name: 'Rose',
    },
    {
      id: 'theme-purple',
      name: 'Purple',
    },
    {
      id: 'theme-amber',
      name: 'Amber',
    },
  ],
  apiConfig: getApiConfig(),
};
