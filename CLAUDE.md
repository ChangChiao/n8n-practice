# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n workflow automation project with custom web scraping capabilities. The project uses Docker Compose to run n8n (an open-source workflow automation tool) with an integrated Playwright-based web scraper for e-commerce data collection.

## Common Commands

### n8n Service Management
```bash
# Start n8n service
docker compose up -d

# Stop n8n service
docker compose down

# Update n8n to latest version
docker compose down
docker compose pull
docker compose up -d

# View logs
docker compose logs -f
```

### Workflow Management
```bash
# Export all workflows to separate JSON files
docker exec -i n8n-n8n-1 sh -c "n8n export:workflow --all --separate --output=/tmp/workflows"
docker cp n8n-n8n-1:/tmp/workflows ./workflow/

# Export workflows with automatic renaming (uses workflow name instead of ID)
./export-simple.sh
```

### fetchData Module Commands
From the `fetchData/` directory:
```bash
make build    # Build Docker image
make run      # Run web scraper
make test     # Run test script
make up       # Start in background
make logs     # View logs
make shell    # Enter container shell
make down     # Stop services
make clean    # Clean up resources
```

### Execute Playwright Script Inside n8n Container
```bash
docker exec -it n8n-n8n-1 node /home/node/fetchData/fetch-web-function.js
```

## Architecture

### Core Components
1. **n8n Service** - Main workflow automation platform running on port 5678
2. **fetchData Module** - Playwright-based web scraper that integrates with n8n via webhooks
3. **Workflows** - JSON-based automation definitions stored in `workflow/workflows/`

### Volume Mounts
- `n8n_storage:/home/node/.n8n` - Persistent n8n data
- `./fetchData:/home/node/fetchData` - Web scraping module accessible within n8n container

### Key Integration Points
- The fetchData module sends scraped data to n8n webhooks
- n8n can execute the Playwright scripts directly via the mounted volume
- Workflows can trigger data scraping and process the results

### Environment Configuration
The fetchData module requires a `.env` file with:
- `ECOMMERCE_TEST_LOGIN_URL` - E-commerce platform login URL
- `ECOMMERCE_USERNAME` - Login credentials
- `ECOMMERCE_PASSWORD` - Login credentials
- `WEBHOOK_URL` - n8n webhook endpoint for data delivery