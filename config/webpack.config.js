import path from 'path'
import HtmlPlugin from 'html-webpack-plugin'
import GoogleAnalyticsPlugin from '../plugins/google-analytics-webpack-plugin'

const basePath = path.join(__dirname, '..', 'src')
const env = process.env.NODE_ENV || 'development'

console.log('Webpack running in ' + env)

export default {
  entry: {
    main: path.join(basePath, 'index.jsx'),
  },

  output: {
    path: path.join(basePath, '..', 'build'),
    publicPath: env === 'development' ? '/' : '',
    filename: '[name].js',
  },

  plugins: [
    new HtmlPlugin({
      title: 'L-Trominos',
      template: path.join(basePath, 'index.html'),
    }),
    new GoogleAnalyticsPlugin({
      id: 'UA-46471633-1'
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [basePath],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },

  devServer: {
    noInfo: true,
    port: 4000,
    contentBase: path.join(basePath, 'build'),
  },
}
