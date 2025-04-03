#!/bin/bash

# This script fixes deployment issues and deploys to GitHub Pages

echo "Starting deployment fix process..."

# Clean node_modules and reinstall
echo "Cleaning node_modules..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Create .nojekyll file
echo "Creating .nojekyll file..."
touch dist/.nojekyll

# Commit and push changes
echo "Committing changes..."
git add .
git commit -m "Fix deployment issues with proper MIME types and dependencies"
git push

echo "Deployment fix complete! The GitHub Actions workflow should now deploy correctly."
