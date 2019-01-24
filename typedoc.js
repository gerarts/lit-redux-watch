module.exports = {
    readme: 'README.md',
    tsconfig: 'tsconfig.json',
    mode: 'modules',
    excludeNotExported: true,
    ignoreCompilerErrors: true,
    exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/*.test.*'
    ],
    out: './docs',
    includes: 'lib/',
};
