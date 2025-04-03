#!/bin/bash

echo "🛠️  Starting emergency fix script for GitHub Pages deployment 🛠️"

# Remove all build artifacts and dependencies
echo "🧹 Cleaning project directories..."
rm -rf node_modules
rm -rf dist
rm -f package-lock.json

# Reinstall dependencies
echo "📦 Installing dependencies..."
npm install

# Make sure public directory has the SVG file
echo "🖼️  Checking SVG icon..."
if [ ! -f "public/vite.svg" ]; then
  echo "Creating vite.svg in public directory..."
  echo '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet