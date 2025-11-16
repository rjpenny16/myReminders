#!/bin/bash

# Ultrawide To-Do App - Automated Setup Script
# This script checks for prerequisites and helps install them

set -e

echo "======================================"
echo "Ultrawide To-Do App - Setup Assistant"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
echo "Checking Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js is installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js v18+ from: https://nodejs.org/"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm is installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

# Check Rust
echo "Checking Rust..."
if command_exists rustc; then
    RUST_VERSION=$(rustc --version)
    echo -e "${GREEN}✓ Rust is installed: $RUST_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Rust is not installed${NC}"
    echo "  Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    echo -e "${GREEN}✓ Rust installed successfully${NC}"
fi

# Check Cargo
echo "Checking Cargo..."
if command_exists cargo; then
    CARGO_VERSION=$(cargo --version)
    echo -e "${GREEN}✓ Cargo is installed: $CARGO_VERSION${NC}"
else
    echo -e "${RED}✗ Cargo is not installed${NC}"
    exit 1
fi

# Check Ollama (optional)
echo "Checking Ollama (optional for AI features)..."
if command_exists ollama; then
    OLLAMA_VERSION=$(ollama --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓ Ollama is installed: $OLLAMA_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Ollama is not installed (optional)${NC}"
    echo "  For AI features, install from: https://ollama.com/download"
fi

echo ""
echo "======================================"
echo "Installing npm dependencies..."
echo "======================================"
npm install

echo ""
echo "======================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "======================================"
echo ""
echo "To start the app in development mode:"
echo -e "${YELLOW}npm run tauri:dev${NC}"
echo ""
echo "To build for production:"
echo -e "${YELLOW}npm run tauri:build${NC}"
echo ""
echo "For AI features, make sure Ollama is running:"
echo -e "${YELLOW}ollama serve${NC}"
echo ""
echo "Enjoy your ultrawide To-Do app! 🎉"
