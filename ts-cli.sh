#!/usr/bin/env bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print usage information
usage() {
    echo "TypeScript Project CLI"
    echo
    echo "Usage:"
    echo "  $(basename "$0") <command> [options]"
    echo
    echo "Commands:"
    echo "  new <project-name>    Create a new TypeScript project"
    echo "  help                  Show this help message"
    echo
    exit 1
}

# Create a new TypeScript project
create_project() {
    local project_name=$1

    if [ -z "$project_name" ]; then
        echo -e "${RED}Error: Project name is required${NC}"
        usage
    fi

    if [ -d "$project_name" ]; then
        echo -e "${RED}Error: Directory $project_name already exists${NC}"
        exit 1
    fi

    echo -e "${BLUE}Creating new TypeScript project: $project_name${NC}"

    # Create project directory and navigate into it
    mkdir -p "$project_name"
    cd "$project_name"

    # Initialize npm project
    echo -e "${BLUE}Initializing npm project...${NC}"
    npm init -y

    # Install TypeScript and other essential dependencies
    echo -e "${BLUE}Installing TypeScript and dependencies...${NC}"
    npm install --save-dev typescript @types/node ts-node nodemon

    # Initialize TypeScript configuration
    echo -e "${BLUE}Initializing TypeScript configuration...${NC}"
    npx tsc --init

    # Update tsconfig.json
    echo -e "${BLUE}Updating TypeScript configuration...${NC}"
    sed -i 's/\/\/ *"target": *"es2016"/"target": "ES6"/g' tsconfig.json
    sed -i 's/\/\/ *"rootDir": *".\/"/"rootDir": ".\/src"/g' tsconfig.json
    sed -i 's/\/\/ *"outDir": *".\/"/"outDir": ".\/dist"/g' tsconfig.json

    # Create project structure
    mkdir -p src tests dist

    # Create basic README.md
    echo "# $project_name

## Description

A TypeScript project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
" > README.md

    # Create .gitignore
    echo "node_modules/
dist/
.env
*.log" > .gitignore

    # Create basic source file
    echo 'console.log("Hello from TypeScript!");' > src/index.ts

    # Update package.json scripts
    npm pkg set scripts.build="tsc"
    npm pkg set scripts.dev="nodemon --watch 'src/**' --ext 'ts,json' --ignore 'src/**/*.spec.ts' --exec 'ts-node src/index.ts'"
    npm pkg set scripts.start="node dist/index.js"
    npm pkg set scripts.test="echo \"Error: no test specified\" && exit 1"

    echo -e "${GREEN}Successfully created TypeScript project: $project_name${NC}"
    echo -e "${BLUE}To get started:${NC}"
    echo -e "  cd $project_name"
    echo -e "  npm run dev"
}

# Main script logic
case $1 in
    new)
        create_project "$2"
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo -e "${RED}Error: Unknown command $1${NC}"
        usage
        ;;
esac 