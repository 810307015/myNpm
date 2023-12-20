export default {
    resolve: {
        extensions: ['.ts'],
    },
    build: {
        // rollupOptions: {
        //     external: ["vue"],
        // },
        minify: 'terser',
        lib: {
            entry: [
                './src/index.ts',
            ],
            formats: ['es'],
        }
    },
}