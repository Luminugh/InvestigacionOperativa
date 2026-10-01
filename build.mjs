import {build} from 'vite';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

const root = process.cwd();
const excelPath = new URL('./Excel/InvOperativa_FINAL.xlsx', import.meta.url);
const excelPlugin = {
  name: 'case-excel',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'Excel/InvOperativa_FINAL.xlsx', source: readFileSync(excelPath) });
  }
};

const pages = ['index', 'sensibilidad', 'transporte'];
for (const [i, name] of pages.entries()) {
  await build({
    base: './',
    configFile: false,
    plugins: [tailwindcss(), viteSingleFile({ useRecommendedBuildConfig: false }), excelPlugin],
    build: {
      outDir: 'dist',
      emptyOutDir: i === 0,
      cssCodeSplit: false,
      assetsInlineLimit: 4096,
      rollupOptions: {
        input: resolve(root, `${name}.html`),
        output: { inlineDynamicImports: true }
      }
    }
  });
  console.log(`✓ ${name}.html empaquetado`);
}