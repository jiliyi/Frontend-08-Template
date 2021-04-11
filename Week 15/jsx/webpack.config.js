const path = require('path')
module.exports = {
    entry : './src/main.js',
    output:{
        path : path.resolve(__dirname,'dist'),
        filename :"bundle.js"
    },
    mode : 'development',
    module : {
        rules : [
            {
                test : /\.js$/,
                use : {
                    loader : "babel-loader",
                    options : {
                        presets : ["@babel/preset-env"],
                        plugins : [["@babel/plugin-transform-react-jsx",{pragma : "createElement"}]]
        
                }
            }
        }
        ]
    },
    devServer : {
        open : true,
        port : 3000
    }
}