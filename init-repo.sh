#!/bin/bash

# Initialize the git repository and push to GitHub
# Run this script once to set up the repository

echo "Initializing Git repository and pushing to GitHub..."

# Initialize the repository
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit"

# Add the remote repository
git remote add origin https://github.com/TirlaP/mortgage-portal.git

# Push to GitHub
git push -u origin main

# Install gh-pages dependency
npm install --save-dev gh-pages

# Build and deploy to GitHub Pages
npm run build
npx gh-pages -d dist

echo "Repository initialized and pushed to GitHub."
echo "The site will be available at https://tirlap.github.io/mortgage-portal/"