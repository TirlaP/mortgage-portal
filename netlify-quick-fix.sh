#!/bin/bash

# Stop on errors
set -e

echo "Applying quick fix for Netlify deployment..."

# Clean previous build
echo "Cleaning previous build..."
rm -rf dist

# Update vite.config.ts to ensure correct base path
echo "Updating vite.config.ts..."
cat > vite.config.ts << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
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

# Create or update netlify.toml
echo "Updating netlify.toml..."
cat > netlify.toml << 'EOL'
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOL

# Make sure public/_redirects exists
echo "Updating _redirects..."
mkdir -p public
echo "/* /index.html 200" > public/_redirects

# Run the build
echo "Building the project..."
npm run build

echo "Deployment preparation complete!"
echo "Now deploy to Netlify with: netlify deploy --prod"
