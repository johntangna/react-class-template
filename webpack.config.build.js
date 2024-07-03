const path = require("path");
const baseWebpackConfig = require("./webpack.config.base");
const CaseSensitivePathsWebpackPlugin = require("case-sensitive-paths-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const plugins = [new CaseSensitivePathsWebpackPlugin(), new MiniCssExtractPlugin({
  filename: "[name].css",
  chunkFilename: "[id].css",
})];
const { analyse, spa } = process.env;

if (analyse) {
  plugins.push(new BundleAnalyzerPlugin());
}

if (spa) {
  plugins.push(new HtmlWebpackPlugin({
    filename: "index.html",
    template: path.resolve(__dirname, "./index.html"),
    inject: "body",
  }));
}

const entryPath = path.resolve(__dirname, "./src/index.tsx");

module.exports = {
  ...baseWebpackConfig,
  mode: "production",
  entry: entryPath,
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    libraryTarget: "umd",
    publicPath: "./", // 添加这行
  },
  plugins,
  optimization: {
    minimize: true,
    minimizer:[
      new TerserPlugin({
        include: /\.min\.js$/,
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true,
            pure_funcs: ["console.log"],
          },
        },
      }),
    ],
    splitChunks: {
      minSize: 600,
      cacheGroups: {
        default: {
          name: 'common',
          chunks: 'initial',
          minChunks: 3,
          priority: -20,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
        },
      },
    },
  },
};