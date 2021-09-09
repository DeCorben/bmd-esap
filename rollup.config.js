import babel from '@rollup/plugin-babel';
import common from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import html from 'rollup-plugin-html2';
import clean from 'rollup-plugin-cleaner';
import replace from '@rollup/plugin-replace';
import parseJson from '@rollup/plugin-json';

export default {
    input: 'src/fetcher/index.jsx',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        
    },
    plugins: [
        clean({
            targets: [
                './dist',
            ],
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
            preventAssignment: true,
        }),
        babel({ 
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
        resolve({ browser: true }),
        parseJson(),
        common(),
        html({
            template: './template.html',
            fileName: 'index.html',
            title: 'Every Step a Project',
            onlinePath: './',
        })
    ],
}