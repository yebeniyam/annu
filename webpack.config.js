const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    target: 'web',
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {
        'process/browser': require.resolve('process/browser'),
        'stream': require.resolve('stream-browserify'),
        'util': require.resolve('util/'),
        'buffer': require.resolve('buffer/'),
        'crypto': require.resolve('crypto-browserify'),
        'http': require.resolve('stream-http'),
        'https': require.resolve('https-browserify'),
        'os': require.resolve('os-browserify/browser'),
        'url': require.resolve('url/')
      },
      alias: {
        '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
        '@mui/x-data-grid': path.resolve(__dirname, 'node_modules/@mui/x-data-grid'),
        '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
        '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled'),
        '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@services': path.resolve(__dirname, 'src/services/'),
        '@utils': path.resolve(__dirname, 'src/utils/')
      }
    },
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
      clean: true
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3002,
      hot: true,
      open: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        logging: 'error',
        progress: true,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          secure: false,
          changeOrigin: true
        },
        '/auth': {
          target: 'http://localhost:5000',
          secure: false,
          changeOrigin: true
        }
      },
      watchOptions: {
        ignored: /node_modules/
      },
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: true,
        publicPath: false
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules\/(?!(\@mui\/x-data-grid|\@mui\/material|\@emotion\/.*|\@babel\/runtime\/helpers\/esm|\@mui\/utils|\@mui\/core|\@mui\/icons-material|\@mui\/material\/styles|\@mui\/material\/colors|\@mui\/material\/Box|\@mui\/material\/Button|\@mui\/material\/TextField|\@mui\/material\/Paper|\@mui\/material\/Typography|\@mui\/material\/Grid|\@mui\/material\/Card|\@mui\/material\/CardContent|\@mui\/material\/CardHeader|\@mui\/material\/Divider|\@mui\/material\/CircularProgress|\@mui\/material\/Alert|\@mui\/material\/IconButton|\@mui\/material\/Menu|\@mui\/material\/MenuItem|\@mui\/material\/ListItemIcon|\@mui\/material\/ListItemText|\@mui\/material\/ToggleButtonGroup|\@mui\/material\/ToggleButton|\@mui\/material\/Tooltip|\@mui\/material\/Chip))/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                ['@babel/plugin-transform-runtime', {
                  'regenerator': true
                }],
                ['@babel/plugin-transform-modules-commonjs', {
                  'strictMode': false
                }]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
          REACT_APP_SUPABASE_URL: JSON.stringify(process.env.REACT_APP_SUPABASE_URL || ''),
          REACT_APP_SUPABASE_ANON_KEY: JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY || ''),
          REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:5000')
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : undefined,
      })
    ]
  };
};