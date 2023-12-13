/* eslint-disable @typescript-eslint/no-var-requires */
import { ProgressPlugin, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import WebpackExtensionManifestPlugin from 'webpack-extension-manifest-plugin';

const ExtReloader = require('webpack-ext-reloader-mv3');

const dotenv = require('dotenv').config({ path: `${__dirname}/.env` });

const baseManifestChrome: chrome.runtime.ManifestV3 = require('./src/baseManifest_chrome.json');
const baseManifestFirefox: chrome.runtime.ManifestV3 = require('./src/baseManifest_firefox.json');
const baseManifestOpera: chrome.runtime.ManifestV3 = require('./src/baseManifest_opera.json');
const baseManifestEdge: chrome.runtime.ManifestV3 = require('./src/baseManifest_edge.json');

const baseManifest = {
  chrome: baseManifestChrome,
  firefox: baseManifestFirefox,
  opera: baseManifestOpera,
  edge: baseManifestEdge,
};

type BrowserTarget = keyof typeof baseManifest;

const isBrowserTarget = (
  target: string | undefined,
): target is BrowserTarget => {
  if (!target) {
    return false;
  }
  return target in baseManifest;
};

interface EnvironmentConfig {
  NODE_ENV: string;
  OUTPUT_DIR: string;
  TARGET: BrowserTarget;
}

export const Directories = {
  DEV_DIR: 'dev',
  DIST_DIR: 'dist',
  TEMP_DIR: 'temp',
  SRC_DIR: 'src',
};

const { NODE_ENV, TARGET } = process.env;

let OUTPUT_DIR: string;
switch (NODE_ENV) {
  case 'production':
    OUTPUT_DIR = Directories.TEMP_DIR;
    break;
  case 'upload':
    OUTPUT_DIR = Directories.DIST_DIR;
    break;
  default:
    OUTPUT_DIR = Directories.DEV_DIR;
    break;
}

/**
 * Environment Config
 *
 */
const EnvConfig: EnvironmentConfig = {
  OUTPUT_DIR,
  ...(NODE_ENV ? { NODE_ENV } : { NODE_ENV: 'development' }),
  ...(isBrowserTarget(TARGET) ? { TARGET } : { TARGET: 'chrome' }),
};

/**
 * Get HTML Plugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getHTMLPlugins = (
  browserDir: string,
  outputDir = Directories.DEV_DIR,
  sourceDir = Directories.SRC_DIR,
) => [
  new HtmlWebpackPlugin({
    title: 'Popup',
    filename: path.resolve(
      __dirname,
      `${outputDir}/${browserDir}/popup/index.html`,
    ),
    template: path.resolve(__dirname, `${sourceDir}/popup/index.html`),
    chunks: ['popup'],
  }),
  new HtmlWebpackPlugin({
    title: 'Options',
    filename: path.resolve(
      __dirname,
      `${outputDir}/${browserDir}/options/index.html`,
    ),
    template: path.resolve(__dirname, `${sourceDir}/options/index.html`),
    chunks: ['options'],
  }),
];

/**
 * Get DefinePlugins
 *
 * @param config
 * @returns
 */
export const getDefinePlugins = (config = {}) => [
  new DefinePlugin({
    'process.env': JSON.stringify({ ...config, ...(dotenv.parsed ?? {}) }),
  }),
];

/**
 * Get Output Configurations
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getOutput = (
  browserDir: string,
  outputDir = Directories.DEV_DIR,
) => ({
  path: path.resolve(process.cwd(), `${outputDir}/${browserDir}`),
  filename: '[name]/[name].js',
});

/**
 * Get Entry Points
 *
 * @param sourceDir
 * @returns
 */
export const getEntry = (sourceDir = Directories.SRC_DIR) => ({
  popup: [path.resolve(__dirname, `${sourceDir}/popup/index.tsx`)],
  options: [path.resolve(__dirname, `${sourceDir}/options/options.tsx`)],
  content: [path.resolve(__dirname, `${sourceDir}/content/index.tsx`)],
  background: [path.resolve(__dirname, `${sourceDir}/background/index.ts`)],
});

/**
 * Get CopyPlugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getCopyPlugins = (
  browserDir: string,
  outputDir = Directories.DEV_DIR,
  sourceDir = Directories.SRC_DIR,
) => [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, `${sourceDir}/assets`),
        to: path.resolve(__dirname, `${outputDir}/${browserDir}/assets`),
      },
      {
        from: path.resolve(__dirname, `${sourceDir}/_locales`),
        to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`),
      },
    ],
  }),
];

/**
 * Get ZipPlugins
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getZipPlugins = (
  browserDir: string,
  outputDir = Directories.DIST_DIR,
) => [
  new ZipPlugin({
    path: path.resolve(process.cwd(), `${outputDir}/${browserDir}`),
    filename: browserDir,
    extension: 'zip',
    fileOptions: {
      mtime: new Date(),
      mode: 0o100664,
      compress: true,
      forceZip64Format: false,
    },
    zipOptions: {
      forceZip64Format: false,
    },
  }),
];

/**
 * Get Analyzer Plugins
 *
 * @returns
 */
export const getAnalyzerPlugins = () => [
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
  }),
];

/**
 * Get CleanWebpackPlugins
 *
 * @param dirs
 * @returns
 */
export const getCleanWebpackPlugins = (...dirs: string[]) => [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: dirs.map((dir) =>
      path.join(process.cwd(), `${dir}`),
    ),
    cleanStaleWebpackAssets: false,
    verbose: true,
  }),
];

/**
 * Get Resolves
 *
 * @returns
 */
export const getResolves = () => ({
  alias: {
    utils: path.resolve(__dirname, './src/utils/'),
    popup: path.resolve(__dirname, './src/popup/'),
    background: path.resolve(__dirname, './src/background/'),
    options: path.resolve(__dirname, './src/options/'),
    content: path.resolve(__dirname, './src/content/'),
    assets: path.resolve(__dirname, './src/assets/'),
    components: path.resolve(__dirname, './src/components/'),
    types: path.resolve(__dirname, './src/types/'),
    hooks: path.resolve(__dirname, './src/hooks/'),
    '@redux': path.resolve(__dirname, './src/@redux/'),
  },
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
});

/**
 * Get Extension Manifest Plugins
 *
 * @returns
 */
export const getExtensionManifestPlugins = () => [
  new WebpackExtensionManifestPlugin({
    config: { base: baseManifest[EnvConfig.TARGET] },
  }),
];

export const eslintOptions = {
  fix: true,
};

/**
 * Get Eslint Plugins
 *
 * @returns
 */
export const getEslintPlugins = (options = eslintOptions) => [
  new ESLintPlugin(options),
];

/**
 * Get Progress Plugins
 *
 * @returns
 */
export const getProgressPlugins = () => [new ProgressPlugin()];

/**
 * Environment Configuration Variables
 *
 */
export const config = EnvConfig;

/**
 * Get Extension Reloader Plugin
 *
 * @returns
 */
export const getExtensionReloaderPlugins = () => [
  new ExtReloader({
    port: 9090,
    reloadPage: true,
    entries: {
      contentScript: ['content'],
      background: 'background',
      extensionPage: ['popup', 'options'],
    },
  }),
];
