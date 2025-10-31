import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@formbuilder/core': '../../packages/core/src',
      '@formbuilder/ui': '../../packages/ui/src',
      '@formbuilder/layout-engine': '../../packages/layout-engine/src',
      '@formbuilder/property-panel': '../../packages/property-panel/src',
      '@formbuilder/component-library': '../../packages/component-library/src',
      '@formbuilder/form-builder': '../../packages/form-builder/src'
    }
  }
});
