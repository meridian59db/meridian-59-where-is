const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'), // arquivo de entrada da nossa aplicação (src/index.js)
  output: {
    path: path.resolve(__dirname, 'public'), // diretório arquivo que vai ser gerado após ser convertido
    filename: 'bundle.js', // nome do arquivo que vai ser gerado pós conversão (bundle.js)
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'), // caminho pro diretório onde contém os arquivos públicos da aplicação
    hot: true,
    historyApiFallback: {
      index: '/',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        exclude: /node_modules/, // excluir os arquivos do node da transpilação
        test: /\.(j|t)sx$/, // apenas arquivos que terminam com .js
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sass|less)$/,
        exclude: /node_modules/, // excluir os arquivos do node da transpilação
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.css$/, // para arquivos que terminam em css
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i, // Pode haver quantos caracteres quiser, escapa o . , pega todos os tipos de imagem, e o i é para pegar case insensitive
        // não precisa do exclude node modules pq não tem imagem dentro do node-modules
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
};
