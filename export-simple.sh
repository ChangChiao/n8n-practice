#!/bin/bash

# Simple n8n workflow export script with name-based renaming

echo "Starting n8n workflow export..."

# ① Export all workflows separately in container
echo "Step 1: Exporting workflows in container..."
docker exec -i n8n-n8n-1 sh -c \
  "n8n export:workflow --all --separate --output=/tmp/workflows"

# ② Copy workflows directory to host
echo "Step 2: Copying workflows to host..."
docker cp n8n-n8n-1:/tmp/workflows ./workflow/

# ③ Rename workflow files based on their name property
echo "Step 3: Renaming workflow files based on workflow names..."
cd ./workflow/
for file in *.json; do
  if [ -f "$file" ]; then
    # Extract the name field from JSON
    name=$(jq -r '.name' "$file" 2>/dev/null)
    
    if [ -n "$name" ] && [ "$name" != "null" ]; then
      # Replace spaces and special characters with underscores
      safe_name=$(echo "$name" | sed 's/[^a-zA-Z0-9-]/_/g')
      
      # Add .json extension
      new_name="${safe_name}.json"
      
      # Rename file (skip if target exists)
      if [ "$file" != "$new_name" ]; then
        if [ -f "$new_name" ]; then
          echo "Warning: $new_name already exists, keeping original name for $file"
        else
          mv "$file" "$new_name"
          echo "Renamed: $file → $new_name"
        fi
      fi
    else
      echo "Warning: Could not extract name from $file, keeping original name"
    fi
  fi
done
cd ..

# Clean up temporary files in container
echo "Cleaning up container temporary files..."
docker exec -i n8n-n8n-1 sh -c "rm -rf /tmp/workflows"

echo "Export completed! Workflows saved to ./workflow/"