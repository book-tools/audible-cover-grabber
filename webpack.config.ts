import TerserPlugin from 'terser-webpack-plugin';
import type webpack from 'webpack';
import {
  Directories,
  config,
  getAnalyzerPlugins,
  getCleanWebpackPlugins,
  getCopyPlugins,
  getDefinePlugins,
  getEntry,
  getEslintPlugins,
  getExtensionManifestPlugins,
  getExtensionReloaderPlugins,
  getHTMLPlugins,
  getOutput,
  getProgressPlugins,
  getResolves,
  getZipPlugins,
  prefixDir,
} from './webpack.config.utils';

let generalConfig: webpack.Configuration = {
  mode:
    config.NODE_ENV === 'production' || config.NODE_ENV === 'upload'
      ? 'production'
      : 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [{ loader: 'ts-loader' }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: getResolves(),
  entry: getEntry(Directories.SRC_DIR),
  output: getOutput(prefixDir(config.TARGET), config.OUTPUT_DIR),
};

let plugins: webpack.WebpackPluginInstance[] = [
  ...getCleanWebpackPlugins(
    `${config.OUTPUT_DIR}/${prefixDir(config.TARGET)}`,
    `${Directories.DIST_DIR}/${prefixDir(config.TARGET)}`,
  ),
  ...getProgressPlugins(),
  ...getEslintPlugins(),
  ...getDefinePlugins(),
  ...getExtensionManifestPlugins(),
  ...getHTMLPlugins(
    prefixDir(config.TARGET),
    config.OUTPUT_DIR,
    Directories.SRC_DIR,
  ),
  ...getCopyPlugins(
    prefixDir(config.TARGET),
    config.OUTPUT_DIR,
    Directories.SRC_DIR,
  ),
];

if (config.NODE_ENV === 'development') {
  generalConfig = {
    ...generalConfig,
    devtool: 'source-map',
    stats: {
      all: false,
      builtAt: true,
      errors: true,
      hash: true,
    },
    watch: true,
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
    },
  };

  plugins = [...plugins, ...getExtensionReloaderPlugins()];
}

if (config.NODE_ENV === 'profile') {
  generalConfig = {
    ...generalConfig,
    devtool: 'source-map',
    stats: {
      all: false,
      builtAt: true,
      errors: true,
      hash: true,
    },
  };

  plugins = [...plugins, ...getAnalyzerPlugins()];
}

if (config.NODE_ENV === 'upload') {
  generalConfig = {
    ...generalConfig,
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  };

  plugins = [...plugins];
}

if (config.NODE_ENV === 'production') {
  generalConfig = {
    ...generalConfig,
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  };

  plugins = [
    ...plugins,
    ...getZipPlugins(prefixDir(config.TARGET), Directories.DIST_DIR),
  ];
}

export default [
  {
    ...generalConfig,
    plugins,
  },
];
