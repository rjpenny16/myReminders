# Ultrawide To-Do App - Automated Setup Script (Windows)
# This script checks for prerequisites and helps install them

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Ultrawide To-Do App - Setup Assistant" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed" -ForegroundColor Red
    Write-Host "  Please install Node.js v18+ from: https://nodejs.org/" -ForegroundColor White
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm is not installed" -ForegroundColor Red
    exit 1
}

# Check Rust
Write-Host "Checking Rust..." -ForegroundColor Yellow
if (Test-Command rustc) {
    $rustVersion = rustc --version
    Write-Host "✓ Rust is installed: $rustVersion" -ForegroundColor Green
} else {
    Write-Host "⚠ Rust is not installed" -ForegroundColor Yellow
    Write-Host "  Please install Rust from: https://rustup.rs/" -ForegroundColor White
    Write-Host "  After installation, restart this script." -ForegroundColor White
    exit 1
}

# Check Cargo
Write-Host "Checking Cargo..." -ForegroundColor Yellow
if (Test-Command cargo) {
    $cargoVersion = cargo --version
    Write-Host "✓ Cargo is installed: $cargoVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Cargo is not installed" -ForegroundColor Red
    exit 1
}

# Check Ollama (optional)
Write-Host "Checking Ollama (optional for AI features)..." -ForegroundColor Yellow
if (Test-Command ollama) {
    Write-Host "✓ Ollama is installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Ollama is not installed (optional)" -ForegroundColor Yellow
    Write-Host "  For AI features, install from: https://ollama.com/download" -ForegroundColor White
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the app in development mode:" -ForegroundColor White
Write-Host "npm run tauri:dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "To build for production:" -ForegroundColor White
Write-Host "npm run tauri:build" -ForegroundColor Yellow
Write-Host ""
Write-Host "For AI features, make sure Ollama is running:" -ForegroundColor White
Write-Host "ollama serve" -ForegroundColor Yellow
Write-Host ""
Write-Host "Enjoy your ultrawide To-Do app! 🎉" -ForegroundColor Green
