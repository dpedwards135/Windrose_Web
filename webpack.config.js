const config = {
    entry: __dirname + "/index.jsx", 
    output: {
        path: __dirname,
        filename: "windrose_es5.js",
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0']
            }
        ]
    },
    resolve: {
        extensions: [
            ".js",
            ".jsx",
        ]
    }
};

module.exports = config;