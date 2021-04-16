const path = require('path');

module.exports = {
    entry: './public/electron.ts',
    target: 'electron-main',
    node: {
        __dirname: true,
        __filename: true
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'electron.js'
    },
    mode: 'none',
    module: {
        rules: [
            { test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        "noEmit": false
                    }
                }     
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    }
}