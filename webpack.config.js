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
        'buffer': require.resolve('buffer/')
      },
      alias: {
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
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
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