#!/bin/bash

# Simple n8n workflow export script

echo "Starting n8n workflow export..."

# ① Export all workflows separately in container
echo "Step 1: Exporting workflows in container..."
docker exec -i n8n-n8n-1 sh -c \
  "n8n export:workflow --all --separate --output=/tmp/workflows"

# ② Copy workflows directory to host
echo "Step 2: Copying workflows to host..."
docker cp n8n-n8n-1:/tmp/workflows ./workflow/

# Clean up temporary files in container
echo "Cleaning up container temporary files..."
docker exec -i n8n-n8n-1 sh -c "rm -rf /tmp/workflows"

echo "Export completed! Workflows saved to ./workflow/"