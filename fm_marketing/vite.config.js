import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['jimp']
	},
	build: {
		commonjsOptions: {
			include: [/jimp/, /node_modules/]
		}
	}
});
