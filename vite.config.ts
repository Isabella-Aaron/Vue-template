import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig((mode:any)=>{
    const env = loadEnv(mode.mode,process.cwd()) // 获取 .env里面定义是参数

    return {
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
        server: {
            host: '0.0.0.0',
            port: 8080,
            open: true,
            cors: true,
            strictPort: false,
            hmr: true,
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_APP_BASE_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ''),
                },
            }
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, 'src'),
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
            preserveSymlinks: false
        },
        build: {
            target: "es2015",
            outDir: "build",
            cssCodeSplit: true,
            minify: "terser",
            chunkSizeWarningLimit: 1500,
            emptyOutDir: true,
            sourcemap: false,
            assetsDir: "assets",
            manifest: true,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    },
                    chunkFileNames: (chunkInfo) => {
                        const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
                        const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
                        return `js/${fileName}/[name].[hash].js`;
                    }
                }
            },
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            }
        },
        css: {
            modules: {
                localsConvention: "camelCaseOnly",
                scopeBehaviour: "local",
                generateScopedName: '[name]_[local]_[hash:5]'
            },
            devSourcemap: true,
            postcss: {
                plugins: []
            },
        },
    }
})