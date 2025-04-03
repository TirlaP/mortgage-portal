#!/bin/bash

# Make sure we have the Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI globally..."
    npm install -g netlify-cli
fi

# Login to Netlify if needed
netlify login

# Deploy to Netlify
netlify deploy --prod
