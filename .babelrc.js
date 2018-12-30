module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8',
          browsers: ['> 0.5%', 'not dead']
        }
      }
    ]
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread']
};
