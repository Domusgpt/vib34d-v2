#!/bin/bash

echo "🔥 Setting up VIB34D Firebase LLM Integration"
echo "==========================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase (if not already logged in)
echo "🔐 Checking Firebase authentication..."
firebase login --no-localhost

# Create or use existing Firebase project
echo "📦 Setting up Firebase project..."
firebase projects:list

echo ""
echo "📝 Please do the following steps:"
echo "1. Go to https://console.firebase.google.com/"
echo "2. Create a new project called 'vib34d-llm'"
echo "3. Enable Functions in the Firebase console"
echo "4. Go to https://aistudio.google.com/app/apikey"
echo "5. Create a new Gemini API key"
echo ""
read -p "Press Enter when you have the Firebase project created and Gemini API key ready..."

# Initialize Firebase in the project
echo "🚀 Initializing Firebase..."
firebase init functions

# Set the Gemini API key as a Firebase environment variable
echo ""
read -p "Enter your Gemini API key: " GEMINI_KEY
firebase functions:config:set gemini.api_key="$GEMINI_KEY"

# Install dependencies
echo "📦 Installing dependencies..."
cd functions
npm install

# Deploy the function
echo "🚀 Deploying Firebase Function..."
cd ..
firebase deploy --only functions

echo ""
echo "✅ Setup complete!"
echo "Your Firebase Function URL will be displayed above."
echo "Update the functionUrl in src/llm/FirebaseLLMInterface.js with the deployed URL."