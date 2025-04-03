#!/bin/bash

# Stop on errors
set -e

echo "Fixing Netlify deployment issues..."

# Clean previous build
echo "Cleaning previous build..."
rm -rf dist

# Update vite.config.ts to ensure correct base path
echo "Updating vite.config.ts..."
cat > vite.config.ts << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Base path for Netlify deployment
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false
  }
})
EOL

# Rebuild the project
echo "Rebuilding the project..."
npm run build

# Verify the built assets
echo "Verifying built assets..."
cat dist/index.html

# Create or update netlify.toml
echo "Updating netlify.toml..."
cat > netlify.toml << 'EOL'
[build]
  command = "npm run build"
  publish = "dist"

# Handle SPA routing by redirecting all unknown routes to index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
EOL

# Make sure public/_redirects exists
echo "Updating _redirects..."
mkdir -p public
echo "/* /index.html 200" > public/_redirects

echo "Deployment preparation complete!"
echo "Now run './deploy-to-netlify.sh' to deploy to Netlify"
