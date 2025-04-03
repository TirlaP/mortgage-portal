#!/bin/bash

# This script automates the deployment process to GitHub Pages

# Display usage information
echo "Deploying Mortgage Team Portal to GitHub Pages..."

# Ensure we have the latest code
git pull

# Install dependencies
npm install

# Build the project
npm run build

# Create a .nojekyll file to prevent GitHub from using Jekyll
touch dist/.nojekyll

# Deploy to gh-pages branch
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages

echo "Deployment complete! Your site should be available at https://tirlap.github.io/mortgage-portal/"