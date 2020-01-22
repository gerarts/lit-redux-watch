module.exports = {
    readme: 'README.md',
    tsconfig: 'tsconfig.json',
    mode: 'modules',
    ignoreCompilerErrors: true,
    exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/*.test.*'
    ],
    out: './docs',
    includes: 'lib/',
};
