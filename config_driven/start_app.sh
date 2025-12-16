#!/bin/bash

# Use npx concurrently to run services in parallel with better log management
# quotes are important for arguments with spaces or nested commands

echo "Starting Multi-Predict App (Backend + Frontend)..."

npx concurrently \
  -n "BACKEND,FRONTEND" \
  -c "blue,magenta" \
  "cd Backend && npm run dev" \
  "cd Frontend && npm run dev -- --host"
