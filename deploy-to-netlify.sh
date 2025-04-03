#!/bin/bash

# Run the fix script to ensure everything is set up correctly
echo "Preparing the project for Netlify deployment..."
./fix-netlify.sh

# Install Netlify CLI globally if not already installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI globally..."
    npm install -g netlify-cli
fi

# Login to Netlify if needed (this will open a browser window)
echo "Authenticating with Netlify..."
netlify login

# Initialize a new Netlify site if it's the first deployment
if [ ! -f .netlify/state.json ]; then
    echo "Initializing new Netlify site..."
    netlify init
else
    echo "Using existing Netlify site configuration..."
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "Deployment complete!"
