module.exports = {
    entry : './src/index.js',
    module:{
        rules :[
             {
            test : /\.js$/,
            use : {
                loader : "babel-loader",
                options :{ 
                    presets : ["@babel/preset-env"],
                    plugins : [['@babel/plugin-transform-react-jsx',{pragma:"createElement"}]]
                    },
                   
                },
                
                }
            ]
        },
        mode :'development',
        devServer : {
            contentBase : './dist',
            open : true
        }
    }